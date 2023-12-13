var tree_topic = 'listtopic';




loadKendoTreeList({
    id: tree_topic,
    url: _RootBase + "Topic/gettopic",
    data: {
        numofrow: -1,
        orgid: _orgid,
        posstart: 0,
        recursive: true
    },
    model: {
        id: "id",
        parentId: "parentId",
        fields: {
            parentId: { field: "ptopicid", nullable: true, type: "number" },
            id: { field: "topicid", type: "number" },
            topicname: { field: "topicname" },
            iseffect: { field: "iseffect", type: "bool" }
        },
        expanded: true
    },
    //height: height,
    columns: [
        {
            field: "topicname",
            title: _localizer.tendanhmuc,
            width: 200,
            filterable: {
                messages: {
                    info: _localizer.loctendanhmuc,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },

        },
        {
            field: "issync",
            title: _localizer.tendanhmuc,
            hidden: true,
            width: 200,
            filterable: false,
            template: '#if(data.issync!=null){# <a class="issync_#:issync#" title="#:issync#">#:issync#</a> #}#',

        },
        {
            field: "iseffect",
            title: _localizer.hienthi,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            width: 80,
            filterable: false,
            template: "#if(data.iseffect==true){#<i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i>#}# #if(data.iseffect==false){##}#",
        },
        {
            command: [
                {
                    name: "addchild",
                    text: " ",
                    imageClass: "k-i-add",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        addupdate_topic(data.id, data.parentId, "themcon", _orgid);
                    }
                },
                {
                    name: "addupdate",
                    text: " ",
                    imageClass: "k-i-edit",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        addupdate_topic(data.id, data.parentId, "capnhat", _orgid);
                    }
                },
                {
                    name: "delete",
                    text: ' ',
                    imageClass: "k-i-trash",
                    click: function (e) {
                        var tr = $(e.target).closest("tr");
                        var data = this.dataItem(tr);
                        deletetopic_popup(data.id);
                    }
                },
                //{
                //    name: "View",
                //    text: ' ',
                //    imageClass: "k-i-detail",
                //    click: function (e) {
                //        var tr = $(e.target).closest("tr");
                //        var data = this.dataItem(tr);
                //        deletetopic_popup(data.id);
                //    }
                //},
            ],
            width: 200
        }
    ],
    isCustomtool: true,
    editable: 'popup',
    dataBound: function (e) {
        //remove toàn bộ để init lại
        $('#' + tree_topic + ' .k-command-cell button .custom-title').remove();
        //
        $('#' + tree_topic + ' .k-command-cell button[data-command="addupdate"]').attr('title', _localizer.capnhat);
        $('#' + tree_topic + ' .k-command-cell button[data-command="addupdate"]').append('<div class="custom-title">' + _localizer.capnhat + '</div>');
        //
        $('.issync_true').each(function (e) {
            var tag_b = $(this).parents('tr').find('.k-command-cell button[data-command="delete"]');
            var tag_a = $(this).parents('tr').find('.k-command-cell button[data-command="addchild"]');
            $(tag_b).remove();
            $(tag_a).remove();
        })
        $('#' + tree_topic + ' .k-command-cell button[data-command="delete"]').attr('title', _localizer.xoa);
        $('#' + tree_topic + ' .k-command-cell button[data-command="delete"]').append('<div class="custom-title">' + _localizer.xoa + '</div>');
        //
        $('#' + tree_topic + ' .k-command-cell button[data-command="addchild"]').attr('title', _localizer.themdanhmuccon);
        $('#' + tree_topic + ' .k-command-cell button[data-command="addchild"]').append('<div class="custom-title">' + _localizer.themdanhmuccon + '</div>');

    }
});
//popup xác nhận xóa user
function deletetopic_popup(id) {
    InitDialogCourse({
        id: 'deletetopic',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtindanhmucsebixoa + '</div>'
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
                        deletetopic(id);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa tài khoản user
function deletetopic(id) {
    $.ajax({
        url: _RootBase + "Topic/deletetopic",
        dataType: "json",
        type: "POST",
        data: {
            topicid: id,
            numofrow: -1,
            posstart: 0
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
                    toastr["success"](_localizer.xoadulieudanhmucthanhcong, _localizer.thongbao);
                    $('#deletetopic').modal('hide');
                    var gridview = $('#' + tree_topic).data("kendoTreeList");
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


