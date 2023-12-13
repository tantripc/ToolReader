//////ConvertDocToHtml(e.count.fileName, IdRandomModal);
//////function ConvertDocToHtml(filePath, IdRandomModal) {
//////    $.ajax({
//////        url: _RootBase + "DocExam/WordToHTML",
//////        data: { PathFile: filePath },
//////        type: 'POST',
//////        success: function (data) {
//////            $('#form_import').modal('hide');
//////            $('#' + IdRandomModal).addClass('d-none');
//////            CallSuccess();
//////        },
//////        error: function (data) {
//////            $('#form_import').modal('hide');
//////            $('#' + IdRandomModal).addClass('d-none');
//////            CallSuccess();
//////        }
//////    });

//////}
////importQuesListFromWord = function () {
////    $.ajax({
////        url: _RootBase + "DocExam/ImportQuestion",
////        type: "POST",
////        success: function (data) {
////            if (data != null) {
////                InitDialogCourse({
////                    id: 'form_import',
////                    fullscreen: false,
////                    width: $(window).width() * 0.7,
////                    title: _localizer.themtufile,
////                    body: data,
////                    footer: {
////                        button: [
////                            {
////                                text: _localizer.huy,
////                                isClose: true,
////                                style: 'background-color:#B7BDD3;',
////                            },
////                            {
////                                text: _localizer.themmoi,
////                                style: 'background-color:#5C77D0;',
////                                click: function () {
////                                    uploadFileWordToServer();
////                                },
////                                isClose: false,
////                            },
////                        ]
////                    }
////                });

////            }
////        },
////        error: function (err) {
////            console.log(err)
////        }
////    });
////}


////var uploadFileWordToServer = function (success) {
////    if ($('#ImportQuestionsFromWord').length === 0) {
////        $('body').append('<div id="ImportQuestionsFromWord" style="display:none"></div>');
////    }

////    var files = $("#fileimport_word").prop("files");

////    var obj = {
////        isUser: false,
////        subFolder: 'Temp\\WordExQB',
////        fileType: 'Word',          // ''
////        isExists: null,             // false
////        //async: null,              // true
////        autoComplete: true,         // false
////        change: function (fileName) {
////            ////giu lai lua chon du lieu
////            //var DGCID = $('#impDGCID_word').data('kendoComboBox');
////            //var V_QuestionLevel = $('#impQuesLevel_word').data('kendoComboBox');
////            //$("#ImportQuestionsFromWord").data('QuestionsData', {
////            //    GradeLevelID: _GradeLevelID,
////            //    SubjectID: _SubjectID,
////            //    DGCID: DGCID != null ? DGCID.value() : '',
////            //    V_QuestionLevel: V_QuestionLevel != null ? V_QuestionLevel.value() : '',
////            //});

////            //gọi lại hàm hoàn tất được truyền vào
////            //success();
////            //chạy tiếp bước xử lý tiếp theo
////            loadContentWord(fileName);
////        },          // function () {}
////        modalBackgroundColor: null, // rgba(0,0,0,0.1)
////        modalHeaderText: null,      // Tải lên tập tin
////        successHeaderText: null,    // Kết quả
////        totalText: null,            // Tổng cộng tải lên
////        successText: null,          // Thành công
////        errorText: null,            // Lỗi
////        listErrorText: null,        // Danh sách tập tin lỗi
////        btnSuccessText: null,       // Tiếp tục
////        btnRefreshText: null,       // Tải lại tệp lỗi
////        btnCancelText: null         // Hủy
////    }
////    UploadFile(files, obj);
////}

////var loadContentWord = function (fileName) {
////    $.ajax({
////        url: _RootBase + "DocExam/WordToHTML",
////        data: {
////            FileName: fileName
////        },
////        //contentType: "application/json; charset=utf-8",
////        dataType: "text",//dữ liệu trả về dạng text
////        type: "POST",
////        beforeSend: function (data) {
////            InitDialogCourse({
////                id: 'form_import_result',
////                fullscreen: true,
////                width: $(window).width() * 0.9,
////                title: _localizer.kiemtradulieu,
////                body: '<div id="k-dialog-custom" class="k-dialog-custom k-content"></div>',
////                footer: {
////                    button: [
////                        {
////                            text: _localizer.huy,
////                            isClose: true,
////                            style: 'background-color:#B7BDD3;',
////                            click: function (e) {
////                                InitDialogCourse({
////                                    id: 'dialog-cancel-import',
////                                    fullscreen: false,
////                                    width: $(window).width() * 0.6,
////                                    title: _localizer.xacnhanhuynhapcauhoi,
////                                    body: ''
////                                        + '<div class="text-center" style="font-size: 16px;">'
////                                        + '<p>' + _localizer.cauhoichuaduocluuvaohethong + '</p>'
////                                        + '<p class="bigger-110 bolder center grey"><i class="ace-icon fa fa-hand-o-right blue bigger-120"></i> ' + _localizer.xacnhanhuyquatrinhthemcauhoi + '?</p>'
////                                        + '</div>',
////                                    footer: {
////                                        button: [
////                                            {
////                                                text: _localizer.huy,
////                                                isClose: true,
////                                                style: 'background-color:#B7BDD3;',
////                                            },
////                                            {
////                                                text: _localizer.dongy,
////                                                style: 'background-color:#5C77D0;',
////                                                click: function () {
////                                                    $('#dialog-cancel-import').modal('hide');
////                                                },
////                                                isClose: false,
////                                            },
////                                        ]
////                                    }
////                                });

////                                return false;
////                            },
////                        },
////                        {
////                            text: _localizer.themmoi,
////                            style: 'background-color:#5C77D0;',
////                            click: function (e) {
////                                var Questions = $("#ImportQuestionsFromWord").data('Questions');
////                                var point_import = $("#point_input_import").val();
////                                console.log(Questions)
////                                var Questions_Temp = [];
////                                if (Questions && Questions.length > 0) {
////                                    Questions.forEach(function (e) {
////                                        if ($('#k-dialog-custom .box-ques .ques input[type="checkbox"][value="' + e.Idx + '"]').prop('checked')) {
////                                            Questions_Temp.push(e);
////                                        }
////                                    });
////                                }
////                                //var question = {
////                                //    qbankid: content_question[0].qbankid,
////                                //    ordinal: content_question[0].qbankid,
////                                //    point: point,
////                                //    content: content_question[0].content,
////                                //    solution_key: content_question[0].solution_key,
////                                //    explanation: content_question[0].explanation,
////                                //    question_bank_choice: JSON.stringify(content_question[0].question_bank_choice),
////                                //    question_bank_suggest: JSON.stringify(content_question[0].question_bank_suggest),
////                                //    v_questiontype: content_question[0].v_questiontype,
////                                //    v_questiontypename: $('#question_type').data('kendoComboBox').text(),
////                                //    is_shuffle_ans: is_shuffle_ans
////                                //};
////                                var pointtemp = $('td:last-child').attr('data-value');
////                                var count = 1;

////                                if (pointtemp == undefined) {
////                                }
////                                else {
////                                    var no = pointtemp;
////                                    console.log(no)
////                                    count = no;
////                                }
////                                for (var i = 0; i < Questions.length; i++) {
                                    
////                                    var html = `<tr class="import">
////    <td class="counter">`+ count + `</td>
////    <td>`+ Questions[i].content + `</td>
////    <td id="point">`+ point_import + `</td>
////    <td>Lựa chọn đơn</td>
////    <td>
////        <a onclick="viewItem(`+ count + `)" rel="` + count + `" title="` + _localizer.xemchitiet + `" class="btn btn-success" href="#">
////            <i class="fa fa-list"></i>
////        </a>
////        <a onclick="editItem(this,`+ count + `)" rel="` + count +`" title="` + _localizer.chinhsua + `" class="btn btn-info" href="#">
////            <i class="fa fa-edit"></i>
////        </a>
////        <a onclick="removeItem(this,`+ count + `)" rel="` + count +`" title="` + _localizer.xoa + `" class="btn btn-danger" href="#">
////            <i class="fa fa-trash-o"></i>
////        </a>
////<a onclick="move(this,`+ count + `,'up')" rel="` + count +`" title="` + _localizer.dichuyenlen + `" class="btn btn-success" href="#">
////                                                        <i class="k-icon k-i-arrow-up"></i>
////                                                    </a>
//// <a onclick="move(this,`+ count + `,'down')" rel="` + count +`" title="` + _localizer.dichuyenxuong + `" class="btn btn-success" href="#">
////                                                        <i class="k-icon k-i-arrow-down"></i>
////                                                    </a>
////    </td>
////    </tr>`;
////                                    count++
////                                    $('.cnt_question').append(html);
////                                }
////                                point_import = parseFloat(point_import * Questions.length);
////                                $('#total_point').val(point_import);
////                                //
////                                //initDialogSaveExQB(Questions_Temp);
////                                //
////                                //Questions = Questions_Temp;
////                                //if (Questions && Questions.length > 0) {
////                                //    InitDialogCourse({
////                                //        fullscreen: false,
////                                //        width: $(window).width() * 0.6,
////                                //        title: _localizer.xulythemcauhoivaohethong,
////                                //        body: '<div class="clearfix" id="progress-addques">'
////                                //            + '<div class="text-center progress-name" style="padding: 1em 0 2em;"><i class="fa fa-spinner fa-2x text-primary" style="vertical-align:sub;"></i>&nbsp;&nbsp;<span>' + _localizer.dangthemcauhoi + '</span></div>'
////                                //            + '<div class="clearfix">'
////                                //            + '<div class="progress" style="height:6px;margin: 0;">'
////                                //            + '<div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%"></div>'
////                                //            + '</div>'
////                                //            + '</div>'
////                                //            + '<div class="clearfix text-center" style="padding: 0.5em 0;"><span class="progress-status" style="padding: 0 15px;" ></span></div>'
////                                //            + '<div class="progress-result"></div>'
////                                //            + '</div>'
////                                //    });
////                                //    var counter = 0
////                                //        , lenQues = Questions.length
////                                //        , arrError = []
////                                //        , ques = Questions[counter]
////                                //        , getReturnMessenger = function (returnCode) {
////                                //            var msg = null;
////                                //            switch (returnCode) { case 0: msg = _localizer.error0; break; case 8511: msg = _localizer.error8511; break; case 8512: msg = _localizer.error8512; break; case 8513: msg = _localizer.error8513; break; case 8514: msg = _localizer.error8514; break; case 8515: msg = _localizer.error8515; break; case 8516: msg = _localizer.error8516; break; case 8517: msg = _localizer.error8517; break; case 8518: msg = _localizer.error8518; break; case 8519: msg = _localizer.error8519; break; case 8500: msg = _localizer.error8500; break; case 8508: msg = _localizer.error8508; break; case 8520: msg = _localizer.error8520; break; case 8510: msg = _localizer.error8510; break; case 8506: msg = _localizer.error8506; break; case 8507: msg = _localizer.error8507; break; case 8529: msg = _localizer.error8529; break; case 8510: msg = _localizer.error8510; break; case 8503: msg = _localizer.error8503; break; case 8504: msg = _localizer.error8504; break; case 8505: msg = _localizer.error8505; break; case 8500: msg = _localizer.error8500; break; case 10004: msg = _localizer.error10004; break; default: msg = _localizer.themcauhoithatbai + '(#' + returnCode + ')'; break; }

////                                //            return msg;
////                                //        };

////                                //    _successData = [];
////                                //    $.each(Questions, function (Idx, ques) {
////                                //        //thêm dữ liệu câu hỏi vào từng câu hỏi
////                                //        $.extend(ques, data);

////                                //        AddUpdateExQB(ques, function (e) {
////                                //            counter++;

////                                //            $('#progress-addques .progress-bar').css('width', (Math.ceil((counter / lenQues) * 100)) + '%');
////                                //            $('#progress-addques .progress-status').text(counter + '/' + lenQues);

////                                //            if (e && e.returnCode) {
////                                //                var returnCode = parseInt(e.returnCode + '');

////                                //                if (returnCode == 0) {
////                                //                    _successData.push({ res: e });
////                                //                }
////                                //                else {
////                                //                    arrError.push({ ques: ques, msg: getReturnMessenger(returnCode) });
////                                //                }

////                                //                if (counter === lenQues) {
////                                //                    $('#progress-addques .progress-name').html('<i class="fa fa-check-circle fa-2x text-success" style="color:#59A84B;vertical-align:sub;"></i>&nbsp;&nbsp;<span>' + _localizer.themcauhoihoantat + '</span>');
////                                //                    $('#progress-addques .progress-bar').addClass('progress-bar-success');

////                                //                    $('.k-grid.k-widget .k-pager-refresh .k-i-reload').trigger('click');

////                                //                    if (arrError.length === 0) {
////                                //                        alert(_localizer.quatrinhthemcauhoihoantat)
////                                //                        if (_successCallBack && typeof (_successCallBack) == 'function') {
////                                //                            _successCallBack();
////                                //                        }
////                                //                        $("#ImportQuestionsFromWord").data('Questions', null);
////                                //                    }
////                                //                    else {
////                                //                        var htmlError = '<div class="well well-sm" style="margin:0;">';
////                                //                        htmlError += '<table class="table">';
////                                //                        htmlError += '<caption><strong>' + _localizer.gaploitrongquatrinhthemdulieu + '</strong></caption>';
////                                //                        htmlError += '<tr><th style="width: 30%;">' + _localizer.thutucauhoi + '</th><th>' + _localizer.loi + '</th></tr>';

////                                //                        arrError.forEach(function (e) {
////                                //                            htmlError += '<tr><td class="text-center">' + e.ques.Idx + '</td><td>' + e.msg + '</td></tr>';
////                                //                        });

////                                //                        htmlError += '</table>';
////                                //                        htmlError += '</div>';

////                                //                        $('#progress-addques .progress-result').html(htmlError);
////                                //                    }

////                                //                    if (isMobile()) {
////                                //                        gotoPage(1);
////                                //                    }
////                                //                }

////                                //            };
////                                //        });
////                                //    });

////                                //}
////                                //else {
////                                //    alert(_localizer.khongtimthaydulieucauhoi)

////                                //}
////                                //
////                                $('#form_import_result').modal('hide');
////                                $('#form_import').modal('hide');
////                                return true;
////                            },
////                            isClose: false,
////                        },
////                    ]
////                }
////            });
////        },
////        success: function (data) {
////            if (data) {
////                $('#k-dialog-custom').append('<div class="data-html" style="display:none">' + data + '</div>');
////                //$('#k-dialog-custom .Header').parent().remove();
////                //$('#k-dialog-custom p').first().remove();
////                $('#k-dialog-custom img').each(function () {
////                    $(this).attr('src', UrlFileWord + $(this).attr('src'));
////                });
////                $('#k-dialog-custom p').each(function (Idx, item) {
////                    if ($(this).text().match(/Spire.Doc/g)) {
////                        $(this).remove();
////                    }
////                });

////                setTimeout(function () {
////                    var Questions = null;

////                    ////
////                    //if ($('#k-dialog-custom').text().indexOf('[<br>]') >= 0) {
////                    //    Questions = getQuestionFromData_From1($('#k-dialog-custom'));
////                    //}
////                    //else {
////                        Questions = getQuestionFromData_From2($('#k-dialog-custom'));
////                    //}
////                    console.log(Questions)
////                    //quét xong xóa sì tai css
////                    $('#k-dialog-custom').find('style').remove();

////                    $("#ImportQuestionsFromWord").data('Questions', Questions);

////                    //
////                    $('#k-dialog-custom .wt-waiting').remove();
////                    $('#k-dialog-custom').append(renderExQNR(Questions));

////                    $('#k-dialog-custom .approval-import').change(function () {
////                        $('#k-dialog-custom .total-approval-import').text($('#k-dialog-custom .approval-import:checked').length);
////                    });

////                })
////            }
////            else {
////                $('#k-dialog-custom').html(_localizer.khongtimthaydulieu);
////            }
////        },
////        error: function (err) {
////            $('#k-dialog-custom').html(_localizer.khongtimthaydulieu);
////        }
////    });
////}

////var renderExQNR = function (Questions) {
////    var html = '<h4 class="total-selected-question">' + _localizer.socauhoidachon + ': <b class="total-approval-import">' + Questions.length + '</b></h4>'

////    html += '<div class="col-xs-12 no-padding box-ques">'

////    Questions.forEach(function (question) {
////        var randomId = Math.floor(Math.random() * 999999999);

////        html += '<div class="ques ques-view-sa">';
////        html += '<div class="row no-margin">';

////        html += '<div class="col-xs-1 no-padding idx">';
////        html += '<h1>';
////        html += '<span>' + question.Idx + '</span>'
////        html += '</h1>'
////        html += '<div style="margin-top:5px;" class="confirm-question-checkbox">';
////        html += '<input type="checkbox" class="custom-input approval-import" id="' + randomId + '" name="' + randomId + '_' + question.Idx + '" value="' + question.Idx + '" checked />';
////        html += '<label class="for-custom-input" for="' + randomId + '"></label>';
////        html += '</div>';
////        html += '</div>';

////        html += '<div class="col-xs-11 no-padding ques-cnt">';
////        html += '<div class="section-cnt">' + question.content + '</div>';
////        html += '<div class="ques-anw">';

////        if (question.question_bank_choice.length > 0) {
////            html += '<ul class="ul-anw-choice">';
////            question.question_bank_choice.forEach(function (detail) {
////                html += '<li class="li-anw-choice">';
////                html += '<input type="radio" class="custom-input" id="' + question.Idx + '-' + detail.Idx + '" name="' + question.Idx + '-' + detail.Idx + '" ' + (question.solution_key === detail.Idx ? " checked " : "") + ' onclick="return false"/>';
////                html += '<label class="label-choice for-custom-input" for="' + question.Idx + '-' + detail.Idx + '">';
////                html += '</label>';
////                html += '<div class="div-content">' + detail.choice_content + '</div>';
////                html += '</li>';
////            });
////            html += '</ul>';
////        }
////        else {
////            html += '<div class="alert alert-danger" style="margin:15px 0 0 0"><strong style="font-weight:600">' + _localizer.cauhoichuadungdinhdang + '</strong></div>';
////        }

////        html += '</div>';
////        html += '</div>';

////        html += '</div>';
////        html += '</div>';
////        html += '<hr />';

////    });

////    html += '</div>';

////    return html;
////}


////var getQuestionFromData_From2 = function (e) {
////    var question_content = [];

////    var _Question_Temp = { content: "", explanation: "", is_shuffle_ans: false, qbankid:"" };
////    var _Answer_Arr_Temp = [];
////    var _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: ""};

////    var regexQuestion = /(((Câu|Question){1})(\s)([0-9]+)(?=\.))/g;
////    var regexAnswer = /(([A-Z]{1})(?=\.))/g; // A. B. C. D. ---- Z.

////    var counter = 1;
////    var defined = {
////        v_questiontypename: "Lựa chọn đơn",
////        v_questiontype: 9401, // lựa chọn đơn        
////    }

////    var dataHtml = e.find('.data-html > div');

////    //fix table
////    dataHtml.find('table')
////        .addClass('import-table')
////        .css({ width: '100%' })
////    //.attr({ border: 0, padding: 0 });
////    //dataHtml.find('tr').css({ height: 'auto', margin: 0, padding: 0, border: 0 });
////    //dataHtml.find('td').css({ width: 'auto', margin: 0, padding: 0, border: 0 });
////    dataHtml.find('td').css({ width: 'auto' });

////    //fix image
////    dataHtml.find('img')
////        .css({ 'max-width': 'none', 'vertical-align': 'middle' });

////    dataHtml.find('> *').each(function (quesid, ques) {

////        //$(ques).css({ margin: 0, 'text-indent': 0 });
////        //$(ques).removeAttr('class');

////        //lấy đáp án
////        var isQuestion = false, isAnswer = false, matchAnswer = null;

////        if ($(ques).text().trim() || $(ques).find('img').length > 0) {

////            //check đoạn là câu hỏi
////            if ($(ques).text().trim().substring(0, 16).match(regexQuestion)) {

////                //xóa key "Câu <n>. "
////                var strKey = "";
////                $(ques).find('span').each(function (i, e) {
////                    strKey += $(e).text();

////                    if (strKey.substring(0, 16).match(regexQuestion)) {
////                        if ($(e).next().length > 0 && !$(e).next().text().trim() && ($(e).next()[0].nodeName + "").toUpperCase() === 'SPAN') {
////                            $(e).next().remove();
////                        }

////                        $(e).prevAll().remove();
////                        $(e).remove();
////                        return false;
////                    }
////                });

////                isQuestion = true;
////            }
////            //check đoạn là đáp án
////            else {
////                $(ques).find('span').each(function (ansid, ans) {
////                    if ($(ans).text().trim().length > 0) {
////                        if ($(ans).css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).css('font-weight')) >= 500) {
////                            matchAnswer = $(ans).text().trim().substring(0, 2).match(regexAnswer);

////                            //nếu element chưa phải đáp án thì thử nối với element tiếp theo
////                            if (matchAnswer === null && $(ans).next().length > 0 && $(ans).next().text().trim().length > 0) {
////                                matchAnswer = ($(ans).text().trim() + $(ans).next().text().trim()).substring(0, 2).match(regexAnswer);
////                            }

////                            //đáp án là phương án chọn được gạch chân hoặc màu đỏ(red), hoặc màu xanh(blue)
////                            if (matchAnswer !== null) {
////                                //if ($(ans).css("text-decoration").indexOf('underline') >= 0
////                                //    || ($(ans).css('color') + "").replace(/\s/gm, '') === 'rgb(255,0,0)'
////                                //    || ($(ans).css('color') + "").replace(/\s/gm, '') === 'rgb(0,0,255)')
////                                if ($(ans).css("text-decoration").indexOf('underline') >= 0) {
////                                    _Question_Temp.solution_key = matchAnswer.toString();
////                                }
////                                isAnswer = true;
////                            }
////                        }
////                    }
////                });
////            }

////            //đoạn này là câu hỏi hoặc đoạn tiếp theo chưa phải đáp án
////            if (isQuestion || (_Question_Temp.content && !isAnswer)) {
////                $(ques).find('*').each(function (qcid, ques_content) {
////                    if ($(ques_content).css('vertical-align') === 'baseline' && $(ques_content).prop('tagName').toLowerCase() !== 'font') {
////                        $(ques_content).css({ 'font-family': '', 'font-size': '', 'font-style': '', 'color': '', 'background-color': '', 'vertical-align': '' });

////                        if (!$(ques_content).attr('style')) {
////                            $(ques_content).removeAttr('style');
////                        }
////                    }
////                });

////                //if (($(ques)[0].nodeName + "").toUpperCase() !== 'SPAN' || $(ques).text().trim().length > 0) {


////                _Question_Temp.content += ($(ques)[0].outerHTML).replace(/(\&nbsp\;)+/gm, '&nbsp;');
////                //}
////            }

////            //chưa tới phần đáp án thì tiếp tục cộng dồn dẫn đề

////            if (_Question_Temp.content && isAnswer) {
////                var countAnswer = 0;

////                $(ques).find('> *').each(function (ansid, ans) {
////                    var matchAnswer = null;
////                    var fixAnswer = false;

////                    if ($(ans).text().trim().length > 0) {

////                        if (($(ans).css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).css('font-weight')) >= 500)) {
////                            matchAnswer = $(ans).text().trim().substring(0, 2).match(regexAnswer);

////                            if (matchAnswer === null && $(ans).next().length > 0 && $(ans).next().text().trim().length > 0) {
////                                matchAnswer = ($(ans).text().trim() + $(ans).next().text().trim()).substring(0, 2).match(regexAnswer);

////                                if (matchAnswer !== null) {
////                                    return;
////                                }
////                            }
////                        }

////                        if (matchAnswer === null
////                            && $(ans).prev().length > 0 && $(ans).prev().text().trim().length > 0
////                            && ($(ans).prev().css('font-weight').indexOf('bold') >= 0 || parseInt($(ans).prev().css('font-weight')) >= 500)) {

////                            matchAnswer = ($(ans).prev().text().trim() + $(ans).text().trim()).substring(0, 2).match(regexAnswer);

////                            //nếu element chứa >1 giá trị thì chỉ xóa mỗi ký tự . và giữ lại element
////                            if (matchAnswer !== null && $(ans).text().trim() !== '.') {
////                                $(ans)[0].innerHTML = ($(ans)[0].innerHTML).trim().replace('.', '');
////                                fixAnswer = true;
////                            }
////                        }
////                    }

////                    if (matchAnswer !== null) {
////                        //khi tìm thấy đáp án A. or ... Z.

////                        if (_Answer_Temp.choice_content) {
////                            _Answer_Arr_Temp.push(_Answer_Temp);
////                            _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: "" };
////                        }

////                        // gán cho lần sau duyệt mà tìm thấy
////                        _Answer_Temp.Idx = matchAnswer.toString();

////                        if (fixAnswer) {
////                            matchAnswer = null;
////                        }
////                    }

////                    if (matchAnswer === null) {
////                        if ($(ans).css('vertical-align') === 'baseline' && $(ans).prop('tagName').toLowerCase() !== 'font') {
////                            $(ans).css({ 'font-family': '', 'font-size': '', 'font-style': '', 'color': '', 'background-color': '', 'vertical-align': '' });

////                            if (!$(ans).attr('style')) {
////                                $(ans).removeAttr('style');
////                            }
////                        }

////                        //if (($(ans)[0].nodeName + "").toUpperCase() !== 'SPAN' || $(ans).text().trim().length > 0) {

////                        //_Answer_Temp.AnswerHTML += $(ans)[0].outerHTML;
////                        if (_Answer_Temp.Idx) {
////                            _Answer_Temp.choice_content += ($(ans)[0].outerHTML).replace(/(\&nbsp\;)+/gm, '&nbsp;');
////                        }
////                        //}
////                    }

////                    //duyệt hết dữ liệu
////                    if ($(ans).next().length === 0 && _Answer_Temp.choice_content) {
////                        _Answer_Arr_Temp.push(_Answer_Temp);
////                        _Answer_Temp = { qbank_choiceid: "", choice_content: "", idx: "" };
////                    }
////                });
////            }
////        }

////        //lưu câu hỏi
////        if (_Question_Temp.content) {
////            if ($(ques).next().length == 0
////                || ($(ques).next().length > 0 && $(ques).next().text().trim().substring(0, 16).match(regexQuestion))
////                || $(ques).next().length > 0 && $(ques).next().text().trim().indexOf('HẾT') >= 0) {

////                //fix content question
////                _Question_Temp.content = (function (content) {
////                    var thisHtml = $('<div/>').html(content);


////                    //p
////                    var innerHTMLs_p = thisHtml.find('>*').map(function () {
////                        $(this).css({ margin: 0, 'text-indent': 0 });
////                        $(this).removeAttr('class');

////                        //span,img,...
////                        var innerHTMLs = $(this).find('>*').map(function () {
////                            if ((this.nodeName || '').toLowerCase() == 'span' && !this.getAttribute('style')) {
////                                return this.textContent;
////                            }
////                            else if ((this.nodeName || '').toLowerCase() == 'a') {
////                                return this.innerHTML;
////                            }
////                            return this.outerHTML;
////                        }).get();

////                        return $(this).html(innerHTMLs.join(''))[0].outerHTML;
////                    }).get();

////                    //
////                    return innerHTMLs_p.join('');
////                })(_Question_Temp.content);

////                //fix content answer
////                _Answer_Arr_Temp.forEach(function (answer) {
////                    answer.content = (function (content) {
////                        var thisHtml = $('<div/>').html(content);
////                        var firstElement = thisHtml.find('>*').first();
////                        if (firstElement.length && (firstElement.get(0).nodeName + '').toLowerCase() === 'span' && firstElement.text().trim() === '') {
////                            thisHtml.find('>*:first-child').remove();
////                        }

////                        //
////                        var innerHTMLs = thisHtml.find('>*').map(function () {
////                            if ((this.nodeName || '').toLowerCase() == 'span' && !this.getAttribute('style')) {
////                                return this.textContent;
////                            }
////                            return this.outerHTML;
////                        }).get();

////                        return innerHTMLs.join('');
////                    })(answer.choice_content);
////                });

////                //_Question_Temp.Answer = _Answer_Arr_Temp;
////                _Question_Temp.question_bank_choice = _Answer_Arr_Temp;

////                _Question_Temp.Idx = (counter++)
////                _Question_Temp.qbankid = _Question_Temp.Idx

////                $.extend(_Question_Temp, defined);
////                //_Question_Temp.question_bank_choice = JSON.stringify(_Answer_Temp);
////                question_content.push(_Question_Temp);
////                _Question_Temp = { explanation: "", is_shuffle_ans: false, content: "" };
////                _Answer_Arr_Temp = [];
////            }
////        }

////        //dừng vòng lặp
////        if ($(ques).next().length > 0 && $(ques).next().text().trim().indexOf('HẾT') >= 0) {
////            return false;
////        }
////    });

////    return _Question_Arr;
////}


////var _successData = [];
////var _successCallBack = function () {

////}