$(function() {
    var apiPath = "http://16.186.75.243:8080/";
    var app = angular.module("app", ["ngRoute"]);
    app.config(function($routeProvider) {
        $routeProvider
            .when("/job_overview", {
                templateUrl : "app/views/jobs.html",
                controller : "jobOverviewCtrl"
            })
            .when("/job_detail", {
                templateUrl : "app/views/job_detail.html",
                controller : "jobDetailCtrl"
            })
            .when("/job_build_status/:jobName", {
                templateUrl : "app/views/build_status.html",
                controller : "buildStatusCtrl"
            })
            .otherwise("/job_overview",{
                templateUrl : "app/views/jobs.html",
                controller : "jobOverviewCtrl"
            });
    });
    app.controller("jobOverviewCtrl", function ($scope, $http) {
        $scope.jobItems = null;
        loading();

        $http.get(apiPath + "api/json?depth=2&pretty=true&tree=jobs[displayName,url,property[parameterDefinitions[description,name,type,defaultParameterValue[name,value]]]]").
            success(function (data) {
                $scope.jobItems = data.jobs;
            });

    });
    app.controller("buildStatusCtrl", function ($scope, $http, $routeParams) {
        $scope.buildStatusItems = null;
        loading();

        $http.get(apiPath + "job/" + $routeParams.jobName + "/api/json?depth=3&pretty=true&tree=allBuilds[fullDisplayName,queueId,result,timestamp,builtOn]").
            success(function (data) {
                $scope.buildStatusItems = data.allBuilds;
            });
    });

    loading = function(){
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });
    };

}());

