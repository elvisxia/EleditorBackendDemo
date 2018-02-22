(function () {
    "use strict"

    var myApp = angular.module("MyApp", []);
    myApp.controller("RootController", function ($scope) {

        var converter = new showdown.Converter();
        //var baseUrl = "http://10.168.172.166:4003/";
        var baseUrl = "http://localhost:1137/";
        var uploadUrl = baseUrl + "api/imageupload/uploadfile";
        $scope.editor = eleditor.render({
            elementId: "divInput",//the div element that will be rendered
            uploadUrl: uploadUrl,
            previewElementId: "divResult",//the preview div element
            textareaId: "mTextArea",//the id of the textarea will be applied
            onTextChange: function () {
                var reg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9\s@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
                var tmp = reg.exec(textArea.value);
                if (tmp != null) {
                    text = textArea.value.replace(tmp[0], encodeURI(tmp[0]));
                } else {
                    text = textArea.value;
                }
                result.innerHTML = converter.makeHtml(textArea.value);
            }//the callback that will be applied when strings are inserted into textarea.

        });

        var textArea = document.getElementById('mTextArea');
        var result = document.getElementById('divResult');
        textArea.oninput = function (evt) {
            //works OK
            var text;
            var reg = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9\s@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi);
            var tmp = reg.exec(textArea.value);
            if (tmp != null) {
                text = textArea.value.replace(tmp[0], encodeURI(tmp[0]));
            } else {
                text = textArea.value;
            }
            
            result.innerHTML = converter.makeHtml(text);
        };



    });
})(angular);