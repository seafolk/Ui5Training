$data.Class.define("$scope.Types.Course", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    Name: { type: "string" },
    Duration: {type: "int"},
    Level: { type: "string" },
    Teacher: { type: "$scope.Types.User" },
    Product: { type: "string" },
    StartDate: { type: "datetime" },
    EndDate: { type: "datetime" },
    Exercises: { type: "Array", elementType: "$scope.Types.Exercise"}
}, null);

$data.Class.define("$scope.Types.Exercise", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    Name: { type: "string" },
    ShortDescription:  { type: "string" },
    Duration: { type: "int" }
});

$data.Class.define("$scope.Types.User", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    LoginName: { type: "string" },
    Email: { type: "string" },
    Profile: { type: "$scope.Types.UserProfile", inverseProperty: "User" }
}, null);

$data.Class.define("$scope.Types.UserProfile", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    FullName: { type: "string" },
    Bio: { type: "string" },
    Avatar: { type: "blob" },
    Location: { type: "$scope.Types.Location" },
    Birthday: { type: "date" },
    User: { type: "$scope.Types.User", inverseProperty: "Profile", required: true }
}, null);

$data.Class.define("$news.Types.Location", $data.Entity, null, {
    Address: { type: "string" },
    City: { type: "string" },
    Zip: { type: "int" },
    Country: { type: "string" }
}, null);

$scope.Types.scopeContext.generateTestData = function (context, callBack) {
    var usr1 = new $scope.Types.User({ LoginName: "nikitin", Email: "nikitin.sergey@company.com", Profile: new $scope.Types.UserProfile({ FullName: "Nikitin Sergey", Birthday: new Date(Date.parse("1975/01/01")), Location: new $scope.Types.Location({ Zip: 2840, City: 'City1', Address: 'Address6', Country: 'Country1' }) }) });
    var usr2 = new $scope.Types.User({ LoginName: "Usr2", Email: "usr2@company.com", Profile: new $scope.Types.UserProfile({ FullName: "Full Name", Birthday: new Date(Date.parse("1976/02/01")), Location: new $scope.Types.Location({ Zip: 1117, City: 'City2', Address: 'Address7', Country: 'Country2' }) }) });
    var usr3 = new $scope.Types.User({ LoginName: "Usr3", Email: "usr3@company.com", Profile: new $scope.Types.UserProfile({ FullName: "Full Name1", Birthday: new Date(Date.parse("1977/03/01")), Location: new $scope.Types.Location({ Zip: 1115, City: 'City3', Address: 'Address8', Country: 'Country3' }) }) });
    var usr4 = new $scope.Types.User({ LoginName: "Usr4", Email: "usr4@company.com", Profile: new $scope.Types.UserProfile({ FullName: "Full Name1", Birthday: new Date(Date.parse("1978/04/01")), Location: new $scope.Types.Location({ Zip: 1211, City: 'City4', Address: 'Address9', Country: 'Country4' }) }) });
    var usr5 = new $scope.Types.User({ LoginName: "Usr5", Email: "usr5@company.com", Profile: new $scope.Types.UserProfile({ FullName: "Full Name2", Birthday: new Date(Date.parse("1979/05/01")), Location: new $scope.Types.Location({ Zip: 3451, City: 'City5', Address: 'Address0', Country: 'Country5' }) }) });

    context.Courses.add(
        new $scope.Types.Course({
            Name: "HTML5/CSS3",
            Duration: 960,
            Level: "базовый",
            Teacher: usr1,
            Product: "SAPUI5",
            StartDate: new Date(Date.parse("2014/10/10")),
            EndDate: new Date(Date.parse("2014/10/12")),
            Exercises: [
                new $scope.Types.Exercise({ Name:"Упражнение 1", ShortDescription: "Описание первого упражнения", Duration: 120}),
                new $scope.Types.Exercise({ Name:"Упражнение 2", ShortDescription: "Описание второго упражнения", Duration: 60})
            ]
        })
    );

    context.Courses.add(
        new $scope.Types.Course({
            Name: "SAPUI5",
            Duration: 1440,
            Level: "расширенный",
            Teacher: usr1,
            Product: "SAPUI5",
            StartDate: new Date(Date.parse("2014/10/13")),
            EndDate: new Date(Date.parse("2014/10/16")),
            Exercises: [
                new $scope.Types.Exercise({ Name:"Упражнение 1", ShortDescription: "Описание первого упражнения", Duration: 120}),
                new $scope.Types.Exercise({ Name:"Упражнение 2", ShortDescription: "Описание второго упражнения", Duration: 60})
            ]
        })
    );

    context.saveChanges(function (count) {
        if (callBack) {
            callBack(count);
        }
    });
};

module.exports = exports = $scope.Types.scopeContext;
