var _numofrow = 12;
var height_crolltop_tags = $('.soft_apply').height();
var height_crolltop_label = $('#label_selected_id').height();
$(document).ready(function () {
    if (_topicid && _topicid != '') {
        $('.cnt_category_icon ul li a[data-val="' + _topicid + '"]').text();
        /*$('.catg_title').text(text_topic);*/
    }
    $('#lst_book').on('click', '.view_grid_book a,.view_list_book a', function (e) {
        if ($(e.target).hasClass('btn_like') || $(e.target).parents('.btn_like').length > 0) {
            e.preventDefault();
        }
        if ($(e.target).hasClass('catg_name') || $(e.target).parents('.catg_name').length > 0) {
            e.preventDefault();
            location = $(e.target).attr('data-href');
        }
    });
    //$('#lst_book').on('click', '.view_grid_book a', function (e) {
    //    if ($(e.target).parents('.catg_name').length > 0) {
    //        e.preventDefault();
    //    }
    //window.location.href = $('.catg_name').attr('data-href');
    //location = "/danh-muc/cong-nghe-3.html";
    //console.log(.attr('data-href'))
    //console.log($(e.target).parents('.catg_name').attr('data-href'))
    //if ($(e.target).hasClass('btn_like') || $(e.target).parents('.btn_like').length > 0) {
    //    e.preventDefault();
    //}
    //});
    $('.book_top').on('click', 'a.card', function (e) {
        if ($(e.target).hasClass('btn_like') || $(e.target).parents('.btn_like').length > 0) {
            e.preventDefault();
        }
    });
    $('#soft_new').click(function (e) {
        var type = $(this).attr('data-t');
        var sort = $(this).attr('data-val');
        if (sort && type) {
            var catg_id_selected = $('.catg_title').attr('data-val');
            var tab_view = $('.item_type_view.active').attr('data-val');
            if (tab_view == 'list') {
                view_page_book_list(1, null, catg_id_selected, sort, type);
            }
            else {
                view_page_book_grid(1, null, catg_id_selected, sort, type);
            }
        }
    });
    $('#soft_currency').click(function (e) {
        var type = $(this).attr('data-t');
        var sort = $(this).attr('data-val');
        if (sort && type) {
            var catg_id_selected = $('.catg_title').attr('data-val');
            var tab_view = $('.item_type_view.active').attr('data-val');
            if (tab_view == 'list') {
                view_page_book_list(1, null, catg_id_selected, sort, type);
            }
            else {
                view_page_book_grid(1, null, catg_id_selected, sort, type);
            }
        }
    });
    $('#soft_reads').click(function (e) {
        var type = $(this).attr('data-t');
        var sort = $(this).attr('data-val');
        if (sort && type) {
            var catg_id_selected = $('.catg_title').attr('data-val');
            var tab_view = $('.item_type_view.active').attr('data-val');
            if (tab_view == 'list') {
                view_page_book_list(1, null, catg_id_selected, sort, type);
            }
            else {
                view_page_book_grid(1, null, catg_id_selected, sort, type);
            }
        }
    });

    $('.content_category .accordion-header .accordion-button').first().trigger('click');
    //$('#collapseCatg_menu').click(function (e) {
    //    var catgs = get_catgnames_filter();
    //    $('#label_selected_id').empty();
    //    if (catgs != "") {
    //        $('#headingCatg').addClass('active_tab');
    //        $('#label_selected_id').addClass('label_selected');
    //        $('#label_selected_id').append(catgs);
    //    }
    //    else {
    //        $('#headingCatg').removeClass('active_tab');
    //    }
    //});
})

function view_page_book_grid(page, _orgid, topicid, sortfield, sorttype) {

    var iscurrency = $('#soft_currency .list-soft').attr('aria-selected');
    var isnew = $('#soft_new .list-soft').attr('aria-selected');
    var isreads = $('#soft_reads .list-soft').attr('aria-selected');
    if (iscurrency == 'true') {
        sorttype = $('#soft_currency').attr('data-t');
        sortfield = $('#soft_currency').attr('data-val');
    }
    else if (isnew == 'true') {
        sorttype = $('#soft_new').attr('data-t');
        sortfield = $('#soft_new').attr('data-val');
        view_page_book_list(1, null, docid, sort, type);
    }
    else if (isreads == 'true') {
        sorttype = $('#soft_reads').attr('data-t');
        sortfield = $('#soft_reads').attr('data-val');
    }
    else {
        topicid = $('.catg_title').attr('data-val'); 
    }
    var catgs = get_catgids_filter();
    $.ajax({
        url: _RootBase + "Book/ViewBookGrid",
        //dataType: "json",
        type: "GET",
        data: {
            p: page,
            numofrow: _numofrow,
            topicid: topicid ? topicid : null,
            sortfield: sortfield ? sortfield : null,
            sorttype: sorttype ? sorttype : null,
            catgs: catgs ? catgs : null,
            orgid: _orgid
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
                $('#lst_book').html(data);
                $('html, body').stop().animate({
                    scrollTop: 0
                }, 300);
            }
            else {
                //$('#lst_book').removeAttr('style');
                //$('#lst_book').css("margin-top", "5rem");
                //$('#lst_book').css("text-align", "center");
                $('#lst_book').html('<div>' + _localizer.chuacosach + '</div>');
            }

        },
        error: function (err) {
            console.log(err)
        }
    });
}
function view_page_book_list(page, _orgid, topicid, sortfield, sorttype) {
    topicid = $('.catg_title').attr('data-val');
    var iscurrency = $('#soft_currency .list-soft').attr('aria-selected');
    var isnew = $('#soft_new .list-soft').attr('aria-selected');
    var isreads = $('#soft_reads .list-soft').attr('aria-selected');
    if (iscurrency == 'true') {
        sorttype = $('#soft_currency').attr('data-t');
        sortfield = $('#soft_currency').attr('data-val');
    }
    else if (isnew == 'true') {
        sorttype = $('#soft_new').attr('data-t');
        sortfield = $('#soft_new').attr('data-val');
    }
    else if (isreads == 'true') {
        sorttype = $('#soft_reads').attr('data-t');
        sortfield = $('#soft_reads').attr('data-val');
    }
    else {
    }
    var catgs = get_catgids_filter();
    $.ajax({
        url: _RootBase + "Book/ViewBookList",
        //dataType: "json",
        type: "GET",
        data: {
            p: page,
            numofrow: _numofrow,
            topicid: topicid ? topicid : null,
            sortfield: sortfield ? sortfield : null,
            sorttype: sorttype ? sorttype : null,
            catgs: catgs ? catgs : null,
            orgid: _orgid
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
                $('#lst_book').html(data);
                $('html, body').stop().animate({
                    scrollTop: 0
                }, 300);
            }
            else {
                $('#lst_book').html('<div>' + _localizer.chuacosach + '</div>');
            }

        },
        error: function (err) {
            console.log(err)
        }
    });
}
function view_list_book($this) {
    $('.item_type_view').removeClass('active');
    var active_page = $('#lst_book .content_pagination .page-item.active a').text();
    $($this).addClass('active');
    var topicid = $('.catg_title').attr('data-val');
    view_page_book_list(active_page, null, topicid);

}
function view_grid_book($this) {
    $('.item_type_view').removeClass('active');
    var active_page = $('#lst_book .content_pagination .page-item.active a').text();
    $($this).addClass('active');
    var topicid = $('.catg_title').attr('data-val');
    view_page_book_grid(active_page,null, topicid);
}
function expand_child($this) {
    var is_active = $($this).hasClass('active');
    var active_page = $('#lst_book .content_pagination .page-item.active a').text();
    var topicid = $('.catg_title').attr('data-val');
    if (is_active == false) {
        $($this).addClass('active');
        $($this).parent().addClass('child_expand');
        //view_page_book_grid(active_page, topicid);
    }
    else {
        $($this).removeClass('active');
        $($this).parent().removeClass('child_expand');
    }
}
function load_book_from_topic(id, orgid, $this) {
    $('.catg_title').text($($this).parents().find("#headingOrg_" + orgid).text() + " / " + $($this).find('span').first().text());
    $('.catg_title').attr('data-val', id);
    var tab_view = $('.item_type_view.active').attr('data-val');
    if (tab_view == 'list') {
        $.ajax({
            url: _RootBase + "Book/ViewBookList",
            //dataType: "json",
            type: "GET",
            data: {
                p: 1,
                numofrow: _numofrow,
                topicid: id ? id : null,
                orgid: orgid
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
                    $('#lst_book').html(data);
                    $('html, body').stop().animate({
                        scrollTop: 0
                    }, 300);
                }
                else {
                    $('#lst_book').html('<div>' + _localizer.chuacosach + '</div>');
                }

            },
            error: function (err) {
                console.log(err)
            }
        });
    }
    else {
        $.ajax({
            url: _RootBase + "Book/ViewBookGrid",
            //dataType: "json",
            type: "GET",
            data: {
                p: 1,
                numofrow: _numofrow,
                topicid: id ? id : null,
                orgid: orgid
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
                    $('#lst_book').html(data);
                    $('html, body').stop().animate({
                        scrollTop: 0
                    }, 300);
                }
                else {
                    $('#lst_book').html('<div>' + _localizer.chuacosach + '</div>');
                }

            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}
function reset_filter_catg() {
    $('.catg_title').attr('data-val', '');
    $('.catg_title').text(_localizer.tusachlacviet);
    var tab_view = $('.item_type_view.active').attr('data-val');
    if (tab_view == 'list') {
        view_page_book_list(1, null);
    }
    else {
        view_page_book_grid(1, null);
    }
    $('#collapseCatg input[type="checkbox"]').prop('checked', false);
}
function remove_tags($this, catgid) {
    
    $($this).remove();
    var catg_id_selected = $('.catg_title').attr('data-val');
    $('#checked_catg_' + catgid).prop('checked', false);
    var catgs = get_catgnames_filter();//lấy danh sách đã check 
    $('#label_selected_id').empty();//xóa ô "thể loại đã chọn"
    if (catgs != "") {//nếu có thể loại đã được chọn
        $('#label_selected_id').append(catgs);//thì thêm nội dung những nội dung vào ô "thể loại đã chọn"
    }
    else {//nếu không có thể loại nào được chọn
        $('#title_danhmuc_book').css("color", "#212529");
        $(".title_catg").removeAttr("style");
        //$('#label_selected_id').remove();//thì xóa nội dung ô "thể loại đã chọn"
        $('#headingCatg').removeClass('active_tab');//xóa border left 
    }
    var tab_view = $('.item_type_view.active').attr('data-val');
    if (tab_view == 'list') {
        view_page_book_list(1, null, catg_id_selected, null, null);
    }
    else {
        view_page_book_grid(1, null, catg_id_selected, null, null);
    }
}
function filter_catg(catgid) {
    $('.catg_title').text(_localizer.tatcasach);
    $('#title_danhmuc_book').css("color","#f0f8ff00");
    var span_content_tags_select = ` <span id="label_selected_id"></span>`;
    $('#headingCatg').append(span_content_tags_select);
    var checked = $('#checked_catg_' + catgid).is(':checked');//kiểm tra xem có đánh giấu thể loại nào
    if (checked == false) {//nếu không có check 
     
        var catgs = get_catgnames_filter();//lấy danh sách đã check 
        $('#label_selected_id').empty();//xóa ô "thể loại đã chọn"
        if (catgs != "") {//nếu có thể loại đã được chọn
            $('#label_selected_id').append(catgs);//thì thêm nội dung những nội dung vào ô "thể loại đã chọn"
        }
        else {//nếu không có thể loại nào được chọn
            $('#title_danhmuc_book').css("color", "#212529");
            $(".title_catg").removeAttr("style");
            //$('#label_selected_id').remove();//thì xóa nội dung ô "thể loại đã chọn"
            $('#headingCatg').removeClass('active_tab');//xóa border left 
        }
        $('.tag_soft_' + catgid).remove();//xóa tất cả các tags trên bộ lọc

    }
    else {

        var catg_id = $('.catg_title').attr('data-val');
        var content = $('#label_catg_' + catgid).text();
        var catgs = get_catgnames_filter();
        var html = `<span type="button" class="btn btn-primary tag_soft tag_soft_` + catgid + `"onclick="remove_tags(this,` + catgid + `)">` + content + ` <span class="badge"><i class="iconmoon iconmoon-Close"></i></span></span>`;
        $('#label_selected_id').empty();
        $('#headingCatg').addClass('active_tab');
        $('#collapseCatg_menu').removeClass("pb-3");//xóa class padding-bottom =1rem
        $('#label_selected_id').addClass('label_selected');
        $('#tag_apply_catg').append(html);//thêm những thẻ tags vào bộ lọc
        $('#label_selected_id').append(catgs);//thêm nội dung đã check
        $(".title_catg").attr("style", "padding-bottom: 16px;")
        $('#side_left_modal').scrollTop(parseInt($('.soft_apply').height() - height_crolltop_tags) + parseInt($('#label_selected_id').height() - height_crolltop_label));
    }
    var tab_view = $('.item_type_view.active').attr('data-val');
    if (tab_view == 'list') {
        view_page_book_list(1, null, catg_id , null, null);
    }
    else {
        view_page_book_grid(1, null, catg_id , null, null);
    }
}
//lấy id của catg
function get_catgids_filter() {
    var arr_catg = [];
    $('#collapseCatg input[type="checkbox"]:checked').each(function () {
        var catgid = $(this).attr('data-val');
        if (catgid) {
            arr_catg.push(catgid);
        }
    });
    var catgs = '';
    if (arr_catg.length > 0) {
        catgs = arr_catg.join(',');
    }
    return catgs;
}
//lấy tên của catg
function get_catgnames_filter() {
    var arr_catgname = [];
    $('#collapseCatg input[type="checkbox"]:checked').each(function () {
        var catgname = $(this).attr('data-name');
        if (catgname) {
            arr_catgname.push(catgname);
        }
    });
    var catgnames = "";
    if (arr_catgname.length > 0) {
        catgnames = arr_catgname.join(', ');
    }
    return catgnames;
}
//$('.language_vi').click(function (e) {
//    $('#languge_choose').text($(this).text());
//});
//$('.language_en').click(function (e) {
//    $('#languge_choose').text($(this).text());
//});

$('.language_item').on('click', function (e) {
    $('#languge_choose').text($(this).text());
    var lang_value = $(this).attr('data-value');
    //console.log(lang_value);
    if (lang_value != '') {
        $.ajax({
            url: _RootBase + "Culture/ChangeLanguage",
            dataType: "json",
            type: "POST",
            data: {
                culture: lang_value
            },
            success: function (data) {
                //console.log(data);
                if (data.returncode == 0) {
                    location.reload(true);
                }

            },
            error: function (err) {
                console.log(err)
            }
        });
    }
})
$('#emailsignup').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        signupuser();
    }

});
$(document).ready(function () {
    $("#search_form").val() == "" ? $('.cover_search_form .iconmoon-Close').addClass('d-none') : $('.cover_search_form .iconmoon-Close').removeClass('d-none');
    $("#search_form").keypress(function () {
        $('.cover_search_form .iconmoon-Close').removeClass('d-none');
    });
});

function signupuser() {
    var email = $('#emailsignup').val();
    register_modal(email);
}
document.addEventListener('DOMContentLoaded', function () {
    new Splide('#splide', {
        type: 'loop',
        perPage: 5,
        perMove: 1,
        arrowPath: '',
        arrows: true, // disbale arrows,
        classes: {
            arrows: 'splide__arrows ',
            arrow: 'splide__arrow ',
            prev: 'splide__arrow--prev iconmoon iconmoon-Back1',
            next: 'splide__arrow--next iconmoon iconmoon-Next',
        }
    }).mount();
});


