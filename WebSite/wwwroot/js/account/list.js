var _record = 0;
var _id_tree_user = 'listuser';
var column_command = [
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addUpdateUser(data.userid, data.emailaddr);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            ajax_deleteuser(data.userid);
        }
    },
    {
        name: "approved",
        template: '<a title="' + _localizer.khoataikhoan + '" role="button" class="k-button k-button-icontext k-grid-approved"><i class="k-icon k-i-rotate"></i><div class="custom-title">' + _localizer.khoataikhoan + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            if (data.isblocked == true) {
                var checktrangthai = false;
            }
            else {
                var checktrangthai = true;
            }
            Blockuser(data.userid, checktrangthai);
        },
        editable: true,
    },
    {

        name: "isactive",
        template: '<a title="' + _localizer.kichhoattaikhoan + '" role="button" class="k-button k-button-icontext k-grid-isactive"><i class="k-icon k-i-check"></i><div class="custom-title">' + _localizer.kichhoattaikhoan + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            //if (data.isactivated == true) {
            //    toastr["error"](_localizer.taikhoancuabandakichhoat, _localizer.thongbao);
            //}
            //else {
            //}
                Activateuser(data.emailaddr)
        }
    },
    {
        name: "changepass",
        template: '<a title="' + _localizer.datlaimatkhau + '" role="button" class="k-button k-button-icontext k-grid-changepass"><i class="iconmoon iconmoon-Password"></i><div class="custom-title">' + _localizer.datlaimatkhau + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            setpwUser(data.userid);
        }
    }
];

loadKendoGrid({
    id: _id_tree_user,
    url: _RootBase + "Account/search",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'DESC',
        orgid: _orgid
    },
    model: {
        fields: {
            username: { field: "username" },
            v_role: { field: "v_role" },
            fullname: { field: "fullname" },
            isactivated: { field: "isactivated" },
            isblocked: { field: "isblocked", type: "bool" }
        }
    },
    columns: [
        {
            title: _localizer.stt,
            //template: '#if(data.userid!=null){# #:userid# #}#',
            template: "#= ++_record #",
            width: 50,
            headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
            attributes: { style: "text-align: center;" }
        },
        {
            field: "username",
            title: _localizer.tennguoidung,
            template: '<div class="data-row-user" data-isblock="#:data.isblocked#">#if(data.username!=null){# #:username# #}#</div>',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotentaikhoan,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "v_role",
            title: _localizer.loaitaikhoan,
            width: 100,
            filterable: {
                messages: {
                    info: _localizer.loctheoloaitaikhoan,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_v_role
            },
            template: '#if(data.v_role_name!=null){# #:v_role_name# #}#',
        },
        {
            field: "fullname",
            title: _localizer.hovaten,
            width: 140,
            filterable: {
                messages: {
                    info: _localizer.loctheohovaten,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }
            },
            template: '#if(data.fullname!=null){# #:fullname# #}#',
        },
        {
            field: "isactivated",
            title: _localizer.kichhoat,
            width: 120,
            filterable: {
                messages: {
                    info: _localizer.loctheotrangthaikichhoat,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_isactivated
            },
            template: "#if(data.isactivated == true){# <h6 class='data-row-user-active' data-isactivated='#:data.isactivated#'> " + _localizer.dakichhoat + "</h6> #}# #if(data.isactivated== false){# <h6 class='data-row-user-active' data-isactivated='#:data.isactivated#' > " + _localizer.chuakichhoat + "</h6> #}#",

        },
        {
            field: "isblocked",
            title: _localizer.hoatdong,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotrangthaihoatdong,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_blocked
            },
            template: "#if(data.isblocked == true){# <i class=\"iconmoon iconmoon-wrong\" style=\"color:\\#d81d1d\"></i> #}# #if(data.isblocked== false){# <i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i> #}#",

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
    detailInit: detailInit,
    dataBound: function (e) {
        $('.userid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
        $('.data-row-user').each(function () {
            var isblock = $(this).attr('data-isblock');
            if (parseBool(isblock) == true) {
                var tag_a = $(this).parents('tr').find('.k-command-cell .k-grid-approved');
                $(tag_a).attr('title', 'Mở khóa tài khoản');
                $(tag_a).find('.custom-title').text('Mở khóa tài khoản');
            }
        })
        $('.data-row-user-active').each(function () {
            var isactive = $(this).attr('data-isactivated');
            if (parseBool(isactive) == true) {
                var tag_b = $(this).parents('tr').find('.k-command-cell .k-grid-isactive');
                $(tag_b).remove();
            }
        })
    },
    resizable: true
})


function viewDetailCourse(id, emailadd) {
    $.ajax({
        url: _RootBase + "Account/getdetailaccount",
        //dataType: "json",
        type: "POST",
        data: {
            userid: id,
            emailaddr: emailadd
        },
        async: true,
        beforeSend: function () {
            $("body").addClass('loading');
        },
        complete: function () {
            $("body").removeClass('loading');
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'viewDetailCourse',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.xemthongtinchitiettaikhoan,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            }
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
//popup xác nhận xóa user
function ajax_deleteuser(id) {
    InitDialogCourse({
        id: 'ajax_deleteuser',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinnguoidungsebixoa + '</div>'
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
                        DeleteAccount(id, true);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//bảng detail của user
function detailInit(e) {
    var html = `
<label class="label"><label class="titledetail">`+ _localizer.manhanvien + '</label>:&ensp;' + (e.data.user_code ? e.data.user_code : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.hovaten + '</label>:&ensp;' + (e.data.fullname ? e.data.fullname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.gioitinh + '</label>:&ensp;' + (e.data.gender == '1' ? "Nam" : "Nữ") + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tentaikhoan + '</label>:&ensp;' + (e.data.username ? e.data.username : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.email + '</label>:&ensp;' + (e.data.emailaddr ? e.data.emailaddr : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaysinh + '</label>:&ensp;' + (e.data.dob ? kendo.toString(new Date(e.data.dob), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.kichhoat + '</label>:&ensp;' + (e.data.isactivated ? _localizer.dakichhoat : _localizer.chuakichhoat) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.hoatdong + '</label>:&ensp;' + (e.data.isblocked ? '<i class=\"iconmoon iconmoon-wrong\" style=\"color:\#d81d1d\"></i>' :  '<i class=\"iconmoon iconmoon-right\" style=\"color:\#1ED81D\"></i>') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.loaitaikhoan + '</label>:&ensp;' + (e.data.v_role_name ? e.data.v_role_name : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.diachi + '</label>:&ensp;' + (e.data.contacts ? e.data.contacts : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.sodienthoai + '</label>:&ensp;' + (e.data.mobile ? e.data.mobile : '') + `</label><br>`;
    $(html).appendTo(e.detailCell);
}
//chức năng xóa tài khoản user
function DeleteAccount(id) {
    $.ajax({
        url: _RootBase + "Account/Delete",
        dataType: "json",
        type: "POST",
        data: {
            userid: id, delete_anyway: true
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
                    $('#deleteCourse').modal('hide');
                    var gridview = $("#" + _id_tree_user).data("kendoGrid");
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
//chức năng khóa và mở kháo user
function Blockuser(id, checktrangthai) {
    $.ajax({
        url: _RootBase + "Account/Blockuser",
        dataType: "json",
        type: "POST",
        data: {
            userid: id,
            isblocked: checktrangthai,
            blockedreason: null
        },
        success: function (data) {
            if (data != null) {
                console.log(data);
                var returncode = data.returncode;
                var notifyjs = data.notifyjs;
                if (returncode == 0) {
                    if (checktrangthai == true) {
                        toastr["success"](_localizer.khoataikhoanthanhcong, _localizer.thongbao);
                    } else {
                        toastr["success"](_localizer.mokhoataikhoanthanhcong, _localizer.thongbao);
                    }
                    var gridview = $("#" + _id_tree_user).data("kendoGrid");
                    gridview.dataSource.read();

                    if (isapproved_old != true) {
                        //
                        send_notify_for_user(notifyjs);
                    }
                }
                else {
                    if (returncode == -1) {
                        toastr["error"](_localizer.thaydoitrangthaitaikhoanthatbai, _localizer.thongbao);
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
//chức năng kích hoạt tài khoản
function Activateuser(id, v_role) {
    $.ajax({
        url: _RootBase + "Account/Activateuser",
        dataType: "json",
        type: "POST",
        data: {
            emailaddr: id,
            activationcode: null,
            lang: 'vi'
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                var notifyjs = data.notifyjs;
                if (returncode == 0) {
                    toastr["success"](_localizer.kichhoattrangthaitaikhoanthanhcong, _localizer.thongbao);
                    var gridview = $("#" + _id_tree_user).data("kendoGrid");
                    gridview.dataSource.read();

                    if (isapproved_old != true) {
                        //
                        send_notify_for_user(notifyjs);
                    }
                }
                else {
                    if (data.returnmsg == "") {
                        toastr["error"](_localizer.kichhoattrangthaitaikhoanthatbai, _localizer.thongbao);
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
//lọc theo giới tính
function filtergender(element) {
    $(element).attr('id', 'filter_gender');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: 1, name: _localizer.nam,
                },
                {
                    id: 2, name: _localizer.nu,
                }
            ]

    });
}
//lọc theo quyền
function filter_v_role(element) {
    $(element).attr('id', 'filter_v_role');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: 1302, name: _localizer.nguoidoc,
                },
                {
                    id: 1301, name: _localizer.quantridoitac,
                }
            ]
    });
}
//lọc theo trạng thái hoạt động
function filter_blocked(element) {
    $(element).attr('id', 'filter_blocked');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: 'false', name: "Hoạt động",
                },
                {
                    id: 'true', name: "Không hoạt động",
                }
            ]

    });
}
//lọc theo trạng thái kích hoạt
function filter_isactivated(element) {
    $(element).attr('id', 'filter_isactivated');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: true, name: "Đã kích hoạt",
                },
                {
                    id: false, name: "Chưa kích hoạt",
                }
            ]

    });
}

function exportUser() {
    InitDialogCourse({
        id: 'exportUser',
        fullscreen: false,
        width: $(window).width() * 0.5,
        title: _localizer.xuatdulieutaikhoan,
        body: $('#modal_export').html(),
        footer: {
            button: [
                {
                    text: _localizer.huy,
                    isClose: true,
                    style: 'background-color:#B7BDD3;',
                },
                {
                    text: _localizer.xuatdulieu,
                    style: 'background-color:#5C77D0;',
                    click: function () {
                        var v_role = $('#exportUser #v_role').data('kendoComboBox').value();
                        if (v_role == '') {
                            toastr["error"](_localizer.banchuachonloaitaikhoan, _localizer.thongbao);
                            return false;
                        }
                        location.href = _link_export + '?v_role=' + v_role + '&orgid=' + _orgid;
                    },
                    isClose: false,
                },
            ]
        },
        callback: function () {
            $('#exportUser .v_role').attr('id', 'v_role');
            loadKendoComboBox({
                id: "v_role",
                placeholder: _localizer.chonloaitaikhoan,
                dataTextField: "objectvalue",
                dataValueField: "lookupid",
                url: _RootBase + "General/searchreflookup",
                data: { objectname: 'v_role' }
            });
        }
    });
}
function importUser() {
    InitDialogCourse({
        id: 'importUser',
        fullscreen: false,
        width: 600,
        title: _localizer.themtaikhoantufile,
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
                        ajax_importUser('importUser');
                    },
                    isClose: false,
                },
            ]
        },
        callback: function () {
            $('#importUser .v_role').attr('id', 'v_role');
            loadKendoComboBox({
                id: "v_role",
                placeholder: _localizer.chonloaitaikhoan,
                dataTextField: "objectvalue",
                dataValueField: "lookupid",
                url: _RootBase + "General/searchreflookup",
                data: { objectname: 'v_role' }
            });
        }
    });
    $('#importUser .sheet_file').attr('id', 'sheet_file');
    $('#importUser input.attachfile').on('change', function () {
        var options = {
            subFolder: 'FileBook',
            fileType: 'document'
        };
        uploadApi(api_file, $('#importUser input.attachfile')[0].files[0], function (e) {
            if (e.ReturnCode == 0) {
                $('#importUser .attachfilename').html(e.PathfileName);
                $('#importUser .attachfile').attr('data-name', e.PathfileName);
                getWorkSheet('importUser');
            }
        }, options)
    });
}
function ajax_importUser(id) {
    var v_role = $('#importUser #v_role').data('kendoComboBox').value();
    if (v_role == '') {
        toastr["error"](_localizer.banchuachonloaitaikhoan, _localizer.thongbao);
        return false;
    }
    if ($('#sheet_file').data('kendoComboBox') == undefined) {
        toastr["error"](_localizer.banchuachonfile, _localizer.thongbao);
        return false;
    }
    if ($('#sheet_file').data('kendoComboBox').text() == '') {
        toastr["error"](_localizer.banchuachonsheet, _localizer.thongbao);
        return false;
    }
    var formData = new FormData();
    formData.append("formFile", $('#' + id + ' input.attachfile')[0].files[0]);
    formData.append("sheetname", $('#sheet_file').data('kendoComboBox').text());
    formData.append("v_role", v_role);
    formData.append("orgid", _orgid);
    $.ajax({
        url: _RootBase + "Account/import",
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
                if (data.data.length > 0) {
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
                        html += '<th scope="col">' + _localizer.tentaikhoan + '</th>';
                        html += '<th scope="col">' + _localizer.email + '</th>';
                        html += '<th scope="col">' + _localizer.trangthai + '</th>';
                        html += '</tr>';
                        html += '</thead>';
                        html += '<tbody>';
                        for (var i = 0; i < data.data.length; i++) {
                            if (data.data[i].returncode != 0) {
                                html += '<tr>';
                                html += '<th scope="row">' + (i + 1) + '</th>';
                                html += '<th scope="row">' + (data.data[i].ordinal) + '</th>';
                                html += '<td>' + (data.data[i].username ? data.data[i].username : '') + '</td>';
                                html += '<td>' + (data.data[i].emailaddr ? data.data[i].emailaddr : '') + '</td>';
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
                                        var _grid = $("#" + _id_tree_user).data("kendoGrid");
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
    $('#importUser input.attachfile').trigger('click');
}




