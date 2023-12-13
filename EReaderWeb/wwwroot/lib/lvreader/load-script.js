(function () {
    /*
        var jsonData = {
            //lvb : 2,
            //lvm : 4,
            //zip : 5,
            jpg : 1,
            gif : 40,
            png : 41,
            bmp : 10,
            jpe : 9,
            jpeg : 20,
            svg : 3,
            mp3 : 50,
            //mp4 : 51,
            wav : 90,
            m4a : 7,
            //pdf : 30,
            //doc : 70,
            //docx : 71,
            //xls : 52,
            //xlsx : 8,
            //ppt : 11,
            //pptx : 12,
            //htm : 91,
            //html : 92,
            json : 31,
            js : 13,
            //js1 : 53,
            //js2 : 42,
            //js3 : 80,
            //js4 : 14
        };
        var arrData = [];

        Object.keys(jsonData).forEach(function (key) { arrData[jsonData[key]] = key; });

        console.log(JSON.stringty);

     */

    //const FileExtensions = [null, "jpg", "lvb", "svg", "lvm", "zip", null, "m4a", "xlsx", "jpe", "bmp", "ppt", "pptx", "js", null, null, null, null, null, null, "jpeg", null, null, null, null, null, null, null, null, null, "pdf", "json", null, null, null, null, null, null, null, null, "gif", "png", null, null, null, null, null, null, null, null, "mp3", "mp4", "xls", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "doc", "docx", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wav", "htm", "html"];
    const FileExtensions = [null, "jpg", null, "svg", null, null, null, "m4a", null, "jpe", "bmp", null, null, "js", null, null, null, null, null, null, "jpeg", null, null, null, null, null, null, null, null, null, null, "json", null, null, null, null, null, null, null, null, "gif", "png", null, null, null, null, null, null, null, null, "mp3", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wav"];
    const FileContentTypes = { "lvb": "application/sureboard", "lvm": "application/sureboard", "zip": "application/zip", "jpg": "image/jpeg", "gif": "image/gif", "png": "image/png", "bmp": "image/bmp", "jpe": "image/jpeg", "jpeg": "image/jpeg", "svg": "image/svg+xml", "mp3": "audio/mp3", "mp4": "video/mp4", "wav": "audio/wav", "m4a": "audio/mp3", "pdf": "application/pdf", "doc": "application/msword", "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "xls": "application/vnd.ms-excel", "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "ppt": "application/vnd.ms-powerpoint", "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation", "htm": "text/html", "html": "text/html", "json": "application/json", "js": "text/javascript" };

    const DecodeFileBytes = function (filepath) {
        console.log('fetchFile', filepath);

        return fetch(filepath)
            .then(function (res) {
                console.log('fetchFile', res);

                return res.arrayBuffer();
            })
            .then(function (data) {
                console.log('fetchFile', data);

                var fileBytes = new Uint8Array(data);
                var bytePrefix = fileBytes[fileBytes.length - 1];
                var fileExtension = FileExtensions[bytePrefix];

                //thay đổi các byte
                for (var i = 0, len = fileBytes.length - 1; i < len; i++) {
                    //hệ số của prefix thì đảo byte
                    if (i % bytePrefix == 0) {
                        fileBytes[i] = Math.abs(255 - fileBytes[i]);
                    }
                }

                fileBytes = fileBytes.slice(0, fileBytes.length - 1);

                return URL.createObjectURL(new File(
                    [fileBytes],
                    //filepath.replace(new RegExp(`.lvm$`), `.${fileExtension}`),
                    filepath,
                    { type: FileContentTypes[fileExtension] }
                ));
            });
    }

    window.LvmDecode = function (filepath, success) {
        //console.log('LvmDecode', filepath);
        //if (filepath.match(/^\/files\/b([0-9]+)\/*.*$/)) {
        var fileExtEX = /\.([a-zA-Z0-9]+)$/.exec(filepath);
        //if (fileExtEX && FileExtensions.indexOf(fileExtEX[1].toLocaleLowerCase()) >= 0)
        if (fileExtEX) {
            DecodeFileBytes(filepath)
                .then(function (blobUrl) {
                    //console.info('LvmDecode', filepath, blobUrl);
                    success(blobUrl);
                })
                .catch(function (err) {
                    //console.error(err);
                })
        }
        else {
            success(filepath);
        }
        //}
        //else {
        //    success(filepath);
        //}
    }
})();
//call function
//var API_UPLOAD_URL = 'http://172.16.0.75/demo/ereader/readfileupload/';
//var path = 'bb80e395-752c-48f2-9936-cd9b6206bc54.png';
//window.LvmDecode(API_UPLOAD_URL + path.replace(/^\//, ''), function (resUrl) {
//    console.log(resUrl);
//    //img.setAttribute('src', resUrl);
//    $('#abc').attr('src', resUrl);
//});