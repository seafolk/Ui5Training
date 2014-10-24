sap.ui.controller("view.TrainingCourseDetail", {
	onBeforeRendering:function(){
		console.log(this.getView().getModel())
		//this.byId("SupplierForm").bindElement("BusinessPartner");
	}
});