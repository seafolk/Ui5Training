require('odata-server');

var contextType = require('./ui5training/context.js');
var context = new $scope.Types.TrainingContext({
    name: 'mongoDB',
    databaseName: 'ui5training',
    dbCreation: $data.storageProviders.DbCreationType.DropAllExistingTables
});

context.onReady(function(db){
    contextType.generateTestData(db, function(count){
        console.log('Test data upload successful. ', count, 'items inserted.');
        console.log('Starting Ui5Training OData server.');

        //var connect = require('connect');
        var connect = require('odata-server/node_modules/connect');
        var app = connect();
        
        app.use('/ui5training.svc', $data.ODataServer({
            type: contextType,
            CORS: true,
            database: 'ui5training',
            responseLimit: 100,
            basicAuth: function(username, password){
                if (username == 'admin'){
                    return password == 'admin';
                }else return true;
            },
            checkPermission: function(access, user, entitySets, callback){
                if (access & $data.Access.Create){
                    if (user == 'admin') callback.success();
                    else callback.error('Auth failed');
                }else callback.success();
            },
            provider: {
                howto: 'You can pass a customized JayData provider configuration in here.'
            }
        }));

        app.listen(52999);
        
        console.log('Ui5Training OData server listening on http://localhost:52999/ui5training.svc');
    });
});
