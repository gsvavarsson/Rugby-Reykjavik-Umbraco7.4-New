angular.module("umbraco")
    .controller("Hunang.IconPickerController",
        function($scope,dialogService, iconHelper) {
            

            $scope.iconStart = function () {

                var iconPicerk = dialogService.iconPicker({
                    template: 'views/common/dialogs/iconpicker.html',
                    show: true,
                    callback: function (e) {
                        $scope.model.value = e;
                    }
                });
            };

            
        });
