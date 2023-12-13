//cập nhật và thêm mới sách
function addupdatedoc(id) {
    $.ajax({
        url: _RootBase + "Doc/Addupdate",
        type: "POST",
        data: {
            id: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: id ? _localizer.capnhatsach : _localizer.themmoisach,
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
                                    ajax_addupdate_doc(id != undefined ? id : '')
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(publishyear);
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function loadcontrol(publishyear) {
    $("#currency").kendoComboBox({
        dataTextField: "text",
        dataValueField: "value",
        value: "VND",
        dataSource: [
            { text: "VND", value: "VND" },
            { text: "USD", value: "USD" },
        ],
        filter: "contains",
        suggest: true
    });
    loadKendoYear({
        id: 'publishyear',
        value: publishyear
    });
    load_editor({
        id: 'abstractcontent',
        isInline: true,
        isrequired: true,
        placeholder: _localizer.nhapmota
    });
    load_editor({
        id: 'desct',
        isInline: true,
        isrequired: true,
        placeholder: _localizer.nhapmotangan
    });
    loadKendoComboBox({
        id: "topic",
        placeholder: _localizer.chondanhmucsach,
        dataTextField: "topicname",
        dataValueField: "topicid",
        value: topicname != '' ? topicname : '',
        url: _RootBase + "Topic/gettopic",
        data: {
            numofrow: -1
        },
        isrequired: true
    });
    
    loadKendoComboBox({
        id: "cp",
        placeholder: _localizer.chontacquyen,
        dataTextField: "cprname",
        dataValueField: "cprid",
        value: cprid != '' ? cprid : '',
        url: _RootBase + "CopyRight/Search",
        data: {
            numofrow: -1
        },
        isrequired: true
    });
    
}

function updatecoversheet() {
    $('#coverfile').trigger('click');
}
$('#coverfile').on('change', function () {
    var options = {
        subFolder: 'ImageBook',
        fileType: 'image'
    };
    init_dialog_crop_image_and_upload({
        idinputfile: 'coverfile',
        aspectRatio: 16 / 9,
        api_file: api_file,
        callback: function (e) {
            if (e.ReturnCode == 0) {
                $('#imgcoversheet').attr('src', e.root + e.PathfileName).show();
                $('#coverfile').attr('data-name', e.PathfileName);
            }
        },
        options_upload: options
    })
    //var height = "406px";
    //var width = "286px";
    //options_get = resize_image_upload(width, height);
    //uploadApi(api_file, $('#coverfile')[0].files[0], function (e) {
    //    if (e.ReturnCode == 0) {
    //        $('#imgcoversheet').attr('src', e.root + e.PathFileName).show();
    //        $('#coverfile').attr('data-name', e.PathFileName);
    //    }
    //}, options)
});
function upload_attachfile() {
    $('#attachfile').trigger('click');
}
$('#attachfile').on('change', function () {
    if ($('#attachfile')[0].files[0].type != "application/pdf" && $('#attachfile')[0].files[0].type != "video/mp4" && $('#attachfile')[0].files[0].type != "audio/mpeg") {
        $('#pagenumber').removeClass('d-none');
    }
    else {
        $('#pagenumber').addClass('d-none');
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

//Bước thứ 2 của cập nhật và thêm mới sách
function ajax_addupdate_doc(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var title = $('#title').val();
        var isbn = $('#isbn').val();
        var numpage = $('#numpage').val();
        var author = $('#author').val();
        var publisher = $('#publisher').val();
        var publishyear = $('#publishyear').val();
        var abstractcontent = CKEDITOR.instances['abstractcontent'].getData();
        var desct = CKEDITOR.instances['desct'].getData();
        var originprice = $('#originprice').val();
        var price = $('#price').val();
        var collector = $('#collector').val();
        var translator = $('#translator').val();
        var publishnum = $('#publishnum').val();
        //var catgnamejs = $('#catgnamejs').data("kendoMultiSelect");
        var catgnamejs = $("#catgnamejs").data("kendoMultiSelect").value();
        var currency = $("#currency").data('kendoComboBox').value();
        var catgjs = [];
        if (catgnamejs.length > 0) {
            for (var i = 0; i < catgnamejs.length; i++) {
                catgjs.push({
                    catgid: catgnamejs[i],
                });
            }
        }
        var topic = $("#topic").data('kendoComboBox').value();
        var cp = $("#cp").data('kendoComboBox').value();
        var filepathname = $('#attachfile').attr('data-name');
        var coversheet = $('#coverfile').attr('data-name');
        var tag_keyword = '';
        var tag_keyword_arr = $("select#tag_keyword").tagsinput('items');
        if (tag_keyword_arr.length > 0) {
            tag_keyword = tag_keyword_arr.join(';');
        }
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Doc/addupdatedoc",
            dataType: "json",
            type: "POST",
            data: {
                title: title,
                author: author,
                docid: id,
                cprid: cp,
                publisher: publisher,
                publishyear: publishyear,
                abstractcontent: abstractcontent,
                desct: desct,
                price: price,
                publishnum: publishnum,
                originprice: originprice,
                translator: translator,
                attachfile: filepathname,
                coverfile: coversheet,
                keyword: tag_keyword,
                catg_js: catgjs,
                isbn: isbn,
                numpage: numpage,
                currency: currency,
                topicid: topic,
                collector: collector

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
                    var returncode = data.returncode;
                    if (returncode == 0) {
                        toastr["success"]((id ? _localizer.capnhatsachthanhcong : _localizer.themmoisachthanhcong), _localizer.thongbao);
                        $('#form_addupdate').modal('hide');
                     
                        var gridview = $("#" + List_Doc).data("kendoGrid");
                        gridview.dataSource.read();
                        //location.reload();
                    }
                    else {
                        if (returncode == -1) toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                        else toastr["error"]((data.returnmsg ? data.returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                    }
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}




