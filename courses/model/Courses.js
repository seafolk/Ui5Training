sap.ui.model.json.JSONModel.extend("app.courses.model.Courses", {
    config: null,
    setConfig: function(config) {
        this.config = config;
    },
    getPathByObjectId: function(id) {
        var index = 0;

        this.getProperty('/Courses').forEach(function(item, i) {
            if (id == item.objectId) index = i;
        });

        return "/Courses/" + index;
    },
    createNew: function() {
        var index = this.getProperty('/Courses').length;
        this.setProperty("/Courses/" + index, {
            // default values
        });

        return "/Courses/" + index;
    },
    getQuerySettings: function(resourseName, oData, method) {

        var data = $.extend({}, oData);
        if (data.objectId) {
            resourseName = resourseName + "/" + data.objectId;
            delete data.objectId;
        }

        if (data.updatedAt) {
            delete data.updatedAt;
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
    read: function(objectId, fnCallback) {
        var me = this,
            data = {};

        if (objectId) {
            data.objectId = objectId;
        }

        $.ajax(this.getQuerySettings('Courses', data))
            .done(function(data) {
                me.setProperty("/Courses", data.results);
                if (fnCallback) fnCallback.call(me);
            });
    },
    save: function(sPath, fnCallback) {
        var me = this;

        var oData = this.getProperty(sPath);

        $.ajax(this.getQuerySettings('Courses', oData, oData.objectId ? 'put' : 'post'))
            .done(function(data) {
                if (data.objectId) me.setProperty(sPath + "/objectId", data.objectId);
                if (data.createdAt) me.setProperty(sPath + "/createdAt", data.createdAt);

                if (fnCallback) fnCallback.call(me, me.getProperty(sPath + "/objectId"));
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
