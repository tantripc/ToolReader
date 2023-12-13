var width = $(window).width();
var height = $(window).height();
var width_one_image = 0;
var data_html_ebook = '';

$(document).bind("contextmenu", function (e) {
    return false;
});
$(document).ready(function () {
    //render hình ảnh
    if (isUsingCallApi == true) {
        $('.page_view img').each(function () {
            var url_img = $(this).attr('data-src');
            var this_img = $(this);
            if (url_img && url_img != '') {
                //window.LvmDecode(url_img, function (resUrl) {
                //    $(this_img).attr('src', resUrl);
                //    $(this_img).removeAttr('data-src');
                //});
                $(this_img).attr('src', url_img);
                $(this_img).css('width', pagewidth);
                $(this_img).attr('height', pageheight);
                $(this_img).removeAttr('data-src');
            }
        })
    }
    //tính chiều cao
    $('.lv_content_viewer').height(height - 70).addClass('active');
    $('.lv_popup_control').height(height - 70);
    //init event
    scroll_content_viewer();
    //bắt sự kiện change số trang
    $('#page_active').on('change', function (e) {
        var min = $(this).attr('min');
        var max = $(this).attr('max');
        var active_page = $(this).val();
        if (active_page && min && max) {
            active_page = parseInt(active_page);
            if (active_page < parseInt(min)) {
                $(this).val(min);
            }
            if (active_page > parseInt(max)) {
                $(this).val(max);
            }
        }
        view_page(active_page);
    });
    $('#page_active').on('keypress', function (e) {
        if (e.keyCode == 13) {
            var min = $(this).attr('min');
            var max = $(this).attr('max');
            var active_page = $(this).val();
            if (active_page && min && max) {
                active_page = parseInt(active_page);
                if (active_page < parseInt(min)) {
                    $(this).val(min);
                }
                if (active_page > parseInt(max)) {
                    $(this).val(max);
                }
            }
            view_page(active_page);


        }
    });

    event_button_user();
    width_one_image = _width_image;
    //bắt event change zoom
    $('#range_zoom').on('input', function () {
        var value_zoom = $(this).val();
        $(this).parent().find('label').text(value_zoom + "%");
        zoom_event(value_zoom);
        $('.lv_content_viewer').addClass('zoom-event');
    })
    //event key board
    event_key_board();
});
function view_one_page() {
    $('.lv_content_viewer .container_content').removeClass('d-none');
    $('.lv_content_viewer .container_content_thumnail').addClass('d-none');


    reset_range_zoom();
    var curent_mode = $('.lv_content_viewer').attr('data-mode');
    if (curent_mode == 2 || curent_mode == "2") {
        $('.lv_content_viewer[data-mode="2"] .pages').turn('destroy');
        $('.lv_content_viewer .pages').removeAttr('style');
        $('.lv_content_viewer .pages').html(data_html_ebook);
        $('.lv_content_viewer .pages .page_item[fill="yes"]').attr('fill', 'no');
        render_all_image();
        //$('.lv_content_viewer[data-mode="2"]').zoom('destroy');
    }
    $('.lv_footer_viewer .button_one_page').addClass('active');
    $('.lv_footer_viewer .button_two_page').removeClass('active');
    $('.lv_footer_viewer .button_thumbnail').removeClass('active');
    $('.lv_content_viewer').attr('data-mode', '1');
    var page_active = $('#page_active').val();
    if (page_active) {
        view_page(page_active);
    }
    $('.lv_content_viewer .pages').css({
        width: 'auto'
    })
}
function view_two_page() {
    //location.reload();
    $('.lv_content_viewer .container_content').removeClass('d-none');
    $('.lv_content_viewer .container_content_thumnail').addClass('d-none');


    data_html_ebook = $('.pages').html();
    reset_range_zoom();
    $('.lv_footer_viewer .button_one_page').removeClass('active');
    $('.lv_footer_viewer .button_two_page').addClass('active');
    $('.lv_footer_viewer .button_thumbnail').removeClass('active');
    $('.lv_content_viewer').attr('data-mode', '2');
    $('.lv_content_viewer').off('click');
    effect_view_two_page();

}
function scroll_content_viewer() {
    var lastScrollTop = 0;
    var total_load = CountFile;
    $(".lv_content_viewer").scroll(function () {
        var mode_view = $('.lv_content_viewer').attr('data-mode');
        var page_active = $('#page_active').val();
        var pagebookmark = $(".pageview_bookmark_" + page_active).attr("data-bookmark");
        if (page_active != '' && mode_view == 1) {
            var st = $(this).scrollTop();
            if (st > lastScrollTop) {
                // downscroll code
                //check tăng
                var page_next = parseInt(page_active) + 1;
                if (pagebookmark == -1 || pagebookmark == undefined) {
                    $('.content_profile_account .cnt_add_bookmark').removeClass('active');
                    $('.item_bookmark_' + pagebookmark).removeClass('active');
                    $('.item_bookmark').removeClass('active');
                    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'addbookmark()');
                }
                else {
                    $('.item_bookmark').removeClass('active');
                    $('.item_bookmark_' + pagebookmark).addClass('active');
                    $('.content_profile_account .cnt_add_bookmark').addClass('active');
                    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'delete_bookmark(' + pagebookmark + ',' + _FileId + ')');
                }
                var offset_page_next = $('.page_view[data-p="' + page_next + '"]').offset();
                if (offset_page_next) {
                    if (offset_page_next.top <= (height - 40) / 2) {
                        $('#page_active').val(page_next);
                        //active mục lục
                        if ($('.label_doctoc[data-p="' + page_next + '"]').length > 0) {
                            $('.label_doctoc').removeClass('active');
                            $('.label_doctoc[data-p="' + page_next + '"]').addClass('active');
                        }
                        //ghi log

                        write_log(page_next);
                    }
                }
                //kiểm tra nếu trang tiếp theo của trang next chưa đổ thì đổ dần cho em nó
                if (page_next == total_load - 5 || page_next == total_load) {
                    total_load = parseInt(total_load) + 5;
                    if (total_load > _total_page) {
                        total_load = _total_page;
                    }
                    isUsingCallApi = false;
                    load_data_image(total_load, _FileId);
                    //for (var i = total_load; i < total_load+10; i++) {
                    //}
                }

            } else {
                // upscroll code
                //check giảm
                if (pagebookmark == -1 || pagebookmark == undefined) {
                    $('.content_profile_account .cnt_add_bookmark').removeClass('active');
                    $('.item_bookmark_' + pagebookmark).removeClass('active');
                    $('.item_bookmark').removeClass('active');
                    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'addbookmark()');
                }
                else {
                    $('.item_bookmark').removeClass('active');
                    $('.item_bookmark_' + pagebookmark).addClass('active');
                    $('.content_profile_account .cnt_add_bookmark').addClass('active');
                    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'delete_bookmark(' + pagebookmark + ',' + _FileId + ')');
                }
                var page_back = parseInt(page_active) - 1;
                var offset_page_back = $('.page_view[data-p="' + page_back + '"]').offset();
                if (offset_page_back) {
                    if (offset_page_back.top >= -1 * ((height - 40) / 2)) {
                        $('#page_active').val(page_back);
                        //active mục lục
                        if ($('.label_doctoc[data-p="' + page_back + '"]').length > 0) {
                            $('.label_doctoc').removeClass('active');
                            $('.label_doctoc[data-p="' + page_back + '"]').addClass('active');
                        }
                        //ghi log
                        write_log(page_back);
                    }
                }
                //kiểm tra nếu trang trước đó của trang back chưa đổ thì đổ dần cho em nó
                //if ($('.page_view[data-p="' + (page_back - 1) + '"] .page_item[fill="no"]').length > 0) {
                //    render_canvas_image(page_back - 1);
                //}
            }
            lastScrollTop = st;
            data_html_ebook = $('.pages').html();
        }
    });
}
function view_next_page() {

    if (nosign == "bHY7") {
        var page_active = $('#page_active').val();
        var page_max = $('#page_active').attr("max");
        if (page_active == page_max) {
            window.location.href = Redirect_Login + "Account/Login";
        }
    }
    else {
        if ($('.lv_footer_viewer .button_next').hasClass('disabled')) {
            return false;
        }
    }

    var mode_view = $('.lv_content_viewer').attr('data-mode');
    var page_active = $('#page_active').val();
    var page_next = 0;
    var total_load = CountFile;
    if (page_next == total_load - 5) {
        total_load = parseInt(total_load) + 5;
        if (total_load > _total_page) {
            total_load = _total_page;
        }
        isUsingCallApi = false;
        load_data_image(total_load, _FileId);
        //for (var i = total_load; i < total_load+10; i++) {
        //}
    }
    if (mode_view == 1) {
        page_next = parseInt(page_active) + 1;

    }
    else if (mode_view == 2) {
        if ($('.lv_content_viewer[data-mode="2"] .pages').turn('is')) {
            $('.lv_content_viewer[data-mode="2"] .pages').turn('next');
        }
    }
    else if (mode_view == -1) {
        var p_active = $('.lv_content_viewer[data-mode="-1"] .page_view.active').attr('data-p');
        if (p_active) {
            page_next = parseInt(p_active) + 1;
            $('.lv_content_viewer[data-mode="-1"] .page_view').removeClass('active');
            $('.lv_content_viewer[data-mode="-1"] .page_view[data-p="' + page_next + '"]').addClass('active');
            $('#page_active').val(page_next);

            get_status_bookmark_page(page_next);
            set_status_button_navigate(page_next);
            if ($('.label_doctoc[data-p="' + page_next + '"]').length > 0) {
                $('.label_doctoc').removeClass('active');
                $('.label_doctoc[data-p="' + page_next + '"]').addClass('active');
            }
        }
    }
    if (mode_view != -1 && page_next != 0 && page_next <= _total_page) {
        view_page(page_next);
        $('#page_active').val(page_next);
    }
    var page_active = $('#page_active').val();
    var pagebookmark = $(".pageview_bookmark_" + page_active).attr("data-bookmark");
    if (pagebookmark == -1 || pagebookmark == undefined) {
        $('.content_profile_account .cnt_add_bookmark').removeClass('active');
        $('.item_bookmark_' + pagebookmark).removeClass('active');
        $('.item_bookmark').removeClass('active');
        $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'addbookmark()');
    }
    else {
        $('.item_bookmark').removeClass('active');
        $('.item_bookmark_' + pagebookmark).addClass('active');
        $('.content_profile_account .cnt_add_bookmark').removeClass('active');
        $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'delete_bookmark(' + pagebookmark + ',' + _FileId + ')');
    }
}
function view_back_page() {
    if ($('.lv_footer_viewer .button_back').hasClass('disabled')) {
        return false;
    }
    var mode_view = $('.lv_content_viewer').attr('data-mode');
    var page_active = $('#page_active').val();
    var page_back = 0;
    if (mode_view == 1) {
        page_back = parseInt(page_active) - 1;
    }
    else if (mode_view == 2) {
        if ($('.lv_content_viewer[data-mode="2"] .pages').turn('is')) {
            $('.lv_content_viewer[data-mode="2"] .pages').turn('previous');
        }
    }
    else if (mode_view == -1) {
        var p_active = $('.lv_content_viewer[data-mode="-1"] .page_view.active').attr('data-p');

        if (p_active) {
            page_back = parseInt(p_active) - 1;
            $('.lv_content_viewer[data-mode="-1"] .page_view').removeClass('active');
            $('.lv_content_viewer[data-mode="-1"] .page_view[data-p="' + page_back + '"]').addClass('active');
            $('#page_active').val(page_back);
            get_status_bookmark_page(page_back);
            set_status_button_navigate(page_back);

            if ($('.label_doctoc[data-p="' + page_back + '"]').length > 0) {
                $('.label_doctoc').removeClass('active');
                $('.label_doctoc[data-p="' + page_back + '"]').addClass('active');
            }
        }
    }
    if (mode_view != -1 && page_back != 0 && page_back >= 1) {
        view_page(page_back);
        $('#page_active').val(page_back);
    }
}
function view_page(page) {

    fill_image_near_page(page);

    if ($('.page_view[data-p="' + (page) + '"]').length > 0) {
        var top_scroll = $('.page_view[data-p="' + (page) + '"]')[0].offsetTop;
        $('.lv_content_viewer').scrollTop(top_scroll);
    }

    get_status_bookmark_page(page);
    set_status_button_navigate(page);
    if ($('.label_doctoc[data-p="' + page + '"]').length > 0) {
        $('.label_doctoc').removeClass('active');
        $('.label_doctoc[data-p="' + page + '"]').addClass('active');
    }

    data_html_ebook = $('.pages').html();
    //ghi log
    write_log(page);

}


function effect_view_two_page() {
    //$("body").removeClass('loading');
    var page_active_old = $('#page_active').val();
    var width_pages = _width_image;
    var height_pages = _height_image;
    var height_content = $('.lv_content_viewer[data-mode="2"]').height() - 20;
    var width_content = (width_pages * height_content) / height_pages;
    $('.lv_content_viewer[data-mode="2"] .pages').turn({
        width: width_content * 2,
        height: height_content,
        autoCenter: true,
        gradients: true,
        acceleration: true,
        display: 'double',
        // Events
        when: {
            turning: function (event, page, view) {
                if (view[1] > parseInt(CountFile)) {
                    $('.page_view.page.p' + view[0] + ' .inner').css('display', 'flex');
                    $('.page_view.page.p' + view[1] + ' .inner').css('display', 'flex');
                    if (parseBool(isUsingCallApi) != true) {
                        saveimage(view[0], _fileName_Image, _fileExt, _FileId, _Islink)
                        saveimage(view[1], _fileName_Image, _fileExt, _FileId, _Islink)
                    }
                    $('.page_view.page.p' + view[0] + ' img').attr('src', _UrlLoadImage.replace('__pagenumber__', view[0]));
                    $('.page_view.page.p' + view[0] + ' img').on("load", function () {
                        imgLoad(view[0]);
                    });


                    $('.page_view.page.p' + view[1] + ' img').attr('src', _UrlLoadImage.replace('__pagenumber__', view[1]));

                    $('.page_view.page.p' + view[1] + ' img').on("load", function () {
                        imgLoad(view[1]);
                    });
                    if ($('.page_view.page.p' + view[0] + ' .leftShadow').length == 0) {
                        var html_left = `<div name="midShadow" class="leftShadow book" style="opacity: 1;width: 130px;background-image: -webkit-linear-gradient(right, rgba(60, 60, 60, 0.4) 0%, rgba(50, 50, 50, 0.1) 54%, rgba(200, 200, 200, 0) 100%);background-image: -ms-linear-gradient(right, rgba(60, 60, 60, 0.4) 0%, rgba(50, 50, 50, 0.1) 54%, rgba(200, 200, 200, 0) 100%);position: absolute;top: 0px;right: 0px;height: 100%;z-index: 5;pointer-events: none;background-repeat: repeat-y;background-size: 100%;cursor: default;"></div>`;
                        $('.page_view.page.p' + view[0]).append(html_left);
                        var html_right = `<div name="midShadow" class="rightShadow book" style="opacity: 1;width: 52px;position: absolute;top: 0px;left: 0px;height: 100%;z-index: 5;pointer-events: none;background-repeat: repeat-y;background-size: 100%;background-image: -webkit-linear-gradient(left, rgba(53, 53, 53, 0.5) 0%, rgba(53, 53, 53, 0.2) 40%,rgba(53, 53, 53, 0.1) 60%, rgba(200, 200, 200, 0) 100%);"></div>`;
                        if (view[1] != 1) {
                            $('.page_view.page.p' + view[1]).append(html_right);
                        }
                    }
                    const audio = new Audio(DomainName + "/audio/audio_book.mp3");
                    audio.play();
                }
                else {
                    fill_image_near_page(page);
                    if ($('.page_view.page.p' + view[0] + ' .leftShadow').length == 0) {
                        var html_left = `<div name="midShadow" class="leftShadow book" style="opacity: 1;width: 130px;background-image: -webkit-linear-gradient(right, rgba(60, 60, 60, 0.4) 0%, rgba(50, 50, 50, 0.1) 54%, rgba(200, 200, 200, 0) 100%);background-image: -ms-linear-gradient(right, rgba(60, 60, 60, 0.4) 0%, rgba(50, 50, 50, 0.1) 54%, rgba(200, 200, 200, 0) 100%);position: absolute;top: 0px;right: 0px;height: 100%;z-index: 5;pointer-events: none;background-repeat: repeat-y;background-size: 100%;cursor: default;"></div>`;
                        $('.page_view.page.p' + view[0]).append(html_left);
                        var html_right = `<div name="midShadow" class="rightShadow book" style="opacity: 1;width: 52px;position: absolute;top: 0px;left: 0px;height: 100%;z-index: 5;pointer-events: none;background-repeat: repeat-y;background-size: 100%;background-image: -webkit-linear-gradient(left, rgba(53, 53, 53, 0.5) 0%, rgba(53, 53, 53, 0.2) 40%,rgba(53, 53, 53, 0.1) 60%, rgba(200, 200, 200, 0) 100%);"></div>`;
                        if (view[1] != 1) {
                            $('.page_view.page.p' + view[1]).append(html_right);
                        }
                    }
                    const audio = new Audio(DomainName + "/audio/audio_book.mp3");
                    audio.play();
                    $('.cnt_add_bookmark').removeClass('active');
                }

            },
            turned: function (event, page, view) {
                $('#page_active').val(page);
                get_status_bookmark_page(page);
                set_status_button_navigate(page);
                if ($('.label_doctoc[data-p="' + page + '"]').length > 0) {
                    $('.label_doctoc').removeClass('active');
                    $('.label_doctoc[data-p="' + page + '"]').addClass('active');
                }
                $('.lv_content_viewer .pages .page_item[fill="yes"]').attr('fill', 'no');
                render_all_image();
                //ghi log
                write_log(page);

            },
            missing: function (event, pages) {
            }
        }
    });
    //nhảy đến trang trước đó

    if (page_active_old !== undefined) {
        if ($('.lv_content_viewer[data-mode="2"] .pages').turn('is'))
            $('.lv_content_viewer[data-mode="2"] .pages').turn('page', page_active_old);
    }


}
//bắt event 3 nút bookmark, đề thi, notes
function event_button_user() {
    $('.button_quizz').on('click', function () {
        var isactive = $(this).hasClass('active');
        if (!isactive) {
            $('.group_btn_right .btn_quizz').trigger('click');
        }
    });
    $('.button_note').on('click', function () {
        var isactive = $(this).hasClass('active');
        if (!isactive) {
            $('.group_btn_right .btn_note').trigger('click');
        }
    });
    $('.button_bookmark').on('click', function () {
        var isactive = $(this).hasClass('active');
        if (!isactive) {
            $('.group_btn_right .btn_bookmark').trigger('click');
        }
    });
}
function zoom_event(zoom) {
    var mode_view = $('.lv_content_viewer').attr('data-mode');
    if (mode_view == 1 || mode_view == "1") {
        var pixel_percent = width_one_image / 100;
        if (zoom) {
            if (zoom < 1) zoom = 1;
            if (zoom > 200) zoom = 200;
            $('.lv_content_viewer .page_view').width(pixel_percent * zoom);
        }
        if (zoom < 100) {
            //render hết ko lộ hàng
            render_all_image();
        }
    }
    else if (mode_view == 2 || mode_view == "2") {
        $('.lv_content_viewer[data-mode="2"] .pages').turn('zoom', (zoom / 100));
    }
    else if (mode_view == 1 || mode_view == "-1") {
        var default_width = 14;
        var width_new = zoom * default_width / 100;
        $('.lv_content_viewer[data-mode="-1"] .pages .page_view').css('cssText', 'width:calc(' + width_new + '% - 10px)!important');
    }
}
function maximize_reader() {
    $('body').addClass('fullscreen');
    $('.button_maximize').hide().removeClass('show_button');
    $('.button_minimize').show().addClass('show_button');
    openFullscreen();
}
function minimize_reader() {
    $('body').removeClass('fullscreen');
    $('.button_minimize').hide().removeClass('show_button');
    $('.button_maximize').show().addClass('show_button');
    closeFullscreen();
    $('.lv_content_viewer,.lv_popup_control').height(height - 70);
}
function openFullscreen() {
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
        elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    }
    document.addEventListener("fullscreenchange", function () {
        cacl_height_content();
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        cacl_height_content();
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        cacl_height_content();
    }, false);

    document.addEventListener("msfullscreenchange", function () {
        cacl_height_content();
    }, false);

}
function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}
function cacl_height_content() {
    setTimeout(function () {
        var is_fullscreen = $('body').hasClass('fullscreen');
        var window_height = $(window).height();
        if (is_fullscreen == true) {
            $('.lv_content_viewer,.lv_popup_control').height(window_height - 40);
        }
        else {
            $('.lv_content_viewer,.lv_popup_control').height(window_height - 70);
        }
        //
        var curent_mode = $('.lv_content_viewer').attr('data-mode');
        if (curent_mode == 2 || curent_mode == "2") {
            calc_height_two_page()
        }
    }, 50);

}
function view_thumbnail() {
    $('.cnt_range_zoom').addClass('unactive');
    //reset_range_zoom();
    $('.lv_content_viewer').off('click');
    var curent_mode = $('.lv_content_viewer').attr('data-mode');
    if (curent_mode == 2 || curent_mode == "2") {
        $('.lv_content_viewer[data-mode="2"] .pages').turn('destroy');
        $('.lv_content_viewer .pages').removeAttr('style');
        $('.lv_content_viewer .pages').html(data_html_ebook);
        $('.lv_content_viewer .pages .page_item[fill="yes"]').attr('fill', 'no');
        //render_all_image();
    }
    render_all_image_thumnail();

    $('.lv_content_viewer .container_content').addClass('d-none');
    $('.lv_content_viewer .container_content_thumnail').removeClass('d-none');
    //active trang hiện tại
    $('.lv_content_viewer .container_content_thumnail .page_item_thumnail').removeClass('active');
    $('.lv_content_viewer .container_content_thumnail .page_item_thumnail[data-p="' + $('#page_active').val() + '"]').addClass('active');
    //đăng ký event
    event_goto_page_select_all();

    $('.lv_footer_viewer .button_one_page').removeClass('active');
    $('.lv_footer_viewer .button_two_page').removeClass('active');
    $('.lv_footer_viewer .button_thumbnail').addClass('active');
    $('.lv_content_viewer').attr('data-mode', '-1');

}
function event_goto_page_select_all() {
    $('.lv_content_viewer .container_content_thumnail').on('click', '.page_item_thumnail', function () {
        var this_page = $(this).attr('data-p');
        $('#page_active').val(this_page);
        view_one_page();
    });
}
function goto_bookmark($this) {
    var this_page = $($this).attr('data-p');
    $('#page_active').val(this_page);
    view_one_page();
    $('.item_bookmark').removeClass('active');
    $($this).parents('.item_bookmark').addClass('active');
}
function goto_note($this) {
    //show_note(docnoteid, $this, numbercolor,'list_action');
    var this_page = $($this).attr('data-p');
    $('#page_active').val(this_page);
    view_one_page();
    $('.item_note').removeClass('active');
    $($this).parents('.item_note').addClass('active');
}
function goto_doctoc($this) {
    var this_page = $($this).attr('data-p');
    $('#page_active').val(this_page);
    view_one_page();
    $('.label_doctoc').removeClass('active');
    $($this).addClass('active');
}

function calc_height_two_page() {
    var width_pages = _width_image;
    var height_pages = _height_image;
    var height_content = $('.lv_content_viewer[data-mode="2"]').height() - 20;
    var width_content = (width_pages * height_content) / height_pages;
    $('.lv_content_viewer[data-mode="2"] .pages').turn('size', (width_content * 2), height_content);
}
function reset_range_zoom() {
    $('.cnt_range_zoom').removeClass('unactive');
    $('#range_zoom').val(100);
    $('#range_zoom').parent().find('label').text(100 + "%");
    $('.lv_content_viewer .pages .page_view').removeAttr('style');
    $('.lv_content_viewer').removeClass('zoom-event');
}
function search_content($this) {
    var is_active = $($this).parents('.group_search').hasClass('active');
    if (is_active == false) {
        $($this).parents('.group_search').addClass('active');
        $("#search_content").toggle("slide", { direction: "right" }, 200);
        $("#search_content").focus();
    }
    else {
        //
    }
}
function event_key_board() {
    const KEY_PrevPage = 37;        //LEFT
    const KEY_NextPage = 39;        //RIGHT
    const KEY_UpPage = 38;      //UP
    const KEY_DownPage = 40;//DOWN
    const KEY_F11 = 122;
    const KEY_PLUS = 187;
    const KEY_SUB = 189;
    const KEY_Zero = 48;

    //const KEY_SaveExam = 13;      //Enter     //CTRL + ENTER -> lưu bài || CTRL + SHIFT + ENTER -> nộp bài
    //const KEY_SaveExam = 83;        //Enter     //CTRL + S -> lưu bài || CTRL + SHIFT + S -> nộp bài


    $(window).keydown(function (event) {
        if (!event) return false;
        //KEY
        var key = event.keyCode || event.charCode || event.which;
        //CTRL + S
        if (event.ctrlKey === true && key === 83) {
            //chặn sự kiện save page của trình duyệt
            event.stopPropagation();
            event.preventDefault();
            return false;
        }

        //chặn sự kiện dùng phím di chuyển và space của trình duyệt
        if (event.ctrlKey === true &&
            (key == KEY_PrevPage ||
                key == KEY_NextPage ||
                key == KEY_UpPage ||
                key == KEY_DownPage || key == KEY_PLUS || key == KEY_SUB || key == KEY_Zero)) {
            event.stopPropagation();
            event.preventDefault();
        }
    });
    $(window).keyup(function (event) {
        if (!event) return false;
        //KEY
        var key = event.keyCode || event.charCode || event.which;

        //ESC
        if (key === 27) {
            return false;
        }

        if (event.ctrlKey === false && key === 13) {
            return false;
        }

        //SHIFT - các phím sử dụng kèm với SHIFT
        if (event.shiftKey === true) {
            if (48 <= key && key <= 57) {
                var PageIdxArr = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57]; // 0 -> 9
                var idx = PageIdxArr.indexOf(key);

                //chuyển đến trang 1-9
                if (event.ctrlKey === false) {

                }
                //chuyển đến phần thi BB/TC1-9
                else {

                }
            }
        }


        //CTRL - các phím sử dụng kèm với CTRL
        if (event.ctrlKey === true) {

            //di chuyển
            if (key === KEY_PrevPage || key === KEY_NextPage || key === KEY_UpPage || key === KEY_DownPage) {

                //chuyển về page trước hoặc tiếp theo
                if (key === KEY_PrevPage) {
                    view_back_page();
                    return false;
                }
                else if (key === KEY_NextPage) {
                    view_next_page();
                    return false;
                }
                else if (key === KEY_UpPage) {
                    view_back_page();
                    return false;
                }
                else if (key === KEY_DownPage) {
                    view_next_page();
                    return false;
                }
            }
            //phóng to, thu nhỏ
            else if (key == KEY_PLUS || key == KEY_SUB || key == KEY_Zero) {
                if (key === KEY_PLUS) {
                    var value_zoom = parseInt($('#range_zoom').val());
                    value_zoom += 10;
                    if (value_zoom <= 200) {
                        $('#range_zoom').val(value_zoom);
                        $('#range_zoom').parent().find('label').text(value_zoom + "%");
                        zoom_event(value_zoom);
                    }

                    return false;
                }
                else if (key === KEY_SUB) {
                    var value_zoom = parseInt($('#range_zoom').val());
                    value_zoom -= 10;
                    if (value_zoom > 0) {
                        $('#range_zoom').val(value_zoom);
                        $('#range_zoom').parent().find('label').text(value_zoom + "%");
                        zoom_event(value_zoom);
                    }
                    return false;
                }
                else if (key === KEY_Zero) {
                    var value_zoom = 100;
                    $('#range_zoom').val(value_zoom);
                    $('#range_zoom').parent().find('label').text(value_zoom + "%");
                    zoom_event(value_zoom);
                    return false;
                }
            }

        }
        else {
            if (key === KEY_PrevPage) {
                view_back_page();
            }
            else if (key === KEY_NextPage) {
                view_next_page();
            }
            else if (key === KEY_F11) {
                cacl_height_content();
            }
            else if (key === KEY_UpPage) {
                var curent_mode = $('.lv_content_viewer').attr('data-mode');
                if (curent_mode == 2) {
                    view_back_page();
                }
            }
            else if (key === KEY_DownPage) {
                var curent_mode = $('.lv_content_viewer').attr('data-mode');
                if (curent_mode == 2) {
                    view_next_page();
                }
            }
        }
    });
}
function scroll_page_all(page) {
    var height_page = $('.lv_content_viewer[data-mode="-1"] .page_view').first().height() + 10;
    var top_scroll = (page * height_page) - (height_page);
    $('.lv_content_viewer').scrollTop(top_scroll);
}
function set_status_button_navigate(page) {
    if (page == 1) {
        $('.lv_footer_viewer .button_back').addClass('disabled');
        $('.lv_footer_viewer .button_next').removeClass('disabled');
    }
    else if (page == _total_page) {
        $('.lv_footer_viewer .button_next').addClass('disabled');
        $('.lv_footer_viewer .button_back').removeClass('disabled');
    }
    else {
        $('.lv_footer_viewer .button_next,.lv_footer_viewer .button_back').removeClass('disabled');
    }
}
function fill_image_near_page(page) {
    //kiểm tra nếu trang hiện tại chưa đổ thì đổ cho em nó
    if ($('.page_view[data-p="' + page + '"] .page_item[fill="no"]').length > 0) {

        render_canvas_image(page);
    }
    var page_back = (parseInt(page) - 1);
    var page_next = (parseInt(page) + 1);
    if ($('.page_view[data-p="' + page_back + '"] .page_item[fill="no"]').length > 0) {
        render_canvas_image(page_back);
    }
    if ($('.page_view[data-p="' + page_next + '"] .page_item[fill="no"]').length > 0) {
        render_canvas_image(page_next);
    }
}
function render_all_image() {
    //kiểm tra những trang nào chưa render thì render cho hết
    $('.page_view .page_item[fill="no"]').each(function () {
        var page_view = $(this).parents('.page_view').attr('data-p');
        if (page_view) {
            render_canvas_image(page_view);
        }
    })
}
function render_canvas_image(page) {
    var link_image = "";
    var img = new Image();
    var exists = urlExists(_link_reader_image.replace('__pagenumber__', page));
    if (exists == true) {
        $('.page_view.page.p' + page + ' .inner').css('display', 'flex');
        $('.page_view[data-p="' + page + '"] img').remove();

        link_image = _link_reader_image.replace('__pagenumber__', page);
        img.src = link_image;
        img.width = pagewidth;
        img.height = pageheight;
        if (link_image && link_image != '') {
            $('.page_view[data-p="' + page + '"]').append(img);
            $('.page_view[data-p="' + page + '"] img').on("load", function () {
                $('.page_view.page.p' + page + ' .inner').css('display', 'none');
            });
        }
    }
    else {
        $('.page_view.page.p' + page + ' .inner').css('display', 'flex');
        $('.page_view[data-p="' + page + '"] img').remove();
        link_image = _UrlLoadImage.replace('__pagenumber__', page);
        img.src = link_image;
        img.width = pagewidth;
        img.height = pageheight;
        if (link_image && link_image != '') {
            $('.page_view[data-p="' + page + '"]').append(img);
            $('.page_view[data-p="' + page + '"] img').on("load", function () {
                $('.page_view.page.p' + page + ' .inner').css('display', 'none');
            });
        }
    }


}
//render image thumnail
function render_all_image_thumnail() {
    //kiểm tra những trang nào chưa render thì render cho hết
    $('.container_content_thumnail .page_item_thumnail[fill="no"]').each(function () {
        var page_view = $(this).attr('data-p');
        if (page_view) {
            render_canvas_image_thumnail(page_view);
        }
    })
}

function render_canvas_image_thumnail(page) {
    //init_watting_popup();
    var link_image = "";
    var img = new Image();
    if (isUsingCallApi == true) {
        link_image = _link_reader_thumnail.replace('__pagenumber__', page);
        img.width = 176;
        img.height = 250;
        img.src = link_image;
        img.onload = function (e) {
            $('.container_content_thumnail .page_item_thumnail[data-p="' + page + '"] canvas').remove();
            var canvas = document.createElement("canvas");
            canvas.width = 176;
            canvas.height = 250;
            $('.container_content_thumnail .page_item_thumnail[data-p="' + page + '"]').append(canvas).attr('fill', 'yes');
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            remove_watting_popup();
        }
    }
    else {
        link_image = _UrlLoadImageThumbnail.replace('__pagenumber__', page);
        img.width = 176;
        img.height = 250;
        img.src = link_image;
        img.onload = function (e) {
            $('.container_content_thumnail .page_item_thumnail[data-p="' + page + '"] canvas').remove();
            var canvas = document.createElement("canvas");
            canvas.width = 176;
            canvas.height = 250;
            $('.container_content_thumnail .page_item_thumnail[data-p="' + page + '"]').append(canvas).attr('fill', 'yes');
            var context = canvas.getContext('2d');
            context.drawImage(img, 0, 0);
            remove_watting_popup();
        }
    }
}
//function readlog(pagenumber) {
//    $('#ModalLog').css("display", "none");
//    $('#modalbackdrop').css("display", "none");
//    $('#page_active').val(pagenumber);
//    $('#ModalLog').remove();
//    view_page(pagenumber);
//}
//function closepopup() {
//    $('#ModalLog').css("display", "none");
//    $('#modalbackdrop').css("display", "none");
//    $('#ModalLog').remove();
//}

function saveimage(page, _fileName_Image, _fileExt, _FileId, _Islink, _total_image_load, _folder_image) {
    /*loadpage(page, _total_page);*/
    $.ajax({
        url: _RootBase + "BookAttach/SaveImageAPI",
        type: "GET",
        data: {
            fileName_Image: _fileName_Image,
            folder_image: _folder_image,
            fileExt: _fileExt,
            pagenum: page,
            FileId: _FileId,
            Islink: _Islink,
            type: _Type
        },
        async: true,
        beforeSend: function () {

        },
        complete: function () {
            render_canvas_image(page);
        },
        success: function (data) {
        },
        error: function (err) {
        }
    });
}
function urlExists(url) {
    $.ajax({
        type: 'HEAD',
        url: url,
        success: function () {
            return true;
        },
        error: function () {
            return false
        }
    });
}
function imgLoad(page) {
    $('.page_view.page.p' + page + ' .inner').css('display', 'none');
}