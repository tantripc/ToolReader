//Thêm / Sửa người dùng trong nhóm người dùng (Popup)
function addupdate_usergroup_member(id) {
    $.ajax({
        url: _RootBase + "UserGroup/AddupdateUser",
        type: "Get",
        data: {
            ugid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_usergroup_member',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: _localizer.themtaikhoanvaonhomtaikhoan,
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
                                    function_addupdate_usermember(id != undefined ? id : '')
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


//Thêm / Sửa người dùng trong nhóm người dùng (Function)
function function_addupdate_usermember(id) {
    // lấy value của form nhập dữ liệu
    var arr_usermember = $('#selected').data('kendoListBox').dataItems();
    var temp_usermember = [];
    if (arr_usermember.length == 0) toastr["error"](_localizer.banchuachonsach, _localizer.thongbao);
    for (var i = 0; i < arr_usermember.length; i++) temp_usermember.push({ userid: arr_usermember[i].userid, emailaddr: arr_usermember[i].emailaddr, username: arr_usermember[i].username });
    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "UserGroup/AddupdateUser_Callapi",
        dataType: "json",
        type: "POST",
        data: {
            usermember: JSON.stringify(temp_usermember),
            ugid: id
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
                debugger
                var fullscreen = false;
                if (res.numok > 0) {
                    var html = '<div class="alert alert-primary" role="alert">';
                    html += _localizer.themvaonhomtaikhoanthanhcongdongdulieu.replace('__numok__', (res.numok));//đếm từng dòng thành công
                    html += '</div>';
                }
                if (res.numerr > 0) {
                    var html = '<div class="alert alert-danger" role="alert">';
                    html += _localizer.loisodongdulieu.replace('__numerror__', (res.numerr));//đếm từng dòng lỗi 

                    html += '</div>';
                    html += '<table class="table">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th scope="col">' + _localizer.stt + '</th>';
                    html += '<th scope="col">' + _localizer.tennguoidung + '</th>';
                    html += '<th scope="col">' + _localizer.email + '</th>';
                    html += '<th scope="col">' + _localizer.thongbao + '</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].returncode != 0) {
                            html += '<tr style="background: #fee2e1;">';
                            html += '<th scope="row">' + (i + 1) + '</th>';
                            html += '<th scope="row">' + res.data[i].username + '</th>';
                            html += '<th scope="row">' + res.data[i].emailaddr + '</th>';
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
                                    $('#form_addupdate_usergroup_member').modal('hide');
                                    var _grid = $("#" + list_usergroup_member).data("kendoGrid");
                                    _grid.dataSource.read();
                                },
                            },
                        ]
                    },
                    hide: function () {
                        $('#ajax_importUser').fadeIn();
                        $('#form_addupdate_usergroup_member').modal('hide');
                    }
                });
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

