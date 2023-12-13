

loadBook(link);

function loadBook(urlfile) {
    var data;
    data = loadFileUrl(urlfile);
    var book = new MobiBook(data);
    addResult(book.html);
}

