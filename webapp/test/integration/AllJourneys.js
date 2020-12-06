/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 MyAssetSet in the list
// * All 3 MyAssetSet have at least one ToServices

sap.ui.require([
	"sap/ui/test/Opa5",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/App",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/Browser",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/Master",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/Detail",
	"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/pages/NotFound"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "com.zvwp.asset.myasset.zvwp_asset_myasset.view."
	});

	sap.ui.require([
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/MasterJourney",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/NavigationJourney",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/NotFoundJourney",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/BusyJourney",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});