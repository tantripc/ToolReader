var _record = 0;
var _id_tree_sh = 'listsh';
var _record = 0;
//các nút nhấn
var column_command = [
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            delete_docinterest_popup(data.docitrid);
        }
    }
];
//load table  sách liên quan
loadKendoGrid({
    id: _id_tree_sh,
    url: _RootBase + "Docinterest/gettable",
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
            publisher: { field: "publisher" },
            topicname: { field: "topicname"}
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
            width: 130,
            filterable: false,
        },
        {
            field: "topicname",
            title: _localizer.chude,
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
            title: _localizer.theloai,
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

//popup xác nhận xóa sách hay
function delete_docinterest_popup(id) {
    InitDialogCourse({
        id: 'delete_popup',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinsachmoihaysebixoa + '</div>'
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
                        delete_docinterest(id, true);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa sách hay
function delete_docinterest(id) {
    $.ajax({
        url: _RootBase + "Docinterest/DocInterest_Delete",
        dataType: "json",
        type: "POST",
        data: {
            docitrid: id
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
                    toastr["success"](_localizer.xoadulieusachmoihaythanhcong, _localizer.thongbao);
                    $('#delete_popup').modal('hide');
                    var gridview = $("#" + _id_tree_sh).data("kendoGrid");
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
//Detail sách hay
function detailInit(e) {
    var html = `
<div class="row">
<div class="col-md-6">
<label class="label"><label class="titledetail">`+ _localizer.chude + '</label>:&ensp;' + (e.data.topicname ? e.data.topicname : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.tensach + '</label>:&ensp;' + (e.data.title ? e.data.title : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.tacgia + '</label>:&ensp;' + (e.data.author ? e.data.author : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.nhaxuatban + '</label>:&ensp;' + (e.data.publisher ? e.data.publisher : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.namxuatban + '</label>:&ensp;' + (e.data.publishyear ? e.data.publishyear : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.giagoc + '</label>:&ensp;' + ((e.data.originprice ? e.data.originprice : '') + " " + (e.data.originprice ? e.data.currency : '')) + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.giaban + '</label>:&ensp;' + ((e.data.price ? e.data.price : '') + " " + (e.data.price ? e.data.currency : '')) + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.ngaytao + '</label>:&ensp;' + (e.data.createddate ? kendo.toString(new Date(e.data.createddate), 'dd/MM/yyyy') : '') + `</label><br>

<label class="label"><label class="titledetail">`+ _localizer.xuatbanlanthu + '</label>:&ensp;' + (e.data.publishnum ? e.data.publishnum : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.mota + '</label>:&ensp;' + (e.data.abstracttxt ? e.data.abstracttxt : '') + `</label><br></div>
<div class="col-md-6">
<label class="label">`+ (e.data.coverfile ? '<img style="width:150px" src=' + read_file + e.data.coverfile + ' />' : '') + `</label><br></div>
</div>
`;
    $(html).appendTo(e.detailCell);
}

