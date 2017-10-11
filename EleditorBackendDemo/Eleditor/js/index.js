(function(){
    "use strict"

    var myApp = angular.module("MyApp", []);
    myApp.controller("RootController", function ($scope) {
        
        var converter = new showdown.Converter();

        $scope.editor = eleditor.render({
            elementId: "divInput",//the div element that will be rendered
            uploadUrl:"http://localhost:1137/api/imageupload/uploadfile",
            previewElementId:"divResult",//the preview div element
            textareaId: "mTextArea",//the id of the textarea will be applied
            onTextChange: function () {
                result.innerHTML = converter.makeHtml(textArea.value);
            }//the callback that will be applied when strings are inserted into textarea.
            
        });

        var textArea = document.getElementById('mTextArea');
        var result = document.getElementById('divResult');
        textArea.oninput = function (evt)
        {
           result.innerHTML = converter.makeHtml(textArea.value);
        }
        


    });
})(angular)