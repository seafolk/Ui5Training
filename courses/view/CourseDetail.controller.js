jQuery.sap.require("sap.m.MessageBox");

sap.ui.controller("view.CourseDetail", {

	onInit: function(){
		this.router = sap.ui.core.UIComponent.getRouterFor(this);
		this.router.attachRoutePatternMatched(this._handleRouteMatched, this);
	},	

	_handleRouteMatched : function (evt) {
		var param = evt.getParameter("name"),
			sViewId = evt.getParameter("arguments").viewId;

		if ("course-view" !== param) {
			return;
		}

		this.getView().bindElement("/courseList/" + sViewId);
		// Set the initial form to be the display one
    	this._showFormFragment("CourseDisplay", this.getView().getBindingContext().sPath);
	},

	onBackButtonPress: function(oEvent) {
		this.router.myNavBack("home", {});
	},

	/**
	 *	DESCRIPTION FORM
	 **/
	_formFragments: {},
	_getFormFragment: function (sFragmentName, sPath) {
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
  _showFormFragment : function (sFragmentName, sPath) {
    oForm = this._getFormFragment(sFragmentName, sPath);
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
  handleAddToMyCourses: function(oEvent){
  	var oCourse = this.getView().getModel().getProperty(this.getView().getBindingContext().sPath);

  	/*
  		TODO 
  		добавить курс в коллекцию курсов пользователя, отправить запрос на сервер
  	*/

  	var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
    sap.m.MessageBox.show(
      'Курс "' + oCourse.name + '" добавлен в Ваш список курсов.', {
        icon: sap.m.MessageBox.Icon.QUESTION,
        title: "Статус выполнения",
        actions: ["Перейти в мои курсы", "Закрыть"],
        styleClass: bCompact? "sapUiSizeCompact" : "",
        onClose : function(oAction) { 
	        if ( oAction === "Перейти в мои курсы" ) {
	          location.href = '../mycourses/index.html'
	        }
	    },
      }
    );
  }
});