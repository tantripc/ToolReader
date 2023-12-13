
$(document).ready(function () {
    loadKendoComboBox({
        id: "question_type",
        placeholder: _localizer.chonloaicauhoi,
        dataTextField: "objectvalue",
        dataValueField: "lookupid",
        value: v_questiontype != '' ? v_questiontype : motluachon,
        url: _RootBase + "General/searchreflookup",
        data: { objectname: 'v_questiontype' },
        onChange: function () {
            $('.popover').popover('hide')
            var type_ques = $('#question_type').data('kendoComboBox').value();
            loadtemplate_typequestion(type_ques);
            if (type_ques == dungsai || type_ques == motluachon || type_ques == nhieuluachon) {
                $('.cnt_is_shuffle_ans').removeClass('d-none');
                $('#popoverbootstrap').addClass('d-none');
            }
            else if (type_ques == dienkhuyet) {
                $('#popoverbootstrap').removeClass('d-none');
            }
            else {
                $('#popoverbootstrap').addClass('d-none');
                $('.cnt_is_shuffle_ans').addClass('d-none');
            }
        },
        isrequired: true
    });

    load_editor({
        id: 'question-title',
        placeholder: _localizer.nhapnoidungcauhoi,
        isInline: true
    });
    if (v_questiontype) {
        loadtemplate_typequestion(v_questiontype);
    }
    else {
        loadtemplate_typequestion(motluachon);
    }
    load_editor({
        id: 'question-explantion',
        placeholder: _localizer.nhapnoidunggoiy,
        isInline: true
    });
    //Load lại dữ liệu để chỉnh sửa (nếu có)
    //load_question_edit();
    //
    $('[data-toggle="popover"]').popover();
})
//thêm option chọn cho câu hỏi
$('#createQuestion').on('click', '.group-answer .btn-add-option-question', function () {
    var question_type = $('#question_type').data('kendoComboBox').value();//$('#question_type').val();
    if (question_type == motluachon || question_type == nhieuluachon) {
        var num_option = $('.group-option-question .form-check').length + 1;
        var content = `<div class="form-check">
        <input class="form-check-input `+ (question_type == nhieuluachon ? `hidden-box` : ``) + `" type="` + (question_type == motluachon ? `radio` : `checkbox`) + `" name="optionQuestion" id="optionQuestion` + num_option + `" value="option` + num_option + `"><label for="optionQuestion` + num_option + `" ` + (question_type == nhieuluachon ? `class="check--label"` : ``) + `>` + (question_type == nhieuluachon ? `<span class="check--label-box"></span>` : ``) + `</label>
        <div class="form-check-label" for="optionQuestion`+ num_option + `">
        <div class="form-control editor_control" id="answer_`+ num_option + `"></div>
        </div>
        <i class="fa fa-minus"></i>
        </div>`;
        $('#createQuestion .group-option-question .group-option').append(content);
        load_editor({
            id: 'answer_' + num_option,
            placeholder: _localizer.nhapnoidungluachon,
            isInline: true
        });
    }
})
//xóa option chọn câu hỏi
$('#createQuestion').on('click', '.form-check .fa.fa-minus', function () {
    $(this).parents('.form-check').first().remove();
    //đánh dấu lại id
    var index_ele = 1;
    $('.group-option-question .form-check').each(function () {
        $(this).find('input.form-check-input').attr('id', 'optionQuestion' + index_ele).attr('value', 'option' + index_ele);
        $(this).find('label.form-check-label').attr('for', 'optionQuestion' + index_ele);
        $(this).find('input.form-control').attr('id', 'answer_' + index_ele);
        index_ele++;
    });
});
//load template loại câu hỏi
loadtemplate_typequestion = function (type_question) {
    $('#notes_hd').addClass('d-none');

    $('#createQuestion .group-answer-plaintext,#createQuestion .group-answer-matching').remove();
    $('#createQuestion .group-solution-answer').addClass('d-none');
    var html_question = '';
    if (type_question == motluachon || type_question == nhieuluachon) {
        html_question += `<div style="border-bottom: 1px solid #ccc;margin-left: -12px;">
                                                                            <div class="form-control btn-add-option-question">
                                                                                <i class="fa fa-plus"></i>
                                                                                <span>`+ _localizer.themdapan + `</span>
                                                                            </div>
                                                                            <div style="clear:both"></div>
                                                                        </div>`;
        html_question += '<div class="group-option">';
        if (question_bank_choice != null) {
            
            var question_choice = JSON.parse(question_bank_choice);
            var num_option = 1;
            for (var i = 0; i < question_choice.length; i++) {
                var ischeck = false;
                if (type_question == motluachon) {
                    ischeck = (solution_key == question_choice[i].idx ? true : false);
                }
                else if (type_question == nhieuluachon) {
                    var arr_solution_key = solution_key.split(';');
                    for (var j = 0; j < arr_solution_key.length; j++) {
                        if (arr_solution_key[j] == question_choice[i].idx) {
                            ischeck = true;
                            break;
                        }
                    }
                }
                var label = question_choice[i].choice_content;
                var qbank_choiceid = question_choice[i].qbank_choiceid;
                html_question += template_html_option(type_question, num_option, ischeck, label, qbank_choiceid);
                num_option++;
            }
        }
        else {
            for (var num_option = 1; num_option <= 4; num_option++) {
                html_question += template_html_option(type_question, num_option);
            }
        }
        html_question += '</div>';
        $('#createQuestion .group-option-question').html(html_question);
        $('#createQuestion .group-answer').show();
        $('#createQuestion .group-option .form-check .editor_control').each(function () {
            load_editor({
                id: $(this).attr('id') + '',
                placeholder: _localizer.nhapnoidungluachon,
                isInline: true
            });
        });

    }
    else if (type_question == dungsai) {
        html_question += template_html_option_true_false(true);
        $('#createQuestion .group-option-question').html(html_question);
        $('#createQuestion .group-answer').show();
    }
    // điền khuyết
    else if (type_question == dienkhuyet) {
        $('#notes_hd').removeClass('d-none');
        $('#createQuestion .group-answer').hide();
        var content_question = CKEDITOR.instances['question-title'].getData();
        var html_plaintext = '';
        if (content_question != '') {
            html_plaintext = get_template_plaintext(true);
        }
        var html = `<div class="form-group group-answer-plaintext">
        <div class="col-md-12">
            <div class="row">
                <label class="col-form-label col-md-3">`+ _localizer.noidungtraloi + `:</label>
                <div class="col-md-9">
                    <div class="form-group group-item-plaintext" style="padding-right:0px;">`+ html_plaintext + `
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        $('#createQuestion .group-content').after(html);
        //khởi tạo lại editor
        if (CKEDITOR.instances['question-title']) {
            CKEDITOR.instances['question-title'].destroy();
        }
        $('#createQuestion .group-content div.col-md-9').html('<div class="form-control validate[required] editor_control" id="question-title">' + content_question + '</div>');
        load_editor({
            id: 'question-title',
            onChange: function () { get_template_plaintext() },
            placeholder: _localizer.nhapnoidungcauhoi,
            isInline: true
        });

        if (question_bank_choice) {
            //đổ dữ liệu đáp án
            var option_count = 0;
            var question_choice = JSON.parse(question_bank_choice);
            $('#createQuestion .group-item-plaintext .item-plaintext .item-answer-plantext').each(function () {
                var solution_key_plantext = question_choice[option_count].solution_key.split('|');
                for (var i = 0; i < solution_key_plantext.length; i++) {
                    if (solution_key_plantext[i] != "") {
                        add_option_plantext($(this), solution_key_plantext[i]);
                    }
                }
                $(this).attr('data-id', question_choice[option_count].qbank_choiceid);
                option_count++;
            });
        }

    }
    // ghép đôi
    else if (type_question == ghepdoi) {
        $('#createQuestion .group-answer').hide();
        var html = `<div class="form-group group-answer-matching">
        <div class="col-md-12">
            <div class="row">
                <label class="col-form-label col-md-3">`+ _localizer.noidungtraloi + `:</label>
                <div class="col-md-9">
                    <div class="row">
                        <div class="form-group col-md-6 group-question-matching">
                            <div class="col-form-label">
                                <span>`+ _localizer.noidungcaudan + `</span>
                                <i title="`+ _localizer.themcaudan + `" style="text-align: right;position: absolute;right: 0px;top: 10px;font-size: 16px;cursor: pointer;" class="icon iconmoon iconmoon-Plus"></i>
                            </div>
                            <div style="border-bottom:1px solid #ccc;"></div>
                            <div class="cnt-question-matching">`+ add_template_question_matching(true) + `</div>
                        </div>
                        <div class="form-group col-md-6 group-option-matching">
                            <div class="col-form-label">
                                <span>`+ _localizer.phuongandenghi + `</span>
                                <i title="`+ _localizer.themphuongan + `" style="text-align: right;position: absolute;right: 0px;top: 10px;font-size: 16px;cursor: pointer;" class="icon iconmoon iconmoon-Plus"></i>
                            </div>
                            <div style="border-bottom:1px solid #ccc;"></div>
                            <div class="cnt-option-matching">`+ add_template_option_matching(true) + `</div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                        <div class="col-form-label">`+ _localizer.ghepphuongandung + `</div>
                        <div style="border-bottom:1px solid #ccc;margin-bottom:10px;"></div>
                        <div class="group-matching-answer">`+ add_template_answer_matching(true) + `</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        $('#createQuestion .group-content').after(html);
        var question_suggest = [];
        var question_choice = [];
        if (question_bank_choice) {
            question_choice = JSON.parse(question_bank_choice);
            var html = '';
            for (var i = 0; i < question_choice.length; i++) {
                html += add_template_question_matching(false, i + 1, question_choice[i].choice_content, question_choice[i].qbank_choiceid);
            }
            $('#createQuestion .group-question-matching .cnt-question-matching').html(html);
        }
        if (question_bank_suggest) {
            question_suggest = JSON.parse(question_bank_suggest);
            var html = '';
            for (var i = 0; i < question_suggest.length; i++) {
                html += add_template_option_matching(false, i, question_suggest[i].suggest_content, question_suggest[i].qbank_suggestid);
            }
            $('#createQuestion .group-option-matching .cnt-option-matching').html(html);
        }
        if (question_suggest.length > 0 && question_choice.length > 0) {
            $('#createQuestion .group-matching-answer').html(template_html_solution_matching(question_choice, question_suggest, solution_key));
        }

    }
    else if (type_question == traloingan || type_question == tuluan) {
        $('#createQuestion .group-answer').hide();
        $('#createQuestion .group-solution-answer').removeClass('d-none');
        if (!CKEDITOR.instances["solution_answer"]) {
            load_editor({
                id: 'solution_answer',
                placeholder: _localizer.nhapnoidungdapan,
                isInline: true
            });
        }
        load_editor({
            id: 'solution_answer',
            placeholder: _localizer.nhapnoidungdapan,
            isInline: true
        });
    }
}
quesPlainText_GetCount = function (val) {
    var regexp = /\[\[[A-Z]\]\]/gi;
    var matches_array = val.match(regexp);
    return matches_array;
}
get_template_plaintext = function (isreturn) {
    var plaintext = quesPlainText_GetCount(CKEDITOR.instances['question-title'].getData());
    var html = '';
    if (plaintext != null) {
        for (var i = 0; i < plaintext.length; i++) {
            if ($('.item-plaintext[rel="' + plaintext[i] + '"]').length == 0) {
                html += `<div class="item-plaintext" rel="` + plaintext[i] + `" style="clear:both">
                        <div style="border-bottom: 1px solid #ccc;margin-left: -12px;padding-left: 12px;line-height: 32px;">
                            <i class="icon iconmoon iconmoon-Plus" onclick="add_option_plantext(this)" style="margin-right: 10px;    cursor: pointer;color: #5864b3;"></i><span>`+ _localizer.cacphuonganchoncua + ` <span style="color:` + quesPlainText_GeneralColor() + `;cursor: pointer;" onclick="add_option_plantext(this)">` + plaintext[i] + `</span></span>
                        </div>
                        <div class="item-answer-plantext" style="margin-top:10px;"></div>
                     </div>`;
            }
        }
        if (isreturn) {

        }
        else {
            $('.group-item-plaintext').append(html);
        }
        //Xóa ngược lại những tag bị thừa
        if (plaintext.length < $('.group-item-plaintext .item-plaintext').length) {
            var html_new = '';
            for (var i = 0; i < plaintext.length; i++) {
                html_new += $('.item-plaintext[rel="' + plaintext[i] + '"]')[0].outerHTML;
            }
            if (isreturn) {
                html = html_new;
            }
            else {
                $('.group-item-plaintext').html(html_new);
            }

        }
    }
    if (isreturn) return html;
}
quesPlainText_GeneralColor = function () {
    //rgb(132, 51, 51)
    var r = Math.floor((Math.random() * 225) + 1);
    var g = Math.floor((Math.random() * 255) + 1);
    var b = Math.floor((Math.random() * 255) + 1);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}
//Thêm nội dung lựa chọn cho câu hỏi điền khuyết
add_option_plantext = function (ele, value) {
    var html = `<div class="item-input-plantext" style="width: 100px;position: relative;padding-right: 20px;background-color: #ccc;margin-right: 10px;float:left;margin-bottom: 10px;"><input style="width: 100%;border-radius: 0px;height: 38px;" class="form-control" value="` + (value ? value : ``) + `" />
    <div style="width: 20px;position: absolute;top: 0px;right: 0px;text-align: center;font-size: 12px;">
        <div><i class="fa fa-arrows-alt" style="cursor: pointer;"></i></div>
        <div><i class="fa fa-trash-o" onclick="delete_input_plantext(this)" style="cursor: pointer;"></i></div>
    </div>
</div>`;
    $(ele).parents('.item-plaintext').first().find('.item-answer-plantext').append(html);
}
delete_input_plantext = function (ele) {
    $(ele).parents('.item-input-plantext').first().remove();
}

//câu hỏi ghép đôi
//template thêm câu dẫn
add_template_question_matching = function (isinit, num, value, id) {
    var html = '';
    if (isinit) {
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="A" class="item_matching"><div style="width:30px;float:left;">A</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.noidungcaudan + '" class="form-control validate[required]"></textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="B" class="item_matching"><div style="width:30px;float:left;">B</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.noidungcaudan + '" class="form-control validate[required]"></textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
    }
    else {
        var CharCode = String.fromCharCode(64 + num);
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="' + CharCode + '" class="item_matching"><div style="width:30px;float:left;">' + CharCode + '</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.noidungcaudan + '" class="form-control validate[required]" data-id="' + (id ? id : 'null') + '">' + (value ? value : '') + '</textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
    }
    return html;
}
//template thêm phương án
add_template_option_matching = function (isinit, num, value, id) {
    var html = '';
    if (isinit) {
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="1" class="item_matching"><div style="width:30px;float:left;">1</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.phuongan + '" class="form-control validate[required]"></textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="2" class="item_matching"><div style="width:30px;float:left;">2</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.phuongan + '" class="form-control validate[required]"></textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
    }
    else {
        html += '<div style="margin: 10px 0px 5px;position: relative;" rel="' + (num + 1) + '" class="item_matching"><div style="width:30px;float:left;">' + (num + 1) + '</div><textarea style="width: calc(100% - 50px);float: left;" rows="3" placeholder="' + _localizer.phuongan + '" class="form-control validate[required]" data-id="' + (id ? id : 'null') + '">' + (value ? value : '') + '</textarea><i class="fa fa-minus"></i><div style="clear: both"></div></div>';
    }
    return html;
}
//template thêm đáp án
add_template_answer_matching = function (isinit, isquestion, isoption) {
    var html = '';
    if (isinit) {
        html += `<table>
                    <tr class="tr_option">
                        <td></td>
                        <td>1</td>
                        <td>2</td>
                    <tr>
                    <tr class="tr_question" rel="A">
                        <td>A</td>
                        <td>
                            <input type="radio" name="question_A" id="question_A_1" />
                            <label for="question_A_1"></label>
                        </td>
                        <td>
                            <input type="radio" name="question_A" id="question_A_2" />
                            <label for="question_A_2"></label>
                        </td>
                    <tr>
                    <tr class="tr_question" rel="B">
                        <td>B</td>
                        <td>
                            <input type="radio" name="question_B" id="question_B_1" />
                            <label for="question_B_1"></label>
                        </td>
                        <td>
                            <input type="radio" name="question_B" id="question_B_2" />
                            <label for="question_B_2"></label>
                        </td>
                    <tr>
                </table>`;
    }
    else {
        if (isquestion) {
            var count_num = $('#createQuestion .group-answer-matching table tr.tr_question').length;
            var count_num_col = $('#createQuestion .group-answer-matching table tr.tr_option td').length;
            var html_col = '';
            var CharCode = String.fromCharCode(64 + count_num + 1);
            for (var i = 0; i < count_num_col - 1; i++) {
                html_col += '<td><input type="radio" id="question_' + CharCode + '_' + (i + 1) + '" name="question_' + CharCode + '" /><label for="question_' + CharCode + '_' + (i + 1) + '"></label></td>';
            }
            html += `<tr class="tr_question" rel="` + CharCode + `">
                        <td>`+ CharCode + `</td>
                       `+ html_col + `
                    <tr>`;
        }
        if (isoption) {
            var count_num = $('#createQuestion .group-answer-matching table tr.tr_option td').length;
            $('#createQuestion .group-answer-matching table tr.tr_option').append('<td>' + count_num + '</td>');
            $('#createQuestion .group-answer-matching table tr.tr_question').each(function () {
                var CharCode = $(this).find('td').first().text();
                $(this).append('<td><input type="radio" name="question_' + CharCode + '" id="question_' + CharCode + '_' + count_num + '" /><label for="question_' + CharCode + '_' + count_num + '"></label></td>');
            });
            return '';
        }
    }
    return html;
}
//sự kiện thêm mới câu dẫn
$('#createQuestion').on('click', '.group-question-matching i.iconmoon-Plus', function () {
    var count_num = $(this).parents('.group-question-matching').first().find('.item_matching').length;
    var html_template = add_template_question_matching(false, count_num + 1);
    $('#createQuestion .group-question-matching .cnt-question-matching').append(html_template);
    $('#createQuestion .group-answer-matching table').append(add_template_answer_matching(false, true));
});
//sự kiện thêm mới phương án
$('#createQuestion').on('click', '.group-option-matching i.iconmoon-Plus', function () {
    var count_num = $(this).parents('.group-option-matching').first().find('.item_matching').length;
    var html_template = add_template_option_matching(false, count_num);
    $('#createQuestion .group-option-matching .cnt-option-matching').append(html_template);
    add_template_answer_matching(false, false, true);
});
//kiểm tra đã điền đầy đủ đáp án chưa
check_answer_matching = function () {
    var ischeckanswer = false;
    $('#createQuestion .group-matching-answer table tr.tr_question').each(function () {
        ischeckanswer = false;
        $(this).find('td input[type="radio"]').each(function () {
            var ischeck = $(this).is(":checked");
            if (ischeck) {
                ischeckanswer = true;
                return false;
            }
        });
        if (!ischeckanswer) return false;
    });
    return ischeckanswer;
}
//kiểm tra trùng đáp án câu ghép đôi
check_answer_exist_matching = function () {
    var ischeckanswer = true;
    var option_num = $('#createQuestion .group-matching-answer tr.tr_option td').length;
    for (var i = 1; i < option_num; i++) {
        ischeckanswer = true;
        var count_check = 0;
        $('#createQuestion .group-matching-answer table tr.tr_question td:nth-child(' + (i + 1) + ')').each(function () {
            var ischeck = $(this).find('input[type="radio"]').is(":checked");
            if (ischeck) {
                count_check++;
            }
            if (count_check > 1) {
                ischeckanswer = false;
                return false;
            }
        });
        if (!ischeckanswer) return false;
    }
    return ischeckanswer;
}
//lấy data_matching
get_data_matching = function () {
    var count_question = 1;
    var data_matching = [];
    var question_bank_choice = [];
    var data_solution_key = [];
    var question_bank_suggest = [];
    $('#createQuestion .group-question-matching .cnt-question-matching .item_matching').each(function () {
        var charcode = $(this).attr('rel');
        var content_question = $(this).find('textarea').val();
        var qbank_choiceid = $(this).find('textarea').attr('data-id');
        var count_num = 1;
        $('#createQuestion .group-answer-matching table tr.tr_question[rel="' + charcode + '"] input[type="radio"]').each(function () {
            if ($(this).is(":checked")) {
                return false;
            }
            count_num++;
        });
        var solution_key = $('#createQuestion .group-option-matching .cnt-option-matching .item_matching[rel="' + count_num + '"] div').first().text();
        var content_answer = $('#createQuestion .group-option-matching .cnt-option-matching .item_matching[rel="' + count_question + '"] textarea').val();
        var qbank_suggestid = $('#createQuestion .group-option-matching .cnt-option-matching .item_matching[rel="' + count_question + '"] textarea').attr('data-id');
        var CharCode = String.fromCharCode(64 + count_question);
        data_solution_key.push(CharCode + '-' + solution_key);
        question_bank_choice.push({
            qbank_choiceid: qbank_choiceid != 'null' ? qbank_choiceid : null,
            idx: CharCode,
            choice_content: content_question,
        });
        question_bank_suggest.push({
            qbank_suggestid: qbank_suggestid != 'null' ? qbank_suggestid : null,
            idx: count_question,
            suggest_content: content_answer
        });
        count_question++;
    });
    data_matching.push({
        question_bank_choice: question_bank_choice,
        question_bank_suggest: question_bank_suggest,
        data_solution_key: data_solution_key.join(';')
    })
    return data_matching;
}

//Xóa 1 câu dẫn 
$('#createQuestion').on('click', '.group-answer-matching .cnt-question-matching .item_matching i.fa-minus', function () {
    //xóa câu dẫn
    var charcode = $(this).parents('.item_matching').first().attr('rel');
    $(this).parents('.item_matching').first().remove();
    //xóa đáp án
    $('#createQuestion .group-matching-answer table tr.tr_question[rel="' + charcode + '"]').remove();
    //tính lại thứ tự matching
    var count_matching = 1;
    $('#createQuestion .group-answer-matching .cnt-question-matching .item_matching').each(function () {
        var CharCode = String.fromCharCode(64 + count_matching);
        $(this).attr('rel', CharCode);
        $(this).find('div').first().text(CharCode);
        count_matching++;
    });
    //tính lại thứ tự đáp án
    count_matching = 1;
    $('#createQuestion .group-matching-answer table tr.tr_question').each(function () {
        var CharCode = String.fromCharCode(64 + count_matching);
        $(this).attr('rel', CharCode);
        $(this).find('td').first().text(CharCode);
        $(this).find('input[type="radio"]').attr('name', 'question_' + CharCode);
        count_matching++;
    });
});
//Xóa 1 phương án 
$('#createQuestion').on('click', '.group-answer-matching .cnt-option-matching .item_matching i.fa-minus', function () {
    //xóa 
    var num = $(this).parents('.item_matching').first().attr('rel');
    $(this).parents('.item_matching').first().remove();
    //Xóa đáp án
    $('#createQuestion .group-matching-answer table tr td:nth-child(' + (parseInt(num) + 1) + ')').remove();
    //tính lại thứ tự phương án
    var count_option = 1;
    $('#createQuestion .group-answer-matching .cnt-option-matching .item_matching').each(function () {
        $(this).attr('rel', count_option);
        $(this).find('div').first().text(count_option);
        count_option++;
    });
    //tính lại thứ tự cho đáp án
    count_option = 0;
    $('#createQuestion .group-matching-answer table tr.tr_option td').each(function () {
        if (count_option == 0) {

        }
        else {
            $(this).text(count_option);
        }
        count_option++;
    });
});
//template câu trả lời lựa chọn đơn, đa lựa chọn
template_html_option = function (type_question, num_option, isSolutionkey, label, qbank_choiceid) {
    var html = `<div class="form-check">
                                                                                <input class="form-check-input `+ (type_question == nhieuluachon ? `hidden-box` : ``) + `" type="` + (type_question == motluachon ? `radio` : `checkbox`) + `" name="optionQuestion" id="optionQuestion` + num_option + `" value="option` + num_option + `" ` + (isSolutionkey ? `checked` : (label == undefined ? (num_option == 1 ? `checked` : ``) : ``)) + ` data-id="` + (qbank_choiceid ? qbank_choiceid : '') + `"/><label for="optionQuestion` + num_option + `" ` + (type_question == nhieuluachon ? `class="check--label"` : ``) + `>` + (type_question == nhieuluachon ? `<span class="check--label-box"></span>` : ``) + `</label>                               <div class="form-check-label" for="optionQuestion` + num_option + `">
                                                                                    <div class="form-control editor_control" id="answer_`+ num_option + `">` + (label ? label : ``) + `</div>
                                                                                </div>
                                                                            <i class="fa fa-minus"></i>
                                                                            </div>`;
    return html;
}
//template câu trả lời của câu hỏi đúng sai
template_html_option_true_false = function (Solutionkey) {
    
    var question_choice = [];
    if (question_bank_choice) {
        question_choice = JSON.parse(question_bank_choice);
    }
    var html = `<div class="form-check"><input class="form-check-input" type="radio" name="optionQuestion" id="optionQuestion1" value="option1" ` + (Solutionkey ? `checked` : ``) + ` data-id="` + (question_choice.length > 0 ? question_choice[0].qbank_choiceid : '') + `" /><label class="form-check-label" for="optionQuestion1" style="margin-top:8px;">` + _localizer.dung + `</label>
</div><div class="form-check"><input class="form-check-input" type="radio" name="optionQuestion" id="optionQuestion2" value="option2" `+ (!Solutionkey ? `checked` : ``) + ` data-id="` + (question_choice.length > 0 ? question_choice[1].qbank_choiceid : '') + `"/><label class="form-check-label" for="optionQuestion2" style="margin-top:8px;">` + _localizer.sai + `</label></div>`;
    return html;
}
//template khung đáp án câu hỏi điền khuyết
template_html_solution_matching = function (arr_question, arr_option, solution_key) {
    var arr_solution_key = solution_key.split(';');
    var html = '';
    html += '<table>';
    html += '<tr class="tr_option">'
    html += '<td></td>';
    for (var i = 0; i < arr_option.length; i++) {
        html += '<td>' + (i + 1) + '</td>';
    }
    html += '</tr>'
    for (var i = 0; i < arr_question.length; i++) {
        var key = arr_solution_key[i].split('-');
        var CharCode = String.fromCharCode(64 + i + 1);
        html += '<tr class="tr_question" rel="' + CharCode + '">';
        html += '<td>' + CharCode + '</td>';
        for (var j = 0; j < arr_option.length; j++) {
            html += '<td><input type="radio" ' + (key[1] == arr_option[j].idx ? 'checked' : '') + ' name="question_' + CharCode + '" id="question_' + CharCode + '_' + j + '"><label for="question_' + CharCode + '_' + j + '"></label></td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

//Lưu câu hỏi
save_question = function (type_question) {
    
    var question = [];
    var content_question = CKEDITOR.instances['question-title'].getData();
    if (content_question == '') {
        toastr["error"](_localizer.noidungcauhoikhongduocdetrong, _localizer.thongbao);
        return false;
    }
    var ischeckanswer = false;
    var isemptysanswer = false;
    var question_bank_choice = [];
    var solution_key = '';
    //lựa chọn đơn -- đa lựa chọn
    if (type_question == motluachon || type_question == nhieuluachon) {
        var index_option = 1;
        $('.group-answer .group-option-question .group-option .form-check').each(function () {
            var ischeck = $(this).find('input.form-check-input').is(":checked");
            var qbank_choiceid = $(this).find('input.form-check-input').attr('data-id');
            if (ischeck) {
                ischeckanswer = true;
                if (type_question == motluachon) {
                    solution_key = String.fromCharCode(64 + index_option);
                }
                else {
                    solution_key = solution_key + String.fromCharCode(64 + index_option) + ';';
                }
            }

            var data_id = $(this).find('.editor_control').attr('id')
            var option_content = CKEDITOR.instances[data_id].getData();
            if (option_content) {
                question_bank_choice.push(
                    {
                        qbank_choiceid: qbank_choiceid ? qbank_choiceid : null,
                        idx: String.fromCharCode(64 + index_option),
                        choice_content: option_content
                    });
                index_option++;
            }
            else {
                isemptysanswer = true;
            }
        });
        if (isemptysanswer) {
            toastr["error"](_localizer.noidungcautraloikhongduocdetrong, _localizer.thongbao);
            return false;
        }
    }
    //đúng sai
    if (type_question == dungsai) {
        var index_option = 1;
        $('.group-answer .group-option-question .form-check').each(function () {
            var ischeck = $(this).find('input.form-check-input').is(":checked");
            var qbank_choiceid = $(this).find('input.form-check-input').attr('data-id');
            if (ischeck) {
                ischeckanswer = true;
                solution_key = String.fromCharCode(64 + index_option);
            }
            var option_content = $(this).find('label.form-check-label').text();
            if (option_content) {
                question_bank_choice.push(
                    {
                        qbank_choiceid: qbank_choiceid ? qbank_choiceid : null,
                        idx: String.fromCharCode(64 + index_option),
                        choice_content: option_content
                    });
                index_option++;
            }
        });
    }
    //điền khuyết
    if (type_question == dienkhuyet) {
        var quesPlainText = quesPlainText_GetCount(content_question);
        if (quesPlainText == null) {
            toastr["error"](_localizer.noidungcauhoikhongdungdinhdang, _localizer.thongbao);
            return false;
        }
        var issolution = true;
        $('#createQuestion .group-item-plaintext .item-answer-plantext').each(function () {
            if ($(this).find('.item-input-plantext').length == 0) {
                issolution = false;
                return false;
            }
        });
        if (!issolution) {
            toastr["error"](_localizer.phaicoitnhat1luachoncho1chotrong, _localizer.thongbao);
            return false;
        }
        var isexistoption = false;
        for (var i = 0; i < quesPlainText.length; i++) {
            var solution_option = [];
            $('.group-answer-plaintext .item-plaintext').each(function () {
                if ($(this).attr('rel') == quesPlainText[i]) {
                    var item_plantext = $(this).find('.item-input-plantext');
                    $(item_plantext).each(function () {
                        var option_value = $(this).find('input').first().val();
                        var count_option = 0;
                        //Kiểm tra trùng đáp án
                        $('.item-plaintext[rel="' + quesPlainText[i] + '"] .item-input-plantext input').each(function () {
                            if ($(this).val() == option_value) {
                                count_option++;
                            }
                        });
                        if (count_option > 1) {
                            isexistoption = true;
                            return false;
                        }
                        solution_option.push(option_value);
                    });
                    if (isexistoption) {
                        return false;
                    }
                }
            });
            if (isexistoption) {
                toastr["error"](_localizer.luachontraloikhongduoctrungnhau, _localizer.thongbao);
                return false;
            }
            var qbank_choiceid = $('.group-answer-plaintext .item-plaintext[rel="' + quesPlainText[i] + '"] .item-answer-plantext').attr('data-id');
            question_bank_choice.push(
                {
                    qbank_choiceid: qbank_choiceid ? qbank_choiceid : null,
                    idx: String.fromCharCode(64 + (i + 1)),
                    choice_content: quesPlainText[i],
                    solution_key: solution_option.join('|')
                });
        }
        var question_explantion = CKEDITOR.instances['question-explantion'].getData();
        question.push({
            content: content_question,
            v_questiontype: type_question,
            question_bank_choice: question_bank_choice,
            explanation: question_explantion,
            solution_key: solution_key,
            v_questiontypename: $('#question_type').data('kendoComboBox').text()
        });
    }
    //ghép đôi
    if (type_question == ghepdoi) {
        if ($('#createQuestion .cnt-question-matching .item_matching').length != $('#createQuestion .cnt-option-matching .item_matching').length) {
            toastr["error"](_localizer.soluongcaudanvaphuonganchonphaibangnhau, _localizer.thongbao);
            return false;
        }
        if (!check_answer_matching()) {
            toastr["error"](_localizer.chuachondapan, _localizer.thongbao);
            return false;
        }
        //kiểm tra đáp án trùng
        if (!check_answer_exist_matching()) {
            toastr["error"](_localizer.moidapanchiduocdungcho1cauhoi, _localizer.thongbao);
            return false;
        }
        //
        var question_explantion = CKEDITOR.instances['question-explantion'].getData();
        var data_mathching = get_data_matching();
        if (data_mathching.length > 0) {
            question.push({
                content: content_question,
                v_questiontype: type_question,
                question_bank_choice: data_mathching[0].question_bank_choice,
                question_bank_suggest: data_mathching[0].question_bank_suggest,
                explanation: question_explantion,
                solution_key: data_mathching[0].data_solution_key,
                v_questiontypename: $('#question_type').data('kendoComboBox').text()
            });
        }
    }
    //Trả lời ngắn --- Tự luận
    if (type_question == traloingan || type_question == tuluan) {
        var question_explantion = CKEDITOR.instances['question-explantion'].getData();
        //if (question_explantion == '') {
        //    toastr["error"](_localizer.noidungcautraloikhongduocdetrong, _localizer.thongbao);
        //    return false;
        //}
        var solution_answer = CKEDITOR.instances['solution_answer'].getData();;
        question.push({
            content: content_question,
            v_questiontype: type_question,
            explanation: question_explantion,
            solution_key: solution_answer,
            v_questiontypename: $('#question_type').data('kendoComboBox').text()
        });
    }
    if (!ischeckanswer && (type_question == motluachon || type_question == nhieuluachon || type_question == dungsai)) {
        toastr["error"](_localizer.chuachondapan, _localizer.thongbao);
    }
    else {
        var question_explantion = CKEDITOR.instances['question-explantion'].getData();
        question.push({
            content: content_question,
            v_questiontype: type_question,
            question_bank_choice: question_bank_choice,
            explanation: question_explantion,
            solution_key: solution_key,
            v_questiontypename: $('#question_type').data('kendoComboBox').text()
        });
        return question;
    }
}
function previewquestion() {
    var question = save_question($('#question_type').data('kendoComboBox').value());
    if (question.length > 0) {
        var json = [{
            content: question[0].content,
            solution_key: question[0].solution_key,
            explanation: question[0].explanation,
            question_bank_choice: JSON.stringify(question[0].question_bank_choice),
            question_bank_suggest: JSON.stringify(question[0].question_bank_suggest),
            v_questiontype: question[0].v_questiontype
        }];
        $.ajax({
            url: _RootBase + "General/GetHtmlViewQuestion",
            dataType: "json",
            type: "POST",
            data: {
                pathview: 'Views/DocExam/ViewQuestion.cshtml',
                json: JSON.stringify(json)
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
                    });
                    MathLive.renderMathInElement(
                        document.getElementById('previewquestion'), {
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
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}
function ajax_savequestion() {
    var question_type = $('#question_type').data('kendoComboBox').value();
    var content_question = save_question(question_type);
    var lessonid = $('#select_lesson').data('kendoComboBox').value();
    var is_shuffle_ans = $('#is_shuffle_ans').is(':checked');
    if (content_question.length > 0) {
        var question = content_question[0];
        $.ajax({
            url: _RootBase + "Instructor/QuestionBank/addupdate",
            type: "POST",
            data: {
                qbankid: qbankid,
                content: question.content,
                solution_key: question.solution_key,
                explanation: question.explanation,
                question_bank_choice: JSON.stringify(question.question_bank_choice),
                question_bank_suggest: JSON.stringify(question.question_bank_suggest),
                question_bank_mapping: JSON.stringify([{
                    courseid: courseid ? parseInt(courseid) : null,
                    lessonid: lessonid ? parseInt(lessonid) : null
                }]),
                v_questiontype: question.v_questiontype,
                is_shuffle_ans: is_shuffle_ans
            },
            async: true,
            beforeSend: function () {
                $("body").addClass('loading');
            },
            complete: function () {
                $("body").removeClass('loading');
            },
            success: function (data) {
                if (data != null) {
                    var returncode = data.returncode;
                    if (returncode == 0) {
                        toastr["success"]((qbankid ? _localizer.capnhatcauhoithanhcong : _localizer.themmoicauhoithanhcong), _localizer.thongbao);
                        setTimeout(function () {
                            location.href = link_back;
                        }, 2000);
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
}



function add_html_sub($this, data) {
    for (var i = 0; i < data.length; i++) {
        var id = randomString(5);
        var html = '';
        html += '<div class="item_sub" id="' + id + '" data-name="' + data[i].filename + '">';
        html += '<span>' + data[i].filename + '</span>';
        html += $('#cnt_setup_sub').html();
        html += '</div>';
        $($this).append(html);
        $($this).find('#' + id + ' .name_sub').val(data[i].label);
        $($this).find('#' + id + ' input[type="checkbox"]').attr('id', 'check_box_' + id);
        $($this).find('#' + id + ' .form-check-label').attr('for', 'check_box_' + id);
        $($this).find('#check_box_' + id).prop('checked', data[i].isdefault);
        listen_event_check_box_submain($this);
    }
}
function listen_event_check_box_submain($this) {
    $($this).find('.cnt-setup-default input[type="checkbox"]').on('change', function () {
        if ($(this).is(':checked')) {
            $($this).find('.cnt-setup-default input[type="checkbox"]').prop('checked', false);
            $(this).prop('checked', true);
        }
    })
}
function scorm_extract(filename, $this) {
    $.ajax({
        url: _RootBase + "Instructor/Lesson/scorm_extract",
        dataType: "json",
        type: "POST",
        data: {
            filepathname: filename
        },
        async: true,
        beforeSend: function () {
            init_watting_popup();
            InitDialogCourse({
                id: 'scorm_extract',
                width: 600,
                disableClose: true,
                title: _localizer.danggiainen,
                body: '<div style="height:300px"></div>'
            });
        },
        complete: function () {
            remove_watting_popup();
            $('#scorm_extract').modal('hide');
        },
        success: function (data) {
            //console.log(data);
            if (data != null) {
                var returncode = data.returncode;
                if (returncode == 0) {
                    $($this).find('.attachfilename').html(data.otherval);
                    $($this).find('.attachfile').attr('data-name', data.otherval);
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
            setTimeout(function () {
                $('#scorm_extract').modal('hide');
            }, 300);
        },
        error: function (err) {
            console.log(err)
        }
    });
}
function remove_file_sub($this) {
    $($this).parents('.item_sub').first().remove();
}

function updatecoversheet_lesson() {
    $('#coversheet_lesson').trigger('click');
}