sap.ui.define([
	"com/zvwp/asset/myasset/zvwp_asset_myasset/controller/BaseController",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/model/formatter"
], function (BaseController, formatter) {
	"use strict";

	return BaseController.extend("com.zvwp.asset.myasset.zvwp_asset_myasset.controller.ServiceDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.zvwp.asset.myasset.zvwp_asset_myasset.view.ServiceDetail
		 */

		formatter: formatter,
		onInit: function () {
			var oRouter = this.getRouter();

			oRouter.getRoute("service").attachMatched(this._onRouteMatched, this);

		},
		_onRouteMatched: function (oEvent) {
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			oView = this.getView();

			oView.bindElement({
				path: "/ServiceSet('" + oArgs.serviceId + "')",
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function (oEvent) {
						oView.setBusy(true);
					},
					dataReceived: function (oEvent) {
						oView.setBusy(false);
					}
				}
			});
		},

		onRateSave: function (oEvent) {
			var oModel = this.getModel();
			var oControlRi = sap.ui.core.Fragment.byId("rateService", "riRaitingNew");
			var oValueControl = oControlRi.getValue();
			var oValueObject = this.getView().getBindingContext().getObject();

			oValueObject.Rating = oControlRi.getValue().toString();
			if (oValueControl) {
				oModel.update(this.getView().getBindingContext().getPath(), oValueObject, {
					success: function (oData) {
						this.onCloseDialog();

					}.bind(this),
					error: function () {

					}.bind(this)
				});
			}

		},

		_getDialog: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("rateService", "com.zvwp.asset.myasset.zvwp_asset_myasset.view.fragments.ServiceRate", this);
				this.getView().addDependent(this._oDialog);
			}
			return this._oDialog;
		},

		onPressRateService: function (oEvent) {
			this._getDialog().open();
		},

		_onBindingChange: function (oEvent) {
			// No data for the binding
			if (!this.getView().getBindingContext()) {
				this.getRouter().getTargets().display("notFound");
			}
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.zvwp.asset.myasset.zvwp_asset_myasset.view.ServiceDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.zvwp.asset.myasset.zvwp_asset_myasset.view.ServiceDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.zvwp.asset.myasset.zvwp_asset_myasset.view.ServiceDetail
		 */
		//	onExit: function() {
		//
		//	}

	});

});