var _record = 0;
var list_category = 'listcategory';
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
            addupdatecategory(data.catgid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            deletecategory_popup(data.catgid);
        }
    }
];

//load table topic
loadKendoGrid({
    id: list_category,
    url: _RootBase + "Category/getcategory",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC'
    },
    model: {
        fields: {
            catgname: { field: "catgname" },
            iseffect: { field: "iseffect", type: "bool" }
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
            field: "catgname",
            title: _localizer.tentheloai,
            template: '#if(data.catgname!=null){# #:catgname# #}#',
            width: 130,
            filterable: {
                messages: {
                    info: _localizer.loctheotentheloai,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }
            },
        },
        {
            field: "iseffect",
            title: _localizer.hienthi,
            width: 130,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable:false,
            template: "#if(data.iseffect==true){#<i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i>#}# #if(data.iseffect==false){##}#",
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
        $('.catgid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
    },
    resizable: true
})

//popup xác nhận xóa thể loại
function deletecategory_popup(id) {
    InitDialogCourse({
        id: 'iddeletecategory',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtintheloaisebixoa + '</div>'
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
                        deletecategory(id, true);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa thể loại
function deletecategory(id) {
    $.ajax({
        url: _RootBase + "Category/deletecategory",
        dataType: "json",
        type: "POST",
        data: {
            catgid: id
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
                    toastr["success"](_localizer.xoadulieutheloaithanhcong, _localizer.thongbao);
                    $('#iddeletecategory').modal('hide');
                    var gridview = $("#" + list_category).data("kendoGrid");
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



