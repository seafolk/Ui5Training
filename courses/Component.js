jQuery.sap.declare("app.courses.Component");
jQuery.sap.require("app.courses.model.Courses");

sap.ui.core.UIComponent.extend("app.courses.Component", {

    metadata: {
        routing: {
            config: {
                viewType: "XML",
                viewPath: "view",
                targetControl: "splitApp",
                clearTarget: false,
                transition: "slide"
            },
            routes: [{
                pattern: "",
                name: "course",
                view: "CourseMaster",
                viewPath: "view",
                viewLevel: 1,
                targetAggregation: "masterPages",
                subroutes: [{
                    pattern: "{course}",
                    name: "course-view",
                    view: "CourseDetail",
                    viewPath: "view",
                    viewLevel: 1,
                    targetAggregation: "detailPages"
                }]
            }, ]
        }
    },

    /**
     * !!! The steps in here are sequence dependent !!!
     */
    init: function() {

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

    destroy: function() {
        if (this.routeHandler) {
            this.routeHandler.destroy();
        }

        // call overridden destroy
        sap.ui.core.UIComponent.prototype.destroy.apply(this, arguments);
    },

    createContent: function() {
        // create root view
        var oView = sap.ui.view({
            id: "app",
            viewName: "view.App",
            type: "JS",
            viewData: {
                component: this
            }
        });

        var oModel = new app.courses.model.Courses();

        jQuery.when(
            jQuery.getJSON("/config.json")
        ).done(function(oConfig) {
            oModel.setConfig({
                application_id: oConfig.services.parse.application_id,
                rest_api_key: oConfig.services.parse.rest_api_key
            });
            oModel.read();
        });

        oView.setModel(oModel);

        // set i18n model
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: "i18n/messageBundle.properties"
        });
        oView.setModel(i18nModel, "i18n");

        // done
        return oView;
    }
});
