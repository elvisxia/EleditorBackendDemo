var eleditor=(function () {
    "use strict"

    //internal options
    var _options = {
        elementId: null,
        previewElementId:"divResult",
        uploadUrl: "http://localhost:4033/api/imageupload/uploadfile",
        textareaId: "textareaId",
        onTextChange: function () { }
    }

    //internal variables
    var _template = "";
    var _element = null;
    var _eleditorContent = {};
    var _eleditorUl = {};
    var _previewElement = null;
    
    
    //initialize the template
    function initTemplate() {
        _template = "<div class='eleditor_container'>" +
            "<ul id='eleditor_ul' class='eleditor_toolbar'>" +
            "<li id='fa-bold' class='fa fa-bold'></li>" +
            "<li id='fa-italic' class='fa fa-italic'></li>" +
            "<li id='fa-header' class='fa fa-header'></li>" +
            "<i class='separator'>|</i>" +
            "<li id='fa-link' class='fa fa-link'></li>" +
            "<li id='fa-quote' class='fa fa-quote-left'></li>" +
            "<li id='fa-picture' class='fa fa-picture-o'></li>" +
            "<li id='fa-file' class='fa fa-file'></li>"+
            "<li id='fa-code' class='fa fa-code'></li>" +
            "<i class='separator'>|</i>" +
            "<li id='fa-list-ol' class='fa fa-list-ul'></li>" +
            "<li id='fa-list-ul' class='fa fa-list-ol'></li>" +
            "<i class='separator'>|</i>" +
            "</ul>" +
            "<textarea style='padding:10px' id='" + _options.textareaId + "' class='eleditor_content'></textarea>" +
            "</div>";
    }

    //constrcutor
    function _constructor() {
        //Edit the template to give some ids so that user can find the textarea by Id
        initTemplate();
        //apply the template
        _element = document.getElementById(_options.elementId);
        _previewElement = document.getElementById(_options.previewElementId);
        _element.innerHTML = _template;
        //get the textarea
        _eleditorContent = document.getElementById(_options.textareaId);
        //get the Ul and set Ul onclick event
        _eleditorUl = document.getElementById("eleditor_ul");
        _eleditorUl.onclick = eleditor_btnsClick;
    }

    //btns click event listeners
    function eleditor_btnsClick(evt)
    {
        switch (evt.srcElement.id) {
            case 'fa-bold': insertStringOnStartEnd("**", "**","enter text here");  break;
            case 'fa-italic': insertStringOnStartEnd("*", "*", "enter text here");  break;
            case 'fa-header': if (cursorInLineStart()) { insertStringOnStartEnd("##", "##\n", "Heading"); } else { insertStringOnStartEnd("", "\n----------\n", "Heading"); }  break;
            case 'fa-picture': openModelDialogForUpload('image');  break;
            case 'fa-link': insertStringOnStartEnd("[","](http://)","enter link description here");  break;
            case 'fa-quote': insertStringOnStartEnd("\n>", "","enter code here");  break;
            case 'fa-code': if (cursorInLineStart()) { insertStringOnStartEnd("\n    ", "\n", "enter code here"); } else { insertStringOnStartEnd("`", "`", "enter code here"); } break;
            case 'fa-list-ul': insertStringOnStartEnd("\n 1. ", "\n", "List Item"); break;
            case 'fa-list-ol': insertStringOnStartEnd("\n - ", "\n", "List Item"); break;
            case 'fa-file': openModelDialogForUpload('file');break;
        }

        _options.onTextChange();
    }

    function cursorInLineStart()
    {
        var re = /(\s)+/g;
        var lines = _eleditorContent.value.substr(0, _eleditorContent.selectionStart).split("\n");
        var text = lines[lines.length - 1];
        if (text == "")
        {
            return true;
        }
        var txt = re.exec(text);
        if (txt && txt != "") {
            return true;
        } else
        {
            return false;
        }
    }


    function autoSelectRange(field, start, end) {
        if (field.createTextRange) {
            var selRange = field.createTextRange();
            selRange.collapse(true);
            selRange.moveStart('character', start);
            selRange.moveEnd('character', end);
            selRange.select();
            field.focus();
        } else if (field.setSelectionRange) {
            field.focus();
            field.setSelectionRange(start, end);
        } else if (typeof field.selectionStart != 'undefined') {
            field.selectionStart = start;
            field.selectionEnd = end;
            field.focus();
        }
    }



    //insert string into textare on cursor position
    function insertStringOnCursor(str) {
        var value = _eleditorContent.value;
        var cursorPos = _eleditorContent.selectionStart;
        var textBefore = _eleditorContent.value.substring(0, cursorPos);
        var textAfter = _eleditorContent.value.substring(cursorPos, value.length);

        _eleditorContent.value = textBefore + str + textAfter;
    }

    function insertStringOnStartEnd(startText,endText,defaultText) {

        var hasTextMiddle = true;
        var value = _eleditorContent.value ? _eleditorContent.value : _eleditorContent.innerText;
        var selectionStart = _eleditorContent.selectionStart;
        var selectionEnd = _eleditorContent.selectionEnd;
        var textBefore = _eleditorContent.value.substring(0, selectionStart);
        var textMiddle = _eleditorContent.value.substring(selectionStart, selectionEnd);
        if (!textMiddle)
        {
            hasTextMiddle = false;
            textMiddle = defaultText;
        }
        var textAfter = _eleditorContent.value.substring(selectionEnd, value.length);

        _eleditorContent.value = textBefore + startText + textMiddle + endText + textAfter;
        if (!hasTextMiddle)
        {
            var newSelectionStart = selectionStart + startText.length;
            var newSelectionEnd = startText.length + selectionEnd + textMiddle.length;
            autoSelectRange(_eleditorContent, newSelectionStart, newSelectionEnd);
        }
        
    }

    function openModelDialogForUpload(mode) {
        eluploader.show(mode);
    }

    function initOptions(opts)
    {
        for (var key in opts)
        {
            _options[key] = opts[key];
        }
    }
    
    function render(options)
    {
        initOptions(options);
        //Initialize some of the options
        
        _options.textareaId = _options.textareaId ? _options.textareaId : 'eleditor_textarea';

        //init the uploader
        var imageCallback = function (text) {
            insertStringOnStartEnd("![","](" + text + ")","enter image description here");
            _options.onTextChange();
        }
        var fileCallback=function(text)
        {
            insertStringOnStartEnd("[","](" + text + ")","enter file description here");
            _options.onTextChange();
        }
        eluploader.render({
            "image": {
                uploadUrl: _options.uploadUrl,
                uploadCallback: imageCallback
            },
            "file": {
                uploadUrl:_options.uploadUrl,
                uploadCallback:fileCallback
            }
        });

        _constructor();
    };


    return {
        render: render
    };

})();

