//Thêm / Sửa sách liên quan (View)
function add_docrelate(id) {
    $.ajax({
        url: _RootBase + "DocRelate/Addupdate",
        data: {
            docid: id
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_add',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: _localizer.themsachlienquan,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.them,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    function_add(id != undefined ? id : '')
                                },
                                isClose: false,
                            },
                        ]
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//Thêm / Sửa sách liên quan (Function) 
function function_add(id) {
    // lấy value của form nhập dữ liệu
    var arr = $('#selected').data('kendoListBox').dataItems();
    var Docinterest = [];
    if (arr.length == 0) {
        toastr["error"](_localizer.banchuachonsach, _localizer.thongbao);
        return;
    }
    for (var i = 0; i < arr.length; i++) {
        Docinterest.push(
            {
                docid: arr[i].docid,
            }
        );
    }
    //kiểm tra dữ liệu
    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "DocRelate/DocRelate_Add",
        dataType: "json",
        type: "POST",
        data: {
            docids: JSON.stringify(Docinterest),
            relatedocid: id
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (res) {
            if (res != null && res.data) {
                for (var i = 0; i < res.data.length; i++) {
                    var returncode = res.data[i].returncode;
                    if (returncode == 0) {
                        toastr["success"]( _localizer.themsachlienquanthanhcong, _localizer.thongbao);
                        $('#form_add').modal('hide');
                        var gridview = $("#" + list_docrelate).data("kendoGrid");
                        gridview.dataSource.read();
                    }
                    else if (returncode != 0) toastr["error"]((res.data[i].returnmsg ? res.data[i].returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                }
            }
            else toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
        },
        error: function (err) {
            console.log(err)
        }
    });
}




