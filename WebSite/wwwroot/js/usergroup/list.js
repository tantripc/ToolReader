var list_usergroup = 'listusergroup';
var _record = 0;
//button action cho từng hàng của nhóm người dùng
var column_command = [
    {
        name: "view",
        template: '<a title="' + _localizer.xemdanhsachnguoidung + '" role="button" class="k-button k-button-icontext k-grid-view"><i class="iconmoon iconmoon-GridView"></i><div class="custom-title">' + _localizer.xemdanhsachnguoidung + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            var link = htmlUnescape(link_usergroup_member.replace('__ugid__', data.ugid).replace('__ugname__', data.ugname).replace('__orgid__', data.orgid));
            window.location.href = link; //di chuyển vào danh sách người dùng của nhóm người dùng
        }
    },
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdate_usergroup(data.ugid, data.orgid);//gọi hàm chỉnh sửa nhóm người dùng (popup)
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_usergroup_popup(data.ugid);//gọi hàm xóa nhóm người dùng (popup)
        }
    }
];

//Danh sách nhóm người dùng
loadKendoGrid({
    id: list_usergroup,
    url: _RootBase + "UserGroup/UserGroup_Search",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
    },
    model: {
        fields: {
            ugname: { field: "ugname" },
            numuser: { field: "numuser" },
            orgname: { field: "orgname" },
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
            field: "ugname",
            title: _localizer.tennhom,
            template: '#if(data.ugname!=null){# #:ugname# #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "orgname",
            title: _localizer.tenphongban,
            template: '#if(data.orgname!=null){# #:orgname# #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "numuser",
            title: _localizer.songuoidung,
            width: 130,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable: false,
            template: '<div class="d-none typegroupuser" data-value="#:isbuiltin#"></div>#if(data.numuser!=null){# #:numuser# #}#',
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
        $('.typegroupuser').each(function (e) {
            if ($(this).attr('data-value') == 'true') {
                $(this).parents('tr').first().find('.k-button-icontext.k-grid-destroy').addClass('d-none')
            }
        });
    },
    resizable: true
})

//Xóa nhóm người dùng (popup)
function delete_usergroup_popup(id) {
    InitDialogCourse({
        id: 'delete_usergroup_id',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinnhomtaikhoansebixoa + '</div>'
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
                        delete_usergroup(id, true);
                    },
                    isClose: true,
                },
            ]
        }
    });
}

//Xóa nhóm người dùng (View)
function delete_usergroup(id) {
    $.ajax({
        url: _RootBase + "UserGroup/UserGroup_Delete",
        dataType: "json",
        type: "POST",
        data: {
            ugid: id
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
                    toastr["success"](_localizer.xoadulieunhomtaikhoanthanhcong, _localizer.thongbao);
                    $('#delete_usergroup_id').modal('hide');
                    var gridview = $("#" + list_usergroup).data("kendoGrid");
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

//thông tin chi tiết của từng hàng nhóm người dùng
function detailInit(e) {
    var html = `
<label class="label"><label class="titledetail">`+ _localizer.tennhom + '</label>:&ensp;' + (e.data.ugname ? e.data.ugname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tenphongban + '</label>:&ensp;' + (e.data.orgname ? e.data.orgname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.songuoidung + '</label>:&ensp;' + (e.data.numuser ? e.data.numuser : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaytaonhom + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy hh:mm:ss') : '') + `</label><br>
<label class="label"><label class="titledetail typegroupuser" data-value="`+ e.data.isbuiltin +`">`+ _localizer.loainhom + '</label>:&ensp;' + (e.data.isbuiltin == true ? _localizer.nhomcuahethong : _localizer.nhomcuataikhoan) + `</label><br>`;
    $(html).appendTo(e.detailCell);
}

