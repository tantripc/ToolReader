//Giao 1 cuốn sách cho người dùng
function addupdate_doc_readrequired(id) {
    $.ajax({
        url: _RootBase + "DocReadRequired/Docreadrequire_User",
        type: "GET",
        data: {
            docid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_docreadrequired',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: id ? _localizer.phancongdocsachchonguoidunghoacnhomnguoidung : _localizer.phancongdocsach,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.phancong,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate(id != undefined ? id : '', status)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(id != undefined ? id : '');
                    }
                });

            }
        },
        error: function (err) {
        }
    });
}

function loadcontrol(id) {
    loadKendoComboBox({
        id: "typedoc",
        placeholder: _localizer.chonsach,
        dataTextField: "title",
        dataValueField: "docid",
        value: id ? id : '',
        url: _RootBase + "Doc/search_foradmin",
        data: {
            numofrow: -1,
            docid: id
        },
        isrequired: true
    });
    loadKendoDatePicker({
        id: "startdate"
    });
    loadKendoDatePicker({
        id: "enddate"
    });
}
function diffGetTime(date1, date2) {
    if (date1.getTime() > date2.getTime()) {
        console.log(aaaaaaaaaa)
    }
    return date;
}
//Bước thứ 2 của cập nhật và thêm mới sách
function ajax_addupdate(id, status) {
    var nguoidung = $("input[name='nguoidung']:checked").val();
    if (nguoidung == undefined) {
        toastr["warning"](_localizer.vuilongchonnguoidunghoacnhomnguoidung, _localizer.thongbao);
        return false;
    }
    var docid = $("#typedoc").data("kendoComboBox").value();
    var Typeuser = [];
    if (nguoidung == "1") {
        var arr = $('#selectedUser').data('kendoListBox').dataItems();
        if (arr.length == 0) toastr["error"](_localizer.banvuilongchonnguoidung, _localizer.thongbao);
        for (var i = 0; i < arr.length; i++) Typeuser.push({ userid: arr[i].userid, emailaddr: arr[i].emailaddr, fullname: arr[i].fullname });
    }
    else {
        var arr = $('#selectedGroupuser').data('kendoListBox').dataItems();
        if (arr.length == 0) toastr["error"](_localizer.banvuilongchonnhomnguoidung, _localizer.thongbao);
        for (var i = 0; i < arr.length; i++) Typeuser.push({ ugid: arr[i].ugid });
    }

    //if (startdate != '' && enddate != '') {
    //    var start_datetime = moment(kendo.toString($('#startdate').data('kendoDatePicker').value(), "yyyy-MM-dd"));
    //    var end_datetime = moment(kendo.toString($('#enddate').data('kendoDatePicker').value(), "yyyy-MM-dd"));
    //    var check_date = moment(start_datetime, 'DD/MM/YYYY').isBefore(moment(end_datetime, 'DD/MM/YYYY'));
    //    if (check_date == false) {
    //        toastr["error"](_localizer.thoigianbatdaunhohonthoigianketthuc, _localizer.thongbao);
    //        return false;
    //    }
    //    else {
    //        var startdate = $("#startdate").val();
    //        var enddate = $("#enddate").val();
    //    }
    //}
    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "DocReadRequired/DocReadRequire_AddUpdate",
        dataType: "json",
        type: "POST",
        data: {
            arrdocreadrequired: JSON.stringify(Typeuser),
            docid: docid
            //startdate: startdate,
            //enddate: enddate
        },
        success: function (res) {
            var connectionidsend = $('.connectionidAdmin').attr('data-connect');
            var nguoidung = $("input[name='nguoidung']:checked").val();
            if (res.data.length > 0) {
                var fullscreen = false;
                var html = '';
                if (res.numok > 0) {
                    html += '<div class="alert alert-primary" role="alert">';
                    if (nguoidung == "1") {
                        html += _localizer.phancongdocsachchonguoidung.replace('__numok__', (res.numok));
                    }
                    else {
                        html += _localizer.phancongdocsachchonhomnguoidung.replace('__numok__', (res.numok));
                    }
                    html += '</div>';
                }
                if (res.numerr > 0) {
                    debugger
                    html += '<div class="alert alert-danger" role="alert">';
                    html += _localizer.loisodongdulieu.replace('__numerror__', (res.numerr));
                    html += '</div>';
                    html += '<table class="table">';
                    html += '<thead>';
                    html += '<tr>';
                    html += '<th scope="col">' + _localizer.stt + '</th>';

                    res.data[0].emailaddr == null ? html += '<th scope="col">' + _localizer.tennhomnguoidung + '</th>' : html += '<th scope="col">' + _localizer.tennguoidung + '</th>';

                    res.data[0].emailaddr == null ? '' : html += '<th scope="col">' + _localizer.emailnguoidung + '</th>';
                    html += '<th scope="col">' + _localizer.trangthai + '</th>';
                    html += '</tr>';
                    html += '</thead>';
                    html += '<tbody>';
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].returncode != 0) {
                            html += '<tr style="background: #fee2e1;">';
                            html += '<th scope="row">' + (i + 1) + '</th>';
                            res.data[i].fullname != null ? html += '<th scope="row">' + res.data[i].fullname + '</th>' : html += '<th scope="row">' + res.data[i].ugname + '</th>';
                            res.data[i].emailaddr != null ? html += '<th scope="row">' + res.data[i].emailaddr + '</th>' : '';
                            html += '<td>' + (res.data[i].returnmsg) + '</td>';
                            html += '</tr>';
                        }

                    }
                    html += '</tbody>';
                    html += '</table>';
                    fullscreen = true;
                }
                InitDialogCourse({
                    id: 'ajax_importUser',
                    fullscreen: fullscreen,
                    width: fullscreen == true ? $(window).width() * 0.8 : $(window).width() * 0.6,
                    title: _localizer.ketquathaotac,
                    body: html,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                                click: function () {
                                    $('#form_addupdate_docreadrequired').modal('hide');
                                    var _grid = $("#" + list_doc_read_required).data("kendoGrid");
                                    _grid.dataSource.read();
                                },
                            },
                        ]
                    }
                });
                if (_IsUsingSocket == 'True') {
                    for (var i = 0; i < res.data.length; i++) {
                        if (res.data[i].detail_notify != "") {
                            var obj = JSON.parse(res.data[i].detail_notify);
                            send_socket_notify(connectionidsend, obj[i]._connectionid, obj[i]._mess, obj[i]._notifyrecv);
                        }
                    }
                }
            }


        },
        error: function (err) {
            console.log(err)
        }
    });
}




