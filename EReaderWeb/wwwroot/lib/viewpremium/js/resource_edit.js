var dynamicLoading = {
    css: function (path) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    },
    js: function (path, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.src = path;
        script.type = 'text/javascript';
        script.async = false
        script.onload = script.onreadystatechange = function () {
            callback && callback()
        };
        head.appendChild(script);
    },
    type: 't2022022201',
    time: '1661736118'
}
dynamicLoading.css('../css/style.css')
dynamicLoading.css('../css/player.css')
dynamicLoading.css('../css/phoneTemplate.css')
dynamicLoading.css('../css/template.css')
dynamicLoading.css('../css/hiSlider2.min.css')
dynamicLoading.css('../css/FlipBookPlugins.min.css')

dynamicLoading.js('../js/jquery-3.5.1.min.js', function () {
    dynamicLoading.js('../js/main.js', function () {
    })
    dynamicLoading.js('../js/visitinfo.js')
    dynamicLoading.js('../js/flipHtml5.hiSlider2.min.js')
    dynamicLoading.js('../js/FlipBookPlugins.min.js')
    dynamicLoading.js('../js/BookPreview.js', function () {
        dynamicLoading.js('../js/previewBook.js')
    })
})