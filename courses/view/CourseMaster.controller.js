sap.ui.controller("view.CourseMaster", {

	onInit: function(){
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
	},

	coursesItemPress: function(oEvent){
		var context = oEvent.getSource().getBindingContext(),
			oCourse = context.oModel.getProperty(context.sPath);

		this.router.navTo("course-view", {
			courseId: oCourse.Id
		});
	},

	handleNavBack : function () {
		this.router.myNavBack("home-master", {});
	}
});