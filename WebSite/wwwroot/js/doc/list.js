var _record = 0;
var List_Doc = 'ListDoc';
var _record = 0;
var column_command = [
    {
        name: "detail",
        template: '<a title="' + _localizer.chitiet + '" role="button" class="k-button k-button-icontext k-grid-detail"><i class="iconmoon iconmoon-GridView"></i><div class="custom-title">' + _localizer.chitiet + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            window.location.href = linkDocAttach.replace('__docid__', data.docid);

        }
    },
    {

        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdatedoc(data.docid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            deletedoc_popup(data.docid);
        }
    },
    {
        name: "add_docinterest",
        template: '<a title="' + _localizer.themvaosachmoihay + '" role="button" class="k-button k-button-icontext k-grid-add-docinterest"><i class="iconmoon iconmoon-animation"></i><div class="custom-title">' + _localizer.themvaosachmoihay + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            add_docinterest(data.docid);
        }
    },
    {
        name: "approved",
        template: '<a title="' + _localizer.doitrangthai + '" role="button" class="k-button k-button-icontext k-grid-approved"><i class="k-icon k-i-rotate"></i><div class="custom-title">' + _localizer.doitrangthai + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            if (data.isblock == true) {
                var status_block = false;
            }
            else {
                var status_block = true;
            }
            UpdateStatus(data.docid, status_block);
        }
    }, {
        name: "deliverbook",
        template: '<a title="' + _localizer.phancongdocsach + '" role="button" class="k-button k-button-icontext k-grid-deliverbook"><i class="iconmoon iconmoon-KhoaDaHoc"></i><div class="custom-title">' + _localizer.phancongdocsach + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delivery_book(data.docid);
        }
    }, {
        name: "view_docreadrequiredindoc",
        template: '<a title="' + _localizer.quanlyphancongdocsach + '" role="button" class="k-button k-button-icontext k-grid-view_docreadrequiredindoc"><i class="iconmoon iconmoon-SachCanDoc"></i><div class="custom-title">' + _localizer.quanlyphancongdocsach + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            window.location.href = linkDocReadRequiredInDoc.replace('__docid__', data.docid);
        }
    }
];
loadKendoGrid({
    id: List_Doc,
    url: _RootBase + "Doc/search_foradmin",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC'
    },
    model: {
        fields: {
            title: { field: "title" },
            catgname: { field: "catgname" },
            author: { field: "author" },
            topicid: { field: "topicid" },
            publisher: { field: "publisher" },
            ishide: { field: "ishide", type: "bool" },
            isblock: { field: "isblock", type: 'boolean' }
        }
    },
    columns: [
        {
            title: _localizer.stt,
            template: "#= ++_record #",
            headerTemplate: '<label title="' + _localizer.sothutu + '" for="check-all">' + _localizer.stt + '</label>',
            width: 50,
            headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
            attributes: { style: "text-align: center;" }
        },
        {
            field: "title",
            title: _localizer.tensach,
            template: '#if(data.title!=null){# <a title="#:title#">#:title#</a> #}#',
            headerTemplate: '<label title="' + _localizer.tensach + '" for="check-all">' + _localizer.tensach + '</label>',
            width: 190,
            filterable: {
                messages: {
                    info: _localizer.loctheotensach,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
            },
        },
        {
            field: "catgname",
            title: _localizer.loaisach,
            headerTemplate: '<label title="' + _localizer.loaisach + '" for="check-all">' + _localizer.loaisach + '</label>',
            width: 170,
            filterable: {
                messages: {
                    info: _localizer.loctheoloaisach,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }
            },
            template: '#: getcategoryname(data.catg_js)#',
            //template: '#if(data.catg_js!=null){# #:catg_js[parseInt((data.catg_js.length-1))].catgname# #}#',
        },
        {
            field: "topicid",
            title: _localizer.danhmuc,
            headerTemplate: '<label title="' + _localizer.danhmuc + '" for="check-all">' + _localizer.danhmuc + '</label>',
            width: 150,
            filterable: {
                messages: {
                    info: _localizer.loctheodanhmuc,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_topic
                
            },
            template: '#if(data.topicname!=null){# <a title="#:topicname#">#:topicname#</a> #}#',

        },
        {
            field: "author",
            title: _localizer.tacgia,
            headerTemplate: '<label title="' + _localizer.tacgia + '" for="check-all">' + _localizer.tacgia + '</label>',
            width: 150,
            filterable: {
                messages: {
                    info: _localizer.loctheotacgia,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }
            },
            template: '#if(data.author!=null){# <a title="#:author#">#:author#</a> #}#',

        },
        
        {
            field: "isblock",
            title: _localizer.hienthi,
            width: 100,
            headerTemplate: '<label title="' + _localizer.hienthi + '" for="check-all">' + _localizer.hienthi + '</label>',
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable: {
                messages: {
                    info: _localizer.loctheotrangthaihoatdong,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                },
                ui: filter_blocked
            },
            template: '#if(data.isblock==true){# <i class=\"iconmoon iconmoon-wrong data-row-book\" style=\"color:\\#d81d1d\"></i> #} else if(data.isblock ==false){# <i class=\"iconmoon iconmoon-right data-row-book\" style=\"color:\\#1ED81D\"></i> #}else if(data.isblock==null){#  #}#',

        },
        {
            command: column_command,
            width: 320
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
            if (IsBlockEditBook == "True") {
                var tag_b = $(this).parents('tr').find('.k-command-cell .k-grid-destroy');
                var tag_a = $(this).parents('tr').find('.k-command-cell .k-grid-addupdate');
                $(tag_b).remove();
                $(tag_a).remove();
                $('.k-grid-add-docinterest').remove();
                $('.add_book_new').remove();
            }
            else {
                $('.k-grid-add-docinterest').remove();
            }
        })
    },
    resizable: true
})

function getcategoryname(data) {
    var name = "";
    if (data && data.length > 0) {
        /*const lastItem = data[data.length - 1]*/
        for (var i = 0; i < data.length; i++) {
            name += data[i].catgname + ", ";
        }
    }
    let result = name.slice(0, name.lastIndexOf(",")) + "" + name.slice(name.lastIndexOf(",") + ",".length);//name.lastIndexOf(",") tìm vị trí cuối cùng của ký tự trong chuỗi,sau đó thay thể ký tự đó bằng ký tự mới tại vị trí đã tìm thấy
    return result;
}
//thêm vào sách hay
function add_docinterest(docid) {

    $.ajax({
        url: _RootBase + "Docinterest/addupdate_docinterests",
        //dataType: "json",
        type: "POST",
        data: {
            docid: docid
        },
        async: true,
        beforeSend: function () {
            $("body").addClass('loading');
        },
        complete: function () {
            $("body").removeClass('loading');
        },
        success: function (data) {
            if (data.data != null && data.data.length > 0) {
                var returncode = data.data[0].returncode;
                var returnmsg = data.data[0].returnmsg;
                if (returncode == 0) {
                    toastr["success"](_localizer.themdvaosachmoihaythanhcong, _localizer.thongbao);
                }
                else {
                    if (returncode == -1 || returnmsg == undefined) {
                        toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                    }
                    else {
                        toastr["error"](returnmsg, _localizer.thongbao);
                    }
                }
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//popup xác nhận xóa user
function deletedoc_popup(id) {
    InitDialogCourse({
        id: 'iddeletebook',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinsachsebixoa + '</div>'
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
                        deletedoc(id, null);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa tài khoản user
function deletedoc(id, delete_anyway) {
    $.ajax({
        url: _RootBase + "Doc/deletedoc",
        dataType: "json",
        type: "POST",
        data: {
            docid: id,
            delete_anyway: delete_anyway != null ? delete_anyway : null
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
                    toastr["success"](_localizer.xoadulieusachthanhcong, _localizer.thongbao);
                    $('#iddeletebook').modal('hide');
                    var gridview = $("#" + List_Doc).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else if (returncode == 9) {
                    InitDialogCourse({
                        id: 'iddeletebook_callback',
                        width: 600,
                        title: _localizer.thongbao,
                        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.sachdangduocgiaohoacdangcobaitap + '</div>'
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
                                        deletedoc(id, true);
                                    },
                                    isClose: true,
                                },
                            ]
                        }
                    });

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
function docrelate_get(id) {
    $.ajax({
        url: _RootBase + "DocRelate/Index",
        dataType: "json",
        type: "POST",
        data: {
            docid: id
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
        },
        complete: function () {
            remove_watting_popup();
        },
        success: function (data) {
            console.log(data)
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//bảng detail của user
function detailInit(e) {
    var html = `
<div class="row">
<div class="col-md-6">
<label class="label"><label class="titledetail">`+ _localizer.danhmuc + '</label>:&ensp;' + (e.data.topicname ? e.data.topicname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tensach + '</label>:&ensp;' + (e.data.title ? e.data.title : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.loaisach + '</label>:&ensp;' + (getcategoryname(e.data.catg_js)) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.nhaxuatban + '</label>:&ensp;' + (e.data.publisher ? e.data.publisher : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.giagoc + '</label>:&ensp;' + ((e.data.originprice ? e.data.originprice + " " + e.data.currency : '')) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.giaban + '</label>:&ensp;' + ((e.data.price ? e.data.price + " " + e.data.currency : '')) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.mota + '</label>:&ensp;' + (e.data.desct ? e.data.desct : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.isbn + '</label>:&ensp;' + (e.data.isbn ? e.data.isbn : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.hienthi + '</label>:&ensp;' + (e.data.isblock == true ? '<i class=\"iconmoon iconmoon-wrong\" style=\"color:\#d81d1d\"></i>' : '<i class=\"iconmoon iconmoon-right\" style=\"color:\#1ED81D\"></i>') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.xuatbanlanthu + '</label>:&ensp;' + (e.data.publishnum ? e.data.publishnum : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaytao + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaychinhsua + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy') : '') + `</label>
</div>
<div class="col-md-6">
<label class="label"><label class="titledetail">`+ (e.data.issync == false ? '<img style="width:150px" src=' + read_file + e.data.coverfile + ' />' : '<img src="' + e.data.syncapi + e.data.coverfile.replace("~/", "/") + '">') + `</label><br>
</div>
</div>`;
    $(html).appendTo(e.detailCell);
}

//chức năng ẩn/hiện, khóa/mở khóa sách
function UpdateStatus(id, status_block) {
    $.ajax({
        url: _RootBase + "Doc/Update_status",
        dataType: "json",
        type: "POST",
        data: {
            docid: id,
            isblock: status_block
        },
        success: function (data) {
            if (data != null) {
                var returncode = data.returncode;
                var notifyjs = data.notifyjs;
                if (returncode == 0) {
                    toastr["success"](_localizer.thaydoitrangthaisachthanhcong, _localizer.thongbao);
                    var gridview = $("#" + List_Doc).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else {
                    if (returncode == -1 || data.returnmsg == undefined) {
                        toastr["error"](_localizer.thaydoitrangthaithatbai, _localizer.thongbao);
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


//lọc theo trạng thái hoạt động
function filter_blocked(element) {
    $(element).attr('id', 'filter_blockedd');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: 'false', name: _localizer.hienthi,
                },
                {
                    id: 'true', name: _localizer.khonghienthi,
                }
            ]

    });

}
//lọc theo danhmuc
function filter_topic(element) {
    $(element).attr('id', 'filter_topic');
    loadKendoComboBox({
        id: "filter_topic",
        placeholder: _localizer.chondanhmuc,
        dataTextField: "topicname",
        dataValueField: "topicid",
        url: _RootBase + "Topic/gettopic",
        data: {
            numofrow: -1,
            orgid: _OrgID
        },
        isrequired: true
    });

}