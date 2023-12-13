var _record = 0;
var list_copyright = 'listcopyright';
var _record = 0;
var column_command = [
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdate_copyright(data.cprid, data.cprgrouptype,data.cpruserid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            deletedoc_popup(data.cprid);
        }
    }
];
loadKendoGrid({
    id: list_copyright,
    url: _RootBase + "CopyRight/Search",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC'
    },
    model: {
        fields: {
            cprname: { field: "cprname" },
            cprgrouptype: { field: "cprgrouptype" },
            hide: { field: "hide", type: "bool" }
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
            field: "cprname",
            title: _localizer.tentacquyen,
            template: '#if(data.cprname!=null){# #:cprname# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotentacquyen,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "cprgrouptype",
            title: _localizer.nhomtacquyen,
            width: 120,
            filterable: false,
            template: '#if(data.cprgrouptype==1){# Công ty phát hành & NXB #}# #if(data.cprgrouptype ==2){# Cá nhân #}# #if(data.cprgrouptype == null){#  #}# #if(data.cprgrouptype==3){# Báo và tạp chí #}#',

        },
        {
            field: "hide",
            title: _localizer.hienthi,
            width: 150,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable: {
                messages: {
                    info: _localizer.loctheotrangthai,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_hide
            },
            template: '#if(data.hide==true){#  #}# #if(data.hide ==false){# <i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i> #}# #if(data.hide!=null){#  #}#',

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
        $('.docid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
    },
    resizable: true
})

//thêm vào sách hay

//popup xác nhận xóa user
function deletedoc_popup(id) {
    InitDialogCourse({
        id: 'id_delete_copyright',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtintacquyensebixoa + '</div>'
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
        }
    });
}
//chức năng xóa tài khoản user
function deletedoc(id) {
    $.ajax({
        url: _RootBase + "CopyRight/CopyRight_Delete",
        dataType: "json",
        type: "POST",
        data: {
            cprid: id
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
                    toastr["success"](_localizer.xoadulieutacquyenthanhcong, _localizer.thongbao);
                    $('#id_delete_copyright').modal('hide');
                    var gridview = $("#" + list_copyright).data("kendoGrid");
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
<label class="label"><label class="titledetail">`+ _localizer.tennhomtacquyen + '</label>:&ensp;' + (e.data.cprgrouptype == 1 ? "Công ty phát hành & NXB" : e.data.cprgrouptype == 2 ? "Cá nhân" : e.data.cprgrouptype == 2 ? "Báo và tạp chí" : '') +`</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tennguoiquanlytacquyen + '</label>:&ensp;' + (e.data.username ? e.data.username : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tentacquyen + '</label>:&ensp;' + (e.data.cprname ? e.data.cprname : '') +`</label><br>
<label class="label"><label class="titledetail">`+ _localizer.email + '</label>:&ensp;' + (e.data.email ? e.data.email : '') +`</label><br>
<label class="label"><label class="titledetail">`+ _localizer.diachi + '</label>:&ensp;' + (e.data.address ? e.data.address : '') +`</label><br>
<label class="label"><label class="titledetail">`+ _localizer.sodienthoai + '</label>:&ensp;' + (e.data.phone ? e.data.phone : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.hienthi + '</label>:&ensp;' + (e.data.hide == true ? '<i class=\"iconmoon iconmoon-wrong\" style=\"color:\#d81d1d !important\"></i>' : '<i class=\"iconmoon iconmoon-right\" style=\"color:\#1ED81D !important\"></i>') +`</label><br>

<label class="label"><label class="titledetail">`+ _localizer.ngaytao + '</label>:&ensp;' + (e.data.createddate ? kendo.toString(new Date(e.data.createddate), 'dd/MM/yyyy') : '') +`</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaychinhsua + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy') : '') +`</label>`;
    $(html).appendTo(e.detailCell);
}
//lọc theo trạng thái hiener thij
function filter_hide(element) {
    $(element).attr('id', 'filter_blocked');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: true, name: _localizer.khonghienthi,
                },
                {
                    id: false, name: _localizer.hienthi,
                }
            ]

    });
}