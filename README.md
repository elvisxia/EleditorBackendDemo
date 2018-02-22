Front End:
--

1. **Files to include in index.html(Pay attention to the consequence):**

**js:**

    "lib/jquery.min.js"
    "lib/angular.min.js"
    "lib/showdown.js"
    "js/eluploader.js"
    "js/eleditor.js"
     
   **CSS:**
   
    "css/default.css"
    "css/font-awesome/css/font-awesome.min.css"
    "css/bootstrap.min.css"
    "css/eluploader.css"
    "css/eleditor.css"
2. **Sample usage:**
Html:

       <!DOCTYPE html>
       <html ng-app="MyApp">
           <head>
            <!--css references-->
                <title></title>
           </head>
           <body ng-controller="RootController">
                <div id="divInput"></div>
                <div id="divResult" ></div>
            <!--scripts references-->
          </body>
       </html>

JS:

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
        //var baseUrl = "http://10.168.172.166:4003/";
        var baseUrl = "http://localhost:1137/";
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
