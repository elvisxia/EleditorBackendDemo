var eleditor = (function () {
    "use strict"

    //internal options
    var _options = {
        elementId: null,
        previewElementId: "divResult",
        uploadUrl: "",
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
            "<li id='fa-bold' class='fa fa-bold'><span class='tooltiptext'>Bold</span></li>" +
            "<li id='fa-italic' class='fa fa-italic'><span class='tooltiptext'>Italic</span></li>" +
            "<li id='fa-header' class='fa fa-header'><span class='tooltiptext'>Header </span></li>" +
            "<i class='separator'>|</i>" +
            "<li id='fa-link' class='fa fa-link'><span class='tooltiptext'>Link</span></li>" +
            "<li id='fa-quote' class='fa fa-quote-left'><span class='tooltiptext'>Quote</span></li>" +
            "<li id='fa-picture' class='fa fa-picture-o'><span class='tooltiptext'>Picture</span></li>" +
            "<li id='fa-file' class='fa fa-file'><span class='tooltiptext'>Upload File</span></li>" +
            "<li id='fa-code' class='fa fa-code'><span class='tooltiptext'>Code</span></li>" +
            "<i class='separator'>|</i>" +
            "<li id='fa-list-ol' class='fa fa-list-ul'><span class='tooltiptext'> Ul </span></li>" +
            "<li id='fa-list-ul' class='fa fa-list-ol'><span class='tooltiptext'> Nummbered List </span></li>" +
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
    function eleditor_btnsClick(evt) {
        //init the textBefore textAfter and textMiddle
        var value = _eleditorContent.value ? _eleditorContent.value : _eleditorContent.innerText;
        var selectionStart = _eleditorContent.selectionStart;
        var selectionEnd = _eleditorContent.selectionEnd;
        var textBefore = _eleditorContent.value.substring(0, selectionStart);
        var textMiddle = _eleditorContent.value.substring(selectionStart, selectionEnd);
        var textAfter = _eleditorContent.value.substring(selectionEnd, value.length);

        var data = {
            textBefore: textBefore,
            textMiddle: textMiddle,
            textAfter: textAfter,
            selectionStart: selectionStart,
            selectionEnd: selectionEnd
        }

        //different buttons add different strings
        switch (evt.srcElement.id) {
            case 'fa-bold': insertStringOnStartEnd("**", "**", "enter text here", data); break;
            case 'fa-italic': insertStringOnStartEnd("*", "*", "enter text here", data); break;
            case 'fa-header': if (cursorInLineStart(textBefore, textAfter)) { insertStringOnStartEnd("##", "", "Heading", data); } else { insertStringOnStartEnd("", "\n----------\n", "Heading", data); } break;
            case 'fa-picture': openModelDialogForUpload('image'); break;
            case 'fa-link': insertStringOnStartEnd("[", "](http://)", "enter link description here", data); break;
            case 'fa-quote': 
                {
                    data.textBefore = data.textBefore.trim() + "\n\n";
                    data.textAfter = "\n\n" + data.textAfter.trim();
                    data.textMiddle = data.textMiddle.trim();
                    insertStringOnEveryLine("", "", ">", 0, data);
                }
                break;
            case 'fa-code':  
                {
                    let startLineNum = getLineNum(selectionStart);
                    let endLineNum = getLineNum(selectionEnd);
                    if (startLineNum != endLineNum || hasSelectedWholeLine(selectionStart, selectionEnd, startLineNum)) {
                        //需要空行
                        data.textBefore = data.textBefore.trim() +"\n\n";
                        data.textAfter = "\n\n" + data.textAfter.trim();
                        data.textMiddle = data.textMiddle.trim();
                        insertStringOnEveryLine("", "", "    ", 0, data);
                    } else {
                        //不需要空行
                        insertStringOnStartEnd("`", "`", "enter code here", data);
                    }
                };
                break;
            case 'fa-list-ul': insertStringOnStartEnd("\n 1. ", "\n", "List Item", data); break;
            case 'fa-list-ol': insertStringOnStartEnd("\n - ", "\n", "List Item", data); break;
            case 'fa-file': openModelDialogForUpload('file'); break;
        }

        _options.onTextChange();
    }

    function hasSelectedWholeLine(startCursor, endCursor,lineNum) {
            let arr = _eleditorContent.value.split("\n");
            if ((endCursor - startCursor) == arr[lineNum-1].length) {
                return true;
            } else {
                return false;
            }
        }

    function getLineNum(index) {
        return _eleditorContent.value.substr(0, index).split("\n").length;
    }
    

    function cursorInLineStart(textBefore, textAfter) {
        var preLines = textBefore.split("\n");
        var preTxt = preLines[preLines.length - 1];
        var postLines = textAfter.split("\n");
        var postTxt = postLines[0];
        if (preTxt.trim() == "" && postTxt.trim() == "") {
            return true;
        } else {
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

    function insertStringOnEveryLine(startStr, endStr, insertStr, lineIndex, data) {
        var newSelectionStart, newSelectionEnd;
        newSelectionStart = data.textBefore.length;
        var lines = data.textMiddle.split("\n");
        var tmpMiddleText = "";
        for (let i = 0; i < lines.length; i++) {
            let tmpStr = lines[i];
            if (i == 0) {
                tmpMiddleText += tmpStr.substr(0, lineIndex).trim() + insertStr + tmpStr.substr(lineIndex, tmpStr.length).trim() + "\n";
            } else {
                tmpMiddleText += tmpStr.substr(0, lineIndex) + insertStr + tmpStr.substr(lineIndex, tmpStr.length) + "\n";
            }
            
        }
        tmpMiddleText = tmpMiddleText.substr(0, tmpMiddleText.length - 1);
        _eleditorContent.value = data.textBefore + startStr + tmpMiddleText + endStr + data.textAfter;
        newSelectionEnd = newSelectionStart + tmpMiddleText.length;
        autoSelectRange(_eleditorContent, newSelectionStart, newSelectionEnd);
    }

    function insertStringOnStartEnd(startText, endText, defaultText, data) {

        if (!data)
        {
            var value = _eleditorContent.value ? _eleditorContent.value : _eleditorContent.innerText;
            var selectionStart = _eleditorContent.selectionStart;
            var selectionEnd = _eleditorContent.selectionEnd;
            var textBefore = _eleditorContent.value.substring(0, selectionStart);
            var textMiddle = _eleditorContent.value.substring(selectionStart, selectionEnd);
            var textAfter = _eleditorContent.value.substring(selectionEnd, value.length);
            data = {
                textBefore: textBefore,
                textMiddle: textMiddle,
                textAfter: textAfter,
                selectionStart: selectionStart,
                selectionEnd: selectionEnd
            }
        }
        var hasTextMiddle = true;

        if (!data.textMiddle) {
            hasTextMiddle = false;
            data.textMiddle = defaultText;
        }
        _eleditorContent.value = data.textBefore + startText + data.textMiddle + endText + data.textAfter;
        if (!hasTextMiddle) {
            var newSelectionStart = data.selectionStart + startText.length;
            var newSelectionEnd = startText.length + data.selectionEnd + data.textMiddle.length;
            autoSelectRange(_eleditorContent, newSelectionStart, newSelectionEnd);
        }

    }

    function openModelDialogForUpload(mode) {
        eluploader.show(mode);
    }

    function initOptions(opts) {
        for (var key in opts) {
            _options[key] = opts[key];
        }
    }

    function render(options) {
        initOptions(options);
        //Initialize some of the options

        _options.textareaId = _options.textareaId ? _options.textareaId : 'eleditor_textarea';

        //init the uploader
        var imageCallback = function (text) {
            insertStringOnStartEnd("![", "](" + text + ")", "enter image description here");
            _options.onTextChange();
        }
        var fileCallback = function (text) {
            insertStringOnStartEnd("[", "](" + text + ")", "enter file description here");
            _options.onTextChange();
        }
        eluploader.render({
            "image": {
                uploadUrl: _options.uploadUrl,
                uploadCallback: imageCallback
            },
            "file": {
                uploadUrl: _options.uploadUrl,
                uploadCallback: fileCallback
            }
        });

        _constructor();
    };


    return {
        render: render
    };

})();

