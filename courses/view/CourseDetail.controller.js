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
    	this._showFormFragment("CourseDisplay");
	},

	onBackButtonPress: function(oEvent) {
		this.router.myNavBack("home", {});
	},

	/**
	 *	DESCRIPTION FORM
	 **/
	_formFragments: {},
	_getFormFragment: function (sFragmentName) {
	    var oFormFragment = this._formFragments[sFragmentName];

	    if (!oFormFragment) {
	      oFormFragment = sap.ui.xmlfragment(
	        "view." + sFragmentName
	      );
	      this._formFragments[sFragmentName] = oFormFragment;
	      oFormFragment.bindElement(
	      		this.getView().getBindingContext().sPath
	      );
	    }
	    return oFormFragment;
	  },
  _showFormFragment : function (sFragmentName) {
    oForm = this._getFormFragment(sFragmentName);
    var oContainer = this.getView().byId("descriptionformContainer");
    oContainer.removeAllContent();
    oContainer.insertContent(oForm);
  },
  handleFooterBarButtonPress: function (oEvent) {
    // Derive action from the button pressed
    var bEditAction = /idButtonEdit$/.test(oEvent.getSource().getId()),
      oView = this.getView();

    // Show the appropriate action buttons
    oView.byId("idButtonEdit").setVisible(!bEditAction);
    oView.byId("idButtonSave").setVisible(bEditAction);
    oView.byId("idButtonCancel").setVisible(bEditAction);

    // Set the right form type
    oForm = this._showFormFragment(bEditAction ? "CourseChange" : "CourseDisplay");
  }
});