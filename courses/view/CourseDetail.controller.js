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
    /* TODO
    handleFooterBarButtonPress: function (oEvent) {
      // Derive action from the button pressed
      var bEditAction = /idButtonEdit$/.test(oEvent.getSource().getId()),
        oView = this.getView();

      // Show the appropriate action buttons
      oView.byId("idButtonEdit").setVisible(!bEditAction);
      oView.byId("idButtonSave").setVisible(bEditAction);
      oView.byId("idButtonCancel").setVisible(bEditAction);

      // Set the right form type
      oForm = this._showFormFragment(bEditAction ? "CourseChange" : "CourseDisplay", this.getView().getBindingContext().sPath);
    },
    */
    handleAddToMyCoursesBtnPress: function() {

    },
    handleSaveBtnPress: function() {
        var sPath = this.getView().getBindingContext().sPath;
        var router = this.router;
        var config = this.getView().getModel("config");

        this.getView().getModel().save(
            sPath,
            function(objectId) {
                config.setProperty("/isEditMode", false);
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
    onDeleteExercisesRow: function(evt) {
        var oModel = this.getView().getModel(),
            sPath = this.getView().getBindingContext().sPath,
            items = oModel.getProperty(sPath + '/Exercises'),
            i = evt.getSource().sId.split("driversTable-")[1]; // FIXME

        items.splice(i, 1);
        oModel.setProperty(sPath + '/Exercises', items);
    },
    onSetEditMode: function() {
        this.getView().getModel("config").setProperty("/isEditMode", true);

        this.getView().byId("buttonSave").setProperty("visible", true);
        this.getView().byId("buttonEdit").setProperty("visible", false);
    }
});
