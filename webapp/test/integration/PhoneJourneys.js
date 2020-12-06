/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

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
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/NavigationJourneyPhone",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/NotFoundJourneyPhone",
		"com/zvwp/asset/myasset/zvwp_asset_myasset/test/integration/BusyJourneyPhone"
	], function () {
		QUnit.start();
	});
});