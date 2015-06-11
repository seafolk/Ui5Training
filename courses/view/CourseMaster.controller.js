sap.ui.controller("view.CourseMaster", {

	onInit: function(){
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
	},

	coursesItemPress: function(oEvent){
		var context = oEvent.getSource().getBindingContext();
			//oCourse = context.oModel.getProperty(context.sPath);
		var index = context.sPath.split("/")[2];

		this.router.navTo("course-view", {
			course: index
		});
	},

	handleNavBack : function () {
		this.router.myNavBack("home-master", {});
	},

	courseAddPress: function(){
		this.router.navTo("course-view", {
			course: "new"
		});
	}
});