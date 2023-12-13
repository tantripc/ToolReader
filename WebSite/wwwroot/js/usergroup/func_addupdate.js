

//Thêm / Sửa thể nhóm người dùng (Popup)
function addupdate_usergroup(id, orgid) {
    console.log(orgid)
    $.ajax({
        url: _RootBase + "UserGroup/Addupdate",
        type: "Get",
        data: {
            ugid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_usergroup',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: id ? _localizer.capnhatnhomtaikhoan : _localizer.themmoinhomtaikhoan,
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
                                    function_addupdate_usergroup(id != undefined ? id : '')
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(id, orgid);
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

//Thư viện kendo UI
function loadcontrol(id, orgid) {
  
    loadKendoComboBox({
        id: "orgid",
        placeholder: _localizer.chonphongban,
        dataTextField: "orgname",
        dataValueField: "orgid",
        value: orgid != null ? orgid : '',
        url: _RootBase + "Organization/get_organization",
        data: {
            numofrow: -1
        },
        isrequired: true
    });
}

//Thêm / Sửa thể nhóm người dùng (Function)
function function_addupdate_usergroup(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var ugname = $('#ugname').val();
        var description = $('#description').val();
        var orgid = $("#orgid").data('kendoComboBox').value();
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "UserGroup/UserGroup_AddUpdate",
            dataType: "json",
            type: "POST",
            data: {
                ugname: ugname,
                orgid: orgid,
                description: description
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
                        toastr["success"]((id ? _localizer.capnhatnhomtaikhoanthanhcong : _localizer.themmoinhomtaikhoanthanhcong), _localizer.thongbao);
                        $('#form_addupdate_usergroup').modal('hide');
                        var gridview = $("#" + list_usergroup).data("kendoGrid");
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


//Danh sách người dùng trong nhóm người dùng
function addupdate_usergroup_member(id) {
    $.ajax({
        url: _RootBase + "UserGroup/IndexUser",
        type: "Get",
        data: {
            ugid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_usergroup_member',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.danhsachtaikhoantrongnhom,
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
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
