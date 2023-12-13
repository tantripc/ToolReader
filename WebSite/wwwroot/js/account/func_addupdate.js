function addUpdateUser(id, emailaddr) {
    $.ajax({
        url: _RootBase + "Account/AddUser",
        type: "POST",
        data: {
            id: id != undefined ? id : null
            //emailaddr: emailaddr
        },
        success: function (data) {
            
            if (data != null) {
                InitDialogCourse({
                    id: 'formaddupdateuser',
                    fullscreen: true,
                    width: $(window).width() * 0.6,
                    title: id ? _localizer.capnhattaikhoan : _localizer.themmoitaikhoan,
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
                                    ajax_addUpdateUser(id != undefined ? id : '')
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
function loadcontrol() {
    loadKendoComboBox({
        id: "vrole",
        placeholder: _localizer.chonloaitaikhoan,
        dataTextField: "objectvalue",
        dataValueField: "lookupid",
        value: _vrole != '' ? _vrole : '',
        url: _RootBase + "General/searchreflookup",
        data: {
            objectname: 'v_role'
        },
        isrequired: true
    });
    loadKendoComboBox({
        id: "org",
        placeholder: _localizer.chondonvitochuc,
        dataTextField: "orgname",
        dataValueField: "orgid",
        value: _orgid != '' ? _orgid : '',
        url: _RootBase + "Organization/get_organization",
        data: {
            numofrow: 500,
            posstart: 1,
            porgid: -1
        },
        isrequired: true
    });
    loadKendoDatePicker({
        id: 'dob',
        weekNumber: true,
        format: 'dd/MM/yyyy',
        value: _dob.toString("mm/dd/yyyy")
    });

}

function ajax_addUpdateUser(id) {
    if ($('form').valid()) {
       // lấy value của form nhập dữ liệu
        var user_code = $('#user_code').val();
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var username = $('#username').val();
        var emailaddr = $('#emailaddr').val();
        var password = $('#password').val();
        var diachi = $('#diachi').val();
        var dob = $('#dob').val();
        var sodienthoai = $('#sodienthoai').val();
        var gender = $("input[name='gender']:checked").val();
        var vrole = $('#vrole').data('kendoComboBox').value();
        if (vrole == '') {
            toastr["error"](_localizer.banchuachonloaitaikhoan, _localizer.thongbao);
            return false;
        }
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Account/Action_addupdate",
            dataType: "json",
            type: "POST",
            data: {
                userid : id,
                firstname: firstname,
                lastname: lastname,
                username: username,
                emailaddr: emailaddr,
                pwd: password,
                contacts: diachi,
                user_code: user_code,
                dob: dob,
                mobile: sodienthoai,
                gender: gender,
                v_role: vrole,
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
                if (data != null) {
                    var returncode = data.returncode;
                    if (returncode == 0) {
                        toastr["success"]((id ? _localizer.capnhattaikhoanthanhcong : _localizer.themmoitaikhoanthanhcong), _localizer.thongbao);
                        $('#formaddupdateuser').modal('hide');
                        var gridview = $("#" + _id_tree_user).data("kendoGrid");
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



function setpwUser(id) {
    
    $.ajax({
        url: _RootBase + "Account/Setpassword",
        type: "POST",
        data: {
            userid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'formsetpwuser',
                    fullscreen: false,
                    width: $(window).width() * 0.5,
                    title: _localizer.datlaimatkhau,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text:_localizer.datlai,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_setpassUser(id != undefined ? id : '')
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

function ajax_setpassUser(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var password = $('#password').val();
      
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Account/Setpass",
            dataType: "json",
            type: "POST",
            data: {
                userid: id,
                pwd: password
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
                        toastr["success"](_localizer.datlaimatkhauthanhcong, _localizer.thongbao);
                        $('#formsetpwuser').modal('hide');
                        var gridview = $("#" + _id_tree_user).data("kendoGrid");
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