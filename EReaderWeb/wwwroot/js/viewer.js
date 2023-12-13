var _total_image_load = parseInt(CountFile == null ? 0 : CountFile);
var _height_image = 0;
var _width_image = 0;
var total_bookmar = 0;
$(document).ready(function () {
    if (pagewidth && pageheight && pagewidth != 0 && pageheight != 0) {
        _height_image = pageheight;
        _width_image = pagewidth;
    }
    else {
        _height_image = $('.lv_content_viewer .page_view img').first().height();
        _width_image = $('.lv_content_viewer .page_view img').first().width();
    }
    $('#search_content').on('keydown', function (e) {
        if (e.which == 13) {
            popupsearch();
        }
    });
    //search_content();
    // Initialize autocomplete with custom appendTo:
    if (parseBool(isUsingCallApi) != true && CountFile < 10) {
        for (var i = 1; i <= 10; i++) {
            saveimage(i, _fileName_Image, _fileExt, _FileId, _Islink)
        }
    }
    load_data_image(CountFile);
    //đổ dữ liệu 
    var total_quizz = $('.popup_left_quizz .total_quizz').text();
    $('.button_quizz .total_quizz').text(total_quizz);
    if (total_quizz > 0) {
        $('.lv_footer_viewer .button_quizz .total_item').removeClass('disabled');
    }
    var total_notes = $('.popup_left_note .total_notes').text();
    $('.button_note .total_notes').text(total_notes);
    if (total_notes > 0) {
        $('.lv_footer_viewer .button_note .total_item').removeClass('disabled');
    }
    else {
        $('.lv_footer_viewer .button_note .total_item').addClass('disabled');
    }
    var total_bookmark = $('.popup_left_bookmark .total_bookmark').text();
    $('.button_bookmark .total_bookmark').text(total_bookmark);
    if (total_bookmark > 0) {
        $('.lv_footer_viewer .button_bookmark .total_item').removeClass('disabled');
    }
    else {
        $('.lv_footer_viewer .button_bookmark .total_item').addClass('disabled');
    }
    var popup_note = localStorage.getItem("page_log" + _FileId);
    readlog_local(popup_note);
    var array_notes = "";
    if (localStorage.getItem("notebook" + _FileId) != undefined) {
        array_notes = JSON.parse(localStorage.getItem("notebook" + _FileId).replace(/'/g, '"'));
    }
    var array_bookmark = "";
    if (localStorage.getItem("bookmark" + _FileId) != undefined) {
        array_bookmark = JSON.parse(localStorage.getItem("bookmark" + _FileId).replace(/'/g, '"'));
    }
    render_notes_html(array_notes);
    render_bookmark_html(array_bookmark);
    $('.notes_content').val('');
    var total_note_local_storage = array_notes.length;
    var total_bookmark_local_storage = array_bookmark.length;
    if (total_note_local_storage != 0) {
        $('.total_notes').text((total_note_local_storage));
        $('.popup_left_note .btn_viewmore').attr('data-t', total_note_local_storage);
        $('.group_btn_right .num_note').removeClass('d-none').text(total_note_local_storage);
        $('.popup_left_note .btn_viewmore').attr('data-p', 1);
        $('.lv_footer_viewer .button_note .total_item').removeClass('disabled');
    }
    else {
        $('.group_btn_right .num_note').addClass('d-none');

    }
    if (total_bookmark_local_storage != 0) {
        $('.num_bookmark ').removeClass('d-none').text((total_bookmark_local_storage));
        $('.button_bookmark .total_item').removeClass('disabled');
        $('.total_bookmark').text((total_bookmark_local_storage));
        var pagebookmark = array_bookmark[0].pagenumber;
        if (pagebookmark == -1 || pagebookmark == undefined) {
            $('.content_profile_account .cnt_add_bookmark').removeClass('active');
            $('.item_bookmark_' + pagebookmark).removeClass('active');
            $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'addbookmark()');
        }
    }
});








function show_hide_note() {
    var is_active = $('.popup_left_note').hasClass('active');
    if (is_active == false) {
        $('.popup_left_note').addClass('active');
        $('.popup_left_note').show("speed");
        //xóa các popup hiện tại trên trang
        $('.popup_left_bookmark').removeClass('active');
        $('.popup_left_bookmark').hide();
        $('.popup_left_tableofcontent').removeClass('active');
        $('.popup_left_tableofcontent').hide();
    }
    else {
        $('.popup_left_note').removeClass('active');
        $('.popup_left_note').hide("speed");
    }
}
function save_notes() {
    var notes_content = $('.notes_content').val();
    var num_note = null;
    if (localStorage.getItem("notebook" + _FileId) != null) {
        num_note = (JSON.parse(localStorage.getItem("notebook" + _FileId).replace(/'/g, '"'))).length + 1;
    }
    var pagenumber = $('#page_active').val();
    if (notes_content == '') {
        Swal.fire({
            icon: 'error',
            title: _localizer_layout.thongbao,
            html: _localizer_layout.banchuanhapnoidungghichu,
            confirmButtonText: _localizer_layout.dong,
        }).then(function () {
        });
    }
    if (localStorage.getItem("notebook" + _FileId) == null) {
        var array = [{
            "docid": _FileId,
            "docattachid": _docattachid,
            "note": notes_content,
            "id": 1,
            "pagenumber": pagenumber
        }];
        render_notes_html(array);
        const setjson = JSON.stringify(array);
        localStorage.setItem("notebook" + _FileId, setjson);
    }
    else {
        var arrayed = JSON.parse(localStorage.getItem("notebook" + _FileId).replace(/'/g, '"'));
        var array = {
            "docid": _FileId,
            "docattachid": _docattachid,
            "note": notes_content,
            "id": num_note,
            "pagenumber": pagenumber
        };
        arrayed.push(array);
        render_notes_html(arrayed);
        const setjson = JSON.stringify(arrayed);
        localStorage.setItem("notebook" + _FileId, setjson);
    }
    $('.notes_content').val('');
    var total_note_local_storage = arrayed == null ? 1 : arrayed.length;
    $('.total_notes').text((total_note_local_storage));
    $('.popup_left_note .btn_viewmore').attr('data-p', 1);
    $('.popup_left_note .btn_viewmore').attr('data-t', total_note_local_storage);
    $('.lv_footer_viewer .button_note .total_item').removeClass('disabled');
    $('.group_btn_right .num_note').removeClass('d-none').text(total_note_local_storage);
}
function render_notes_html(array) {
    if (array.length > 0) {
        $('.popup_left_note .body_note .item_note').remove();
        for (i = 0; i < array.length; i++) {
            var html = `<div class="item_note" onclick="goto_note(this)" data-p="` + array[i].pagenumber + `">
                <div class="page_note">Trang `+ array[i].pagenumber + `</div>
                <div>`+ array[i].note + `</div>
                <div class="btn_delete" title="Xóa ghi chú" onclick="delete_notes(this,`+ (array[i].id == null ? 0 : array[i].id) + `)">
                    <i class="iconmoon iconmoon-xoa"></i>
                </div>
            </div>`;
            $('.popup_left_note .body_note').append(html);
        }

    }
}
function delete_notes($this, docnoteid) {
    Swal.fire({
        icon: 'info',
        title: _localizer_layout.bancochacchanmuonxoaghichunay,
        showCancelButton: true,
        confirmButtonText: _localizer_layout.dongy,
        cancelButtonText: _localizer_layout.dong,
    }).then((result) => {
        if (result.value == true) {
            $($this).parent('.item_note').remove();
            var arrayed = JSON.parse(localStorage.getItem("notebook" + _FileId).replace(/'/g, '"'));
            if (arrayed.length > 0) {
                for (i = 0; i < arrayed.length; i++) {
                    if (arrayed[i].id == docnoteid) {
                        arrayed.splice(i, 1);
                        break;
                    }
                }
                var setdata = JSON.stringify(arrayed);
                localStorage.removeItem("notebook" + _FileId);
                localStorage.setItem("notebook" + _FileId, setdata);
            }
            $('.notes_content').val('');
            var total_note_local_storage = arrayed == null ? 1 : arrayed.length;
            $('.total_notes').text((total_note_local_storage));
            $('.popup_left_note .btn_viewmore').attr('data-p', 1);
            $('.popup_left_note .btn_viewmore').attr('data-t', total_note_local_storage);
            $('.lv_footer_viewer .button_note .total_item').removeClass('disabled');
            $('.group_btn_right .num_note').removeClass('d-none').text(total_note_local_storage);

        }
        else {

        }
    })
}
function view_more_notes($this) {
    var numofrow = 20;
    var curent_page = $($this).attr('data-p') ? parseInt($($this).attr('data-p')) : 1;
    if (curent_page) {
        curent_page = curent_page + 1;
    }
    var total = $($this).attr('data-t') ? parseInt($($this).attr('data-t')) : 0;
    if (total <= curent_page * numofrow) {
        $($this).addClass('d-none');
    }
    $.ajax({
        url: _RootBase + "Book/LoadHtmlNote",
        //dataType: "json",
        type: "GET",
        data: {
            p: curent_page,
            numofrow: numofrow,
            docid: _FileId,
            docattachid: _docattachid
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            if (data && data != null) {
                $('.popup_left_note .body_note').append(data);
                $($this).attr('data-p', curent_page);
            }

        },
        error: function (err) {
            //console.log(err)
        }
    });
}
function viewer_docnote() {
    init_watting_popup();
    $.ajax({
        url: _RootBase + "BookAttach/ViewerDocnote",
        type: "POST",
        data: {
            fileid: _FileId,
            totalpage: _total_page,
            type: _Type,
            folder_json: _folder_json,
            folder_image: _folder_image
        },
        async: false,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            //console.log(data)
        },
        error: function (err) {

        }
    });
}


function show_hide_bookmark() {
    var is_active = $('.popup_left_bookmark').hasClass('active');
    if (is_active == false) {
        $('.popup_left_bookmark').addClass('active');
        $('.popup_left_bookmark').show("speed");
        //xóa các popup hiện tại trên trang
        $('.popup_left_note').removeClass('active');
        $('.popup_left_note').hide();
        $('.popup_left_tableofcontent').removeClass('active');
        $('.popup_left_tableofcontent').hide();
    }
    else {
        $('.popup_left_bookmark').removeClass('active');
        $('.popup_left_bookmark').hide("speed");
    }
}
function addbookmark() {
    total_bookmar = $('.popup_left_bookmark .total_bookmark').text();
    total_bookmar++;
    $('.button_bookmark .total_bookmark').text(total_bookmar);
    if (total_bookmar > 0) {
        $('.lv_footer_viewer .button_bookmark .total_item').removeClass('disabled');
    }
    else {
        $('.lv_footer_viewer .button_bookmark .total_item').addClass('disabled');
    }
    $('.total_bookmark').text(total_bookmar);
    var pagenumber = $('#page_active').val();
    $('#page_view').attr('data-bookmark', total_bookmar);
    $('.num_bookmark').removeClass('d-none');
    $('.num_bookmark').text(total_bookmar);
    render_bookmark_html(pagenumber);
    //đánh lại trạng thái bookmark page hiện tại
    get_status_bookmark_page(pagenumber);
    var Isbookmark = localStorage.getItem("bookmark" + _FileId);
    if (Isbookmark == undefined || Isbookmark == null) {
        var array = [{
            "FileId": _FileId,
            "pagenumber": pagenumber
        }];
        render_bookmark_html(array);
        const setjson = JSON.stringify(array);
        localStorage.setItem("bookmark" + _FileId, setjson);
    }
    else {
        var array_addbookmark = JSON.parse(localStorage.getItem("bookmark" + _FileId).replace(/'/g, '"'));
        var array = {
            "FileId": _FileId,
            "pagenumber": pagenumber
        };
        array_addbookmark.push(array);
        render_bookmark_html(array_addbookmark);
        const setjson = JSON.stringify(array_addbookmark);
        localStorage.setItem("bookmark" + _FileId, setjson);
    }
    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'delete_bookmark(' + pagenumber + ',' + _FileId + ')');
}
function render_bookmark_html(array_bookmark) {
    if (array_bookmark.length > 0) {
        $('.popup_left_bookmark .body_bookmark').empty();

        for (i = 0; i < array_bookmark.length; i++) {
            if (array_bookmark[i].pagenumber != undefined) {
                var html = `<div class="item_bookmark item_bookmark_` + array_bookmark[i].pagenumber + `">
                <div class="label_bookmark" onclick="goto_bookmark(this)" data-p="`+ array_bookmark[i].pagenumber + `">Trang ` + array_bookmark[i].pagenumber + `</div>
                <div class="btn_delete" onclick="delete_bookmark(`+ array_bookmark[i].pagenumber + `,` + array_bookmark[i].FileId + `)">
                    <i class="iconmoon iconmoon-xoa"></i>
                </div>
            </div>`;
                $('.popup_left_bookmark .body_bookmark').append(html);
                $(".pageview_bookmark_" + array_bookmark[i].pagenumber).attr("data-bookmark", array_bookmark[i].pagenumber);
            }
        }
    }

}
function delete_bookmark(pagenumber, fileid) {
    $('.item_bookmark_' + pagenumber).remove();
    $('.content_profile_account .cnt_add_bookmark').removeClass('active');
    $('.content_profile_account .cnt_add_bookmark').attr('onclick', 'addbookmark()');
    var total_note_local_storage = parseInt($('.popup_left_bookmark .total_bookmark').text());
    $('.total_bookmark').text((total_note_local_storage - 1));
    $('.num_bookmark').text((total_note_local_storage - 1));
    $('.pageview_bookmark_' + pagenumber).attr("data-bookmark", "-1");
    var array_bookmark = JSON.parse(localStorage.getItem("bookmark" + _FileId).replace(/'/g, '"'));
    if (array_bookmark.length > 0) {
        for (i = 0; i < array_bookmark.length; i++) {
            if (array_bookmark[i].pagenumber == pagenumber) {
                array_bookmark.splice(i, 1);
                break;
            }
        }
        var setdata = JSON.stringify(array_bookmark);
        localStorage.removeItem("bookmark" + _FileId);
        localStorage.setItem("bookmark" + _FileId, setdata);
    }
}
function view_more_bookmark($this) {
    var numofrow = 20;
    var curent_page = $($this).attr('data-p') ? parseInt($($this).attr('data-p')) : 1;
    if (curent_page) {
        curent_page = curent_page + 1;
    }
    var total = $($this).attr('data-t') ? parseInt($($this).attr('data-t')) : 0;
    if (total <= curent_page * numofrow) {
        $($this).addClass('d-none');
    }
    $.ajax({
        url: _RootBase + "Book/LoadHtmlBookmark",
        //dataType: "json",
        type: "GET",
        data: {
            p: curent_page,
            numofrow: numofrow,
            docid: _FileId,
            docattachid: _docattachid
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            if (data && data != null) {
                $('.popup_left_bookmark .body_bookmark').append(data);
                $($this).attr('data-p', curent_page);
            }

        },
        error: function (err) {
            //console.log(err)
        }
    });
}

function viewer_bookmark() {
    init_watting_popup();
    $.ajax({
        url: _RootBase + "BookAttach/ViewerBookmark",
        type: "POST",
        data: {
            fileid: _FileId,
            totalpage: _total_page,
            type: _Type,
            folder_json: _folder_json,
            folder_image: _folder_image
        },
        async: false,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            //console.log(data)
        },
        error: function (err) {

        }
    });
}


function show_hide_tableofcontent() {
    var is_active = $('.popup_left_tableofcontent').hasClass('active');
    if (is_active == false) {
        $('.popup_left_tableofcontent').addClass('active');
        $('.popup_left_tableofcontent').show("speed");
        //xóa các popup hiện tại trên trang
        $('.popup_left_bookmark').removeClass('active');
        $('.popup_left_bookmark').hide();
        $('.popup_left_note').removeClass('active');
        $('.popup_left_note').hide();
    }
    else {
        $('.popup_left_tableofcontent').removeClass('active');
        $('.popup_left_tableofcontent').hide("speed");
    }
}
function expand_child_doctoc($this) {
    var is_active = $($this).hasClass('active');
    if (is_active == false) {
        $($this).addClass('active');
        $($this).parent().addClass('child_expand');
    }
    else {
        $($this).removeClass('active');
        $($this).parent().removeClass('child_expand');
    }
}
function get_status_bookmark_page(page) {
    var pagebookmark = $(".pageview_bookmark_" + page).attr("data-bookmark");
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
    //$('.content_profile_account .cnt_add_bookmark').addClass('active');
    //$('.content_profile_account .cnt_add_bookmark').attr('onclick', 'delete_bookmark(' + page + ')');
}
function load_data_image(_totalload) {
    const loadInterval = setInterval(load_image_page, 10);
    load_image_page();

    function load_image_page() {
        if (_total_image_load >= _totalload) {
            clearInterval(loadInterval);
            data_html_ebook = $('.pages').html();
            $('#page_active').removeAttr('disabled');
            for (var i = 0; i <= _totalload; i++) {
                if (parseBool(isUsingCallApi) != true) {
                    saveimage(i, _fileName_Image, _fileExt, _FileId, _Islink)
                }
            }
        }
        else {
            var page_append = _total_image_load;
            //_total_image_load++;

            if (page_append <= _totalload) {
                for (var i = _total_image_load; i <= page_append; i++) {

                    var html = '<div class="page_view pageview_bookmark_' + i + '" data-p="' + i + '" data-bookmark="-1"></div>';
                    if (_total_image_load > CountFile) {
                        $('.lv_content_viewer .pages').append(html);
                    }
                    if (parseBool(isUsingCallApi) != true) {
                        saveimage(i, _fileName_Image, _fileExt, _FileId, _Islink, _total_image_load);
                    }
                    else {
                        render_canvas_image(_total_image_load);
                    }
                    _total_image_load++;
                }
            }
            else {
                for (var i = _total_image_load; i <= _totalload; i++) {
                    var html = '<div class="page_view pageview_bookmark_' + i + '" data-p="' + i + '"></div>';
                    if (_total_image_load > CountFile) {
                        $('.lv_content_viewer .pages').append(html);
                    }
                    if (parseBool(isUsingCallApi) != true) {
                        saveimage(i, _fileName_Image, _fileExt, _FileId, _Islink, _total_image_load);
                    }
                    else {
                        render_canvas_image(_total_image_load);
                    }
                    _total_image_load++;
                }
            }
        }
    }
}


//Di chuyển đến trang đã đánh dấu 
function readlog(pagenumber) {
    $('#modal_log').css("display", "none");
    $('#modalbackdrop').css("display", "none");
    $('#page_active').val(pagenumber);
    $('#modal_log').remove();
    view_page(pagenumber);
}
function close_popup_log() {
    $('#modal_log').css("display", "none");
    $('#modalbackdrop').css("display", "none");
    $('#modal_log').remove();
}
function close_popup_search() {
    $('#card_search').css("display", "none");
    $('#modalbackdrop').css("display", "none");
    $('#card_search').remove();
}
function change_title_popup(id, text) {
    $('#' + id + ' .modal-header').removeClass('d-none')
    $('#' + id).find('.modal-header .modal-title').text(text);
}


function write_log(page) {
    localStorage.setItem("page_log" + _FileId, page);
}
function readlog_local(page) {
    if (page != null) {
        var template_log = $('#popup_log_template').html()
            .replace(/\{page\}/gm, page)
            .replace(/\{_RootBase\}/gm, _RootBase);
        $('#popup_log').append(template_log);
    }
}

function IshideShowPopup() {
    $('#card_search').data('hide') == 0 ? $('#card_search').hide("speed").data('hide', 1) : $('#card_search').show("speed").data('hide', 0);
}

function generatetext() {
    init_watting_popup();
    $.ajax({
        url: _RootBase + "BookAttach/GenerateText",
        type: "POST",
        data: {
            fileid: _FileId,
            totalpage: _total_page,
            type: _Type,
            folder_json: _folder_json,
            folder_image: _folder_image
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            //console.log(data)
        },
        error: function (err) {

        }
    });
}


