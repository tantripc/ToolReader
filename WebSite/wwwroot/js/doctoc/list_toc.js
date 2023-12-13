var list_toc = 'listtoc';

//danh sách dạng cây của mục lục sách
function loadgriddoctoc(docattachid) {
    loadKendoTreeList({
        id: list_toc,
        url: _RootBase + "DocToc/DocToc_Get",
        data: {
            numofrow: -1,
            docattachid: docattachid
        },
        model: {
            id: "id",
            parentId: "parentId",
            fields: {
                parentId: { field: "pdoctocid", nullable: true, type: "number" },
                id: { field: "doctocid", type: "number" },
                title: { field: "title" },
                act: { field: "act" },
                gotoref: { field: "gotoref" }
            },
            expanded: true
        },

        //height: height,
        columns: [
            {
                field: "title",
                title: _localizer.tenmucluc,
                width: 80,
                filterable: false,
            },
            {
                field: "act",
                title: _localizer.loai,
                headerAttributes: { style: "text-align: center;" },
                attributes: { style: "text-align: center;" },
                width: 80,
                template: '#if(data.act=="p"){# Trang #}# #if(data.act =="l"){# Đường dẫn #}# #if(data.act!=null){#  #}#',
                filterable: false,
            },
            {
                field: "gotoref",
                title: _localizer.ditoi,
                headerAttributes: { style: "text-align: center;" },
                attributes: { style: "text-align: center;" },
                template: '#if(data.act=="p"){# #:gotoref# #}# #if(data.act =="l"){# <a class="linkgotoref" title="' + '#:data.gotoref#' +'" target="_blank" href="' + '#:data.gotoref#' +'">#:data.gotoref#</a> #}# #if(data.act!=null){#  #}#',
                width: 80,
                filterable: false,
            },
            {
                command: [
                    {
                        name: "moveup",
                        text: ' ',
                        imageClass: "k-i-arrow-up",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            move_doctoc(data.id, "moveup");
                        }
                    },
                    {
                        name: "movedown",
                        text: ' ',
                        imageClass: "k-i-arrow-down",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            move_doctoc(data.id, "movedown");
                        }
                    },
                    {
                        name: "add",
                        text: ' ',
                        imageClass: "k-i-plus",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            Addupdate_doctoc(null, docattachid, data.id);
                        }
                    },
                    {
                        name: "addupdate",
                        text: " ",
                        imageClass: "k-i-edit",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            Addupdate_doctoc(data.id, docattachid, data.parentId);
                        }
                    },
                    {
                        name: "delete",
                        text: ' ',
                        imageClass: "k-i-trash",
                        click: function (e) {
                            var tr = $(e.target).closest("tr");
                            var data = this.dataItem(tr);
                            delete_doctoc_popup(data.id);
                        }
                    }
                ],
                width: 200
            }
        ],
        isCustomtool: true,
        editable: 'popup',
        dataBound: function (e) {
            $('#' + list_toc).css('height', 'calc(100% - 2px)');
            $('#' + list_toc + ' .k-grid-content').css('height', 'calc(100% - 76px)');
            //remove toàn bộ để init lại
            $('#' + list_toc + ' .k-command-cell button .custom-title').remove();
            $('#' + list_toc + ' .k-command-cell button[data-command="moveup"]').attr('title', _localizer.dichuyenlen);
            //
            $('#' + list_toc + ' .k-command-cell button[data-command="moveup"]').append('<div class="custom-title">' + _localizer.dichuyenlen + '</div>');

            $('#' + list_toc + ' .k-command-cell button[data-command="movedown"]').attr('title', _localizer.dichuyenxuong);
            //
            $('#' + list_toc + ' .k-command-cell button[data-command="movedown"]').append('<div class="custom-title">' + _localizer.dichuyenxuong + '</div>');
            if (editaddupdate_attach != "False") {
                $('button[data-command="addupdate"]').remove();
                $('button[data-command="add"]').remove();
                $('button[data-command="delete"]').remove();
            }
            else {
                $('#' + list_toc + ' .k-command-cell button[data-command="add"]').attr('title', _localizer.themmuccon);
                //
                $('#' + list_toc + ' .k-command-cell button[data-command="add"]').append('<div class="custom-title">' + _localizer.themmuccon + '</div>');

                $('#' + list_toc + ' .k-command-cell button[data-command="addupdate"]').attr('title', _localizer.chinhsua);
                //
                $('#' + list_toc + ' .k-command-cell button[data-command="addupdate"]').append('<div class="custom-title">' + _localizer.chinhsua + '</div>');
                $('#' + list_toc + ' .k-command-cell button[data-command="delete"]').attr('title', _localizer.xoa);
                $('#' + list_toc + ' .k-command-cell button[data-command="delete"]').append('<div class="custom-title">' + _localizer.xoa + '</div>');
            }
        }
    });
}

//Xóa mục lục sách (View)
function delete_doctoc_popup(id) {
    InitDialogCourse({
        id: 'popup_delete',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinmuclucsebixoa + '</div>'
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
                        delete_doctoc(id);
                    },
                    isClose: true,
                },
            ]
        }
    });
}

//Xóa mục lục sách (function)
function delete_doctoc(id) {
    $.ajax({
        url: _RootBase + "DocToc/DocToc_Delete",
        dataType: "json",
        type: "POST",
        data: {
            doctocid: id
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
                    toastr["success"](_localizer.xoadulieumuclucthanhcong, _localizer.thongbao);
                    $('#popup_delete').modal('hide');
                    var treelist = $("#" + list_toc).data("kendoTreeList");
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

//di chuyển hàng trong mục lục sách
function move_doctoc(id, move) {
    $.ajax({
        url: _RootBase + "DocToc/DocToc_Move",
        dataType: "json",
        type: "POST",
        data: {
            doctocid: id,
            move: move
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
                    if (move == "moveup") {
                        toastr["success"](_localizer.dichuyenlenthanhcong, _localizer.thongbao);
                    }
                    else {
                        toastr["success"](_localizer.dichuyenxuongthanhcong, _localizer.thongbao);
                    }
                    var gridview = $('#' + list_toc).data("kendoTreeList");
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