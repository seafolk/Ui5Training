sap.ui.controller("view.HomeMaster", {
	onInit : function () {
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
	},

	listPress: function(oEvent){
		this.router.navTo("course");
	},

	calendarPress: function(oEvent){
		this.router.navTo("calendar");
	}
});