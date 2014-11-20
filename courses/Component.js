jQuery.sap.declare("app.courses.Component");

sap.ui.core.UIComponent.extend("app.courses.Component", {

	metadata : {
		routing : {
			config : {
				viewType : "XML",
				viewPath : "view",
				targetControl : "splitApp",
				clearTarget : false,
				transition: "slide"
			},
			routes : [
				{
					pattern : "",
					name : "course",
					view : "CourseMaster",
					viewPath : "view",
					viewLevel : 1,
					targetAggregation : "masterPages",
					subroutes : [
						{
							pattern : "{courseId}",
							name : "course-view",
							view : "CourseDetail",
							viewPath : "view",
							viewLevel : 1,
							targetAggregation : "detailPages"
						}
					]
				},
			]
		}
	},

	/**
	 * !!! The steps in here are sequence dependent !!!
	 */
	init : function () {

		// 1. some very generic requires
		jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
		jQuery.sap.require("app.courses.MyRouter");

		// 2. call overridden init (calls createContent)
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		// 3a. monkey patch the router
		var router = this.getRouter();
		router.myNavBack = app.courses.MyRouter.myNavBack;
		router.myNavToWithoutHash = app.courses.MyRouter.myNavToWithoutHash;

		if (!sap.ui.Device.system.phone) {
			router.myNavToWithoutHash("view.Empty", "XML", false);
		}

		// 4. initialize the router
		this.routeHandler = new sap.m.routing.RouteMatchedHandler(router);
		router.initialize();
	},

	destroy : function () {
		if (this.routeHandler) {
			this.routeHandler.destroy();
		}

		// call overridden destroy
		sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
	},

	createContent : function () {
		// create root view
		var oView = sap.ui.view({
			id : "app",
			viewName : "view.App",
			type : "JS",
			viewData : { component : this }
		});

		// load the global data model
		//var oModel = new sap.ui.model.json.JSONModel("model/data.json");
		var oModel = new sap.ui.model.odata.ODataModel("http://localhost:52999/ui5training.svc");
		oView.setModel(oModel);

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "i18n/messageBundle.properties"
		});
		oView.setModel(i18nModel, "i18n");

		// done
		return oView;
	}
});