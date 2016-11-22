/*! 
* FUNP - v1.0.0 
* © Copyright 2016  Liangli Huang
 */
/**
 * Created by hualiang on 16-10-19.
 */

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
        console.log("Arrived at job overview page already!!");

        $scope.jobItems = null;
        loading();

        $http.get(apiPath + "api/json?depth=2&pretty=true&tree=jobs[displayName,url,property[parameterDefinitions[description,name,type,defaultParameterValue[name,value]]]]").
            success(function (data) {
                $scope.jobItems = data.jobs;
            });

    });
    app.controller("buildStatusCtrl", function ($scope, $http, $routeParams) {
        console.log("Arrived at build status page already!!");

        $scope.buildStatusItems = null;
        loading();

        $http.get(apiPath + "job/" + $routeParams.jobName + "/api/json?depth=3&pretty=true&tree=allBuilds[fullDisplayName,queueId,result,timestamp,builtOn]").
            success(function (data) {
                $scope.buildStatusItems = data.allBuilds;
            });

    });

    app.controller("productListCtrl", function ($scope, $http){
        $scope.productItems = null;
        $scope.productItems_selected = [];
        $scope.actionSelected = "";
        $scope.productItems_copy = [];

        //wait for loading product list
        loading();

        //Get product list data
        getProductListByFilters = function(){
            var searchProductByFilters = {};
            searchProductByFilters.type = $("#product_type").prop('selectedIndex');
            searchProductByFilters.publishState = $("#release_state").prop('selectedIndex');
            searchProductByFilters.productRecommend = $("#recommendation").prop('selectedIndex');
            searchProductByFilters.productCategory = $("#product_category").val();

            $http.post(apiPath + "eden/prods/lists", searchProductByFilters)
                .then(function successCallback(response) {
                    console.log("Get product list by filter successfully.");
                    $scope.productItems = response.data;
                    $scope.productItems_copy = response.data;
                    $scope.productItems_selected = [];
                }, function errorCallback(response) {
                    console.log("Failed to get product list by filter");
                });
        };
        console.log("Invoke product list controller, get product list data from remote here!");
        $scope.searchProductListByFilters = function (){
            console.log("Starting to search product items by filters...");
            console.log("Selected product category: " + $("#product_category").val() + " Selected index: " + $("#product_category").prop('selectedIndex'));
            console.log("Selected product type: " + $("#product_type").val() + " Selected index: " + $("#product_type").prop('selectedIndex'));
            console.log("Selected release state: " + $("#release_state").val() + " Selected index: " + $("#release_state").prop('selectedIndex'));
            console.log("Selected recommendation: " + $("#recommendation").val() + " Selected index: " + $("#recommendation").prop('selectedIndex'));

            getProductListByFilters();
        };
        $scope.searchProductListByFilters();

        //click top check item - all yes or no
        $scope.checkALLYesNo = function (){
            console.log("Check all flag: " + $scope.checkAll);
            var allCheck = $('input[name=mySelectedProduct]');
            allCheck.prop('checked', $scope.checkAll);
            $scope.productItems_selected = [];
            if($scope.checkAll){
                for(item in $scope.productItems_copy){
                    $scope.productItems_selected.push($scope.productItems_copy[item]);
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
        };

        //click check item for each line and update top check status if need
        $scope.checkItem = function(userItem){
            console.log("Check item flag: " + userItem.checked);
            if (userItem.checked){
                $scope.productItems_selected.push(userItem);
            }else{
                for(item in $scope.productItems_selected){
                    if($scope.productItems_selected[item].id == userItem.id){
                        $scope.productItems_selected.splice(item, 1);
                    }
                }
            }
            console.log("Current selected number: "+$scope.productItems_selected.length);
            var allCheck = $("#allCheckControl");
            if($scope.productItems_selected.length == 0){
                allCheck.prop('checked', false);
            }else if($scope.productItems_selected.length == $scope.productItems_copy.length){
                allCheck.prop('checked', true);
            }
        };

        //reset productItem with copy list
        $scope.resetSearch = function (){
            $scope.productItems = $scope.productItems_copy;
            $scope.searchProductListByFilters();
        };

        //open modal for recommend/recommendCancel/online/offline
        $scope.actionClickModal = function (action){
            console.log("Click button: "+action);
            $scope.actionSelected = action;
        };

        //confirm yes or no in modal dialog
        $scope.actionConfirm = function (){
            console.log("Confirm action: "+$scope.actionSelected);

            angular.forEach($scope.productItems_selected, function(item){
                $http.get(apiPath + "eden/prods/opes/" + $scope.actionSelected + "/" + item.id)
                    .then(function successCallback(response) {
                        console.log($scope.actionSelected + " product: " + item.name + " successfully");
                        getProductListByFilters();
                    }, function errorCallback(response) {
                        console.log("Failed to " + $scope.actionSelected + " product: " + item.name);
                    });
            });

            $(confirmDiag).modal('hide');
        };
    });
    app.controller("updateARProductDetail", function ($routeParams) {
        console.log("Product ID: "+ $routeParams.productID);
    });
    app.controller("newARDetailCtrl", function () {
        console.log("Arrived at new AR product detail page already!!");
    });
    app.controller("newVideoDetailCtrl", function () {
        console.log("Arrived at new video product detail page already!!");
    });
    app.controller("firstLevelCategoryCtrl", function ($scope){
        $scope.firstLevelCategoryItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get first level category list data
        $scope.firstLevelCategoryItems = [];
        $scope.firstLevelCategoryItems[0] = {
            "id": "1",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[1] = {
            "id": "2",
            "firstCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[2] = {
            "id": "3",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[3] = {
            "id": "4",
            "firstCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.firstLevelCategoryItems[4] = {
            "id": "5",
            "firstCategoryName": "语言",
            "modifyDate": new Date()
        };

        //temp first level category items array for search feature
        firstLevelCategoryItems_temp = [];

        $scope.searchByCategory = function (){
            if(firstLevelCategoryItems_temp.length == 0)
                firstLevelCategoryItems_temp = $scope.firstLevelCategoryItems;
            $scope.firstLevelCategoryItems = [];
            var pattern = new RegExp($scope.firstCategorySearch, "i");
            for(item in firstLevelCategoryItems_temp){
                if(pattern.test(firstLevelCategoryItems_temp[item].firstCategoryName)) {
                    $scope.firstLevelCategoryItems.push(firstLevelCategoryItems_temp[item]);
                }
            }
        };

        $scope.deleteItem = function(selectedItem) {
            $scope.selectedFirstLevelCategoryID = selectedItem.id;
            $scope.selectedFirstLevelCategoryItem = selectedItem;
            console.log("Selected id: " + $scope.selectedFirstLevelCategoryID);
        };
    });
    app.controller("secondLevelCategoryCtrl", function ($scope){
        $scope.secondLevelCategoryItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get first level category list data
        $scope.secondLevelCategoryItems = [];
        $scope.secondLevelCategoryItems[0] = {
            "id": "1",
            "firstCategoryName": "语言",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[1] = {
            "id": "2",
            "firstCategoryName": "社会",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[2] = {
            "id": "3",
            "firstCategoryName": "语言",
            "secondCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[3] = {
            "id": "4",
            "firstCategoryName": "社会",
            "secondCategoryName": "社会",
            "modifyDate": new Date()
        };
        $scope.secondLevelCategoryItems[4] = {
            "id": "5",
            "firstCategoryName": "语言",
            "secondCategoryName": "语言",
            "modifyDate": new Date()
        };

        //temp second level category items array for search feature
        secondLevelCategoryItems_temp = [];

        $scope.searchByCategory = function (){
            console.log("Select first level: "+$scope.firstCategorySelected+" second level: "+$scope.secondCategorySelected);

            if(secondLevelCategoryItems_temp.length == 0)
                secondLevelCategoryItems_temp = $scope.secondLevelCategoryItems;
            $scope.secondLevelCategoryItems = [];

            if (typeof $scope.secondCategorySelected == "undefined")
                $scope.secondCategorySelected = "";
            var patternFirstLevel = new RegExp($scope.firstCategorySelected, "i");
            var patternSecondLevel = new RegExp($scope.secondCategorySelected, "i");
            for(item in secondLevelCategoryItems_temp){
                if(patternFirstLevel.test(secondLevelCategoryItems_temp[item].firstCategoryName)
                    && patternSecondLevel.test(secondLevelCategoryItems_temp[item].secondCategoryName)) {
                    $scope.secondLevelCategoryItems.push(secondLevelCategoryItems_temp[item]);
                }
            }
        };

        $scope.deleteItem = function(selectedItem) {
            $scope.selectedSecondLevelCategoryID = selectedItem.id;
            $scope.selectedSecondLevelCategoryItem = selectedItem;
            console.log("Selected id: " + $scope.selectedSecondLevelCategoryID);
        };
    });
    app.controller("userAdminCtrl", function ($scope){
        $scope.userItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get product list data
        console.log("Invoke user admin controller, get user admin list data here!");
        $scope.userItems = [];
        $scope.userItems[0] = {
            "id": "1",
            "phoneNumber": "13xxxxxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[1] = {
            "id": "2",
            "phoneNumber": "137xxxxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[2] = {
            "id": "3",
            "phoneNumber": "1366xxxxxxx",
            "registerDate": new Date(),
            "babySex": "女",
            "babyBirthday": new Date()
        };
        $scope.userItems[3] = {
            "id": "4",
            "phoneNumber": "13777xxxxxx",
            "registerDate": new Date(),
            "babySex": "男",
            "babyBirthday": new Date()
        };
        $scope.userItems[4] = {
            "id": "5",
            "phoneNumber": "131111xxxxx",
            "registerDate": new Date(),
            "babySex": "女",
            "babyBirthday": new Date()
        };

        //temp user items array for search feature
        userItems_temp = [];

        $scope.searchUserListByPhone = function (){
            if(userItems_temp.length == 0)
                userItems_temp = $scope.userItems;
            $scope.userItems = [];
            var pattern = new RegExp($scope.searchPhoneNumber, "i");
            for(item in userItems_temp){
                if(pattern.test(userItems_temp[item].phoneNumber)) {
                    $scope.userItems.push(userItems_temp[item]);
                }
            }
        };

        $scope.resetPWD = function(userItem) {
            //alert("用户（" + "手机号码:"+ userItem.phoneNumber+"）重置密码");
            $scope.selectedUserID = userItem.id;
            $scope.selectedUserItem = userItem;
            console.log("Selected user id: " + $scope.selectedUserID);
        };
    })
    app.controller("logDownloadCtrl", function ($scope){
        $scope.logItems = null;
        var loadScreenDiv = $("#loadingScreen");
        var loadingScreenLen = loadScreenDiv.width();
        loadScreenDiv.css("margin-left",(loadingScreenLen>441) ? ((loadingScreenLen-441)/2) : 0 + "px");

        $(window).resize(function() {
            var loadScreenDiv_resize = $("#loadingScreen");
            var loadingScreenLen_resize = loadScreenDiv_resize.width();
            loadScreenDiv_resize.css("margin-left",(loadingScreenLen_resize>441) ? ((loadingScreenLen_resize-441)/2) : 0 + "px");
        });

        //Get download log list data
        console.log("Invoke log list controller, get download log list data here!");
        $scope.logItems = [];
        $scope.logItems[0] = {
            "id": "1",
            "phoneNumber": "13xxxxxxxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[1] = {
            "id": "2",
            "phoneNumber": "1323425xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[2] = {
            "id": "3",
            "phoneNumber": "1323666xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[3] = {
            "id": "4",
            "phoneNumber": "13234256666",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
        $scope.logItems[4] = {
            "id": "5",
            "phoneNumber": "1377425xxxx",
            "downloadDate": new Date(),
            "downloadProductName": "蛋生世界"
        };
    });
    app.controller("otherUrlCtrl", function () {
        console.log("Otherwise URL contoller...");
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

