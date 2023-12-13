

//Cập nhật và Thêm mới
function Addupdate_doctoc(doctocid, docattachid, parentId) {
    
    $.ajax({
        url: _RootBase + "DocToc/Addupdate",
        type: "POST",
        data: {
            docattachid: docattachid != null ? docattachid : null,
            doctocid: doctocid != null ? doctocid : null,
            numofrow: -1
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_Addupdate_doctoc',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: doctocid != null ? _localizer.capnhatmucluc : _localizer.themmoimucluc,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: doctocid != null ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate_doctoc(doctocid != null ? doctocid : null, docattachid != undefined ? docattachid : null)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(doctocid, docattachid, parentId);
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
function loadcontrol(doctocid, docattachid, parentId) {
    $('input[name="filetype"]').on('change', function () {
        if ($(this).val() == 1) {
            $('.cnt-pagegoto').removeClass('d-none');
            $('.cnt-linkgoto').addClass('d-none');
        }
        else {
            $('.cnt-linkgoto').removeClass('d-none');
            $('.cnt-pagegoto').addClass('d-none');
        }
    });
    loadKendoComboBox({
        id: "pdoctocid",
        placeholder: _localizer.chonmucluc,
        dataTextField: "title",
        dataValueField: "doctocid",
        value: parentId != '' ? parentId : '',
        url: _RootBase + "DocToc/DocToc_Get",
        data: {
            numofrow: -1,
            docattachid: docattachid
        },
        isLevel: true,
        isrequired: false
    });
}

//Bước thứ 2 của cập nhật và thêm mới sách
function ajax_addupdate_doctoc(doctocid, docattachid) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var linkgoto = $('#linkgoto').val();//link đi tới
        var pagegoto = $('#pagegoto').val();//trang đi tới
        var pagenumber = $('#pagenumber').val();//
        var title = $('#title').val();
        var act = pagenumber == 1 ? "p" : "l";//nếu chọn trang thì value = 1 chọn link thì value bằng 2 để so sánh
        var gotoref = act == "p" ? parseInt(pagegoto) : linkgoto;//nếu act = "P" thì gotoref bằng pagegoto , nếu bằng l thì gotoref là link
        var pdoctocid = $("#pdoctocid").data('kendoComboBox') != undefined ? $("#pdoctocid").data('kendoComboBox').value() : $("#doctocid").data('kendoComboBox').value();
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "DocToc/DocToc_Addupdate",
            dataType: "json",
            type: "POST",
            data: {
                title: title,
                act: act,
                status: status,
                gotoref: gotoref,
                pdoctocid: pdoctocid,
                docattachid: docattachid,
                doctocid: doctocid
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
                        toastr["success"](doctocid != null ? _localizer.capnhatmuclucthanhcong : _localizer.themmoimuclucthanhcong, _localizer.thongbao);
                        $('#form_Addupdate_doctoc').modal('hide');
                        var gridview = $('#' + list_toc).data("kendoTreeList");
                        gridview.dataSource.read();
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
