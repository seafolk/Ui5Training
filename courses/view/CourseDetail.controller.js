jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("view.CourseDetail", {

    onInit: function() {
        this.router = sap.ui.core.UIComponent.getRouterFor(this);
        this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
    },

    _handleRouteMatched: function(evt) {
        var param = evt.getParameter("name"),
            index = evt.getParameter("arguments").course;

        if ("course-view" !== param) {
            return;
        }

        if(!this.getView().getModel().oData.Courses){
        	return;
        }

        this.currentIndex = (index !== "new") ? index : this.getView().getModel().oData.Courses.length;
        var sPath = "/Courses/" + this.currentIndex;

        // Set the initial form to be the display one
        this.getView().byId("buttonSave").setProperty("visible", false);
        this.getView().byId("buttonAddToMyCourses").setProperty("visible", false);

        if (index === "new") {

            this._showFormFragment("CourseChange", sPath);
            this.getView().byId("buttonSave").setProperty("visible", true);

            this.getView().getModel().setProperty(sPath, {});
        } else {

            this._showFormFragment("CourseDisplay", sPath);
            this.getView().byId("buttonAddToMyCourses").setProperty("visible", true);
        }

        this.getView().bindElement({
            path: sPath
                //parameters: {expand: "Teacher"}
        });
    },

    onBackButtonPress: function(oEvent) {
        this.router.myNavBack("home", {});
    },

    /**
     *	DESCRIPTION FORM
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
        this.getView().getModel().saveByIndex( this.currentIndex );
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
    }
});
