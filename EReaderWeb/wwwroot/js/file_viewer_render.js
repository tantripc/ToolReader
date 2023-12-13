var width = $(window).width();
var height = $(window).height();
$(document).ready(function () {
    //ẩn đánh dấu trang
    $('.cnt_add_bookmark').addClass('d-none');
    //tính chiều cao
    $('.lv_content_viewer').height(height - 30).addClass('active');
    $('.lv_popup_control').height(height - 30);
});
