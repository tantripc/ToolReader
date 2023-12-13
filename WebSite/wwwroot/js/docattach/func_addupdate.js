//Cập nhật và Thêm mới chủ đề
function addupdate_docattach(docid, id) {
    $.ajax({
        url: _RootBase + "DocAttach/Addupdate",
        type: "POST",
        data: {
            docattachid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_update',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: id ? _localizer.capnhatfile : _localizer.themmoifile,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: id ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_update(docid != undefined ? docid : '', id != undefined ? id : '')
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(id);
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//Sử dụng KendoUi
function loadcontrol(id) {
    if (id != undefined) {
        $('.cnt-isdefault').addClass('d-none');
    }
    $('input[name="filetype"]').on('change', function () {
        if ($(this).val() == 1) {
            $('.link_input').addClass('d-none');
            $('.embed_input').addClass('d-none');
            $('.cnt-fileattach').removeClass('d-none');
        }
        else if ($(this).val() == 2) {
            $('.cnt-filelink').removeClass('d-none');
            $('.link_input').removeClass('d-none');
            $('.cnt-fileattach').addClass('d-none');
            $('.embed_input').addClass('d-none');
        }
        else {
            $('#embed').prop('checked', true);
            $('.embed_input').removeClass('d-none');
            $('.link_input').addClass('d-none');
            $('.cnt-fileattach').addClass('d-none');
            $('.cnt-filelink').removeClass('d-none');
        }
    });
    //$('input[name="link_type"]').on('change', function () {
    //    debugger
    //    if ($(this).val() == 1) {
    //        $('.embed_input').removeClass('d-none');
    //        $('.link_input').addClass('d-none');
    //    }
    //    else {
    //        $('.embed_input').addClass('d-none');
    //        $('.link_input').removeClass('d-none');
    //    }
    //});
}
function upload_attachfile() {
    $('#attachfile').trigger('click');
}
$('#attachfile').on('change', function () {
    if ($('#attachfile')[0].files[0].type != "application/pdf" && $('#attachfile')[0].files[0].type != "video/mp4" && $('#attachfile')[0].files[0].type != "audio/mpeg") {
        $('#page').removeClass('d-none');
    }
    else {
        $('#page').addClass('d-none');
    }
    var options = {
        subFolder: 'FileBook',
        fileType: 'document,video,audio'
    };
    uploadApi(api_file, $('#attachfile')[0].files[0], function (e) {
        if (e.ReturnCode == 0) {
            $('#attachfilename').html(e.PathfileName).show();
            $('#attachfile').attr('data-name', e.PathfileName);
        }
    }, options)
});

//Bước thứ 2 của cập nhật và thêm mới chủ đề
function ajax_update(docid, id) {
    debugger
    // lấy value của form nhập dữ liệu
    var iseffect = $('#iseffect').is(':checked');
    var attachfile = $('#attachfile').attr('data-name');
    var linktoshare = $('#linktoshare').val();
    var embed = $('#embed_input').val();
    var pagenumber = $('#pagenumber').val();
    //if (attachfile == "" && attachlink == "") {
    //    toastr["error"](_localizer.filechuaduocchonvuilongkiemtralai, _localizer.thongbao);
    //    return false;
    //}
    var fsize = null;
    if ($('#attachfile')[0].files != null && $('#attachfile')[0].files.length > 0) fsize = $('#attachfile')[0].files[0].size;
    //kiểm tra dữ liệu
    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "DocAttach/DocAttach_Update",
        dataType: "json",
        type: "POST",
        data: {
            docattachid: id,
            docid: docid,
            docsize: fsize,
            attachfile: attachfile,
            attachlink: linktoshare ? linktoshare : embed,
            pagenumber: pagenumber,
            isdefault: iseffect

        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            if (data != null) {
                console.log(id);
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"]((id ? _localizer.capnhatfilethanhcong : _localizer.themmoifilethanhcong), _localizer.thongbao);
                    $('#form_update').modal('hide');
                    var gridview = $("#" + list_docattach).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else {
                    if (returncode == -1) {
                        toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                    }
                    else {
                        toastr["error"]((data.returnmsg ? data.returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                    }
                }
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}




//cập nhật và thêm mới sách
function addupdate_doctoc(docattachid) {
    InitDialogCourse({
        id: 'form_add_doctoc',
        fullscreen: true,
        width: $(window).width() * 0.9,
        title: _localizer.mucluc,
        body: '<div id="listtoc"></div>',
        callback: function () {
            loadgriddoctoc(docattachid);
        },
        footer: {
            button: [
                {
                    text: _localizer.dong,
                    isClose: true,
                    style: 'background-color:#B7BDD3;',
                },
                {
                    text: _localizer.themmoi,
                    style: 'background-color:#5C77D0;',
                    click: function () {
                        Addupdate_doctoc(null, docattachid);
                    },
                    isClose: false,
                },
            ]
        },
    });
}
