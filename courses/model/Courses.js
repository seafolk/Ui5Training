sap.ui.model.json.JSONModel.extend("app.courses.model.Courses", {
    config: null,
    setConfig: function(config) {
        this.config = config;
    },
    getQuerySettings: function(resourseName, data, method) {

        if (data.objectId) {
            resourseName = resourseName + "/" + data.objectId;
            delete data.objectId;
        }

        var settings = {
            url: "https://api.parse.com/1/classes/" + resourseName,
            dataType: "json",
            headers: {
                "X-Parse-Application-Id": this.config.application_id,
                "X-Parse-REST-API-Key": this.config.rest_api_key
            },
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            method: 'GET'
        };

        if (method) {
            settings.method = method.toUpperCase();
        }

        return settings;
    },
    read: function(objectId) {
        var me = this,
            data = {};

        if (objectId) {
            data.objectId = objectId;
        }

        $.ajax(this.getQuerySettings('Courses', data))
            .done(function(data) {
                me.setProperty("/Courses", data.results);
            });
    },
    saveByIndex: function(index) {
        var me = this;

        var oData = this.oData.Courses[index];

        $.ajax(this.getQuerySettings('Courses', oData, oData.objectId ? 'put' : 'post'))
            .done(function(result) {
			    /*me.setProperty("/Courses/" + index + "/objectId", result.objectId);
                me.setProperty("/Courses/" + index + "/createdAt", result.createdAt);
                */
               me.setProperty("/Courses", data.results);
            });
    },
    deleteByIndex: function(index) {
        var me = this;

        var oData = this.oData.Courses[index];

        $.ajax(this.getQuerySettings('Courses', oData, 'delete'))
            .done(function() {
              
            });
    }	
});
