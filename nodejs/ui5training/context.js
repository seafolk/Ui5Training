$data.Class.define("$scope.Types.Course", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    Name: { type: "string" },
    Duration: {type: "int"},
    Level: { type: "string" },
    Teacher: { type: "$scope.Types.User", inverseProperty: "Courses" },
    Product: { type: "string" },
    StartDate: { type: "datetime" },
    EndDate: { type: "datetime" },
    Exercises: { type: "Array", elementType: "$scope.Types.Exercise"}
}, null);

$data.Class.define("$scope.Types.Exercise", $data.Entity, null, {
    Name: { type: "string" },
    ShortDescription:  { type: "string" },
    Duration: { type: "int" }
});

$data.Class.define("$scope.Types.User", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    LoginName: { type: "string" },
    FullName: { type: "string" },
    Email: { type: "string" },
    Courses: { type: "Array", elementType: "$scope.Types.Course", inverseProperty: "Teacher" }
    //Profile: { type: "$scope.Types.UserProfile", inverseProperty: "User" }
}, null);
/*
$data.Class.define("$scope.Types.UserProfile", $data.Entity, null, {
    Id: { type: "id", key: true, computed: true },
    FullName: { type: "string" },
    Avatar: { type: "blob" },
    Location: { type: "$scope.Types.Location" },
    Birthday: { type: "date" },
    User: { type: "$scope.Types.User", inverseProperty: "Profile", required: true }
}, null);

$data.Class.define("$scope.Types.Location", $data.Entity, null, {
    Address: { type: "string" },
    City: { type: "string" },
    Zip: { type: "int" },
    Country: { type: "string" }
}, null);
*/

$data.Class.define("$scope.Types.TrainingContext", $data.EntityContext, null, {
    Courses: { type: $data.EntitySet, elementType: $scope.Types.Course, roles: ['anonymous'] },
    Users: { type: $data.EntitySet, elementType: $scope.Types.User }
    //UserProfiles: { type: $data.EntitySet, elementType: $scope.Types.UserProfile }
}, null);

$scope.Types.TrainingContext.generateTestData = function (context, callBack) {
    var usr1 = new $scope.Types.User({
        LoginName: "nikitin", 
        Email: "nikitin.sergey@company.com",
        FullName: "Никитин Сергей"
        /*
        ,Profile: new $scope.Types.UserProfile({
                FullName: "Никитин Сергей", 
                Birthday: new Date(Date.parse("1975/01/01")),
                Location: new $scope.Types.Location({
                    Zip: 2840,
                    City: 'City1',
                    Address: 'Address6',
                    Country: 'Country1'
                })
        })
*/
    });

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

module.exports = exports = $scope.Types.TrainingContext;
