var _record = 0;
var list_usergroup_member = 'listusergroupmember';
var _record = 0;

//button action cho từng hàng của người dùng trong nhóm người dùng
var column_command = [
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_usergroup_popup(data.uiugid);
        }
    }
];

//Danh sách người dùng trong nhóm người dùng
loadKendoGrid({
    id: list_usergroup_member,
    url: _RootBase + "UserGroup/UserGroup_Search_Member",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
        ugid: _ugid
    },
    model: {
        fields: {
            ugname: { field: "ugname" },
            fullname: { field: "fullname" },
            emailaddr: { field: "emailaddr" }
        }
    },
    columns: [
        {
            title: _localizer.stt,
            template: "#= ++_record #",
            width: 50,
            headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
            attributes: { style: "text-align: center;" }

        },
        //{
        //    field: "ugname",
        //    title: _localizer.tennhom,
        //    template: '#if(data.ugname!=null){# #:ugname# #}#',
        //    width: 130,
        //    filterable: false,
        //},
        {
            field: "fullname",
            title: _localizer.tentaikhoan,
            template: '#if(data.fullname!=null){# #:fullname# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotaikhoan,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }
            },
        },
        {
            field: "emailaddr",
            title: _localizer.email,
            width: 130,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable: false,
            template: '#if(data.emailaddr!=null){# #:emailaddr# #}#',
        },
        {
            command: column_command,
            width: 370
        },
    ],
    isCustomtool: true,
    editable: 'inline',
    dataBinding: function () {
        if (this.dataSource.pageSize()) {
            _record = (this.dataSource.page() - 1) * this.dataSource.pageSize();
        }
        else {
            _record = (this.dataSource.page() - 1);
        }
    },
    //detailInit: detailInit,
    //dataBound: function (e) {
    //    $('.ugid').each(function () {
    //        if ($(this).attr('data-isonline') == 'true') {
    //            $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
    //        }
    //    });
    //},
    resizable: true
})

//Xóa người dùng trong nhóm người dùng (popup)
function delete_usergroup_popup(id) {
    InitDialogCourse({
        id: 'delete_usergroup_id_member',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtintaikhoansebixoa + '</div>'
            + '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.bancochacchan
        ,
        icon: 'iconmoon-NotifyDelete',
        footer: {
            //text: 'Text null sẽ bị ẩn!',
            button: [
                {
                    text: _localizer.quaylai,
                    isClose: true,
                    style: 'background-color:#B7BDD3;',
                },
                {
                    text: _localizer.dongy,
                    style: 'background-color:#5C77D0;',
                    click: function () {
                        delete_usermember(id);
                    },
                    isClose: true,
                },
            ]
        }
    });
}

//Xóa người dùng trong nhóm người dùng (Function)
function delete_usermember(id) {
    $.ajax({
        url: _RootBase + "UserGroup/UserGroup_Delete_Member",
        dataType: "json",
        type: "POST",
        data: {
            uiugid: id
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
                    toastr["success"](_localizer.xoadulieutaikhoanthanhcong, _localizer.thongbao);
                    $('#delete_usergroup_id_member').modal('hide');
                    var gridview = $("#" + list_usergroup_member).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else {
                    if (returncode == -1) {
                        toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                    }
                    else {
                        toastr["error"](data.returnmsg, _localizer.thongbao);
                    }
                }
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}

//
function upload_attachfile() {
    $('#importUserGroup input.attachfile').trigger('click');
}

//import người dùng trong nhóm người dùng (popup) 
function import_usermember() {
    InitDialogCourse({
        id: 'import_usermember',
        fullscreen: false,
        width: 600,
        title: _localizer.themtaikhoanvaonhomtufile,
        body: $('#modal_import').html(),
        footer: {
            button: [
                {
                    text: _localizer.dong,
                    isClose: true,
                    style: 'background-color:#B7BDD3;',
                },
                {
                    text: _localizer.nhapdulieu,
                    style: 'background-color:#5C77D0;',
                    click: function () {
                        function_import_usermember('import_usermember');
                    },
                    isClose: false,
                },
            ]
        }
    });
    $('#import_usermember .sheet_file').attr('id', 'sheet_file');
    $('#import_usermember input.attachfile').on('change', function () {
        var options = {
            subFolder: 'FileBook',
            fileType: 'document'
        };
        uploadApi(api_file, $('#import_usermember input.attachfile')[0].files[0], function (e) {
            if (e.ReturnCode == 0) {
                $('#import_usermember .attachfilename').html(e.PathfileName);
                $('#import_usermember .attachfile').attr('data-name', e.PathfileName);
                getWorkSheet('import_usermember');
            }
        }, options)
       
    });
}

//import người dùng trong nhóm người dùng  (function) 
function function_import_usermember(id) {
    var ugid = _ugid;

    if ($('#sheet_file').data('kendoComboBox') == undefined) {
        toastr["error"](_localizer.banchuachonfile, _localizer.thongbao);
        return false;
    }
    if ($('#sheet_file').data('kendoComboBox').text() == '') {
        toastr["error"](_localizer.banchuachonsheet, _localizer.thongbao);
        return false;
    }
    var formData = new FormData();
    formData.append("file", $('#' + id + ' input.attachfile')[0].files[0]);
    formData.append("sheetname", $('#sheet_file').data('kendoComboBox').text());
    formData.append("ugid", ugid);
    $.ajax({
       
        url: _RootBase + "UserGroup/Import_UserGroup",
        type: "POST",
        data: formData,
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        dataType: "json",
        contentType: false,
        processData: false,
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            //remove_watting_popup();
            if (data) {
                if (data.data != null && data.data.length > 0) {
                    var fullscreen = false;
                    var html = '<div class="alert alert-primary" role="alert">';
                    html += _localizer.themmoithanhcongdongdulieu.replace('__numok__', (data.data[0].numok));
                    html += '</div>';
                    if (data.data[0].numerr > 0) {
                        html += '<div class="alert alert-danger" role="alert">';
                        html += _localizer.loisodongdulieu.replace('__numerror__', (data.data[0].numerr));

                        html += '</div>';
                        html += '<table class="table">';
                        html += '<thead>';
                        html += '<tr>';
                        html += '<th scope="col">' + _localizer.stt + '</th>';
                        html += '<th scope="col">' + _localizer.dongf + '</th>';
                        html += '<th scope="col">' + _localizer.trangthai + '</th>';
                        html += '</tr>';
                        html += '</thead>';
                        html += '<tbody>';
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].returncode != 0) {
                                html += '<tr>';
                                html += '<th scope="row">' + (i + 1) + '</th>';
                                html += '<th scope="row">' + (data.data[i].ordinal) + '</th>';
                                html += '<td>' + (data.data[i].msg) + '</td>';
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
                                        var _grid = $("#" + list_usergroup_member).data("kendoGrid");
                                        _grid.dataSource.read();
                                    },
                                },
                            ]
                        }
                    });
                }
                else {
                    toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                }
            }
            else if (data.returnCode == 1) {
                toastr["error"](_localizer.taptinkhonghotro, _localizer.thongbao);
            }
            else if (data.returnCode == 2) {
                toastr["error"](_localizer.taptinkhongdungdinhdang, _localizer.thongbao);
            }
        },
        error: function (err) {
            console.log(err)
        },
        complete: function () {
            remove_watting_popup();
        }
    })
}

//chọn sheet trong file excel để import
function getWorkSheet(id) {
    var formData = new FormData();
    formData.append("formFile", $('#' + id + ' input.attachfile')[0].files[0]);
    $.ajax({
        url: _RootBase + "General/GetWorkSheetExcel",
        type: "POST",
        data: formData,
        async: false,
        beforeSend: function () {
            init_watting_popup();
        },
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.returnCode == 0) {
                $('#' + id + ' .cnt-worksheet').removeClass('d-none');
                loadKendoComboBox({
                    id: "sheet_file",
                    placeholder: _localizer.chonsheet,
                    dataTextField: "workSheetName",
                    dataValueField: "workSheetIndex",
                    dataSource: data.data
                });
            }
            else if (data.returnCode == 1) {
                toastr["error"](_localizer.taptinkhonghotro, _localizer.thongbao);
            }
            else if (data.returnCode == 2) {
                toastr["error"](_localizer.taptinkhongdungdinhdang, _localizer.thongbao);
            }
        },
        complete: function () {
            remove_watting_popup();
        }
    });
}

function upload_attachfile() {
    $('#import_usermember input.attachfile').trigger('click');
}

function export_user_in_group() {
    location.href = _link_export_member;

}

