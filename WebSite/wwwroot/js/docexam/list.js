var List_Exam = 'ListExam';
var ListResult = 'ListResult';
var _record = 10;
var _recordquiz = 10;


//Button action
var column_command = [
    {
        name: "Detail",
        template: '<a title="' + _localizer.xemdemau + '" role="button" class="k-button k-button-icontext k-grid-Detail"><i class="k-icon k-i-form-element"></i><div class="custom-title">' + _localizer.xemdemau + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            viewDetail(data.docquizid, data.docid);
        }
    },
    {
        name: "addupdate",
        template: '<a title="' + _localizer.capnhat + '" role="button" class="k-button k-button-icontext k-grid-addupdate"><i class="k-icon k-i-edit"></i><div class="custom-title">' + _localizer.capnhat + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            addupdatedocexam(data.docquizid, data.docid);
        }
    },
    {
        name: "destroy",
        template: '<a title="' + _localizer.xoa + '" role="button" class="k-button k-button-icontext k-grid-destroy"><i class="k-icon k-i-trash"></i><div class="custom-title">' + _localizer.xoa + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            deletedocexam_popup(data.docquizid);
        }
    },
    {
        name: "Result",
        template: '<a title="' + _localizer.xemketqua + '" role="button" class="k-button k-button-icontext k-grid-Result"><i class="iconmoon iconmoon-KiemTraDanhGia"></i><div class="custom-title">' + _localizer.xemketqua + '</div></a>',
        click: function (e) {
            e.preventDefault();
            var tr = $(e.target).closest("tr");
            var data = this.dataItem(tr);
            viewresult(data.docquizid);
        }
    }
];
loadKendoGrid({
    id: List_Exam,
    url: _RootBase + "DocExam/Search",
    pageSize: 20,
    data: {
        sortfield: 1,//18
        sorttype: 'ASC',
        docid: _docid
    },
    model: {
        fields: {
            title: { field: "title" },
            required_time_minute: { field: "required_time_minute" },
            iseffect: { field: "iseffect", type: "bool" },

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
            title: _localizer.tenbaikiemtra,
            template: '#if(data.title!=null){# #:title# #}#',
            width: 130,
            filterable: false
        },
        {
            field: "required_time_minute",
            title: _localizer.thoigian,
            width: 120,
            filterable: false,
            template: '#if(data.required_time_minute!=null){# #:required_time_minute# ' + _localizer.phut.toLowerCase() + ' #}#',

        },
        {
            field: "iseffect",
            title: _localizer.hienthi,
            width: 150,
            headerAttributes: { style: "text-align: center;" },
            attributes: { style: "text-align: center;" },
            filterable: {
                messages: {
                    info: _localizer.loctheohienthi,
                    filter: _localizer.apdung,
                    clear: _localizer.xoa
                }, ui: filter_iseffect
            },
            template: '#if(data.iseffect==false){#  #}# #if(data.iseffect ==true){# <i class=\"iconmoon iconmoon-right\" style=\"color:\\#1ED81D\"></i> #}# #if(data.iseffect!=null){#  #}#',

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
//popup xác nhận xóa bài kiểm tra
function deletedocexam_popup(id) {
    InitDialogCourse({
        id: 'delete_popup',
        width: 600,
        title: _localizer.thongbao,
        body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.thongtinbaikiemtrasebixoa + '</div>'
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
                        deletedocexam(id, true);
                    },
                    isClose: true,
                },
            ]
        }
    });
}
//chức năng xóa bài kiểm tra
function deletedocexam(id) {
    $.ajax({
        url: _RootBase + "DocExam/DocExam_delete",
        dataType: "json",
        type: "POST",
        data: {
            docquizid: id
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
                    toastr["success"](_localizer.xoadulieubaikiemtrathanhcong, _localizer.thongbao);
                    $('#delete_popup').modal('hide');
                    var gridview = $("#" + List_Exam).data("kendoGrid");
                    gridview.dataSource.read();
                }
                else {
                    if (returncode == -1) {
                        toastr["error"](_localizer.xoadulieubaikiemtrathatbai, _localizer.thongbao);
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


//bảng detail của bài kiểm tra
function detailInit(e) {
    var html = `
<label class="label"><label class="titledetail">`+ _localizer.tenbaikiemtra + '</label>:&ensp;' + (e.data.title ? e.data.title : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.nguoitao + '</label>:&ensp;' + (e.data.createdby_fullname ? e.data.createdby_fullname : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.socauhoi + '</label>:&ensp;' + (e.data.total_question ? e.data.total_question : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.thangdiem + '</label>:&ensp;' + (e.data.total_point ? e.data.total_point : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.diemdat + '</label>:&ensp;' + (e.data.scorepass ? e.data.scorepass : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaytao + '</label>:&ensp;' + (e.data.createddate ? kendo.toString(new Date(e.data.createddate), 'dd/MM/yyyy') : '') + `</label><br>
<label class="label"><label class="titledetail">`+ _localizer.ngaychinhsua + '</label>:&ensp;' + (e.data.modifieddate ? kendo.toString(new Date(e.data.modifieddate), 'dd/MM/yyyy') : '') + `</label>`;
    $(html).appendTo(e.detailCell);
}

//lọc theo trạng thái hiener thij
function filter_iseffect(element) {
    $(element).attr('id', 'filter_blocked');
    loadKendoDropDownList({
        id: $(element).attr('id'),
        dataTextField: "name",
        dataValueField: "id",
        dataSource:
            [
                {
                    id: false, name: "Tắt",
                },
                {
                    id: true, name: "Bật",
                }
            ]

    });
}
function viewDetail(docquizid, docid) {
    $.ajax({
        url: _RootBase + "DocExam/Detail",
        type: "GET",
        data: {
            docid: docid,
            docquizid: docquizid
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_detail',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.xembaikiemtramau,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            }
                        ]
                    },
                    callback: function () {
                        MathLive.renderMathInElement(
                            document.getElementById('form_detail'), {
                            ignoreClass: 'instruction|source',
                            TeX: {
                                delimiters: {
                                    inline: [['$$', '$$'], ['\\(', '\\)']],
                                    display: [['$$', '$$'], ['\\(', '\\)']],
                                }
                            },
                            renderAccessibleContent: 'mathml speakable-text'
                        }
                        );
                    }
                });
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function load_popup_result_exam(id) {
    InitDialogCourse({
        title: _localizer.chitietketqualambaikiemtra,
        id: 'popup_result_exam',
        fullscreen: true,
        width: $(window).width() * 0.9,
        body: '<iframe style="width:100%;height:100%;border: none;" src=' + _urlResultExam.replace('__id__', id) + '></iframe>',
        //callback: function () {
        //    $('#popup_result_exam .modal-header').addClass('d-none');
        //}
    });
}
//cập nhật và thêm mới sách
function viewresult(docquizid) {
    InitDialogCourse({
        id: 'form_result',
        fullscreen: true,
        width: $(window).width() * 0.9,
        title: _localizer.ketquabaikiemtra,
        body: '<div id="ListResult"></div>',
        callback: function () {
            loadgridresult(docquizid);
        },
        footer: {
            button: [
                {
                    text: _localizer.dong,
                    isClose: true,
                    style: 'background-color:#B7BDD3;',
                }, {
                    text: _localizer.xuatdulieu,
                    style: 'background-color:#5C77D0;',
                    click: function () {
                        export_excel_result(docquizid)
                    },
                    isClose: false,
                }
            ]
        },
    });
}
function loadgridresult(docquizid) {
    loadKendoGrid({
        id: ListResult,
        url: _RootBase + "DocExam/docquiz_search_user",
        pageSize: 20,
        data: {
            sortfield: 1,//18
            sorttype: 'ASC',
            docquizid: docquizid
        },
        model: {
            fields: {
                fullname: { field: "fullname" },
                required_time_minute: { field: "required_time_minute" },
                total_quiz: { field: "total_quiz" },
                iseffect: { field: "iseffect", type: "bool" },

            }
        },
        columns: [
            {
                title: _localizer.stt,
                template: "#= ++_recordquiz #",
                width: 50,
                headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
                attributes: { style: "text-align: center;" }
            },
            {
                //template: $("#photo-template").html(),
                field: "fullname",
                title: _localizer.tentaikhoan,
                template: '#if(data.fullname!=null){# #:fullname# #}#',
                width: 130,
                filterable: false
            },
            //{
            //    field: "title",
            //    title: _localizer.tenbaikiemtra,
            //    template: '#if(data.title!=null){# #:title# #}#',
            //    width: 130,
            //    filterable: false
            //},
            {
                field: "total_quiz",
                headerAttributes: { style: "text-align: center;padding-left:.6em !important" },
                attributes: { style: "text-align: center;" },
                title: _localizer.solanthi,
                template: '#if(data.total_quiz!=null){# #:total_quiz# #}#',
                width: 130,
                filterable: false
            }
            //{
            //    field: "ispass",
            //    title: _localizer.ketqua,
            //    template: '#if(data.ispass==false){# <span class="badgtd">Không đạt</span> #}# #if(data.ispass ==true){# <span class="badgtdd">Đạt</span> #}# #if(data.ispass==null){#  #}#',
            //    width: 130,
            //    filterable: false
            //},


        ],
        isCustomtool: true,
        editable: 'inline',
        dataBinding: function () {
            if (this.dataSource.pageSize()) {
                _recordquiz = (this.dataSource.page() - 1) * this.dataSource.pageSize();
            }
            else {
                _recordquiz = (this.dataSource.page() - 1);
            }
        },
        detailInit: detailInit,
        dataBound: function (e) {
            $('#' + ListResult).css('height', 'calc(100% - 2px)');
            $('#' + ListResult + ' .k-grid-content').css('height', 'calc(100% - 76px)');
            $('.docid').each(function () {
                if ($(this).attr('data-isonline') == 'true') {
                    $(this).parents('tr').first().find('.k-command-cell .k-grid-teaching_online').removeClass('d-none')
                }
            });
        },
        resizable: true
    })


    //bảng detail của bài kiểm tra
    function detailInit(e) {
        $.ajax({
            url: _RootBase + "DocExam/docquiz_search",
            dataType: "json",
            type: "POST",
            data: {
                docquizid: e.data.docquizid,
                userid: e.data.userid,
                numofrow: -1,
                posstart: 1
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
                var dem = 1;
                var html = "";
                html += `<table class="table detail_doc custom_result_exam" style="width:50%;">`;
                html += `<thead class="k-detail-body">
                            <tr>
                              <th class="thead-dark">`+ _localizer.stt + `</th>
                              <th class="thead-dark">`+ _localizer.socaudung + `</th>
                              <th class="thead-dark">`+ _localizer.socausai + `</th>
                              <th class="thead-dark">`+ _localizer.socauchualam + `</th>
                              <th class="thead-dark">`+ _localizer.thoigianlambai + `</th>
                              <th class="thead-dark">`+ _localizer.thoigiannopbai + `</th>
                              <th class="thead-dark">`+ _localizer.diem + `</th>
                              <th class="thead-dark"></td>
                            </tr>
                         </thead>`;
                html += `<tbody>`;
                for (var i = 0; i < data.data.length; i++) {
                    html += `<tr>
                                  <td>`+ dem++ + `</td>
                                  <td>`+ (data.data[i].num_correct ? data.data[i].num_correct : 0) + `</td>
                                  <td>`+ (data.data[i].num_incorrect ? data.data[i].num_incorrect : 0) + `</td>
                                  <td>`+ (data.data[i].num_noanswer ? data.data[i].num_noanswer : 0) + `</td>
                                  <td>`+ (data.data[i].date_taken ? kendo.toString(new Date(data.data[i].date_taken), 'dd/MM/yyyy HH:mm') : '') + `</td>
                                  <td>`+ (data.data[i].date_last_save ? kendo.toString(new Date(data.data[i].date_last_save), 'dd/MM/yyyy HH:mm') : '') + `</td>
                                  <td>`+ (data.data[i].score ? data.data[i].score : 0) + `</td>
                                  <td><a title="Xem chi tiết" role="button" onclick="load_popup_result_exam(`+ data.data[i].docquizresultid + `)" class="k-button k-button-icontext k-grid-Detail"><i class="k-icon k-i-form-element"></i><div style="margin-left:10px;" class="custom-title">Xem chi tiết</div></a></td>
                    </tr>`;
                }
                html += `</tbody>`;
                html += `</table>`;
                $(html).appendTo(e.detailCell);

            },
            error: function (err) {
                console.log(err)
            }
        });


    }
}

//xuất file excel
function export_excel_result(docquizid) {
    var data_export = [];
    var data_export_count = [];
    $.ajax({
        url: _RootBase + "DocExam/docquiz_search_user",
        dataType: "json",
        type: "GET",
        async: false,
        data: {
            sortfield: 1,//18
            sorttype: 'ASC',
            numofrow: -1,
            posstart: 1,
            docquizid: docquizid
        },
        success: function (data) {
            if (data.data) {
                data_export = data.data;
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
    $.ajax({
        url: _RootBase + "DocExam/docquiz_search",
        dataType: "json",
        type: "GET",
        async: false,
        data: {
            docquizid: docquizid,
            userid: _userid,
            numofrow: -1,
            posstart: 1
        },
        success: function (data) {
            if (data.data) {
                data_export_count = data.data;
            }
        },
        error: function (err) {
            console.log(err)
        }
    });
    var data_rows = [];
    //header
    data_rows.push({ cells: [{ value: '' }] });
    data_rows.push({ cells: [{ value: '' }] });
    data_rows.push({
        cells: [{
            value: _localizer.ketquabaikiemtra.toUpperCase(), bold: true, fontSize: 18, textAlign: "center", colSpan: 9
        }]
    });
    data_rows.push({
        cells: [
            { value: "" },
        ],
    });
    data_rows.push({
        cells: [
            // The second cell.
            {
                value: _localizer.stt,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
            },
            {
                value: _localizer.tentaikhoan,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
            },
            {
                value: _localizer.solanthi,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
            },
            {
                value: _localizer.socaudung,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
            },
            {
                value: _localizer.socausai,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
                //background: '#538DD5',
                //color: '#fff'
            },
            {
                value: _localizer.socauchualam,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
                //background: '#538DD5',
                //color: '#fff'
            },
            {
                value: _localizer.thoigianlambai,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
                //background: '#538DD5',
                //color: '#fff'
            },
            {
                value: _localizer.thoigiannopbai,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
                //background: '#538DD5',
                //color: '#fff'
            },
            {
                value: _localizer.diem,
                hAlign: 'center',
                bold: true,
                borderBottom: { color: "#000", size: 1 },
                borderLeft: { color: "#000", size: 1 },
                borderTop: { color: "#000", size: 1 },
                borderRight: { color: "#000", size: 1 }
                //background: '#538DD5',
                //color: '#fff'
            }
        ]
    });
    for (var i = 0; i < data_export.length; i++) {
        for (var j = 0; j < data_export_count.length; j++) {
            if (j == 0) {
                data_rows.push({
                    cells: [
                        // The second cell.
                        {
                            value: (i + 1),
                            hAlign: 'center',
                            verticalAlign: "center",
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 },
                            rowSpan: data_export_count.length,

                        },
                        {
                            value: data_export[i].fullname,
                            hAlign: 'center',
                            verticalAlign: "center",
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 },
                            rowSpan: data_export_count.length,
                        }, {
                            value: (j + 1),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                        },
                        {
                            value: data_export_count[j].num_correct,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                        },
                        {
                            value: data_export_count[j].num_incorrect,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: data_export_count[j].num_noanswer,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: kendo.toString(kendo.parseDate(data_export_count[j].date_taken), "dd/MM/yyyy"),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: kendo.toString(kendo.parseDate(data_export_count[j].date_last_save), "dd/MM/yyyy"),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: data_export_count[j].score,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        }
                    ]
                });
            }
            else {
                data_rows.push({
                    cells: [
                        {
                            value: (j + 1),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                        },
                        {
                            value: data_export_count[j].num_correct,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                        },
                        {
                            value: data_export_count[j].num_incorrect,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: data_export_count[j].num_noanswer,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: kendo.toString(kendo.parseDate(data_export_count[j].date_taken), "dd/MM/yyyy"),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: kendo.toString(kendo.parseDate(data_export_count[j].date_last_save), "dd/MM/yyyy"),
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        },
                        {
                            value: data_export_count[j].score,
                            hAlign: 'center',
                            bold: true,
                            borderBottom: { color: "#000", size: 1 },
                            borderLeft: { color: "#000", size: 1 },
                            borderTop: { color: "#000", size: 1 },
                            borderRight: { color: "#000", size: 1 }
                            //background: '#538DD5',
                            //color: '#fff'
                        }
                    ]
                });
            }
        }

    }
    var workbook = new kendo.ooxml.Workbook({
        sheets: [
            {
                columns: [
                    { width: 30 },
                    { width: 200 },
                    { width: 120 },
                    { width: 120 },
                    { width: 120 },
                    { width: 120 },
                    { width: 120 },
                    { width: 120 },
                    { width: 120 }
                ],
                title: _localizer.ketquabaikiemtra,
                rows: data_rows
            }
        ]
    });
    kendo.saveAs({
        dataURI: workbook.toDataURL(),
        fileName: "Kết-quả-bài-kiểm-tra.xlsx"
    });


}