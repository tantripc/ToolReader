
var oReq = new XMLHttpRequest();
oReq.open("GET", link, true);
oReq.responseType = "arraybuffer";
oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response;
    if (arrayBuffer) {
        var byteArray = new Uint8Array(arrayBuffer);
        if (false) {
            for (var i = 0; i < byteArray.byteLength; i++) {
                // do something with each byte in the array
                console.log(byteArray[i]);
            }
        }
        const blob = new Blob([byteArray], { type: "application/octet-stream" });
        var reader = new FileReader();
        reader.onload = function (event) {
            var file_content = event.target.result;
            new MobiFile(file_content).render_to("viewer_mobi");
        };
        reader.readAsArrayBuffer(blob);

    }
}.bind(this);
oReq.send(null);

