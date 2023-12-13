

//Thêm / Sửa mẫu mail (View)
function addupdate_refmail(mailtemplateid) {
    $.ajax({
        url: _RootBase + "RefMailTemplate/Addupdate",
        type: "POST",
        data: {
            mailtemplateid: mailtemplateid != undefined ? mailtemplateid : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_refmail',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: mailtemplateid ? _localizer.capnhatmaumail : _localizer.themmoimaumail,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.xemtruoc,
                                isClose: false,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    getdatamail(mailtemplateid);
                                },
                            },
                            {
                                text: mailtemplateid ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate(mailtemplateid != undefined ? mailtemplateid : null)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol();
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
function loadcontrol() {
    load_editor({
        id: 'mailtemplatecontents',
        isInline: true,
        isrequired: true,
        placeholder: _localizer.nhapmota
    });
}

//Thêm / Sửa mẫu mail (function)
function ajax_addupdate(mailtemplateid) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu

        var title = $('#title').val();
        if (mailtemplateid == null) {
            var name = removeVietnameseTones(title);
        }
        else {
            var name = $('#name').val();
        }
        var mailtemplatecontents = CKEDITOR.instances['mailtemplatecontents'].getData();
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "RefMailTemplate/Addupdate_RefMailTemplate",
            dataType: "json",
            type: "POST",
            data: {
                mailtemplatetitle: title,
                mailtemplatename: name,
                mailtemplatecontents: mailtemplatecontents,
                mailtemplateid: mailtemplateid
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
                        toastr["success"]((mailtemplateid ? _localizer.capnhatmaumailthanhcong : _localizer.themmoimaumailthanhcong), _localizer.thongbao);
                        $('#form_addupdate_refmail').modal('hide');
                        var gridview = $("#" + list_refmail).data("kendoGrid");
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
}

//lấy nội dung mail và truyền cho hàm xem thử mẫu mail
function getdatamail(mailtemplateid, mailtemplatecontents) {
    if (mailtemplatecontents != null) {
        preview_mail(mailtemplateid, mailtemplatecontents)
    }
    else {
        var mailtemplatecontents = CKEDITOR.instances['mailtemplatecontents'].getData();
        preview_mail(mailtemplateid, mailtemplatecontents)
    }
}

//xem thử mẫu mail 
function preview_mail(mailtemplateid, mailtemplatecontents) {
    if (mailtemplatecontents == null) {
        toastr["error"](_localizer.xemtruocthatbai, _localizer.thongbao);
    }
    else {
        $.ajax({
            url: _RootBase + "RefMailTemplate/Previewmail",
            type: "POST",
            data: {
                mailtemplatecontents: mailtemplatecontents,
                mailtemplateid: mailtemplateid
            },
            success: function (data) {
                if (data != null) {
                    InitDialogCourse({
                        id: 'form_view_mail',
                        fullscreen: true,
                        width: $(window).width() * 0.9,
                        title: _localizer.xemtruocmaumail,
                        body: data,
                        footer: {
                            button: [
                                {
                                    text: _localizer.dong,
                                    isClose: true,
                                    style: 'background-color:#B7BDD3;',
                                }
                            ]
                        },
                        callback: function () {
                            loadcontrol();
                        }
                    });
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}