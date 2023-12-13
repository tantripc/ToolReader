//Cập nhật và Thêm mới chủ đề
function addupdate_topic(id, parentId, status, _orgid) {
    console.log(id)
    console.log(parentId)
    console.log(status)
    console.log(_orgid)
    $.ajax({
        url: _RootBase + "Topic/Addupdate",
        type: "POST",
        data: {
            topicid: id != null != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate',
                    fullscreen: false,
                    width: $(window).width() * 0.6,
                    title: status == "themmoi" ? _localizer.themmoidanhmuc : status == "themcon" ? _localizer.themdanhmuccon : _localizer.capnhatdanhmuc,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: status == "themmoi" ? _localizer.themmoi : status == "themcon" ? _localizer.themcon : _localizer.capnhat,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate(id != null ? id : '', status, _orgid)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol(id, parentId, status, _orgid);
                    }
                });

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}
//Sử dụng KendoUi
function loadcontrol(id, parentId, status, _orgid) {
    loadKendoComboBox({
        id: "ptopicid",
        placeholder: _localizer.chondanhmuc,
        dataTextField: "topicname",
        dataValueField: "topicid",
        value: status == "capnhat" ? parentId : status == "themcon" ? id : '',
        url: _RootBase + "Topic/gettopic",
        data: {
            recursive: true,
            numofrow: -1,
            posstart: 0,
            orgid: _orgid
        },
        isLevel: true,
        isrequired: false
    });
    if (status == "themcon") {
        $('#topicname').val('');
    }
}

//Bước thứ 2 của cập nhật và thêm mới chủ đề
function ajax_addupdate(id, status, _orgid) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var iseffect = $('#iseffect').is(':checked');
        var topicname = $('#topicname').val();
        var ptopicid = $("#ptopicid").data('kendoComboBox') != undefined ? $("#ptopicid").data('kendoComboBox').value() : $("#topicid").data('kendoComboBox').value();
        //kiểm tra dữ liệu
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Topic/addupdatetopic",
            dataType: "json",
            type: "POST",
            data: {
                iseffect: iseffect,
                topicname: topicname,
                //nếu trạng thái bằng "Cập nhật" thì truyền topicid bằng id
                //ngược lại thêm con và thêm mới thì truyền bằng null
                topicid: status == "capnhat" ? id : null,
                ptopicid: ptopicid,
                orgid: _orgid

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
                        toastr["success"](status == "themmoi" ? _localizer.themmoidanhmucthanhcong : status == "themcon" ? _localizer.themdanhmucconthanhcong : _localizer.capnhatdanhmucthanhcong, _localizer.thongbao);
                        $('#form_addupdate').modal('hide');
                        var treelisttopic = $('#' + tree_topic).data("kendoTreeList");
                        treelisttopic.dataSource.read();
                        if (status == "themmoi") {
                            location.reload();
                        }
                    }
                    else {
                        if (returncode == -1) {
                            toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                        }
                        else {
                            toastr["error"]((data.returnmsg ? data.returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                        }
                    }
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}




