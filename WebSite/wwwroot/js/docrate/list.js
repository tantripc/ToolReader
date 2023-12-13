var _record = 0;
var list_docrate = 'listdocrate';
var _record = 0;
//Button action
var column_command = [
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_docrate_popup(data.docrateid);
        }
    }
];

//load table topic
loadKendoGrid({
    id: list_docrate,
    url: _RootBase + "DocRate/DocRelate_Get",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
        docid :_docid
    },
    model: {
        fields: {
            title: { field: "title"},
            fullname: { field: "fullname"},
            ratenote: { field: "ratenote"},
            psrate: { field: "psrate"},
            iseffect: { field: "iseffect", type: "bool"}
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
            width: 160,
            filterable: false,
        },
        {
            field: "fullname",
            title: _localizer.hovaten,
            template: '#if(data.fullname!=null){# #:fullname# #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "ratenote",
            title: _localizer.noidungdanhgia,
            template: '#if(data.ratenote!=null){# #:ratenote# #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "psrate",
            title: _localizer.sosao,
            template: '#if(data.psrate!=null){# #:psrate#/5 #}#',
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
    detailInit: detailInit,
    dataBound: function (e) {
        $('.topicid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
    },
    resizable: true
})

//popup xác nhận xóa user
function delete_docrate_popup(id) {
    InitDialogCourse({
        id: 'deletedocrateid',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtindanhgiasebixoa + '</div>'
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
                        deletedocrate(id);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa tài khoản user
function deletedocrate(id) {
    $.ajax({
        url: _RootBase + "DocRate/DocRate_Delete",
        dataType: "json",
        type: "POST",
        data: {
            docrateid: id
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
                    toastr["success"](_localizer.xoadulieudanhgiathanhcong, _localizer.thongbao);
                    $('#deletedocrateid').modal('hide');
                    var gridview = $("#" + list_docrate).data("kendoGrid");
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
<label class="label"><label class="titledetail">`+ _localizer.hovaten + '</label>:&ensp;' + (e.data.fullname ? e.data.fullname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.noidungdanhgia + '</label>:&ensp;' + (e.data.ratenote ? e.data.ratenote : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.sosao + '</label>:&ensp;' + (e.data.psrate ? e.data.psrate : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaydanhgia + '</label>:&ensp;' + (e.data.createddate ? kendo.toString(new Date(e.data.createddate), 'dd/MM/yyyy') : '') + `</label><br>`;
    $(html).appendTo(e.detailCell);
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