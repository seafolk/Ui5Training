jQuery.sap.require("app.courses.util.Controller");

app.courses.util.Controller.extend("view.CourseMaster", {

    onInit: function() {
        var oEventBus = this.getEventBus();
        this.router = sap.ui.core.UIComponent.getRouterFor(this);

        this.getView().byId("MasterList").attachEventOnce("updateFinished", function() {
            oEventBus.publish("Master", "InitialLoadFinished", {
                oList: this.getView().byId("MasterList")
            });
        }, this);
    },

    coursesItemPress: function(oEvent) {
        var context = oEvent.getSource().getBindingContext();
        var oCourse = context.oModel.getProperty(context.sPath);

        this.router.navTo("course-view", {
            course: oCourse.objectId
        });
    },

    handleNavBack: function() {
        this.router.myNavBack("home-master", {});
    },

    courseAddPress: function() {
        this.router.navTo("course-view", {
            course: "new"
        });
    },

    handleDelete: function(oEvent) {

        var oList = oEvent.getSource(),
            oItem = oEvent.getParameter("listItem"),
            sPath = oItem.getBindingContext().getPath(),

            model = this.getView().getModel();

        model.deleteByIndex(sPath);

        oList.removeItem(oItem);

    },


    courseEditPress: function() {

        var oList = this.getView().byId("MasterList");

        oList.getMode() == "None" ? oList.setMode(sap.m.ListMode.Delete) : oList.setMode(sap.m.ListMode.None);

    }
});
