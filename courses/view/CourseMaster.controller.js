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
	},
	
	handleDelete: function(oEvent) {
		
		var oList = oEvent.getSource(),
			oItem = oEvent.getParameter("listItem"),
			sPath = oItem.getBindingContext().getPath(),
			index = sPath.split("/")[2],
		    model = this.getView().getModel();
		
		model.deleteByIndex(index);
		
		 // send a delete request to the odata service
        oList.removeItem(oItem);
		
    },
	
	courseEditPress: function() {
	
		var oList = this.getView().byId("MasterList");
		
		oList.getMode() == "None" ? oList.setMode(sap.m.ListMode.Delete)
                            		: oList.setMode(sap.m.ListMode.None);
		
    }
});