var _record = 0;
var list_doc_read_required = 'list_doc_read_required';
var column_command = [
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_docreadrequired_popup(data.docrequireid);
        }
    },
    {
        name: "updatee",
        template: '<a title="' + _localizer.batbuocdoc + '" role="button" class="k-button k-button-icontext k-grid-updatee"><i class="k-icon k-i-rotate"></i><div class="custom-title">' + _localizer.batbuocdoc + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            update_docreadrequired(data.docrequireid, data.isrequired, data.ugid, data.docid, data.enddate, data.startdate);
        }
    }
];
loadKendoGrid({
    id: list_doc_read_required,
    url: _RootBase + "DocReadRequired/DocReadRequire_Search",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC'
    },
    model: {
        fields: {
            title: { field: "title" },
            fullname: { field: "fullname" },
            ugname: { field: "ugname" },
            author: { field: "author" },
            publisher: { field: "publisher" },
            ishide: { field: "ishide", type: "bool" },
            isblock: { field: "isblock", type: "bool" }
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
        {
            field: "title",
            title: _localizer.tensach,
            template: '#if(data.title!=null){# #:title# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotensach,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "fullname",
            title: _localizer.tennguoidung,
            template: '#if(data.fullname!=null){# #:fullname# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotennguoidung,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "ugname",
            title: _localizer.tennhom,
            template: '#if(data.ugname!=null){# #:ugname# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotennhom,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "isrequired",
            title: _localizer.batbuocdoc,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            width: 120,
            filterable: {
                messages: {
                    info: _localizer.loctheotrangthaidoc,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }, ui: filter
            },
            template: '#if(data.isrequired==false){# <i data-isrequired="false" class=\"iconmoon iconmoon-right d-none data-row-book\" style=\"color:\\#1ED81D\"></i> #}# #if(data.isrequired ==true){# <i data-isrequired="true" class=\"iconmoon iconmoon-right data-row-book\" style=\"color:\\#1ED81D\"></i> #}# #if(data.isrequired==null){#  #}#',

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
        $('.data-row-book').each(function () {
            var isrequired = $(this).attr('data-isrequired');
            if (parseBool(isrequired) == true) {
                var tag_a = $(this).parents('tr').find('.k-command-cell .k-grid-updatee');
                $(tag_a).attr('title', _localizer.khongbatbuoc);
                $(tag_a).find('.custom-title').text(_localizer.khongbatbuoc);
            }
        })
    },
    resizable: true
})

function delete_docreadrequired_popup(id) {
    InitDialogCourse({
        id: 'delete_docreadrequired_id',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinphancongdocsachsebixoa + '</div>'
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
                        deletedoc(id);
                    },
                    isClose: true,
                },
            ]
        },
        callback: function () {
            $("#delete_docreadrequired_id").attr('data-val', id);
        }
    });
}

function update_docreadrequired(id, status, ugid, docid, enddate, startdate) {
    $.ajax({
        url: _RootBase + "DocReadRequired/Docreadrequire_Update",
        dataType: "json",
        type: "POST",
        data: {
            docrequireid: id,
            ugid: ugid,
            docid: docid,
            startdate: startdate,
            enddate: enddate,
            isrequired: status == true ? false : true
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
                    toastr["success"](_localizer.doitrangthaithanhcong, _localizer.thongbao);
                    var gridview = $("#" + list_doc_read_required).data("kendoGrid");
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
//chức năng xóa tài khoản user
function deletedoc(id) {
    $.ajax({
        url: _RootBase + "DocReadRequired/DocReadRequire_Delete",
        dataType: "json",
        type: "POST",
        data: {
            docrequireid: id
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
                    toastr["success"](_localizer.xoadulieuphancongdocsachthanhcong, _localizer.thongbao);
                    $('#delete_docreadrequired_id').modal('hide');
                    var gridview = $("#" + list_doc_read_required).data("kendoGrid");
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
//bảng detail của user
function detailInit(e) {
    var html = `
<label class="label"><label class="titledetail">`+ _localizer.tensach + '</label>:&ensp;' + (e.data.title ? e.data.title : '') + `</label><br>
<label class="label"><label class="titledetail">`+ (e.data.fullname ? _localizer.tennguoidung : _localizer.tennhom) + '</label>:&ensp;' + (e.data.fullname ? e.data.fullname : e.data.ugname) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaybatdau + '</label>:&ensp;' + (e.data.startdate ? kendo.toString(new Date(e.data.startdate), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngayketthuc + '</label>:&ensp;' + (e.data.enddate ? kendo.toString(new Date(e.data.enddate), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.batbuocdoc + '</label>:&ensp;' + (e.data.isrequired == true ? 'Có' : 'Không') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tongsocauhoi + '</label>:&ensp;' + (e.data.numquiz ? e.data.numquiz : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tongsotrang + '</label>:&ensp;' + (e.data.numpage ? e.data.numpage : '') + `</label><br>`;
    $(html).appendTo(e.detailCell);
}




function filter(element) {
    $(element).attr('id', 'filter');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: 'true', name: _localizer.batbuoc,
                },
                {
                    id: 'false', name: _localizer.khongbatbuoc,
                }
            ]

    });
}
function upload_attachfile() {
    $('#import_docreadreadrequired input.attachfile').trigger('click');
}
function import_docreadreadrequired() {
    InitDialogCourse({
        id: 'import_docreadreadrequired',
        fullscreen: false,
        width: 600,
        title: _localizer.phancongdocsachtufile,
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
                        ajax_import_docreadreadrequired('import_docreadreadrequired');
                    },
                    isClose: false,
                },
            ]
        }
    });
    $('#import_docreadreadrequired .sheet_file').attr('id', 'sheet_file');
    $('#import_docreadreadrequired input.attachfile').on('change', function () {
        var options = {
            subFolder: 'FileBook',
            fileType: 'document'
        };
        uploadApi(api_file, $('#import_docreadreadrequired input.attachfile')[0].files[0], function (e) {
            if (e.ReturnCode == 0) {
                $('#import_docreadreadrequired .attachfilename').html(e.PathfileName);
                $('#import_docreadreadrequired .attachfile').attr('data-name', e.PathfileName);
                getWorkSheet('import_docreadreadrequired');
            }
        }, options)
    });
}
function exportDocreadrequired() {
    $.ajax({
        url: _RootBase + "DocReadRequired/ExportFileView",
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'export_DocReadRequired_id',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.xuatdulieuphancongdocsach,
                    body: data,
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
                                    export_DocReadRequired()
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
function export_DocReadRequired() {
    var Type = "";
    var arr = $('#selectedUser').data('kendoListBox').dataItems();
    if (arr.length == 0) toastr["error"](_localizer.banvuilongchonnguoidung, _localizer.thongbao);
    for (var i = 0; i < arr.length; i++) {
        Type += arr[i].doccode+ ",";
    };
    let result = Type.slice(0, Type.lastIndexOf(",")) + "" + Type.slice(Type.lastIndexOf(",") + ",".length);
    location.href = _link_export + '?doccode=' + result;
    $('#export_DocReadRequired_id').modal('hide');
}

function ajax_import_docreadreadrequired(id) {
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
    $.ajax({

        url: _RootBase + "DocReadRequired/Import",
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
                if (data.data != null &&data.data.length > 0) {
                    $('#import_docreadreadrequired').modal('hide');
                    var fullscreen = false;
                    var html = '<div class="alert alert-primary" role="alert">';
                    html += _localizer.phancongdocsachchonguoidung.replace('__numok__', (data.data[0].numok));
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
                                html += '<tr style="background: #fee2e1;">';
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
                                        var _grid = $("#" + list_doc_read_required).data("kendoGrid");
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
            } else {
                toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
            }
        },
        complete: function () {
            remove_watting_popup();
        }
    });
}
