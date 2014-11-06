sap.ui.controller("view.CourseMaster", {

	onInit: function(){
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
	},

	coursesItemPress: function(oEvent){
		var context = oEvent.getSource().getBindingContext();
		this.router.navTo("course-view", {
			viewId: context.sPath.split("/courseList/")[1]
		});
	},

	handleNavBack : function () {
		this.router.myNavBack("home-master", {});
	}
});