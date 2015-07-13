jQuery.sap.declare("app.courses.util.Controller");

sap.ui.core.mvc.Controller.extend("app.courses.util.Controller", {
	getEventBus : function () {
		return this.getOwnerComponent().getEventBus();
	},
	 
	getRouter : function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	}
});