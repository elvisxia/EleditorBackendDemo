(function () {
    "use strict"

    var myApp = angular.module("MyApp", []);
    myApp.controller("RootController", function ($scope) {

        var converter = new showdown.Converter();
        var baseUrl = "http://10.168.172.166:4003/";
        //var baseUrl = "http://localhost:1137/";
        var uploadUrl = baseUrl + "api/imageupload/uploadfile";
        $scope.editor = eleditor.render({
            elementId: "divInput",//the div element that will be rendered
            uploadUrl: uploadUrl,
            previewElementId: "divResult",//the preview div element
            textareaId: "mTextArea",//the id of the textarea will be applied
            onTextChange: function () {
                result.innerHTML = converter.makeHtml(textArea.value);
            }//the callback that will be applied when strings are inserted into textarea.

        });

        var textArea = document.getElementById('mTextArea');
        var result = document.getElementById('divResult');
        textArea.oninput = function (evt) {
            result.innerHTML = converter.makeHtml(textArea.value);
        };



    });
})(angular);