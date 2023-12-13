var _record = 0;
var list_refmail = 'list_refmail';
//Button action từng hàng của mẫu mail
var column_command = [
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdate_refmail(data.mailtemplateid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_refmailtemplate_popup(data.mailtemplateid);
        }
    },{
        name: "view",
        template: '<a title="' + _localizer.xemtruoc + '" role="button" class="k-button k-button-icontext k-grid-view"><i class="k-icon k-i-eye"></i><div class="custom-title">' + _localizer.xemtruoc + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            getdatamail(data.mailtemplateid, data.mailtemplatecontents);
        }
    }
];

//danh sách mẫu mail
loadKendoGrid({
    id: list_refmail,
    url: _RootBase + "RefMailTemplate/Search_RefMailTemplate",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC'
    },
    model: {
        fields: {
            mailtemplatetitle: { field: "mailtemplatetitle" },
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
            field: "mailtemplatetitle",
            title: _localizer.tenmail,
            template: '#if(data.mailtemplatetitle!=null){# #:mailtemplatetitle# #}#',
            width: 300,
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
   /* detailInit: detailInit,*/
    dataBound: function (e) {
        $('.catgid').each(function () {
            if ($(this).attr('data-isonline') == 'true') {
                $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
            }
        });
    },
    resizable: true
})

//Xóa mẫu mail popup (View)
function delete_refmailtemplate_popup(mailtemplateid) {
    InitDialogCourse({
        id: 'id_delete_refmailtemplate',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinmaumailsebixoa + '</div>'
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
                        delete_refmailtemplate(mailtemplateid);
                    },
                    isClose: true,
                },
            ]
        }
    });
}

//Xóa mẫu mail (function)
function delete_refmailtemplate(mailtemplateid) {
    $.ajax({
        url: _RootBase + "RefMailTemplate/Delete_RefMailTemplate",
        dataType: "json",
        type: "POST",
        data: {
            mailtemplateid: mailtemplateid
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
                    toastr["success"](_localizer.xoadulieumaimailthanhcong, _localizer.thongbao);
                    $('#id_delete_refmailtemplate').modal('hide');
                    var gridview = $("#" + list_refmail).data("kendoGrid");
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

