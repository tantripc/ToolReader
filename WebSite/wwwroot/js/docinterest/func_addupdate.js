
//bật popup tạo mới sách hay
function add_docinterest() {
    $.ajax({
        url: _RootBase + "Docinterest/Addupdate",
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'formaddupdatesh',
                    fullscreen: false,
                    width: $(window).width() * 0.8,
                    title: _localizer.themsachmoihay,
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
                                    ajax_addUpdatesh()
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
//thêm mới sách hay
function ajax_addUpdatesh() {
    // lấy value của form nhập dữ liệu
    var ugid = $('#ugid').val();
    var arr = $('#selected').data('kendoListBox').dataItems();
    var Docinterest = [];
    if (arr.length == 0) toastr["error"](_localizer.banchuachonsach, _localizer.thongbao);
    for (var i = 0; i < arr.length; i++) Docinterest.push({ docid: arr[i].docid, title: arr[i].title });

    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "Docinterest/addupdate_docinterests",
        dataType: "json",
        type: "POST",
        data: {
            docids: JSON.stringify(Docinterest),
            ugid: ugid
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (res) {
            if (res.data.length > 0) {
                var fullscreen = false;
                var html = '';
                if (res.numok > 0) {
                    html += '<div class="alert alert-primary" role="alert">';
                    html += _localizer.themvaosachmoihay.replace('__numok__', (res.numok));
                    html += '</div>';
                }
                if (res.numerr > 0) {
                    html += '<div class="alert alert-danger" role="alert">';
                    html += _localizer.loisodongdulieu.replace('__numerror__', (res.numerr));
                    html += '</div>';
                    html += '<table class="table">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th scope="col">' + _localizer.stt + '</th>';
                    html += '<th scope="col">' + _localizer.tensach + '</th>';
                    html += '<th scope="col">' + _localizer.thongbao + '</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].returncode != 0) {
                            html += '<tr style="background: #fee2e1;">';
                            html += '<th scope="row">' + (i + 1) + '</th>';
                            html += '<th scope="row">' + res.data[i].titledoc + '</th>';
                            html += '<td>' + (res.data[i].returnmsg) + '</td>';
                            html += '</tr>';
                        }
                    }
                    html += '</tbody>';
                    html += '</table>';
                    fullscreen = true;
                }
                InitDialogCourse({
                    id: 'ajax_importUser',
                    fullscreen: fullscreen,
                    width: fullscreen == true ? $(window).width() * 0.8 : $(window).width() * 0.6,
                    title: _localizer.ketquathaotac,
                    body: html,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                                click: function () {
                                    $('#formaddupdatesh').modal('hide');
                                    var _grid = $("#" + _id_tree_sh).data("kendoGrid");
                                    _grid.dataSource.read();
                                },
                            },
                        ]
                    }
                });
            }
            else {
                toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                $('#formaddupdatesh').modal('hide');
            }
        }
    });
}

