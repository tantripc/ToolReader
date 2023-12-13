var _record = 0;
var list_docattach = 'listdocattach';
var urlreadfile = url_readfile;
var _record = 0;
//Button action
var column_command = [
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdate_docattach(_docid, data.docattachid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_docattach_popup(data.docattachid);
        },
    },
    {
        name: "update_isdefault",
        template: '<a title="' + _localizer.datlammacdinh + '" role="button" class="k-button k-button-icontext k-grid-update_isdefault"><i class="k-icon k-i-check"></i><div class="custom-title">' + _localizer.datlammacdinh + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            update_isdefault(data.docattachid, data.isdefault);
        }
    },
    {
        name: "doctoc",
        template: '<a title="' + _localizer.mucluc + '" role="button" class="k-button k-button-icontext k-grid-doctoc"><i class="iconmoon iconmoon-GridView"></i><div class="custom-title">' + _localizer.mucluc + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdate_doctoc(data.docattachid);
        }
    },
];

//load table topic
loadKendoGrid({
    id: list_docattach,
    url: _RootBase + "DocAttach/DocAttach_Get",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
        docid :_docid
    },
    model: {
        fields: {
            attachfile: { field: "attachfile"},
            docsize: { field: "docsize"},
            isdefault: { field: "isdefault", type: "bool"}
        }
    },
    columns: [
        {
            title: _localizer.stt,
            template: "<span class='data-row-bookattach'>#= ++_record #</span>",
            width: 50,
            headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
            attributes: { style: "text-align: center;" }
            
        },
        {
            field: "name_file",
            title: _localizer.duongdanfilesach,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            template: '#if(data.name_file!=null && data.attachlink == null){#<a title="' + urlreadfile + '#:data.attachfile#' + '" target="_blank" href="' + urlreadfile + '#:data.attachfile#' + '"><img style="width:15%;" src="' + _RootBase + 'images/file_type/#:typefile(data.name_file)#.svg"/></a> #}# #if(data.attachlink!=null){#<a title="#:data.attachlink#" target="_blank" href="#:data.attachlink#"><img style="width:15%;" src="' + _RootBase +'images/file_type/#:typefile(data.name_file)#.svg"/></a> #}#',
            width: 160,
            filterable: false,
        },
        {
            field: "docsize",
            title: _localizer.dungluongfilesach,
            template: '#if(data.docsize!=null){# #:(docsize/1024).toFixed(2)# Kb #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "isdefault",
            title: _localizer.filesachmacdinh,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            template: "#if(data.isdefault == true){#<i class=\"iconmoon iconmoon-right \" style=\"color:\\#1ED81D\"></i>#}# #if(data.isdefault==false){##}#",
            width: 130,
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
    
    dataBound: function (e) {
        $('.topicid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
        $('.data-row-bookattach').each(function () {
            //if (IsBlockEditBook == "True") {
            //    var tag_b = $(this).parents('tr').find('.k-command-cell .k-grid-destroy');
            //    var tag_a = $(this).parents('tr').find('.k-command-cell .k-grid-addupdate');
            //    $(tag_b).remove();
            //    $(tag_a).remove();
            //    $('.add_toc_new').remove();

            //}
            if (_role == 1301) {
                $('.k-command-cell').remove();
            }
        })
    },
    resizable: true
})
function typefile(typename) {
    switch (typename) {
        case "mp3": typename = "audio"; break;
        case "azw3": typename = "azw3"; break;
        case "Embed": typename = "Embed"; break;
        case "ePub": typename = "ePub"; break;
        case "sureBoard": typename = "sureBoard"; break;
        case "video": typename = "video"; break;
        case "PDF": typename = "PDF"; break;
        case "AZW": typename = "AZW"; break;
        case "EPUB": typename = "EPUB"; break;
        case "MOBI": typename = "MOBI"; break;
        case "PPT": typename = "PPT"; break;
        case "PPT": typename = "PPT"; break;
        case "WORD": typename = "WORD"; break;
        case null: typename = null; break;
    }
    return typename;
}
//function copyToClipboard(elementId) {

//    // Create a "hidden" input
//    var aux = document.createElement("input");

//    // Assign it the value of the specified element
//    aux.setAttribute("value", elementId);

//    // Append it to the body
//    document.body.appendChild(aux);

//    // Highlight its content
//    aux.select();

//    // Copy the highlighted text
//    document.execCommand("copy");

//    // Remove it from the body
//    document.body.removeChild(aux);
//    toastr["success"](_localizer.saochepduongdanthanhcong, _localizer.thongbao);
//}
//popup xác nhận xóa file
function delete_docattach_popup(id) {
    InitDialogCourse({
        id: 'deletedocattach',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinfilesachsebixoa + '</div>'
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
                        deletedocattach(id);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa tài khoản user
function deletedocattach(id) {
    $.ajax({
        url: _RootBase + "DocAttach/DocAttach_Delete",
        dataType: "json",
        type: "POST",
        data: {
            docattachid: id
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
                    toastr["success"](_localizer.xoadulieufilesachthanhcong, _localizer.thongbao);
                    $('#deletedocattach').modal('hide');
                    var gridview = $("#" + list_docattach).data("kendoGrid");
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

function update_isdefault(id,status) {
    $.ajax({
        url: _RootBase + "DocAttach/DocAttach_update_status",
        dataType: "json",
        type: "POST",
        data: {
            docattachid: id,
            isdefault: true
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    toastr["success"](_localizer.datfilesachmacdinhthanhcong, _localizer.thongbao);
                    var gridview = $("#" + list_docattach).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else {
                    if (data.returnmsg == "") {
                        toastr["error"](_localizer.datfilesachmacdinhthatbai, _localizer.thongbao);
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

//lọc theo trạng thái kích hoạt
function filter_iseffect(element) {
    $(element).attr('id', 'filter_iseffect');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: true, name: "Có",
                },
                {
                    id: false, name: "Không",
                }
            ]

    });
}