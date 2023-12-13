var data_qnr_temp_part = [];
var json_sv_questiontype = [];
//var _lstnumquestion = lstnumquestion!='null'?JSON.parse(lstnumquestion):[];
var step = 1;
var data_questiontype = [];
var datatemp_questiontype = [];
var data_questiontype_tn = [];
var data_questiontype_tl = [];
var max_id_question = 1;
var questiontemp = [];



//cập nhật và thêm mới sách
function addupdatedocexam(id, docid) {
    $.ajax({
        url: _RootBase + "DocExam/Addupdate",
        type: "POST",
        data: {
            docid: docid,
            id: id
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_addupdate',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: id ? _localizer.capnhatbaikiemtra : _localizer.themmoibaikiemtra,
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
                                    ajax_addupdate(id != undefined ? id : '', docid != undefined ? docid : '')
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        MathLive.renderMathInElement(
                            document.getElementById('form_addupdate'), {
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
                        loadcontrol(link_file)
                    }
                });
            }
        },
        error: function (err) {
        }
    });
}
function loadcontrol(link_file) {
    function readTextFile(file, callback) {
        var rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.responseText);
            }
        }
        rawFile.send(null);
    }

    //usage:
    readTextFile(read_file + link_file, function (text) {
        var data = JSON.parse(text);
        for (var i = 0; i < data.length; i++) {
            question_content.push(data[i]);
            datatemp_questiontype = question_content;
        }
        var question_arr = [];
        var demmang = 0;
        for (var i = 0; i < question_content.length; i++) {
            question_arr = question_content[i];
            demmang++;
            reloadtablereadfile(question_arr, demmang);
        }
        function reloadtablereadfile(question_arr, demmang) {
            if (question_arr.point != undefined) {
                var checkundefine = question_arr.point;
            }
            else {
                var checkundefine = "";
            }
            var html = `<tr>
    <td class="counter" data-value="` + demmang + `">` + demmang + `</td>
    <td>`+ question_arr.content + `</td>
    <td id="point">`+ checkundefine + `</td>
    <td>`+ question_arr.v_questiontypename + `</td>
    <td>
        <a onclick="viewItem(`+ question_arr.qbankid + `)" rel="` + question_arr.qbankid + `" title="` + _localizer.xemchitiet + `" class="btn btn-success action" href="#">
            <i class="fa fa-list"></i>
        </a>
        <a onclick="editItem(this,`+ question_arr.qbankid + `)" rel="` + question_arr.qbankid + `" title="` + _localizer.chinhsua + `" class="btn btn-info action" href="#">
            <i class="fa fa-edit"></i>
        </a>
        <a onclick="removeItem(this,` + question_arr.qbankid + `)" rel="` + question_arr.qbankid + `" title="` + _localizer.xoa + `" class="btn btn-danger action" href="#">
            <i class="fa fa-trash-o"></i>
        </a>
<a onclick="move(this,`+ question_arr.qbankid + `,'up')" rel="` + question_arr.qbankid + `" title="` + _localizer.dichuyenlen + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-up"></i>
                                                    </a>
 <a onclick="move(this,`+ question_arr.qbankid + `,'down')" rel="` + question_arr.qbankid + `" title="` + _localizer.dichuyenxuong + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-down"></i>
                                                    </a>
    </td>
    </tr>`;

            $('.cnt_question').append(html);
        }
    });
}
function ajax_addupdate(id, docid) {
    if ($('form').valid()) {

        if ($('#scorepass').val() == '') {
            $('#scorepass').addClass('error');
            $("#validatescore").append("<label id='notifytemp' class='error'>" + _localizer.truongnaybatbuoc + "</b>");
            toastr["error"](_localizer.diemdatkhongduocdetrong, _localizer.thongbao);
            return false
        }
        var title = $('#title').val();
        var required_time_minute = $('#required_time_minute').val();
        var total_point = $('#total_point').val();
        var scorepass = $('#scorepass').val();
        var iseffect = $('#iseffect').is(':checked');
        // check dữ liệu ngày tháng
        $.ajax({
            url: _RootBase + "DocExam/Addupdate_api",
            dataType: "json",
            type: "POST",
            data: {
                docquizid: id,
                docid: _docid,
                total_point: total_point,
                scorepass: scorepass,
                iseffect: iseffect,
                total_question: question_content.length > 0 ? question_content.length : '',
                title: title,
                required_time_minute: required_time_minute,
                content: question_content.length > 0 ? JSON.stringify(question_content) : '',
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
                        toastr["success"]((id ? _localizer.capnhatbaikiemtrathanhcong : _localizer.themmoibaikiemtrathanhcong), _localizer.thongbao);
                        $('#form_addupdate').modal('hide');
                        var gridview = $("#" + List_Exam).data("kendoGrid");
                        gridview.dataSource.read();
                    }
                    else {
                        if (returncode == -1) toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
                        else toastr["error"]((data.returnmsg ? data.returnmsg : _localizer.loidocghicosodulieu), _localizer.thongbao);
                    }
                }
            },
            error: function (err) {
            }
        });
    }
}
//chỗ này là thêm câu hỏi
function addnewquestion($this, isedit, json) {
    $('.popover').popover('hide');
    $.ajax({
        url: _RootBase + "General/GetHtmlAddUpdateQuestion",
        dataType: "json",
        type: "POST",
        data: {
            json: json ? JSON.stringify(json) : '',
            pathview: 'Views/DocExam/Addquestion.cshtml'
        },
        async: false,
        beforeSend: function () {
            $("body").addClass('loading');
        },
        complete: function () {
            $("body").removeClass('loading');
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'addnewquestion',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: isedit ? _localizer.capnhatcauhoi : _localizer.themmoicauhoi,
                    body: data.contentHtml,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.xemtruoc,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    previewquestion();
                                },
                                isClose: false,
                            },
                            {
                                text: isedit ? _localizer.capnhat : _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    ajax_addnewquestion($this, isedit, json != undefined ? json[0].qbankid : undefined);
                                },
                                isClose: false,
                            },
                        ]
                    },
                    callback: function () {
                        MathLive.renderMathInElement(
                            document.getElementById('addnewquestion'), {
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
        }
    });
}

function ajax_addnewquestion($this, isedit, qbankided) {
    
    var point = $('#point_input').val();
    if (point == undefined || point == '') {
        $('#point_input').addClass('error');
        if (!$('#notifytemp').length) {
            $("#diem").append("<label id='notifytemp' class='error'>" + _localizer.truongnaybatbuoc + "</b>");
        }
        return false
    }
    var question_type = $('#question_type').data('kendoComboBox').value();
    var is_shuffle_ans = $('#is_shuffle_ans').is(':checked');
    var content_question = save_question(question_type);

    if (question_content && question_content.length > 0 && content_question && content_question.length > 0) {
        if (isedit == true) {
            content_question[0].qbankid = qbankided;
            for (var i = 0; i < question_content.length; i++) {
                if (content_question[0].qbankid == question_content[i].qbankid) {
                    content_question[0].ordinal = question_content[i].ordinal == undefined ? i + 1 : question_content[i].ordinal;
                    break;
                }
            }
        }
        else {
            content_question[0].qbankid = question_content[question_content.length - 1].qbankid+1;
            content_question[0].ordinal = content_question[0].qbankid;
        }
    }
    else {
        content_question[0].qbankid = 1;
        content_question[0].ordinal = 1;
    }
    var question = {
        qbankid: content_question[0].qbankid,
        ordinal: content_question[0].ordinal,
        point: point,
        content: content_question[0].content,
        solution_key: content_question[0].solution_key,
        explanation: content_question[0].explanation,
        question_bank_choice: JSON.stringify(content_question[0].question_bank_choice),
        question_bank_suggest: JSON.stringify(content_question[0].question_bank_suggest),
        v_questiontype: content_question[0].v_questiontype,
        v_questiontypename: $('#question_type').data('kendoComboBox').text(),
        is_shuffle_ans: is_shuffle_ans
    };
    if (question != null && isedit != true) {
        question_content.push(question);
    }
    else {
        // nếu isedit bằng true thì duyệt trong mảng xem thằng nào có id trùng với nó và gán thằng đó bằng nó
        if (isedit) {
            for (var i = 0; i < question_content.length; i++) {
                if (question_content[i].qbankid == question.qbankid) {
                    question_content.splice(i, 1, question);
                    break;
                }
            }
        }
        //nếu ngược lại thì push vào mảng
        else {
            question_content.push(question);
        }
    }
    $($this).parents('.content_type').first().find('.cnt_question tr').remove();
    var cacl_point = 0;
    for (var i = 0; i < question_content.length; i++) {
        var html = `<tr>
                        <td  class="counter" data-value="` + question_content[i].ordinal + `">` + question_content[i].ordinal + `</td>
                        <td>`+ question_content[i].content + `</td>
                        <td id="point">`+ question_content[i].point + `</td>
                        <td>`+ question_content[i].v_questiontypename + `</td>
                        <td>
<a onclick="viewItem(`+ question_content[i].qbankid + `)" rel="` + question_content[i].qbankid + `" title="` + _localizer.xemchitiet + `" class="btn btn-success action" href="#">
                                                                <i class="fa fa-list"></i>
                                                            </a>
                                                            <a onclick="editItem(this,`+ question_content[i].qbankid + `)" rel="` + question_content[i].qbankid + `" title="` + _localizer.chinhsua + `" class="btn btn-info action" href="#">
                                                                <i class="fa fa-edit"></i>
                                                            </a>
                                                    <a onclick="removeItem(this,`+ question_content[i].qbankid + `)" rel="` + question_content[i].qbankid + `" title="` + _localizer.xoa + `" class="btn btn-danger action" href="#">
                                                        <i class="fa fa-trash-o"></i>
                                                    </a>
 <a onclick="move(this,`+ question_content[i].ordinal + `,'up')" rel="` + question_content[i].ordinal + `" title="` + _localizer.dichuyenlen + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-up"></i>
                                                    </a>
 <a onclick="move(this,`+ question_content[i].ordinal + `,'down')" rel="` + question_content[i].ordinal + `" title="` + _localizer.dichuyenxuong + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-down"></i>
                                                    </a>
                                                </td>
                                            </tr>`;
        cacl_point += parseFloat(question_content[i].point);
        $('.cnt_question').append(html);
    }
    max_id_question++;
    document.getElementById("total_point").value = cacl_point;
    $('#addnewquestion').modal('hide');

}
function editItem($this, docquizid, docid) {
    var question_arr_edit = get_json_question(docquizid);
    addnewquestion($this, true, question_arr_edit);
}
function get_json_question(docquizid) {
    var question_arr_edit = [];
    if (question_content.length > 0) {
        for (var i = 0; i < question_content.length; i++) {
            if (question_content[i].qbankid == docquizid) {
                //question_arr = question_content[i];
                question_arr_edit.push(question_content[i]);
                //datatemp_questiontype.push(question_content[i]);
                break;
            }
        };
    }
    else {
        for (var i = 0; i < datatemp_questiontype.length; i++) {
            if (datatemp_questiontype[i].qbankid == docquizid) {
                question_arr_edit.push(datatemp_questiontype[i]);
                //question_arr = datatemp_questiontype[i];
                break;
            }
        };
    }

    return question_arr_edit;
}
function move($this, id, move) {
    $($this).parents('.content_type').first().find('.cnt_question tr').remove();
    var demmang = 0;
    for (var i = 0; i < question_content.length; i++) {
        if (id == question_content[i].qbankid) {
            if (move == "up") {
                var variable = question_content[i].ordinal - 1;
                if (variable >= 1) {
                    question_content[i].ordinal = variable;
                }
                else {
                    toastr["error"](_localizer.khongthedichuyenlen, _localizer.thongbao);
                }
                break;
            }
            else {
                var variable = question_content[i].ordinal + 1;
                if (variable <= question_content.length) {

                    question_content[i].ordinal = variable;
                }
                else {
                    toastr["error"](_localizer.khongthedichuyenxuong, _localizer.thongbao);
                }
                break;
            }
        }
    }

    for (var i = 0; i < question_content.length; i++) {
        if (move == "up") {
            if (variable == question_content[i].ordinal && question_content[i].qbankid != id) {
                question_content[i].ordinal = variable + 1;
                break;
            }
        }
        else {
            if (variable == question_content[i].ordinal && question_content[i].qbankid != id) {
                question_content[i].ordinal = variable - 1;
                break;
            }
        }
    }

    var byName = question_content.slice(0);
    byName.sort(function (a, b) {
        var x = a.ordinal;
        var y = b.ordinal;
        return x < y ? -1 : x > y ? 1 : 0;
    });
    question_content = byName;
    for (var i = 0; i < question_content.length; i++) {
        demmang++;
        reloadtable(question_content[i], demmang);
    }

}
function removeItem($this, id) {
    $($this).parents('.content_type').first().find('.cnt_question tr').remove();
    var demmang = 0;
   
    for (var i = 0; i < question_content.length; i++) {
        if (id == question_content[i].qbankid) {
            question_content.splice((i), 1);
            break;
        }
    }
    if (question_content.length <= 0) {
        $('#scorepass').attr("readonly", "true");
        /* $('#total_point').val('');*/
    }
    var demordinal = 1;
    var calc_point = 0;
    for (var j = 0; j < question_content.length; j++) {
        question_content[j].ordinal = demordinal++;
        question_content[j].qbankid = question_content[j].ordinal;
        question_content[j].Idx = question_content[j].ordinal;
        calc_point += parseFloat(question_content[i].point);
        demmang++;
        reloadtable(question_content[j], demmang);
    }
    document.getElementById("total_point").value = calc_point;
}
function reloadtable(question_content, demmang) {
    var html = `<tr>
    <td  class="counter" data-value="` + demmang + `">` + demmang + `</td>
    <td>`+ question_content.content + `</td>
    <td id="point">`+ question_content.point + `</td>
    <td>`+ question_content.v_questiontypename + `</td>
    <td>
        <a onclick="viewItem(`+ question_content.qbankid + `)" rel="` + question_content.qbankid + `" title="` + _localizer.xemchitiet + `" class="btn btn-success action" href="#">
            <i class="fa fa-list"></i>
        </a>
        <a onclick="editItem(this,`+ question_content.qbankid + `)" rel="` + question_content.qbankid + `" title="` + _localizer.chinhsua + `" class="btn btn-info action" href="#">
            <i class="fa fa-edit"></i>
        </a>
        <a onclick="removeItem(this,` + question_content.qbankid + `)" rel="` + question_content.qbankid + `" title="` + _localizer.xoa + `" class="btn btn-danger action" href="#">
            <i class="fa fa-trash-o"></i>
        </a>
<a onclick="move(this,`+ question_content.qbankid + `,'up')" rel="` + question_content.qbankid + `" title="` + _localizer.dichuyenlen + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-up"></i>
                                                    </a>
 <a onclick="move(this,`+ question_content.qbankid + `,'down')" rel="` + question_content.qbankid + `" title="` + _localizer.dichuyenxuong + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-down"></i>
                                                    </a>
    </td>
    </tr>`;
    $('.cnt_question').append(html);
}
function viewItem(id) {
    $('.popover').popover('hide');
    if (id != undefined) {
        var question_arr = get_json_question(id);
    }
    else {
        var question_arr = question_content;
    }
    $.ajax({
        url: _RootBase + "General/GetHtmlViewQuestion",
        dataType: "json",
        type: "POST",
        data: {
            json: JSON.stringify(question_arr),
            pathview: 'Views/DocExam/ViewQuestion.cshtml'
        },
        async: false,
        beforeSend: function () {
            $("body").addClass('loading');
        },
        complete: function () {
            $("body").removeClass('loading');
        },
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'previewquestion',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer.xemnoidungcauhoi,
                    body: data.contentHtml,
                    footer: {
                        button: [
                            {
                                text: _localizer.dong,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                        ]
                    },
                    callback: function () {
                        MathLive.renderMathInElement(
                            document.getElementById('previewquestion'), {
                            ignoreClass: 'instruction|source',
                            TeX: {
                                delimiters: {
                                    inline: [['$$', '$$'], ['\\(', '\\)']],
                                    display: [['$$', '$$o'], ['\\(', '\\)']],
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
        }
    });
}
$(document).ready(function () {

    //đổ dữ liệu câu hỏi lên
    //v_contenttype == 11706
    question_content = [];
    $('.item-content').on('click', '.delete_row', function () {
        if ($('.item-content .cnt-item-content').length > 1) {
            var tag = $(this).parents('.cnt-item-content').first();
            var rel = $(tag).attr('rel');
            InitDialogCourse({
                id: 'delete_row',
                width: 600,
                title: _localizer.thongbao,
                body: '<div>' + _localizer.loainoidungbanvuachonsebixoa + '</div>'
                    + '<div>' + _localizer.bancochacchan
                ,
                icon: 'iconmoon-NotifyDelete',
                footer: {
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
                                for (var i = 0; i < question_content.length; i++) {
                                    if (question_content[i].rel == rel) {
                                        question_content.splice(i, 1);
                                        break;
                                    }
                                }
                                $(tag).remove();
                                if ($('.item-content .cnt-item-content').length == 0) {
                                    init_control_lesson_first();
                                }
                            },
                            isClose: true,
                        },
                    ]
                }
            });
        }
    });
    //setTimeout(function () {
    //    if (gapi) {
    //        gapi.load("client", loadClient);
    //    }
    //}, 300)

})
function init_control_content($this) {
    var dem = parseInt($($this).attr('rel'));
    //init editor
    $($this).find('.editor').attr('id', 'editor_' + dem);
    load_editor(
        {
            id: 'editor_' + dem,
            //height: 400,
            placeholder: _localizer.nhapnoidungbaihoc,
            isInline: true,
            onChange: function () {
                ///consonle.log(1);
                get_template_plaintext('editor_' + dem, $this)
            },
        });
    $($this).find(".select_content_type").first().attr('id', 'select_content_type_' + dem);
    //init combobox
    var value = $($this).find(".select_content_type").first().attr('data-val');
    loadKendoComboBox({
        id: $($this).find(".select_content_type").first().attr('id'),
        placeholder: _localizer.chonloainoidung,
        dataTextField: "objectvalue",
        dataValueField: "lookupid",
        value: value ? value : _v_contenttype_default,
        //url: _RootBase + "General/searchreflookup",
        //data: { objectname: 'v_contenttype' },
        dataSource: _data_v_content_type,
        onChange: onChange
    });
    //init radio
    $($this).find('input[type="radio"].fileattach').attr('id', 'fileattach_' + dem).attr('name', 'filetype_' + dem);
    $($this).find('label.fileattach').attr('for', 'fileattach_' + dem);

    $($this).find('input[type="radio"].filelink').attr('id', 'filelink_' + dem).attr('name', 'filetype_' + dem);
    $($this).find('label.filelink').attr('for', 'filelink_' + dem);

    $($this).find('input[type="radio"].youtube').attr('id', 'youtube_' + dem).attr('name', 'filetype_' + dem);
    $($this).find('label.youtube').attr('for', 'youtube_' + dem);

    function onChange(e) {
        if (this.element.length > 0) {
            //
            $($this).find('.interactive_board').addClass('d-none');

            var dataItem = $(this.element[0]).data('kendoComboBox');
            if (dataItem.value() == 11700) {
                $($this).find('.content_type').addClass('d-none');
                $($this).find('.content_type[data-type="text"]').removeClass('d-none');
            }
            else if (dataItem.value() >= 11701 && dataItem.value() <= 11704 || dataItem.value() >= 11707 && dataItem.value() <= 11708) {
                $($this).find('.content_type').addClass('d-none');
                $($this).find('.content_type[data-type="file"]').removeClass('d-none');
                //nếu là video thì cho upload file sub
                if (dataItem.value() == 11701) {
                    if ($($this).find('input.fileattach').is(':checked') == true) {
                        $($this).find('.cnt-file-sub').removeClass('d-none');
                    }
                    //cho thêm youtube
                    $($this).find('.youtube_control').removeClass('d-none');
                }
                else {
                    $($this).find('.cnt-file-sub').addClass('d-none');
                    $($this).find('.youtube_control').addClass('d-none');
                }

                //
                var id_file = $($this).find('.fileattach').attr('id');
                if (dataItem.value() == 11704) {
                    $('#' + id_file).parent().addClass('d-none');
                    $($this).find('.filelink').trigger('click');
                    $($this).find('.interactive_board').removeClass('d-none');
                }
                else {
                    $('#' + id_file).parent().removeClass('d-none');
                    $($this).find('.interactive_board').addClass('d-none');
                }

            }

            else if (dataItem.value() == 11706) {
                $($this).find('.content_type').addClass('d-none');
                $($this).find('.content_type[data-type="question"]').removeClass('d-none');
            }
            else if (dataItem.value() == 11705) {
                $($this).find('.content_type').addClass('d-none');
                $($this).find('.content_type[data-type="link"]').removeClass('d-none');
            }
            else if (dataItem.value() == 11709) {
                $($this).find('.content_type').addClass('d-none');
                $($this).find('.content_type[data-type="embed"]').removeClass('d-none');
            }
            //xử lý ràng buộc file
            if (dataItem.value() == 11703) {
                $($this).find('.attachfile').attr('accept', '.zip');
            }
            else {
                $($this).find('.attachfile').removeAttr('accept');
            }


        } else {
        }
    }
    $($this).find('input[type="radio"]').on('change', function () {
        //
        $($this).find('.cnt_youtube_control').addClass('d-none');
        if ($(this).val() == 1) {
            $($this).find('.cnt-fileattach').removeClass('d-none');
            $($this).find('.cnt-filelink').addClass('d-none');
            if ($('#select_content_type_' + dem).data('kendoComboBox').value() == 11701) {
                $($this).find('.cnt-file-sub').removeClass('d-none');
            }
        }
        else if ($(this).val() == 2) {
            $($this).find('.cnt-filelink').removeClass('d-none');
            $($this).find('.cnt-fileattach,.cnt-file-sub').addClass('d-none');
        }
        else if ($(this).val() == 3) {
            $($this).find('.cnt-fileattach').addClass('d-none');
            $($this).find('.cnt-filelink').addClass('d-none');
            $($this).find('.cnt-file-sub').addClass('d-none');
            $($this).find('.cnt_youtube_control').removeClass('d-none');
        }
    });
    $($this).find('.btn-uploadfile').on('click', function () {
        $(this).parents('.cnt-fileattach').first().find('.attachfile').trigger('click');
    })
    $this.find('.attachfile').on('change', function () {
        var content_type = $('#select_content_type_' + dem).data('kendoComboBox').value();
        if (content_type == 11703) {
            if ($(this).val()) {
                var extend_file = $(this).val().split('.')[1];
                if (extend_file != 'zip') {
                    toastr["warning"](_localizer.filescormphailafilezip, _localizer.thongbao);
                    return false;
                }
            }
            else {
                return false;
            }
        }

        var options = {
            subFolder: 'LibraryItem',
            fileType: 'document,media' + (content_type == 11703 ? ',zip' : ''),
            isconvertvideo: ($('#select_content_type_' + dem).data('kendoComboBox').value() == 11701 ? true : false)
        };
        uploadApi(api_file, $($this).find('.attachfile')[0].files[0], function (e) {
            $this.find('.attachfile').val('');
            if (e.ReturnCode == 0) {
                $($this).find('.attachfilename').html(e.PathfileName).show();
                $($this).find('.attachfile').attr('data-name', e.PathfileName);
                //giải nén nếu là scorm
                if ($('#select_content_type_' + dem).data('kendoComboBox').value() == 11703) {
                    scorm_extract(e.PathfileName, $this);
                }
            }
        }, options)
    });
    //upload file sub
    $($this).find('.btn-uploadfilesub').on('click', function () {
        $(this).parents('.cnt-file-sub').first().find('.attachfilesub').trigger('click');
    });
    listen_event_check_box_submain($this);
    $this.find('.attachfilesub').on('change', function () {
        var options = {
            subFolder: 'SubVideo',
            fileType: 'track'
        };
        var length_file_sub = $($this).find('.attachfilesub')[0].files.length;
        for (var i = 0; i < length_file_sub; i++) {
            uploadApi(api_file, $($this).find('.attachfilesub')[0].files[i], function (e) {
                $this.find('.attachfilesub').val('');
                if (e.ReturnCode == 0) {
                    $($this).find('.attachfilesubname').show();
                    $($this).find('.attachfilesub').attr('data-name', e.PathfileName);
                    var data_sub = [];
                    data_sub.push({
                        filename: e.PathfileName,
                        label: '',
                        isdefault: false
                    });
                    add_html_sub($($this).find('.attachfilesubname'), data_sub);
                }
            }, options);
        }

    });
    //bắt sự kiện enter tìm kiểm youtube
    $($this).find('.key_search_youtube').on('keypress', function (e) {
        if (e.keyCode === 13) {
            if ($(this).val() != '') {
                execute_search_youtube($this, $(this).val(), true);
            }
        }
    });
    $($this).find('.youtube_search_control').on('click', function () {
        var val = $($this).find('.key_search_youtube').val();
        if (val != '') {
            execute_search_youtube($this, val, true);
        }
    });

}
$('.item-content').on('click', '.add_new_row', function () {
    var dem = parseInt($('.item-content .cnt-item-content').last().attr('rel'))
    $('.item-content').append(template_html_content);
    $('.item-content .cnt-item-content').last().attr('rel', (dem + 1));
    init_control_content($('.item-content .cnt-item-content').last());
});



//////////////////////////////////////////////////////////////////////////////import

importQuesListFromWord = function () {
    $.ajax({
        url: _RootBase + "DocExam/ImportQuestion",
        type: "POST",
        success: function (data) {
            if (data != null) {
                InitDialogCourse({
                    id: 'form_import',
                    fullscreen: false,
                    width: $(window).width() * 0.7,
                    title: _localizer.themtufile,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                            },
                            {
                                text: _localizer.themmoi,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    uploadFileWordToServer();
                                },
                                isClose: false,
                            },
                        ]
                    }
                });

            }
        },
        error: function (err) {
        }
    });
}


var uploadFileWordToServer = function (success) {
    if ($('#ImportQuestionsFromWord').length === 0) {
        $('body').append('<div id="ImportQuestionsFromWord" style="display:none"></div>');
    }

    var files = $("#fileimport_word").prop("files");

    var obj = {
        isUser: false,
        subFolder: 'Temp\\WordExQB',
        fileType: 'Word',          // ''
        isExists: null,             // false
        //async: null,              // true
        autoComplete: true,         // false
        change: function (fileName) {
            loadContentWord(fileName);
        },          // function () {}
        modalBackgroundColor: null, // rgba(0,0,0,0.1)
        modalHeaderText: null,      // Tải lên tập tin
        successHeaderText: null,    // Kết quả
        totalText: null,            // Tổng cộng tải lên
        successText: null,          // Thành công
        errorText: null,            // Lỗi
        listErrorText: null,        // Danh sách tập tin lỗi
        btnSuccessText: null,       // Tiếp tục
        btnRefreshText: null,       // Tải lại tệp lỗi
        btnCancelText: null         // Hủy
    }
    UploadFile(files, obj);
}

var loadContentWord = function (fileName) {
    $.ajax({
        url: _RootBase + "DocExam/WordToHTML",
        data: {
            FileName: fileName
        },
        //contentType: "application/json; charset=utf-8",
        dataType: "text",//dữ liệu trả về dạng text
        type: "POST",
        beforeSend: function (data) {
            InitDialogCourse({
                id: 'form_import_result',
                fullscreen: true,
                width: $(window).width() * 0.9,
                title: _localizer.kiemtradulieu,
                body: '<div id="k-dialog-custom" class="k-dialog-custom k-content"></div>',
                footer: {
                    button: [
                        {
                            text: _localizer.huy,
                            isClose: true,
                            style: 'background-color:#B7BDD3;',
                            click: function (e) {
                                InitDialogCourse({
                                    id: 'dialog-cancel-import',
                                    fullscreen: false,
                                    width: $(window).width() * 0.6,
                                    title: _localizer.xacnhanhuynhapcauhoi,
                                    body: ''
                                        + '<div class="text-center" style="font-size: 16px;">'
                                        + '<p>' + _localizer.cauhoichuaduocluuvaohethong + '</p>'
                                        + '<p class="bigger-110 bolder center grey"><i class="ace-icon fa fa-hand-o-right blue bigger-120"></i> ' + _localizer.xacnhanhuyquatrinhthemcauhoi + '?</p>'
                                        + '</div>',
                                    footer: {
                                        button: [
                                            {
                                                text: _localizer.huy,
                                                isClose: true,
                                                style: 'background-color:#B7BDD3;',
                                                click: function () {
                                                    questiontemp = [];
                                                },
                                            },
                                            {
                                                text: _localizer.dongy,
                                                style: 'background-color:#5C77D0;',
                                                click: function () {
                                                    $('#dialog-cancel-import').modal('hide');
                                                    questiontemp = [];
                                                },
                                                isClose: false,
                                            },
                                        ]
                                    }
                                });

                                return false;
                            },
                        },
                        {
                            text: _localizer.themmoi,
                            style: 'background-color:#5C77D0;',
                            click: function (e) {
                                //mảng lấy từ file
                                var Readfile_Questions = $("#ImportQuestionsFromWord").data('Questions');
                                var point_import = 0;
                                //mảng sau khi chọn các câu hỏi muốn import
                                if (Readfile_Questions && Readfile_Questions.length > 0) {
                                    Readfile_Questions.forEach(function (e) {
                                        if ($('#k-dialog-custom .box-ques .ques input[type="checkbox"][value="' + e.Idx + '"]').prop('checked')) {
                                            question_content.push(e);
                                        }
                                    });
                                    Readfile_Questions.splice(0, Readfile_Questions.length);
                                }


                                var demstt = 0;
                                //var count = 1;
                                for (var i = 0; i < question_content.length; i++) {
                                    demstt++
                                    var html = `<tr>
                                                <td  class="counter" data-value="` + demstt + `">` + demstt + `</td>
                                                <td>`+ question_content[i].content + `</td>
                                                <td id="point">`+ question_content[i].point + `</td>
                                                <td>`+ question_content[i].v_questiontypename + `</td>
                                                <td>
<a onclick="viewItem(`+ question_content[i].qbankid + `)" rel="` + ($('.content_type').first().find('.cnt_question tr').length + 1) + `" title="` + _localizer.xemchitiet + `" class="btn btn-success action" href="#">
                                                                <i class="fa fa-list"></i>
                                                            </a>
                                                            <a onclick="editItem(this,`+ question_content[i].qbankid + `)" rel="` + ($('.content_type').first().find('.cnt_question tr').length + 1) + `" title="` + _localizer.chinhsua + `" class="btn btn-info action" href="#">
                                                                <i class="fa fa-edit"></i>
                                                            </a>
                                                    <a onclick="removeItem(this,`+ question_content[i].qbankid + `)" rel="` + ($('.content_type').first().find('.cnt_question tr').length + 1) + `" title="` + _localizer.xoa + `" class="btn btn-danger action" href="#">
                                                        <i class="fa fa-trash-o"></i>
                                                    </a>
 <a onclick="move(this,`+ question_content[i].qbankid + `,'up')" rel="` + ($('.content_type').first().find('.cnt_question tr').length + 1) + `" title="` + _localizer.dichuyenlen + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-up"></i>
                                                    </a>
 <a onclick="move(this,`+ question_content[i].qbankid + `,'down')" rel="` + ($('.content_type').first().find('.cnt_question tr').length + 1) + `" title="` + _localizer.dichuyenxuong + `" class="btn btn-success action" href="#">
                                                        <i class="k-icon k-i-arrow-down"></i>
                                                    </a>
                                                </td>
                                            </tr>`;

                                    $('.content_type').first().find('.cnt_question').append(html);
                                    max_id_question++;
                                    point_import += parseFloat(question_content[i].point);
                                }
                                document.getElementById("total_point").value = point_import;
                                $('#form_import_result').modal('hide');
                                questiontemp = [];
                                $('#form_import').modal('hide');

                                return true;
                            },
                            isClose: false,
                        },
                    ]
                }
            });
        },
        success: function (data) {
            if (data) {
                $('#k-dialog-custom').append('<div class="data-html" style="display:none">' + data + '</div>');
                //$('#k-dialog-custom .Header').parent().remove();
                //$('#k-dialog-custom p').first().remove();
                $('#k-dialog-custom img').each(function () {
                    $(this).attr('src', UrlFileWord + $(this).attr('src'));
                });
                $('#k-dialog-custom p').each(function (Idx, item) {
                    if ($(this).text().match(/Spire.Doc/g)) {
                        $(this).remove();
                    }
                });

                setTimeout(function () {

                    var Questions = null;

                    questiontemp = [];
                    Questions = getQuestionFromData_From2($('#k-dialog-custom'));
                    //quét xong xóa sì tai css
                    $('#k-dialog-custom').find('style').remove();

                    $("#ImportQuestionsFromWord").data('Questions', Questions);

                    //
                    $('#k-dialog-custom .wt-waiting').remove();
                    $('.cnt_question tr').remove();
                    $('#k-dialog-custom').append(renderExQNR(Questions));
                    $('#k-dialog-custom .approval-import').change(function () {
                        $('#k-dialog-custom .total-approval-import').text($('#k-dialog-custom .approval-import:checked').length);
                    });

                })
            }
            else {
                $('#k-dialog-custom').html(_localizer.khongtimthaydulieu);
            }
        },
        error: function (err) {
            $('#k-dialog-custom').html(_localizer.khongtimthaydulieu);
        }
    });
}

var renderExQNR = function (Questions) {

    var dem = 0;
    for (var i = 0; i < Questions.length; i++) {
        if (Questions[i].Idx != null) {
            dem++;
        }
    }
    var html = '<h4 class="total-selected-question">' + _localizer.socauhoidachon + ': <b class="total-approval-import">' + dem/*Questions.length*/ + '</b></h4>'
    html += '<div class="col-xs-12 no-padding box-ques">'
    Questions.forEach(function (question) {
        if (typeof question.question_bank_choice == 'object') {
            var randomId = Math.floor(Math.random() * 999999999);
            html += '<div class="ques ques-view-sa">';
            html += '<div class="row no-margin">';
            html += '<div class="col-xs-1 no-padding idx">';
            html += '<h1>';
            html += '<span>' + _localizer.cau+': '+ question.Idx +'</span>'
            html += '</h1>'
            html += '<div style="margin-top:5px;margin-left: 20px;" class="confirm-question-checkbox">';
            html += '<input type="checkbox" class="custom-input approval-import" id="' + randomId + '" name="' + randomId + '_' + question.Idx + '" value="' + question.Idx + '" checked />';
            html += '<label class="for-custom-input" for="' + randomId + '"></label>';
            html += '</div>';
            html += '</div>';
            html += '<div class="col-xs-11 no-padding ques-cnt">';
            html += '<div class="section-cnt">' + question.content + '</div>';
            html += '<div class="ques-anw">';
            if (question.question_bank_choice.length > 0) {
                html += '<ul class="ul-anw-choice">';
                question.question_bank_choice.forEach(function (detail) {
                    html += '<li class="li-anw-choice ' + (question.solution_key === detail.Idx ? " checked " : "") + '">';
                    html += '<input type="radio" class="custom-input" id="' + question.Idx + '-' + detail.Idx + '" name="' + question.Idx + '-' + detail.Idx + '" ' + (question.solution_key === detail.Idx ? " checked " : "") + ' onclick="return false"/>';
                    html += '<label class="label-choice for-custom-input" for="' + question.Idx + '-' + detail.Idx + '">';
                    html += '</label>';
                    html += '<div class="div-content">' + detail.choice_content + '</div>';
                    html += '</li>';
                });
                html += '</ul>';
            }
            else {
                html += '<div class="alert alert-danger" style="margin:15px 0 0 0"><strong style="font-weight:600">' + _localizer.cauhoichuadungdinhdang + '</strong></div>';
            }
            question.question_bank_choice = JSON.stringify(question.question_bank_choice);
        }
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        html += '<hr />';

    });

    html += '</div>';

    return html;
}


var getQuestionFromData_From2 = function (e) {
    var _Question_Temp = { content: "", explanation: "", is_shuffle_ans: false, qbankid: "", ordinal: "", point: "" };
    var _Answer_Arr_Temp = [];
    var _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: "" };

    var regexQuestion = /(((Câu|Question){1})(\s)([0-9]+)(?=\.))/g;
    var regexAnswer = /(([A-Z]{1})(?=\.))/g; // A. B. C. D. ---- Z.
    var counter = 1;
    if (question_content && question_content.length > 0) {
        var demordinal = question_content[question_content.length - 1].ordinal + 1;
        var demqbankid = question_content[question_content.length - 1].qbankid + 1;
        var demIdx = question_content.length + 1;
    }
    else {
        var demordinal = 1;
        var demqbankid = 1;
        var demIdx = 1;
    }
    var defined = {
        v_questiontypename: "Lựa chọn đơn",
        v_questiontype: 9401, // lựa chọn đơn        
    }

    var dataHtml = e.find('.data-html > div');

    //fix table
    dataHtml.find('table')
        .addClass('import-table')
        .css({ width: '100%' })
    //.attr({ border: 0, padding: 0 });
    //dataHtml.find('tr').css({ height: 'auto', margin: 0, padding: 0, border: 0 });
    //dataHtml.find('td').css({ width: 'auto', margin: 0, padding: 0, border: 0 });
    dataHtml.find('td').css({ width: 'auto' });

    //fix image
    dataHtml.find('img')
        .css({ 'max-width': 'none', 'vertical-align': 'middle' });

    dataHtml.find('> *').each(function (quesid, ques) {

        //$(ques).css({ margin: 0, 'text-indent': 0 });
        //$(ques).removeAttr('class');

        //lấy đáp án
        var isQuestion = false, isAnswer = false, matchAnswer = null;

        if ($(ques).text().trim() || $(ques).find('img').length > 0) {

            //check đoạn là câu hỏi
            if ($(ques).text().trim().substring(0, 16).match(regexQuestion)) {

                //xóa key "Câu <n>. "
                var strKey = "";
                $(ques).find('span').each(function (i, e) {
                    strKey += $(e).text();

                    if (strKey.substring(0, 16).match(regexQuestion)) {
                        if ($(e).next().length > 0 && !$(e).next().text().trim() && ($(e).next()[0].nodeName + "").toUpperCase() === 'SPAN') {
                            $(e).next().remove();
                        }

                        $(e).prevAll().remove();
                        $(e).remove();
                        return false;
                    }
                });

                isQuestion = true;
            }
            //check đoạn là đáp án
            else {
                $(ques).find('span').each(function (ansid, ans) {
                    if ($(ans).text().trim().length > 0) {
                        if ($(ans).css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).css('font-weight')) >= 500) {
                            matchAnswer = $(ans).text().trim().substring(0, 2).match(regexAnswer);

                            //nếu element chưa phải đáp án thì thử nối với element tiếp theo
                            if (matchAnswer === null && $(ans).next().length > 0 && $(ans).next().text().trim().length > 0) {
                                matchAnswer = ($(ans).text().trim() + $(ans).next().text().trim()).substring(0, 2).match(regexAnswer);
                            }

                            //đáp án là phương án chọn được gạch chân hoặc màu đỏ(red), hoặc màu xanh(blue)
                            if (matchAnswer !== null) {
                                //if ($(ans).css("text-decoration").indexOf('underline') >= 0
                                //    || ($(ans).css('color') + "").replace(/\s/gm, '') === 'rgb(255,0,0)'
                                //    || ($(ans).css('color') + "").replace(/\s/gm, '') === 'rgb(0,0,255)')
                                if ($(ans).css("text-decoration").indexOf('underline') >= 0) {
                                    _Question_Temp.solution_key = matchAnswer.toString();
                                }
                                isAnswer = true;
                            }
                        }
                    }
                });
            }

            //đoạn này là câu hỏi hoặc đoạn tiếp theo chưa phải đáp án
            if (isQuestion || (_Question_Temp.content && !isAnswer)) {
                $(ques).find('*').each(function (qcid, ques_content) {
                    if ($(ques_content).css('vertical-align') === 'baseline' && $(ques_content).prop('tagName').toLowerCase() !== 'font') {
                        $(ques_content).css({ 'font-family': '', 'font-size': '', 'font-style': '', 'color': '', 'background-color': '', 'vertical-align': '' });

                        if (!$(ques_content).attr('style')) {
                            $(ques_content).removeAttr('style');
                        }
                    }
                });

                //if (($(ques)[0].nodeName + "").toUpperCase() !== 'SPAN' || $(ques).text().trim().length > 0) {


                _Question_Temp.content += ($(ques)[0].outerHTML).replace(/(\&nbsp\;)+/gm, '&nbsp;');
                //}
            }

            //chưa tới phần đáp án thì tiếp tục cộng dồn dẫn đề

            if (_Question_Temp.content && isAnswer) {
                var countAnswer = 0;

                $(ques).find('> *').each(function (ansid, ans) {
                    var matchAnswer = null;
                    var fixAnswer = false;

                    if ($(ans).text().trim().length > 0) {

                        if (($(ans).css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).css('font-weight')) >= 500)) {
                            matchAnswer = $(ans).text().trim().substring(0, 2).match(regexAnswer);

                            if (matchAnswer === null && $(ans).next().length > 0 && $(ans).next().text().trim().length > 0) {
                                matchAnswer = ($(ans).text().trim() + $(ans).next().text().trim()).substring(0, 2).match(regexAnswer);

                                if (matchAnswer !== null) {
                                    return;
                                }
                            }
                        }

                        if (matchAnswer === null
                            && $(ans).prev().length > 0 && $(ans).prev().text().trim().length > 0
                            && ($(ans).prev().css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).prev().css('font-weight')) >= 500)) {

                            matchAnswer = ($(ans).prev().text().trim() + $(ans).text().trim()).substring(0, 2).match(regexAnswer);

                            //nếu element chứa >1 giá trị thì chỉ xóa mỗi ký tự . và giữ lại element
                            if (matchAnswer !== null && $(ans).text().trim() !== '.') {
                                $(ans)[0].innerHTML = ($(ans)[0].innerHTML).trim().replace('.', '');
                                fixAnswer = true;
                            }
                        }
                    }

                    if (matchAnswer !== null) {
                        //khi tìm thấy đáp án A. or ... Z.

                        if (_Answer_Temp.choice_content) {
                            _Answer_Arr_Temp.push(_Answer_Temp);
                            _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: "" };
                        }

                        // gán cho lần sau duyệt mà tìm thấy
                        _Answer_Temp.Idx = matchAnswer.toString();

                        if (fixAnswer) {
                            matchAnswer = null;
                        }
                    }

                    if (matchAnswer === null) {
                        if ($(ans).css('vertical-align') === 'baseline' && $(ans).prop('tagName').toLowerCase() !== 'font') {
                            $(ans).css({ 'font-family': '', 'font-size': '', 'font-style': '', 'color': '', 'background-color': '', 'vertical-align': '' });

                            if (!$(ans).attr('style')) {
                                $(ans).removeAttr('style');
                            }
                        }

                        //if (($(ans)[0].nodeName + "").toUpperCase() !== 'SPAN' || $(ans).text().trim().length > 0) {

                        //_Answer_Temp.AnswerHTML += $(ans)[0].outerHTML;
                        if (_Answer_Temp.Idx) {
                            _Answer_Temp.choice_content += ($(ans)[0].outerHTML).replace(/(\&nbsp\;)+/gm, '&nbsp;');
                        }
                        //}
                    }

                    //duyệt hết dữ liệu
                    if ($(ans).next().length === 0 && _Answer_Temp.choice_content) {
                        _Answer_Arr_Temp.push(_Answer_Temp);
                        _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: "" };
                    }
                });
            }
        }

        //lưu câu hỏi
        if (_Question_Temp.content) {
            if ($(ques).next().length == 0
                || ($(ques).next().length > 0 && $(ques).next().text().trim().substring(0, 16).match(regexQuestion))
                || $(ques).next().length > 0 && $(ques).next().text().trim().indexOf('HẾT') >= 0) {

                //fix content question
                _Question_Temp.content = (function (content) {
                    var thisHtml = $('<div/>').html(content);


                    //p
                    var innerHTMLs_p = thisHtml.find('>*').map(function () {
                        $(this).css({ margin: 0, 'text-indent': 0 });
                        $(this).removeAttr('class');

                        //span,img,...
                        var innerHTMLs = $(this).find('>*').map(function () {
                            if ((this.nodeName || '').toLowerCase() == 'span' && !this.getAttribute('style')) {
                                return this.textContent;
                            }
                            else if ((this.nodeName || '').toLowerCase() == 'a') {
                                return this.innerHTML;
                            }
                            return this.outerHTML;
                        }).get();

                        return $(this).html(innerHTMLs.join(''))[0].outerHTML;
                    }).get();

                    //
                    return innerHTMLs_p.join('');
                })(_Question_Temp.content);

                //fix content answer
                _Answer_Arr_Temp.forEach(function (answer) {
                    answer.content = (function (content) {
                        var thisHtml = $('<div/>').html(content);
                        var firstElement = thisHtml.find('>*').first();
                        if (firstElement.length && (firstElement.get(0).nodeName + '').toLowerCase() === 'span' && firstElement.text().trim() === '') {
                            thisHtml.find('>*:first-child').remove();
                        }

                        //
                        var innerHTMLs = thisHtml.find('>*').map(function () {
                            if ((this.nodeName || '').toLowerCase() == 'span' && !this.getAttribute('style')) {
                                return this.textContent;
                            }
                            return this.outerHTML;
                        }).get();

                        return innerHTMLs.join('');
                    })(answer.choice_content);
                });
             
                //_Question_Temp.Answer = _Answer_Arr_Temp;
                _Question_Temp.question_bank_choice = _Answer_Arr_Temp;
                _Question_Temp.Idx = question_content && question_content.length > 0 ? demIdx++ : demIdx++;
                _Question_Temp.qbankid = question_content && question_content.length > 0 ? demqbankid++ : demqbankid++;
                _Question_Temp.ordinal = question_content && question_content.length > 0 ? demordinal++ : demordinal++;
                _Question_Temp.point = $("#point_input_import").val();

                $.extend(_Question_Temp, defined);
                //_Question_Temp.question_bank_choice = JSON.stringify(_Answer_Temp);
                questiontemp.push(_Question_Temp);
                _Question_Temp = { explanation: "", is_shuffle_ans: false, content: "" };
                _Answer_Arr_Temp = [];
            }
        }

        //dừng vòng lặp
        if ($(ques).next().length > 0 && $(ques).next().text().trim().indexOf('HẾT') >= 0) {
            return false;
        }
    });
    return questiontemp;
}

