sap.ui.define([], function () {
	"use strict";

	return {
		/**
		 * Rounds the currency value to 2 digits
		 *
		 * @public
		 * @param {string} sValue value to be formatted
		 * @returns {string} formatted currency value with 2 digits
		 */
		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},
		parseFloat: function (sValue) {

			return parseFloat(sValue);

		},
		formatStatus: function (fValue) {
			var sStatus;
			switch (fValue) {
			case "001":
				sStatus = "Success";
				break;
			case "002":
				sStatus = "Warning";
				break;
			case "003":
				sStatus = "Error";
				break;
			default:
				sStatus = "None";
			}
			return sStatus;
		},

		formatStatusName: function (fValue) {
			var sStatusName;

			switch (fValue) {
			case "001":
				sStatusName = this.getResourceBundle().getText("baseFormatStateNameOpen");
				break;
			case "002":
				sStatusName = this.getResourceBundle().getText("baseFormatStateNameTakenOver");
				break;
			case "003":
				sStatusName = this.getResourceBundle().getText("baseFormatStateNameClosed");
				break;
			default:
				sStatusName = this.getResourceBundle().getText("baseFormatStateNameNone");
			}
			return sStatusName;
		}
	};

});