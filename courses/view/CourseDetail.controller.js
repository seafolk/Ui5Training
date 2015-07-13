jQuery.sap.require("app.courses.util.Controller");
jQuery.sap.require("sap.m.MessageBox");

app.courses.util.Controller.extend("view.CourseDetail", {

    onInit: function() {
        this.oInitialLoadFinishedDeferred = jQuery.Deferred();

        //this.getView().setBusy(true);
        this.getEventBus().subscribe("Master", "InitialLoadFinished", this.onMasterLoaded, this);

        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._handleRouteMatched, this);

        var configModel = new sap.ui.model.json.JSONModel({
            "isEditMode": false,
            "isUpdateAllowed": true
        });
        this.getView().setModel(configModel, "config");
    },

    onMasterLoaded: function(sChannel, sEvent, oData) {
        var item = oData.oList.getSelectedItem();
        if (item) {
            this.bindView(item.getBindingContext().getPath());
        }
        this.getView().setBusy(false);
        this.oInitialLoadFinishedDeferred.resolve();

        // TODO call _handleRouteMatched
    },

    _handleRouteMatched: function(evt) {
        if ("course-view" !== evt.getParameter("name")) {
            return;
        }

        var objectId = evt.getParameter("arguments").course;

        // FIXME не отрабатывает onMasterLoaded из-за поздней загрузки контроллера detail
        if (this.getView().getModel()) {
            this.oInitialLoadFinishedDeferred.resolve();
        }

        jQuery.when(this.oInitialLoadFinishedDeferred).then(jQuery.proxy(function() {
            var oModel = this.getView().getModel();

            // when detail navigation occurs, update the binding context
            var sPath = null;

            // Set the initial form to be the display one
            this.getView().byId("buttonSave").setProperty("visible", false);
            this.getView().byId("buttonAddToMyCourses").setProperty("visible", false);

            if (objectId === "new") {

                sPath = oModel.createNew();
                this._showFormFragment("CourseChange", sPath);
                this.getView().byId("buttonSave").setProperty("visible", true);

            } else {

                sPath = oModel.getPathByObjectId(objectId);
                this._showFormFragment("CourseDisplay", sPath);
                this.getView().byId("buttonAddToMyCourses").setProperty("visible", true);
            }

            this.getView().bindElement({
                path: sPath
            });

        }, this));

    },

    onBackButtonPress: function(oEvent) {
        this.router.myNavBack("home", {});
    },

    /**
     *  DESCRIPTION FORM
     **/
    _formFragments: {},
    _getFormFragment: function(sFragmentName, sPath) {
        var oFormFragment = this._formFragments[sFragmentName];

        if (!oFormFragment) {
            oFormFragment = sap.ui.xmlfragment(
                "view." + sFragmentName
            );
            this._formFragments[sFragmentName] = oFormFragment;
        }

        // refresh binding
        oFormFragment.bindElement(sPath);

        return oFormFragment;
    },
    _showFormFragment: function(sFragmentName, sPath) {
        var oForm = this._getFormFragment(sFragmentName, sPath);
        var oContainer = this.getView().byId("descriptionformContainer");
        oContainer.removeAllContent();
        oContainer.insertContent(oForm);
    },
    handleAddToMyCoursesBtnPress: function() {
        // TODO
    },
    handleSaveBtnPress: function() {
        var sPath = this.getView().getBindingContext().sPath;
        var router = this.router;
        var config = this.getView().getModel("config");
        var oTable = this.getView().byId("tableExercise");

        this.getView().getModel().save(
            sPath,
            function(objectId) {
                config.setProperty("/isEditMode", false);
                oTable.setMode(sap.m.ListMode.None);
                router.navTo("course-view", {
                    course: objectId
                });
            }
        );
    },
    handleAddToMyCourses: function(oEvent) {
        var oCourse = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);

        /*
        TODO 
        добавить курс в коллекцию курсов пользователя, отправить запрос на сервер
    */

        var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
        sap.m.MessageBox.show(
            'Курс "' + oCourse.Name + '" добавлен в Ваш список курсов.', {
                icon: sap.m.MessageBox.Icon.QUESTION,
                title: "Статус выполнения",
                actions: ["Перейти в мои курсы", "Закрыть"],
                styleClass: bCompact ? "sapUiSizeCompact" : "",
                onClose: function(oAction) {
                    if (oAction === "Перейти в мои курсы") {
                        location.href = '../mycourses/index.html'
                    }
                }
            }
        );
    },

    onAddExercisesRow: function(evt) {
        var oModel = this.getView().getModel(),
            sPath = this.getView().getBindingContext().sPath,
            rows = oModel.getProperty(sPath + '/Exercises') ? oModel.getProperty(sPath + '/Exercises') : [];

        rows.push({
            "Number": "",
            "Name": "",
            "ShortDescription": "",
            "Duration": ""
        });
        oModel.setProperty(sPath + '/Exercises', rows);
    },

    handleDeleteListItem: function(oEvent) {
        var oList = oEvent.getSource(),
            oItem = oEvent.getParameter("listItem"),
            sPath = oItem.getBindingContext().getPath(),
            oModel = this.getView().getModel();

        // after deletion put the focus back to the list
        oList.attachEventOnce("updateFinished", oList.focus, oList);

        // "/Courses/2/Exercises/0"
        var cIndex = sPath.split("/")[2];
        var eIndex = sPath.split("/")[4];
        
        var data = oModel.getData();
        var removed = data.Courses[cIndex].Exercises.splice(eIndex, 1);
        oModel.setData(data)
        
        //sap.m.MessageToast.show(JSON.stringify(removed[0]) +  'is removed');
    },

    onSetEditMode: function() {
        this.getView().getModel("config").setProperty("/isEditMode", true);

        this.getView().byId("buttonSave").setProperty("visible", true);
        this.getView().byId("buttonEdit").setProperty("visible", false);

        this.getView().byId("tableExercise").setMode(sap.m.ListMode.Delete)
    }
});
