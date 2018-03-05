var eluploader = (function () {
    "use strict"

    var template = "<div id='eluploader_container'>" +
        "<div id='eluploader_content' >" +
        "<div id='eluploader_up_zone'>" +
        "<div id='eluploader_drop'>" +
        "<p>Drag and Drop<span>(Picture Max 2Mb)</span></p>" +
        "</div>" +
        "<div id='eluploader_weblink'>" +
        "<span id='eluploader_linkguide'>You can also provide a <a id='eluploader_linkhref' href='#'>link from the web</a></span>" +
        "<span id='eluploader_link'>Web link from <input id='eluploader_webPic' type='text' width=40;> | <a id='eluploader_cancelLink' href='#'>cancel</a></span>" +
        "</div>" +
        "</div>" +
        "<div id='eluploader_bottom_zone'>" +
        "<button id='eluploader_save' class='btn btn-success'>Add</button>" +
        "<input id='inputFile' type='file' style='opacity: 0.0; position: absolute;visibility:hidden;' />"+
        "</div>" +
        "</div>" +
        "</div>";



    var _options = {
        "file": {
            "uploadUrl": "",
            "maxSize": 10,
            "uploadCallback": function (args) { },
            "acceptTypes": {
                'all': true
            }
        },
        "image": {
            "uploadUrl": "",
            "maxSize": 2,//the size of max upload 2=2MB
            "uploadCallback": function (args) { },
            "acceptTypes": {
                'image/png': true,
                'image/jpeg': true,
                'image/gif': true
            }
        }
    }

    var _linkGuide, _linkhref, _link, _cancelLink, _dropzone, _btnAddPic, _webPic,_inputFile;
    var formData;
    var maxSize;
    var _mode = "image";
    var fileMode = false;
    var isEdgeIE = new FormData().has ? false : true;

    function initFormDataObjForEdgeIE() {
        formData.has = function (str) {
            return true;
        }
        formData.get = function (str) {
            return null;
        }
        formData.delete = function (str) {
            return;
        }
    }

    function initOptions(opts) {
        for (var key in opts) {
            for (var subKey in opts[key]) {
                _options[key][subKey] = opts[key][subKey];
            }
        }
    }

    function startLoading() {
        //var loadingTemplate="<div id='eluploader_loadermask'><div id='eluploader_loader'></div></div>"
        var loaderMask = document.createElement("div");
        loaderMask.id = "eluploader_loadermask";
        loaderMask.innerHTML = "<div id='eluploader_loader'></div>";
        document.body.appendChild(loaderMask);
    }

    function stopLoading() {
        var loaderMask = document.getElementById("eluploader_loadermask");
        document.body.removeChild(loaderMask);
    }

    function switchMode(mode) {
        _mode = mode;
        //file upload
        if (mode == "file") {
            fileMode = true;
            document.getElementById("eluploader_weblink").style.display = "none";
            _dropzone.innerHTML = "<p>Drag and Drop<span>(File Max " + _options[_mode].maxSize + "Mb)</span></p>";
        }
        //image upload by default
        else {
            fileMode = false;
            document.getElementById("eluploader_weblink").style.display = "block";
            _dropzone.innerHTML = "<p>Drag and Drop<span>(Image Max " + _options[_mode].maxSize + "Mb)</span></p>";
        }
    }

    function initControl() {
        _linkGuide = document.getElementById('eluploader_linkguide');
        _linkhref = document.getElementById('eluploader_linkhref');
        _link = document.getElementById('eluploader_link');
        _cancelLink = document.getElementById('eluploader_cancelLink');
        _webPic = document.getElementById('eluploader_webPic');
        _dropzone = document.getElementById('eluploader_drop');
        _btnAddPic = document.getElementById('eluploader_save');
        _linkGuide.style.display = "block";
        _link.style.display = "none";
        _inputFile = document.getElementById("inputFile");


        //events
        window.onclick = function (evt) {
            if (evt.target.id == "eluploader_container") {
                eluploader.hideAndClear();
            }
        };
        _linkhref.onclick = function (evt) {
            _linkGuide.style.display = "none";
            _link.style.display = "block";
        }
        _cancelLink.onclick = function () {
            _linkGuide.style.display = "block";
            _link.style.display = "none";
        }

        _inputFile.onchange = function (e) {
            e.preventDefault();
            readFiles(_inputFile.files);
        }
        _dropzone.onclick = function (e) {
            _inputFile.click();
        }
        _dropzone.ondragover = function (e) {
            return false;
        }
        _dropzone.ondragend = function (e) {
            return false;
        }
        _dropzone.ondrop = function (e) {
            e.preventDefault();
            readFiles(e.dataTransfer.files);
        }

        //button click event of Add Picture
        _btnAddPic.onclick = function (e) {
            var re = /(http:\/\/|https:\/\/)/g;

            //upload image from the link
            if (_webPic.value && re.exec(_webPic.value)) {
                _options[_mode].uploadCallback(_webPic.value);
                eluploader.hideAndClear();
            }
            else if (formData && formData.has('file')) {
                //upload file from formdata
                //start loading
                startLoading();
                uploadFile();
            }
            //No image
            else {
                if (fileMode) {
                    alert('please put a file');
                } else {
                    alert('please put an image')
                }
            }
        }
    }
    //Upload Image using Ajax
    function uploadFile() {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', _options[_mode].uploadUrl, true);
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                var resText = xhr.responseText;
                resText = resText.replace(/"/g, "");
                //get the url and add the picture to the context
                _options[_mode].uploadCallback(resText);
                stopLoading();
                eluploader.hideAndClear();
            }
        }

        xhr.send(formData);
    }
    //add the file to FormData
    function readFiles(files) {
        var file = files[0];

        if (!fileMode) {
            if (!_options[_mode].acceptTypes[file.type]) {
                alert("Wrong file type!!");
                return;
            }
        }
        if (!formData || isEdgeIE) {
            formData = new FormData();
            initFormDataObjForEdgeIE();
        };
        if (formData.has('file')) {
            formData.delete('file');
        }

        if (file.size > _options[_mode].maxSize * 1024 * 1024) {
            window.alert("The size of the file is too large!");
            return;
        }
        formData.append('file', files[0]);
        previewFile(files[0]);
    }
    //append the image to eluploader_drop
    function previewFile(file) {
        //var pattern = _options[_mode].acceptTypes['pattern'];
        //var reg = new RegExp(pattern, 'g');
        //upload image
        if (_options[_mode].acceptTypes[file.type] == true) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = new Image();
                image.src = event.target.result;
                image.width = 250; // a fake resize
                _dropzone.innerHTML = "";

                _dropzone.appendChild(image);
            };
            reader.readAsDataURL(file);
        }
        //upload file
        else if (_options[_mode].acceptTypes[file.type] || _options[_mode].acceptTypes["all"]) {
            var div = document.createElement("div");
            div.innerText = file.name;
            _dropzone.innerHTML = "";
            _dropzone.appendChild(div);
        }
    }

    return {
        //settings of eluploader, the first element to be set
        settings: {
            "file": {
                "uploadUrl": "",
                "maxSize": 10,
                "uploadCallback": function (args) { },
                "acceptTypes": {
                    'pattern': /(\S+)\/(\S+)/
                }
            },
            "image": {
                "uploadUrl": "",
                "maxSize": 2,//the size of max upload 2=2MB
                "uploadCallback": function (args) { },
                "acceptTypes": {
                    'image/png': true,
                    'image/jpeg': true,
                    'image/gif': true
                }
            }
        },
        /*requires ElementId*/
        render: function (options) {
            initOptions(options);
            var eluploader_container = document.getElementById("eluploader_container");
            if (eluploader_container != null) {
                return;
            } else {
                document.body.innerHTML += template;
                document.getElementById("eluploader_container").style.display = "none";
            }

            //TO-DO: register event listener
            initControl();
        },
        show: function (mode) {
            switchMode(mode);
            var container = document.getElementById("eluploader_container");
            if (container != null) {
                container.style.display = "block";
            }
        },
        hideAndClear: function () {
            var container = document.getElementById("eluploader_container");
            if (container != null) {
                container.style.display = "none";
            }

            //TO-DO:remove image and revert css style to original
            if (_dropzone) {
                _dropzone.innerHTML = "<p>Drag and Drop<span>(Picture Max 2Mb)</span></p>";
            }

            //clear formdata
            if (formData && formData.has && formData.has('file')) {
                formData.delete('file');
                formData = null;
            }
            //clear the input selection
            var inputFile = document.getElementById("inputFile");
            if (inputFile && inputFile.value) {
                inputFile.value = "";
            }

            _webPic.value = "";
        }
    };
})();

//test codes:
//eluploader.render();
//eluploader.show();