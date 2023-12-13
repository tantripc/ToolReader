
//Giao 1 cuốn sách cho người dùng
function getbook_warehouse(id) {
    $.ajax({
        url: _RootBase + "Doc/GetBookWarehouse",
        type: "GET",
        data: {
            docid: id != undefined ? id : null
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate_doc_partner',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.laysachtukho,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.laysach,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addupdate(id != undefined ? id : '', status)
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        loadcontrol_warehouse();
                    }
                });
            }
        },
        error: function (err) {
        }
    });
}
function loadcontrol_warehouse() {
    loadKendoComboBox({
        id: "topic_partner",
        placeholder: _localizer.chondanhmucluutru,
        dataTextField: "topicname",
        dataValueField: "topicid",
        value: '',
        url: _RootBase + "Topic/gettopic",
        data: {
            numofrow: -1,
            orgid: _OrgID,
            recursive: true
        },
        isrequired: true,
        isLevel: true
    });
    loadKendoComboBox({
        id: "topiced",
        placeholder: _localizer.chondanhmucnguon,
        dataTextField: "topicname",
        dataValueField: "topicid",
        value: '',
        url: _RootBase + "Topic/gettopic",
        data: {
            numofrow: -1,
            recursive: true
        },
        isrequired: true,
        isLevel: true,
        onChange: function (e) {
            //initList_Warehouse($("#topiced").data("kendoComboBox").value());
            initList_Warehouse($("#topiced").data("kendoComboBox").value());
        }
    });
}
//Bước thứ 2 của cập nhật và thêm mới sách
function ajax_addupdate() {
    var iseffect = $('#iseffect').is(':checked');
    var arr = $('#selected').data('kendoListBox').dataItems();
    var Doc = [];
    if (arr.length == 0) toastr["error"](_localizer.banchuachonsach, _localizer.thongbao);
    for (var i = 0; i < arr.length; i++) Doc.push({ docid: arr[i].docid });
    var topic_partner = $("#topic_partner").data('kendoComboBox').value();
    //gọi api cập nhật dữ liệu =>> trả thông báo
    $.ajax({
        url: _RootBase + "Doc/copy_book",
        dataType: "json",
        type: "POST",
        data: {
            docids: JSON.stringify(Doc),
            isdocquiz: iseffect,
            topicid: topic_partner
        },
        success: function (res) {
            if (res.data.length > 0) {
                var fullscreen = false;
                var html = '';
                if (res.numok > 0) {
                    html += '<div class="alert alert-primary" role="alert">';
                    html += _localizer.laysachthanhcong.replace('__numok__', ($("#selected").parents('.k-widget').find('.k-reset[role="listbox"]').children().length));
                    html += '</div>';
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
                                        $('#form_addupdate_doc_partner').modal('hide');
                                        var gridview = $("#" + List_Doc).data("kendoGrid");
                                        gridview.dataSource.read();
                                    },
                                },
                            ]
                        }
                    });
                }
                else {
                    html += '<div class="alert alert-danger" role="alert">';
                    html += res.data[0].returnmsg;
                    html += '</div>';
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
                                    style: 'background-color:#B7BDD3;'
                                },
                            ]
                        }
                    });
                }

            }
        },
        error: function (err) {
            console.log(err)
        }
    });
}




