//Cập nhật và Thêm mới thể loại
function addupdatecategory(id) {
    $.ajax({
        url: _RootBase + "Category/Addupdate",
        type: "POST",
        data: {
            catgid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: id ? _localizer.capnhattheloai : _localizer.themmoitheloai,
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
                                    ajax_addupdate(id != undefined ? id : '')
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
    $('#iseffect').on('change', function () {
        if ($(this).is(':checked')) {
            $('.cnt-iseffect').removeClass('d-none');
        }
        else {
            $('.cnt-iseffect').addClass('d-none');
        }
    });
}
$(document).ready(function () {
    $('input[name="filetype"]').on('change', function () {
        if ($(this).val() == 1) {
            $('.cnt-fileattach').removeClass('d-none');
            $('.cnt-filelink').addClass('d-none');
        }
        else {
            $('.cnt-filelink').removeClass('d-none');
            $('.cnt-fileattach').addClass('d-none');
        }
    });
});

//Bước thứ 2 của cập nhật và thêm mới thể loại
function ajax_addupdate(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var iseffect = $('#iseffect').is(':checked');
        var catgname = $('#catgname').val();
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Category/addupdatecategory",
            dataType: "json",
            type: "POST",
            data: {
                iseffect: iseffect,
                catgname: catgname,
                catgid: id
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
                        toastr["success"]((id ? _localizer.capnhattheloaithanhcong : _localizer.themmoitheloaithanhcong), _localizer.thongbao);
                        $('#form_addupdate').modal('hide');
                        var gridview = $("#" + list_category).data("kendoGrid");
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




