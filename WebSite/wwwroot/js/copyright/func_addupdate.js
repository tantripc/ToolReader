//cập nhật và thêm mới sách

function addupdate_copyright(id, cprgrouptype, cpruserid) {
    $.ajax({
        url: _RootBase + "CopyRight/Addupdate",
        type: "POST",
        data: {
            id: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate',
                    fullscreen: false,
                    width: $(window).width() * 0.7,
                    title: id ? _localizer.capnhattacquyen : _localizer.themmoitacquyen,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: id ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate(id != undefined ? id : '')
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(id, cprgrouptype, cpruserid);
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function loadcontrol(id, cprgrouptype, cpruserid) {

    loadKendoComboBox({
        id: "cprgrouptype",
        placeholder: _localizer.chonnhomtacquyen,
        dataTextField: "text",
        dataValueField: "value",
        value: cprgrouptype != undefined ? cprgrouptype : null,
        dataSource: [
            { text: "Công ty phát hành & NXB", value: "1" },
            { text: "Cá nhân", value: "2" },
            { text: "Báo & tạp chí", value: "3" }
        ],
        isrequired: true
    });
    loadKendoComboBox({
        id: "cpruserid",
        placeholder: _localizer.chonnguoiquanlytacquyen,
        dataTextField: "username",
        dataValueField: "userid",
        value: cpruserid != undefined ? cpruserid : null,
        url: _RootBase + "Account/search",
        data: {
            numofrow: -1
        },
        isrequired: true
    });
}


//Bước thứ 2 của cập nhật và thêm mới sách
function ajax_addupdate(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var hide = $('#hide').is(':unchecked');
        var address = $('#address').val();
        var notes = $('#notes').val();
        var shortname = $('#shortname').val();
        var phone = $('#phone').val();
        var email = $('#email').val();
        var cprname = $('#cprname').val();
        var cprgrouptype = $("#cprgrouptype").data('kendoComboBox').value();
        var cpruserid = $("#cpruserid").data('kendoComboBox').value();
        // check dữ liệu ngày tháng
        $.ajax({
            url: _RootBase + "CopyRight/Addupdate_api",
            dataType: "json",
            type: "POST",
            data: {
                cprid: id,
                address: address,
                phone: phone,
                email: email,
                notes: notes,
                shortname: shortname,
                cprname: cprname,
                cprgrouptype: cprgrouptype,
                cpruserid: cpruserid,
                hide: hide
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
                        toastr["success"]((id ? _localizer.capnhattacquyenthanhcong : _localizer.themmoitacquyenthanhcong), _localizer.thongbao);
                        $('#form_addupdate').modal('hide');
                        var gridview = $("#" + list_copyright).data("kendoGrid");
                        gridview.dataSource.read();
                    }
                    else {
                        if (returncode == -1) toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                        else toastr["error"]((data.returnmsg ? data.returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                    }
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}




