/*global location */
sap.ui.define([
	"com/zvwp/asset/myasset/zvwp_asset_myasset/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/model/formatter",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/Fragment"
], function (BaseController, JSONModel, formatter, MessageToast, MessageBox, Fragment) {
	"use strict";

	return BaseController.extend("com.zvwp.asset.myasset.zvwp_asset_myasset.controller.Detail", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		onInit: function () {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var oViewModel = new JSONModel({
				busy: false,
				delay: 0,
				lineItemListTitle: this.getResourceBundle().getText("detailLineItemTableHeading")
			});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

			this.setModel(oViewModel, "detailView");

			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share by E-Mail button has been clicked
		 * @public
		 */

		onIconTabBarSelect: function (oEvent) {
			var oIconTabBar = this.getView().byId("iconTabBar");
			if (oIconTabBar.getSelectedKey() === '02') {
				this.getView().byId("btnServiceCreate").setVisible(true);
			} else {
				this.getView().byId("btnServiceCreate").setVisible(false);
			}

		},
		// _getDialog: function (oDialogType) {
		// 	if (!this._oDialog) {
		// 		if (oDialogType === 'Service') {
		// 			this._oDialog = sap.ui.xmlfragment("newService", "com.zvwp.asset.myasset.zvwp_asset_myasset.view.fragments.DeviceRequest", this);
		// 		} else {
		// 			this._oDialog = sap.ui.xmlfragment("newRateProduct", "com.zvwp.asset.myasset.zvwp_asset_myasset.view.fragments.ProductRate", this);
		// 		}

		// 		this.getView().addDependent(this._oDialog);
		// 	}
		// 	return this._oDialog;
		// },

		onNewServicePress: function (oEvent) {
			this._getDialog('Service').open();
		},

		onOpinionPress: function (oEvent) {
			this._getDialog('Rate').open();
		},
		onRateProductSave: function (oEvent) {
			var oModel = this.getModel();

			var oIDItem = sap.ui.core.Fragment.byId("newRateProduct", "txtItem");
			var oDescRate = sap.ui.core.Fragment.byId("newRateProduct", "txtRateDesc");
			var oRateNumber = sap.ui.core.Fragment.byId("newRateProduct", "riRaitingProduct");

			oIDItem.getText();
			oDescRate.getValue();
			oRateNumber.getValue();

		},
		onNewService: function (oEvent) {
			var oModel = this.getModel();

			var oAsset = sap.ui.core.Fragment.byId("newService", "txtAsset");
			var oDamageDesc = sap.ui.core.Fragment.byId("newService", "taDescription");
			var oDialog = sap.ui.core.Fragment.byId("newService", "NewDeviceService");

			var oNewServiceEntry = {
				"IdAsset": oAsset.getText(),
				"Requestor": sap.ushell.Container.getService("UserInfo").getId(),
				"Serviceman": "",
				"ContactName": "",
				"PhoneNo": "",
				"DemageDesc": oDamageDesc.getValue(),
				"RequestedOn": new Date(),
				"TakenOverOn": null,
				"ClosedOn": null,
				"ServiceToActionNav": []

			};

			// var oRequestModel = new JSONModel(oNewServiceEntry);
			// this.getView().setModel(oRequestModel, "newServiceModel");

			// var oNewServiceDeepEntry = this.getView().getModel("newServiceModel").getData();
			// 	var oModel = this.getOwnerComponent().getModel();

			oDialog.setBusy(true);
			oModel.create("/ServiceSet", oNewServiceEntry, {
				success: function (oResponse) {

					MessageToast.show("Create done!");
					oDialog.setBusy(false);

					this._oDialog.close();
				}.bind(this),
				error: function (oError) {
					oDialog.setBusy(false);
					// 	var sErrorText = JSON.parse(oError.responseText).error.message.value;
					// 	MessageBox.show(sErrorText, {
					// 		icon: sap.m.MessageBox.Icon.ERROR,
					// 		title: this.getResourceBundle().getText("errorType"),
					// 		actions: [sap.m.MessageBox.Action.CLOSE]
					// 	});
				}.bind(this)
			});

		},

		onInweturaPress: function (oEvent) {
			MessageBox.show("Inwentura potwierdzona", {
				onClose: function () {

				}.bind(this)

			});
		},

		onListItemPressed: function (oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("service", {
				serviceId: oCtx.getProperty("IdService")
			});

		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */

		onListAutoReqItemPressed: function (oEvent) {
			var oItem, oCtx;

			oItem = oEvent.getSource();
			oCtx = oItem.getBindingContext();

			this.getRouter().navTo("autoreq", {
				autoreqId: oCtx.getProperty("idDoc")
			});

		},
		onShareInJamPress: function () {
			var oViewModel = this.getModel("detailView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});

			oShareDialog.open();
		},

		/**
		 * Updates the item count within the line item table's header
		 * @param {object} oEvent an event containing the total number of items in the list
		 * @private
		 */
		onListUpdateFinished: function (oEvent) {
			var sTitle,
				iTotalItems = oEvent.getParameter("total"),
				oViewModel = this.getModel("detailView");

			var idFragment = sap.ui.core.Fragment.createId("fragmentServices", "servicesList");
			var idFragmentAutoReq = sap.ui.core.Fragment.createId("fragmentAutoRequest", "autoReqList");
			// only update the counter if the length is final
			var countReq = this.byId(idFragmentAutoReq).getBinding("items").getLength();
			if (this.byId(idFragment).getBinding("items").isLengthFinal()) {
				if (iTotalItems) {
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeadingCount", [iTotalItems]);
				} else {
					//Display 'Line Items' instead of 'Line items (0)'
					sTitle = this.getResourceBundle().getText("detailLineItemTableHeading");
				}
				oViewModel.setProperty("/lineItemListTitle", sTitle);
				oViewModel.setProperty("/countServices", iTotalItems);
				oViewModel.setProperty("/countAutoReq", countReq);
			}
		},

		/* =========================================================== */
		/* begin: internal methods                                     */
		/* =========================================================== */

		/**
		 * Binds the view to the object path and expands the aggregated line items.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function (oEvent) {
			var sObjectId = oEvent.getParameter("arguments").objectId;
			this.getModel().metadataLoaded().then(function () {
				var sObjectPath = this.getModel().createKey("MyAssetSet", {
					IdAsset: sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
			this.getView().byId("objectHeader").setIcon(this.getOwnerComponent().getManifestObject().getEntry("/sap.app").dataSources.mainService
				.uri + "MyAssetSet('" + sObjectId + "')/ToPhoto/$value");

		},

		/**
		 * Binds the view to the object path. Makes sure that detail view displays
		 * a busy indicator while data for the corresponding element binding is loaded.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound to the view.
		 * @private
		 */
		_bindView: function (sObjectPath) {
			// Set busy indicator during view binding
			var oViewModel = this.getModel("detailView");

			// If the view was not bound yet its not busy, only if the binding requests data it is set to busy again
			oViewModel.setProperty("/busy", false);

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function () {
			var oView = this.getView(),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("detailObjectNotFound");
				// if object could not be found, the selection in the master list
				// does not make sense anymore.
				this.getOwnerComponent().oListSelector.clearMasterListSelection();
				return;
			}

			var sPath = oElementBinding.getPath(),
				oResourceBundle = this.getResourceBundle(),
				oObject = oView.getModel().getObject(sPath),
				sObjectId = oObject.IdAsset,
				sObjectName = oObject.Name,
				oViewModel = this.getModel("detailView");

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);

			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("shareSaveTileAppTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		},

		_onMetadataLoaded: function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay(),
				oViewModel = this.getModel("detailView");

			// Make sure busy indicator is displayed immediately when
			// detail view is displayed for the first time
			oViewModel.setProperty("/delay", 0);
			oViewModel.setProperty("/lineItemTableDelay", 0);

			// Binding the view will set it to not busy - so the view is always busy if it is not bound
			oViewModel.setProperty("/busy", true);
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}

	});

});