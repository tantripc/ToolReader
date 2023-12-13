var _tree_organization = 'tree_organization';
var _record = 0;
var column_command = [
    {
        name: "view",
        template: '<a title="' + _localizer.xemchitiet + '" role="button" class="k-button k-button-icontext k-grid-view"><i class="k-icon iconmoon iconmoon-Infomation"></i><div class="custom-title">' + _localizer.xemchitiet + '</div></a>',
        click: function (e) {
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            viewDetailOrganization(data.orgid);
        }
    },
    {
        name: "moveup",
        template: '<a title="' + _localizer.dichuyenlen + '" role="button" class="k-button k-button-icontext k-grid-moveup"><i class="k-icon k-i-arrow-up"></i><div class="custom-title">' + _localizer.dichuyenlen + '</div></a>',
        click: function (e) {
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            moveOrganization(data.orgid, true, data.orgname);
        }
    },
    {
        name: "movedown",
        template: '<a title="' + _localizer.dichuyenxuong + '" role="button" class="k-button k-button-icontext k-grid-movedown"><i class="k-icon k-i-arrow-down"></i><div class="custom-title">' + _localizer.dichuyenxuong + '</div></a>',
        click: function (e) {
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            moveOrganization(data.orgid, false, data.orgname);
        }
    },
    //{
    //    name: "add",
    //    template: '<a title="' + _localizer.themmoi + '" role="button" class="k-button k-button-icontext k-grid-add"><i class="k-icon k-i-plus"></i><div class="custom-title">' + _localizer.themmoi + '</div></a>',
    //    click: function (e) {
    //        var tr = $(e.target).closest("tr");
    //        var data = this.dataItem(tr);
    //        addUpdateOrganization(undefined, data.orgid);
    //    }
    //},
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addUpdateOrganization(data.orgid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            deleteOrganization(data.orgid, data.orgname );
        }
    },
    {
        name: "lstusers",
        template: '<a title="' + _localizer.taikhoan + '" role="button" class="k-button k-button-icontext k-grid-lstusers"><i class="k-icon k-i-file-txt"></i><div class="custom-title">' + _localizer.taikhoan + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            location.href = url_organization_user + '/' + data.orgid;
        }
    },
    {
        name: "topic",
        template: '<a title="' + _localizer.danhmuc + '" role="button" class="k-button k-button-icontext k-grid-topic"><i class="iconmoon iconmoon-edittext"></i><div class="custom-title">' + _localizer.danhmuc + '</div></a>',
        click: function (e) {
            //sửa lại chỗ này tiếp 
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            var link = htmlUnescape(url_topic.replace('__id__', data.orgid).replace('__name__', data.orgname));
            window.location.href = link;
           
        }
    }, {
        name: "default",
        template: '<a title="' + _localizer.datlammacdinh + '" role="button" class="k-button k-button-icontext k-grid-default"><i class="iconmoon iconmoon-Check"></i><div class="custom-title">' + _localizer.datlammacdinh + '</div></a>',
        click: function (e) {
            //sửa lại chỗ này tiếp 
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            set_isdefault(data.orgid);

        }
    }, {
        name: "synctopic",
        template: '<a title="' + _localizer.dongbodanhmuc + '" role="button" class="k-button k-button-icontext k-grid-synctopic"><i class="iconmoon iconmoon-loading"></i><div class="custom-title">' + _localizer.dongbodanhmuc + '</div></a>',
        click: function (e) {
            //sửa lại chỗ này tiếp 
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            synctopic(data.orgid);

        }
    }, {
        name: "syncbook",
        template: '<a title="' + _localizer.dongbosach + '" role="button" class="k-button k-button-icontext k-grid-syncbook"><i class="iconmoon iconmoon-loading"></i><div class="custom-title">' + _localizer.dongbosach + '</div></a>',
        click: function (e) {
            //sửa lại chỗ này tiếp 
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            syncdoc(data.orgid);

        }
    }
];

loadKendoGrid({
    id: _tree_organization,
    url: _RootBase + "Organization/get_organization",
    pageSize: 20,
    data: {
        porgid: -1
    },
    model: {
        fields: {
            porgid: { field: "porgid", nullable: true, type: "number" },
            orgid: { field: "orgid", type: "number" },
            orgname: { field: "orgname" },
        },
    },
    columns: [
        {
            title: _localizer.stt,
            template: "#= ++_record #",
            width: 50,
            headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
            attributes: { style: "text-align: center;" }
        },
        {
            field: "orgname",
            title: _localizer.tendonvi,
            width: 200,
            filterable: false,
            //filterable: {
            //    messages: {
            //        info: _localizer.loctheotendonvi,
            //        filter: _localizer.apdung,
            //        clear: _localizer.xoa
            //    }
            //},
        },
        {
            field: "org_code",
            title: _localizer.madonvi,
            template: "#if(data.org_code){# #:data.org_code# <a class='data-sync' data-val='#:data.issync#'></a> #}#",
            width: 80,
            filterable: false,
            //filterable: {
            //    messages: {
            //        info: _localizer.loctheomadonvi,
            //        filter: _localizer.apdung,
            //        clear: _localizer.xoa
            //    }
            //},
        },
        {
            field: "numuser",
            title: _localizer.soluonguser,
            width: 100,
            filterable: false
        },
        {
            field: "isdefault",
            title: _localizer.macdinh,
            width: 100,
            attributes: { style: "text-align: center;" },
            template: "#if(data.isdefault == true){#<i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i>#}# #if(data.isdefault==false){##}#",
            filterable: false,

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
    /*detailInit: detailInit,*/
    dataBound: function (e) {
        $('.data-sync').each(function () {
            var issync = $(this).attr('data-val');
            if (issync != "true") {
                var tag_a = $(this).parents('tr').find('.k-command-cell .k-grid-synctopic');
                var tag_b = $(this).parents('tr').find('.k-command-cell .k-grid-syncbook');
                $(tag_a).remove();
                $(tag_b).remove();
            }
        })
    },
    resizable: true

})

function viewDetailOrganization(orgid) {
    $.ajax({
        url: _RootBase + "Organization/ViewDetail",
        //dataType: "json",
        type: "GET",
        data: {
            orgid: orgid != undefined ? orgid : ''
        },
        async: false,
        beforeSend: function () {
            $("body").addClass('loading');
        },
        complete: function () {
            $("body").removeClass('loading');
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'viewDetailOrganization',
                    fullscreen: true,
                    width: $(window).width() * 0.6,
                    title: _localizer.xemthongtindonvi,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
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
function addUpdateOrganization(id, porgid) {
    $.ajax({
        url: _RootBase + "Organization/ViewAddUpdate",
        //dataType: "json",
        type: "GET",
        data: {
            orgid: id != undefined ? id : null
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
                    id: 'addUpdateOrganization',
                    fullscreen: true,
                    width: $(window).width() * 0.6,
                    title: id ? _localizer.capnhatdonvi : _localizer.themmoidonvi,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                //css: 'btn-success',
                                text: id ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addUpdateOrganization(id != undefined ? id : '', porgid)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        setTimeout(function () {
                            if (porgid) {
                                $('#porgid').data('kendoComboBox').value(porgid);
                            }
                        }, 300);
                        
                        loadKendoDatePicker({
                            id: 'founding_date',
                            weekNumber: true,
                            format: 'dd/MM/yyyy'
                        });
                        //loadKendoComboBox({
                        //    id: "presenter_user",
                        //    placeholder: _localizer.chonnguoiquanlytacquyen,
                        //    dataTextField: "username",
                        //    dataValueField: "userid",
                        //    value: cpruserid != undefined ? cpruserid : null,
                        //    url: _RootBase + "Account/search",
                        //    data: {
                        //        numofrow: -1,
                        //        v_role:1300
                        //    },
                        //    isrequired: true
                        //});
                        
                    }
                });
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function ajax_addUpdateOrganization(orgid, porgid) {
    if ($('form').valid()) {
        $.ajax({
            url: _RootBase + "Organization/addupdate_organization",
            dataType: "json",
            type: "POST",
            data: {
                orgid: orgid,
                porgid: $('#porgid').data('kendoComboBox').value(),
                orgname: $('#orgname').val(),
                description: $('#description').val(),
                address: $('#address').val(),
                phone: $('#phone').val(),
                email: $('#email').val(),
                syncapi: $('#syncapi').val(),
                syncpartner: $('#syncpartner').val(),
                syncuser: $('#syncuser').val(),
                syncpwd: $('#syncpwd').val(),
                is_depended_unit: $('#is_depended_unit').is(':checked'),
                founding_date: $('#founding_date').val(),
                head_userid: $('#presenter_user').data('kendoComboBox').value(),
                head_fullname: $('#presenter_user').data('kendoComboBox').text(),
                title: $('#title').val(),
                org_code: $('#org_code').val()
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
                    var returncode = data.returncode;
                    if (returncode == 0) {
                        toastr["success"]((orgid ? _localizer.capnhatdonvithanhcong : _localizer.themmoidonvithanhcong), _localizer.thongbao);
                        $('#addUpdateOrganization').modal('hide');
                        var treelist = $("#" + _tree_organization).data("kendoGrid");
                        treelist.dataSource.read();
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
}
function deleteOrganization(id, orgname) {
    InitDialogCourse({
        id: 'deleteOrganization',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align: center;font-size: 1.53125rem; ">' + _localizer.thongtindonvisebixoakhoihethong + '</div>'
            + '<div style="text-align: center;font-size: 1.53125rem; ">' + _localizer.bancochacchan + '</div>'
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
                        ajax_deleteOrganization(id, orgname);
                    },
                    isClose: false,
                },
            ]
        }
    });
}

function ajax_deleteOrganization(id, orgname) {
    $.ajax({
        url: _RootBase + "Organization/delete_organization",
        dataType: "json",
        type: "POST",
        data: {
            orgid: id,
            orgname: orgname
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"](_localizer.xoadonvithanhcong, _localizer.thongbao);
                    $('#deleteOrganization').modal('hide');
                    var treelist = $("#" + _tree_organization).data("kendoGrid");
                    treelist.dataSource.read();
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
// đặt đơn vị làm mặt định (Phú)
function set_isdefault(id) {
    $.ajax({
        url: _RootBase + "Organization/set_isdefault",
        dataType: "json",
        type: "POST",
        data: {
            orgid: id
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"](_localizer.datlammacdinhthanhcong, _localizer.thongbao);
                    var treelist = $("#" + _tree_organization).data("kendoGrid");
                    treelist.dataSource.read();
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
function export_org() {
    window.open(url_Export_Org, "_blank");
}
function moveOrganization(id, ismoveup, orgname) {
    InitDialogCourse({
        id: 'moveOrganization',
        width: 600,
        title: _localizer.thongbao,
        body: '<div>' + (ismoveup ? _localizer.chinhanhseduocdichuyenlentren : _localizer.chinhanhseduocdichuyenxuongduoi) + '</div>'
            + '<div>' + _localizer.bancochacchan
        ,
        icon: ismoveup ? 'iconmoon-BringTop' : 'iconmoon-BringBack',
        footer: {
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
                        ajax_moveOrganization(id, ismoveup, orgname);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
function ajax_moveOrganization(id, ismoveup, orgname) {
    $.ajax({
        url: _RootBase + (ismoveup ? "Organization/organization_moveup" : "Organization/organization_movedown"),
        dataType: "json",
        type: "POST",
        data: {
            orgid: id,
            orgname: orgname
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"]((ismoveup ? _localizer.dichuyenlentrenthanhcong : _localizer.dichuyenxuongduoithanhcong), _localizer.thongbao);
                    $('#moveOrganization').modal('hide');
                    var tree = $("#" + _tree_organization).data("kendoGrid");
                    tree.dataSource.read();
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
function upload_attachfile() {
    $('#importOrganization input.attachfile').trigger('click');
}

function importOrg() {
    InitDialogCourse({
        id: 'importOrganization',
        fullscreen: false,
        width: 600,
        title: _localizer.themmoidonvitufile,
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
                        ajax_importOrganization('importOrganization');
                    },
                    isClose: false,
                },
            ]
        }
    });
    $('#importOrganization .sheet_file').attr('id', 'sheet_file');
    $('#importOrganization input.attachfile').on('change', function () {
        var options = {
            subFolder: 'Files',
            fileType: 'document'
        };
        uploadApi(api_file, $('#importOrganization input.attachfile')[0].files[0], function (e) {
            if (e.ReturnCode == 0) {
                $('#importOrganization .attachfilename').html(e.PathfileName);
                $('#importOrganization .attachfile').attr('data-name', e.PathfileName);
                getWorkSheet('importOrganization');
            }
        }, options)
    });
}

function getWorkSheet(id) {
    var formData = new FormData();
    formData.append("formFile", $('#' + id + ' input.attachfile')[0].files[0]);
    $.ajax({
        url: _RootBase + "General/GetWorkSheetExcel",
        type: "POST",
        data: formData,
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        dataType: "json",
        contentType: false,
        processData: false,
        success: function (data) {
            if (data.returnCode == 0) {
                $('#' + id + ' .cnt-worksheet').removeClass('d-none');
                loadKendoComboBox({
                    id: "sheet_file",
                    placeholder: "Chọn sheet",
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
        error: function (err) {
            console.log(err)
        }
    });
}

function ajax_importOrganization(id) {
    if ($('#sheet_file').data('kendoComboBox').text() == '') {
        toastr["error"](_localizer.banchuachonsheet, _localizer.thongbao);
        return false;
    }
    var formData = new FormData();
    formData.append("formFile", $('#' + id + ' input.attachfile')[0].files[0]);
    formData.append("sheetname", $('#sheet_file').data('kendoComboBox').text());
    $.ajax({
        url: _RootBase + "Organization/import_org",
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
            console.log(data);
            //remove_watting_popup();
            if (data) {
                if (data.data.length > 0) {
                    var numerr = 0;
                    var numok = 0;
                    for (var i = 0; i < data.data.length; i++) {
                        numerr += data.data[i].numerr;
                        numok += data.data[i].numok;
                    }

                    var fullscreen = false;
                    var html = '';
                    if (numok > 0 || numerr == 0) {
                        html += '<div class="alert alert-primary" role="alert">';
                        html += _localizer.themmoithanhcongdongdulieu.replace('__numok__', (numok));
                        html += '</div>';
                    }
                    else {
                        if (numok < 0) {
                            html += '<div class="alert alert-primary" role="alert">';
                            html += data.data[0].msg;
                            html += '</div>';
                        }
                        else {
                            if (numerr > 0) {
                                html += '<div class="alert alert-danger" role="alert">';
                                html += _localizer.sodongdulieubiloi.replace('__numerror__', (numerr));
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
                                    html += '<tr>';
                                    html += '<th scope="row">' + (i + 1) + '</th>';
                                    html += '<th scope="row">' + (data.data[i].ordinal) + '</th>';
                                    html += '<td>' + (data.data[i].msg) + '</td>';
                                    html += '</tr>';
                                }
                                html += '</tbody>';
                                html += '</table>';
                                fullscreen = true;
                            }
                        }                        
                    }
                    InitDialogCourse({
                        id: 'ajax_importOrganization',
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
                                        var _grid = $("#" + _tree_organization).data("kendoGrid");
                                        _grid.dataSource.read();
                                    },
                                },
                            ]
                        }
                    });
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
function synctopic(orgid) {
    $.ajax({
        url: _RootBase + "Organization/synctopic",
        dataType: "json",
        type: "POST",
        data: {
            orgid: orgid
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"](_localizer.dongbothanhcong, _localizer.thongbao);
                    var treelist = $("#" + _tree_organization).data("kendoGrid");
                    treelist.dataSource.read();
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
function syncdoc(orgid) {
    $.ajax({
        url: _RootBase + "Organization/syncdoc",
        dataType: "json",
        type: "POST",
        data: {
            orgid: orgid
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"](_localizer.dongbosachthanhcong, _localizer.thongbao);
                    var treelist = $("#" + _tree_organization).data("kendoGrid");
                    treelist.dataSource.read();
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
