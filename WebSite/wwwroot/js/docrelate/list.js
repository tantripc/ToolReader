var _record = 0;
var list_docrelate = 'list_docrelate';
//các nút nhấn
var column_command = [
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_docrelate_popup(data.docrelateid);
        }
    }
];

//Danh sách  sách liên quan
loadKendoGrid({
    id: list_docrelate,
    url: _RootBase + "DocRelate/DocRelate_Get",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
        docid: _docid
    },
    model: {
        fields: {
            title: { field: "title" },
            catgname: { field: "catgname" },
            author: { field: "author" },
            publisher: { field: "publisher" },
            topicname: { field: "topicname" }
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
            title: _localizer.tensachlienquan,
            template: '#if(data.title!=null){# #:title# #}#',
            width: 130,
            filterable: false,
        },
        {
            field: "topicname",
            title: _localizer.danhmucsach,
            width: 130,
            filterable: false,
            template: '#if(data.topicname!=null){# #:topicname ##}#',

        },
        {
            field: "author",
            title: _localizer.tacgia,
            width: 120,
            filterable: false,
            template: '#if(data.author!=null){# #:author# #}#',
        },
        {
            field: "catgname",
            title: _localizer.theloaisach,
            width: 120,
            filterable: false,
            template: '#if(data.catgname!=null){# #:catgname # #}#',
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

    },
    resizable: true
})

//Xóa sách liên quan (popup)
function delete_docrelate_popup(docrelateid) {
    InitDialogCourse({
        id: 'delete_popup',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinsachlienquansebixoa + '</div>'
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
                        delete_docrelate(docrelateid);
                    },
                    isClose: true,
                },
            ]
        }
    });
}

//Xóa sách liên quan (function)
function delete_docrelate(docrelateid) {
    $.ajax({
        url: _RootBase + "DocRelate/DocRelate_Delete",
        dataType: "json",
        type: "POST",
        data: {
            docrelateid: docrelateid
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
                    toastr["success"](_localizer.xoadulieusachlienquanthanhcong, _localizer.thongbao);
                    $('#delete_popup').modal('hide');
                    var gridview = $("#" + list_docrelate).data("kendoGrid");
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

//Di chuyển sách liên quan
function move_docrelate(id, move) {
    $.ajax({
        url: _RootBase + "DocRelate/DocRelate_Move",
        dataType: "json",
        type: "POST",
        data: {
            move: move,
            docrelateid: id
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
                    toastr["success"](_localizer.xoadulieusachlienquanthanhcong, _localizer.thongbao);
                    $('#delete_popup').modal('hide');
                    var gridview = $("#" + list_docrelate).data("kendoGrid");
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

//thông tin từng hàng sách liên quan
function detailInit(e) {
    var html = `
<div class="row">
<div class="col-md-6">
    <label class="label"><label class="titledetail">`+ _localizer.danhmucsach + '</label>:&ensp;' + (e.data.topicname ? e.data.topicname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tensachlienquan + '</label>:&ensp;' + (e.data.author ? e.data.author : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.tacgia + '</label>:&ensp;' + (e.data.author ? e.data.author : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.nhaxuatban + '</label>:&ensp;' + (e.data.publisher ? e.data.publisher : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.namxuatban + '</label>:&ensp;' + (e.data.publishyear ? e.data.publishyear : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.giagoc + '</label>:&ensp;' + ((e.data.originprice ? e.data.originprice : '') + " " + e.data.currency) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.giaban + '</label>:&ensp;' + ((e.data.price ? e.data.price : '') + " " + e.data.currency) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.danhgia + '</label>:&ensp;' + (e.data.rate + '/5' ? e.data.rate + '/5' : ``) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaytao + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.mota + '</label>:&ensp;' + (e.data.abstracttxt ? e.data.abstracttxt : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.xuatbanlanthu + '</label>:&ensp;' + (e.data.publishnum ? e.data.publishnum : '') + `</label>
</div>
<div class="col-md-6">
<label class="label">`+ (e.data.coverfile ? '<img style="width:150px" src=' + read_file + e.data.coverfile + ' />' : '') + `</label><br></div></div>`;
    $(html).appendTo(e.detailCell);
}

