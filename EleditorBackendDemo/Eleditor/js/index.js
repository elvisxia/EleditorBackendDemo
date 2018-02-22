(function () {
    "use strict"

    var myApp = angular.module("MyApp", []);
    //to Encode the url of text
    var encodeURLFunc = function (text) {
        var reg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9\s@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
        var tmp = reg.exec(text);
        if (tmp != null) {
            text = text.replace(tmp[0], encodeURI(tmp[0]));
        }
        return text;
    }
    myApp.controller("RootController", function ($scope) {

        var converter = new showdown.Converter();
        var baseUrl = "https://eleditordemo.azurewebsites.net/";
        var uploadUrl = baseUrl + "api/imageupload/uploadfile";
        

        $scope.editor = eleditor.render({
            elementId: "divInput",//the div element that will be rendered
            uploadUrl: uploadUrl,
            previewElementId: "divResult",//the preview div element
            textareaId: "mTextArea",//the id of the textarea will be applied
            onTextChange: function () {
                result.innerHTML = converter.makeHtml(encodeURLFunc(textArea.value));
            }//the callback that will be applied when strings are inserted into textarea.

        });

        var textArea = document.getElementById('mTextArea');
        var result = document.getElementById('divResult');
        
        textArea.oninput = function (evt) {

            result.innerHTML = converter.makeHtml(encodeURLFunc(textArea.value));
        };
    });
})(angular);