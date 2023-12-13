var getMaxZIndex = function () {
    var maxZIndex = Math.max.apply(null, $.map($('div').not('.cke,.pace-inactive .pace-progress,.toast,#toast-container,.sidenav,.cke_dialog_background_cover,.ML__popover,.popover')
        , function (e, i) {
            if ($(e).css('position') !== 'static')
                return parseInt($(e).css('z-index')) || 1;
        })
    );

    //nếu z-index vượt ngưỡng tối đa, thì lấy tối đa z-index trừ đi 2, max(z-index) = max(int) = Math.pow(2,31)-1) = 2147483647
    return Math.min(maxZIndex, Math.pow(2, 31) - 4);
}
function isMobile() {
    var isMobile = false;
    var media = window.matchMedia("only screen and (max-width: 767px)")

    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && media.matches) {
        isMobile = true;
    }
    return isMobile;
}

$(document).on('change', 'input.form-control', function () {
    var text = $(this).val();
    $(this).val(removeHTML(text));
});
//Tạo dialog
//InitDialogCourse({
//    id: 'abc',
//    width: 600,
//    title: 'Thông báo',
//    body: '<div>Bạn có muốn xóa nội dung này!</div>'
//        + '<div>Nội dung này cần phải xóa bạn có muốn xóa liền không?'
//    ,
//    icon: 'iconmoon-NotifyDelete',
//    footer: {
//        //text: 'Text null sẽ bị ẩn!',
//        button: [
//            {
//                //css: 'btn-primary',
//                text: 'Quay lại',
//                isClose: true,
//                style: 'background-color:#B7BDD3;',
//                //click: function () {
//                //    alert("Đóng Dialog, nếu truyền Iclose = false sẽ không đóng")
//                //}
//            },
//            {
//                //css: 'btn-success',
//                text: 'Đồng ý',
//                style: 'background-color:#5C77D0;',
//                click: function () {
//                    alert("Excute Function, Successfull");
//                    //RemoveDialog();
//                },
//                isClose: true,
//            },
//        ]
//    }
//});
var InitDialogCourse = function (obj) {
    if (!obj) obj = {};

    var id = obj.id || 'modal-custom';

    var htmlHeader = function () {
        if (obj.title) {
            return '<div class="modal-header">'
                + '<h4 class="modal-title">' + obj.title + '</h4>'
                + (obj.fullscreen == true ? '<button type="button" class="iconfullscreen"><i class="iconmoon iconmoon-full2"></i></button>' : '')
                + (obj.disableClose == true ? '' : '<button type="button" class="close" aria-label="' + _localizer_layout.dong + '"><i class="iconmoon iconmoon-Close"></i></button>')
                + '</div>';
        }
        return '';
    };

    var htmlBody = function () {
        if (obj.body) {
            return '<div class="modal-body">' + obj.body + (obj.icon ? '<p class="cnt-icon"><i class="iconmoon ' + obj.icon + '" ></i></p>' : '') + '</div>';
        }
        return '';
    };
    var cls_btn_xs = '';
    if (isMobile()) {
        cls_btn_xs = 'btn-xs';
    }
    var htmlFooter = function () {
        if (obj.footer) {
            var html = '';
            html += '<div class="modal-footer">';
            if (obj.footer.text) {
                html += '<div>' + obj.footer.text + '</div>';
            }
            if (obj.footer.button) {
                $.each(obj.footer.button, function (idx, val) {
                    html += '<button type="button" ' + (val.style ? 'style="' + val.style + '"' : '') + ' ' + (val.isClose ? 'data-dismiss="modal"' : '') + ' class="btn btn-custom ' + cls_btn_xs + ' ' + (val.css ? val.css : '') + '">' + val.text + '</button>';
                });
            }
            html += '</div>';
            return html;
        }
        return '';
    };

    var maxZIndex = getMaxZIndex();

    var html = '';
    html += '<div class="modal fade ' + (obj.class ? obj.class : '') + '" data-backdrop="' + (obj.backdrop ? obj.backdrop : 'static') + '" id="' + id + '" style="z-index:' + (maxZIndex + 2) + '">';
    html += '<div class="modal-dialog modal-custom-icon ' + (obj.fullscreen == true ? '' : 'modal-dialog-centered') + '" style="' + (obj.width ? 'width:' + (!isMobile() ? obj.width + 'px;max-width:' + (!isMobile() ? obj.width + 'px;' : 'auto;') : 'auto;') : '') + '">';
    html += '<div class="modal-content">';
    html += htmlHeader() + htmlBody() + htmlFooter();
    html += '</div></div></div>';
    $('body').addClass('modal-open').append(html);
    $('#' + id).modal();
    //if (obj.fullscreen) {
    //    setTimeout(function () {
    //        $('#' + id).removeClass('invisible');
    //    }, 1000)
    //}
    $('#' + id).on('shown.bs.modal', function () {
        $('#' + id).next('.modal-backdrop').css('z-index', ((maxZIndex + 2) - 1));
        $('.pace-progress').css('z-index', (maxZIndex + 3));
        //$(this).find('input:text:visible:first').focus();
        //$(this).find('[autofocus]').focus();
    })
    $('#' + id).on('hidden.bs.modal', function () {
        $('#' + id).remove();
        if ($('.modal:visible').length) {
            $('body').addClass('modal-open');
        }
        else {
            $('body').removeClass('modal-open');
        }
    })
    $('#' + id).addClass(obj.cssClass || '');
    $('#' + id + ' .modal-header button[class="close"]').on('click', function () {
        if (obj.isconfirm) {
            InitDialogCourse({
                id: 'confirmCloseDialog',
                width: 600,
                title: _localizer_layout.thongbao,
                body: obj.confirmtitle ? obj.confirmtitle : '<div style="font-size:18px;"><div>' + _localizer_layout.dulieucuabansekhongduocluu + '</div>'
                    + '<div>' + _localizer_layout.bancochacchan + '</div></div>'
                ,
                icon: 'iconmoon-TestTimeOut',
                footer: {
                    button: [
                        {
                            text: _localizer_layout.quaylai,
                            isClose: true,
                            style: 'background-color:#B7BDD3;',
                        },
                        {
                            //css:'btn-submit',
                            text: _localizer_layout.dongy,
                            style: 'background-color:#5C77D0;',
                            click: function () {
                                $('#confirmCloseDialog').modal('hide');
                                $('#' + id).modal('hide');
                            },
                            isClose: false,
                        },
                    ]
                }
            });
        }
        else {
            $('#' + id).modal('hide');
        }
    })

    var thisModal = $('#' + id);
    $('#' + id + ' .modal-footer .btn').each(function (idx) {
        var ExcuteFunc = obj.footer.button[idx].click;
        if (ExcuteFunc) { $(this).click(function () { ExcuteFunc(thisModal); }); }
    });
    //gọi sự kiện fullscreen
    $('#' + obj.id).on('click', '.iconfullscreen', function () {
        $('#' + obj.id).find('.modal-content').addClass('fullscreen');
        $('#' + obj.id).find('.modal-header .iconfullscreen').removeClass('iconfullscreen').addClass('iconofffullscreen');
        $('#' + obj.id).find('.modal-header .iconmoon.iconmoon-full2').removeClass('iconmoon-full2').addClass('iconmoon-full1');
    });
    //gọi sự kiện tắt fullscreen
    $('#' + obj.id).on('click', '.iconofffullscreen', function () {
        $('#' + obj.id).find('.modal-content').removeClass('fullscreen');
        $('#' + obj.id).find('.modal-header .iconofffullscreen').removeClass('iconofffullscreen').addClass('iconfullscreen');
        $('#' + obj.id).find('.modal-header .iconmoon.iconmoon-full1').removeClass('iconmoon-full1').addClass('iconmoon-full2');
    });
    //bắt sự kiện phím    
    $(document).off('keydown').on("keydown", function (event) {
        //esc
        if (event.which == 27) {
            if (obj.autoClose != false) {
                $('#' + id).modal('hide');
            }
            //console.log('remove');
        }
        //enter
        if (event.which == 13) {
            $('#' + id + ' .modal-footer button[type="button"].btn-submit').trigger('click');
        }
        //console.log(event.which);
    });
    if (typeof obj.callback === 'function') {
        obj.callback();
    }
    return thisModal;
}

//ckeditor
load_editor = function (obj) {

    if (CKEDITOR.env.ie && CKEDITOR.env.version < 9)
        CKEDITOR.tools.enableHtml5Elements(document);

    // The trick to keep the editor in the sample quite small
    // unless user specified own height.
    CKEDITOR.env.isCompatible = true;
    CKEDITOR.config.height = obj.height || 150;
    CKEDITOR.config.width = 'auto';
    CKEDITOR.timestamp = new Date().valueOf();
    var initCKEditor = (function () {
        var wysiwygareaAvailable = isWysiwygareaAvailable(),
            isBBCodeBuiltIn = !!CKEDITOR.plugins.get('bbcode');

        return function () {
            //remove if exist
            if (CKEDITOR.instances[obj.id]) {
                CKEDITOR.instances[obj.id].destroy();
            }
            var editorElement = CKEDITOR.document.getById(obj.id);
            // :(((

            // Depending on the wysiwygarea plugin availability initialize classic or inline editor.
            if (wysiwygareaAvailable) {
                if (obj.isInline) {
                    editorElement.setAttribute('contenteditable', 'true');
                    CKEDITOR.disableAutoInline = true;
                    CKEDITOR.inline(obj.id);
                    CKEDITOR.instances[obj.id].config.extraPlugins += 'sourcedialog,';

                }
                else {
                    CKEDITOR.replace(obj.id);
                }
            } else {
                editorElement.setAttribute('contenteditable', 'true');
                CKEDITOR.inline(obj.id);

                // TODO we can consider displaying some info box that
                // without wysiwygarea the classic editor may not work.
            }
            if (obj.onChange) {
                CKEDITOR.instances[obj.id].on('change', obj.onChange);
            }
            CKEDITOR.instances[obj.id].config.placeholder = obj.placeholder || '';
            CKEDITOR.instances[obj.id].on('instanceReady', function () {
                if ($('#cke_' + obj.id).length > 0) {
                    var index_max = getMaxZIndex();
                    $('#cke_' + obj.id).css('z-index', (index_max + 1));
                }
            });
            if (obj.toolbar) {
                CKEDITOR.instances[obj.id].config.toolbar = obj.toolbar;
            }
        };

        function isWysiwygareaAvailable() {
            // If in development mode, then the wysiwygarea must be available.
            // Split REV into two strings so builder does not replace it :D.
            if (CKEDITOR.revision == ('%RE' + 'V%')) {
                return true;
            }

            return !!CKEDITOR.plugins.get('wysiwygarea');
        }
    })();

    initCKEditor();
}
function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');

    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }

    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}
uploadApi = function (API_UPLOAD, file, callback, options) {
    options = options || {};

    var formData = new FormData();
    formData.append("path", options.subFolder || null);
    formData.append("types", options.fileType || null);
    formData.append("file", file);
    formData.append("isconvertvideo", options.isconvertvideo || false);
    formData.append("base64", options.base64 || false);
    formData.append("issubfolder", options.issubfolder === false ? false : true);
    var loading = $('body');
    var z_max_index = getMaxZIndex();
    var html_modal = `<div style="z-index:` + (z_max_index + 2) + `" class="modal fade" data-backdrop="static" id="modal_upload_file" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">`+ _localizer_layout.taitaptinlen + `</h5>        
          </div>
          <div class="modal-body">
            <div id="progress_file_upload" class="form-group progress hidden" title="`+ _localizer_layout.quatrinhtaifilelenhethong + `" style="margin-bottom:5px;">
                   <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                         <span class="progress-bar-status"></span>
                   </div>
           </div>
           <div>
          </div>
        </div>
      </div>
    </div>`;
    $('body').append(html_modal);
    var progress = $('#progress_file_upload');
    $.ajax({
        url: API_UPLOAD + "files",
        data: formData,
        processData: false,
        contentType: false,
        async: true,
        type: 'POST',
        beforeSend: function () {
            $('#modal_upload_file').modal();
            $('#modal_upload_file').on('shown.bs.modal', function () {
                $('#modal_upload_file').next('.modal-backdrop').css('z-index', ((z_max_index + 2) - 1));
            })
            progress.removeClass('hidden').removeClass('invisible')
                .find('.progress-bar').removeClass('progress-bar-danger').removeClass('progress-bar-warning').removeClass('progress-bar-success').width(0)
                .find('.progress-bar-status').empty();

            if (loading) {
                loading.addClass('loading');
            }
        },
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress',
                    function (e) {
                        if (e.lengthComputable) {
                            var percent = e.loaded * 100 / e.total;
                            if (percent < 100) {
                                progress
                                    .find('.progress-bar').width(percent + '%')
                                    .find('.progress-bar-status').text(parseInt(percent) + "%");
                            }
                            else {
                                if (options.fileType != null && options.isconvertvideo == true) {
                                    InitDialogCourse({
                                        id: 'video_convert',
                                        width: 600,
                                        disableClose: true,
                                        title: 'Đang xử lý video',
                                        body: '<div style="height:300px"></div>'
                                    });
                                }
                                progress
                                    .find('.progress-bar').width('100%').addClass('progress-bar-striped')
                                    .find('.progress-bar-status').text("Đang xử lý");
                                $('#modal_upload_file').modal('hide');

                            }

                            if (loading) {
                                loading.addClass('loading').attr('data-progress', parseInt(percent) + '%');
                            }
                        }
                    }, false);
                return myXhr;
            }
        },
        complete: function (e) {
            //$('#modal_upload_file').modal('hide');   
            if (loading) {
                loading.removeClass('loading');
            }
        },
        success: function (e) {
            $('#modal_upload_file').modal('hide');
            $('#video_convert').modal('hide');
            init_watting_popup();
            var ReturnName = null;
            if (e) {
                if (e.ReturnCode === "0" || e.ReturnCode === 0 || e.ReturnCode === 0) {
                    //$('#modal_upload_file').modal('hide');
                    if (e.file) {
                        e.fileName = e.file.name;
                        e.PathfileName = e.path + '/' + e.file.name;
                    }
                    ReturnName = options.textSuccess || _localizer_layout.tailenthanhcong;
                    toastr["success"](ReturnName, _localizer_layout.thongbao);
                    setTimeout(function () {
                        $('#modal_upload_file').next('.modal-backdrop').remove();
                        $('#modal_upload_file').remove();
                        $('#video_convert').modal('hide');
                        if ($('.modal:visible').length) {
                            $('body').addClass('modal-open');
                        }
                        else {
                            $('body').removeClass('modal-open');
                        }
                    }, 1500);
                }
                else {
                    if (e.ReturnName) {
                        ReturnName = e.ReturnName;
                    }
                    else {
                        debugger
                        switch (e.ReturnCode) {
                            case '500': { ReturnName = _localizer_layout.error500; break; }
                            case '501': { ReturnName = _localizer_layout.error501; break; }
                            case '502': { ReturnName = _localizer_layout.error502; break; }
                            case '503': { ReturnName = _localizer_layout.error503; break; }
                            case '504': { ReturnName = _localizer_layout.error504; break; }
                            case '505': { ReturnName = _localizer_layout.error505; break; }
                            case '506': { ReturnName = _localizer_layout.error506; break; }
                            default: { ReturnName = _localizer_layout.chuacothongtinmaloi + " (#" + e.ReturnCode + ")"; break; }
                        }
                    }
                    toastr["error"](ReturnName || _localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao)
                    setTimeout(function () {
                        $('#modal_upload_file').next('.modal-backdrop').remove();
                        $('#modal_upload_file').remove();
                        $('#video_convert').modal('hide');
                        if ($('.modal:visible').length) {
                            $('body').addClass('modal-open');
                        }
                        else {
                            $('body').removeClass('modal-open');
                        }
                    }, 500);
                }
            }
            else {
                toastr["error"](ReturnName || _localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao);
                setTimeout(function () {
                    $('#modal_upload_file').modal('hide');
                }, 500)
            }


            if (typeof callback === 'function') {
                remove_watting_popup();
                callback(e);
            }
        },
        error: function (e) {
            if (loading) {
                loading.removeClass('loading');
            }
            $('#modal_upload_file').modal('hide');
            toastr["error"](_localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao);
            if (typeof callback === 'function') {
                callback(e);
            }

            //alert("Hệ thống không có phản hồi", "danger");
        }
    });
};
//upload minio
uploadApi_Minio = function (file, callback, options) {
    options = options || {};

    var formData = new FormData();
    formData.append("subfolder", options.subFolder || null);
    formData.append("types", options.fileType || null);
    formData.append("file", file);
    formData.append("base64", options.base64 || '');
    formData.append("issubfolder", options.issubfolder === false ? false : true);
    formData.append("isconvertvideo", options.isconvertvideo || false);
    var loading = $('body');
    var z_max_index = getMaxZIndex();
    var html_modal = `<div style="z-index:` + (z_max_index + 2) + `" class="modal fade" data-backdrop="static" id="modal_upload_file" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">`+ _localizer_layout.taitaptinlen + `</h5>        
          </div>
          <div class="modal-body">
            <div id="progress_file_upload" class="form-group progress hidden" title="`+ _localizer_layout.quatrinhtaifilelenhethong + `" style="margin-bottom:5px;">
                   <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;">
                         <span class="progress-bar-status"></span>
                   </div>
           </div>
           <div>
          </div>
        </div>
      </div>
    </div>`;
    $('body').append(html_modal);
    var progress = $('#progress_file_upload');
    //console.log(file);
    $.ajax({
        url: _RootBase + "FileManager/UploadFileMinIO",
        data: formData,
        processData: false,
        contentType: false,
        async: true,
        timeout: 0,
        type: 'POST',
        beforeSend: function () {
            $('#modal_upload_file').modal();
            $('#modal_upload_file').on('shown.bs.modal', function () {
                $('#modal_upload_file').next('.modal-backdrop').css('z-index', ((z_max_index + 2) - 1));
            })
            progress.removeClass('hidden').removeClass('invisible')
                .find('.progress-bar').removeClass('progress-bar-danger').removeClass('progress-bar-warning').removeClass('progress-bar-success').width(0)
                .find('.progress-bar-status').empty();

            if (loading) {
                loading.addClass('loading');
            }
        },
        xhr: function () {
            var myXhr = $.ajaxSettings.xhr();
            if (myXhr.upload) {
                myXhr.upload.addEventListener('progress',
                    function (e) {
                        if (e.lengthComputable) {
                            var percent = e.loaded * 100 / e.total;
                            if (percent < 100) {
                                progress
                                    .find('.progress-bar').width(percent + '%')
                                    .find('.progress-bar-status').text(parseInt(percent) + "%");
                            }
                            else {
                                progress
                                    .find('.progress-bar').width('100%').addClass('progress-bar-striped')
                                    .find('.progress-bar-status').text("Đang xử lý");
                                //$('#modal_upload_file').modal('hide');

                            }

                            if (loading) {
                                loading.addClass('loading').attr('data-progress', parseInt(percent) + '%');
                            }
                        }
                    }, false);
                return myXhr;
            }
        },
        complete: function (e) {
            //if (loading) {
            //    loading.removeClass('loading').removeAttr('data-progress'); $('#modal_upload_file').modal('hide');
            //}
        },
        success: function (e) {
            if (loading) {
                loading.removeClass('loading').removeAttr('data-progress');
                $('#modal_upload_file').modal('hide');
            }
            var ReturnName = null;
            if (e) {
                if (e.ReturnCode === "0" || e.ReturnCode === 0 || e.ReturnCode === 0) {

                    if (e.file) {
                        //e.fileName = e.file;
                        e.PathfileName = e.file.file;
                        e.ReturnCode = e.ReturnCode;
                        e.root = e.file.root;
                    }
                    ReturnName = options.textSuccess || _localizer_layout.tailenthanhcong;
                    toastr["success"](ReturnName, _localizer_layout.thongbao);
                    setTimeout(function () {
                        $('#modal_upload_file').next('.modal-backdrop').remove();
                        $('#modal_upload_file').remove();
                        if ($('.modal:visible').length) {
                            $('body').addClass('modal-open');
                        }
                        else {
                            $('body').removeClass('modal-open');
                        }
                    }, 2000);
                }
                else {
                    if (e.returnName) {
                        ReturnName = e.returnName;
                    }
                    else {
                        switch (e.ReturnCode) {
                            case '500': { ReturnName = _localizer_layout.error500; break; }
                            case '501': { ReturnName = _localizer_layout.error501; break; }
                            case '502': { ReturnName = _localizer_layout.error502; break; }
                            case '503': { ReturnName = _localizer_layout.error503; break; }
                            case '504': { ReturnName = _localizer_layout.error504; break; }
                            case '505': { ReturnName = _localizer_layout.error505; break; }
                            case '506': { ReturnName = _localizer_layout.error506; break; }
                            default: { ReturnName = _localizer_layout.chuacothongtinmaloi + " (#" + e.ReturnCode + ")"; break; }
                        }
                    }
                    toastr["error"](ReturnName || _localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao);
                }
            }
            else {
                toastr["error"](ReturnName || _localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao);
            }


            if (typeof callback === 'function') {
                //console.log(e);
                callback(e);
            }
        },
        error: function (e) {
            //$('#modal_upload_file').modal('hide');
            if (loading) {
                loading.removeClass('loading').removeAttr('data-progress'); $('#modal_upload_file').modal('hide');
            }
            toastr["error"](_localizer_layout.hethongtuchoitaptin, _localizer_layout.thongbao);
            if (typeof callback === 'function') {
                callback(e);
            }

            //alert("Hệ thống không có phản hồi", "danger");
        }
    });
};
function getQueryVariableUrl(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return pair[1]; }
    }
    return (false);
}
removeHTML = function (txt) {
    var rex = /(<([^>]+)>)/ig;      // < ... >
    var rexEnter = /(\r?\n|\r\n?)/ig;
    return (txt.replace(rex, "").replace('<', '').replace('>', '').replace(rexEnter, ""));
}
htmlUnescape = function (value) {
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

htmlDecode = function (value) {
    return $('<div/>').html(value).text();
}

htmlEncode = function (value) {
    return $('<div/>').text(value).html();
}

getParamUrl = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || ["", ""])[1].replace(/\+/g, '%20')) || null;
}

var setParamUrl = function (options, isNew) {
    /*
        1. nếu options dạng string "?abc=123,xyz=456" thì mặc định là gán mới param, dang object json thì mặc định là map với param cũ
        2. isNew: gán options là các param mới, không giữ param cũ

        setParamUrl({
            param1: value1,
            param2: value2
        })
        
    */

    if (typeof options === 'string') {
        replaceState(location.origin + location.pathname + '?' + options.replace(/\?/gm, ''));
    }
    else if (typeof options === 'object') {
        var queries = {},
            queries_array = [];

        if (!isNew) {
            var dataSearch = location.search.replace('?', '').split('&');
            if (dataSearch.length > 0) {
                for (var i = 0; i < dataSearch.length; i++) {
                    if (dataSearch[i]) {
                        var data = dataSearch[i].split('=');
                        queries[data[0]] = decodeURIComponent(data[1]);
                    }
                }
            }
            //ghi đè param có sẵn trên url bằng param mới
            Object.assign(queries, options);
        }
        else {
            queries = options;
        }

        //cập nhật lại url
        Object.keys(queries).forEach(function (key) {
            queries_array.push(key + '=' + queries[key]);
        });

        if (queries_array.length > 0) {
            replaceState(location.origin + location.pathname + '?' + queries_array.join('&'));
        }
        else {
            replaceState(location.origin + location.pathname);

        }
    }
    else {
        //cập nhật lại url
        pushState(location.origin + location.pathname);
    }
};

var replaceState = function (url) {
    window.history.replaceState({}, null, url);
};
var pushState = function (url) {
    window.history.pushState(
        {
            change: 'loadState()'
        }, null, url
    );
};

var loadState = function () {
    window.location.reload(true);
};

var initState = function () {
    window.history.replaceState(
        {
            change: 'loadState()'
        }, null, null
    );

    //khởi tạo sự kiện khi back page
    window.addEventListener('popstate', function (e) {
        if (e.state && e.state.change) {
            eval(e.state.change);
        }
    });
};
function getPageList(totalPages, page, maxLength) {
    if (maxLength < 5) throw "maxLength must be at least 5";

    function range(start, end) {
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }

    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
    if (totalPages <= maxLength) {
        // no breaks in list
        return range(1, totalPages);
    }
    if (page <= maxLength - sideWidth - 1 - rightWidth) {
        // no break on left of page
        return range(1, maxLength - sideWidth - 1)
            .concat([0])
            .concat(range(totalPages - sideWidth + 1, totalPages));
    }
    if (page >= totalPages - sideWidth - 1 - rightWidth) {
        // no break on right of page
        return range(1, sideWidth)
            .concat([0])
            .concat(
                range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages)
            );
    }
    // Breaks on both sides
    return range(1, sideWidth)
        .concat([0])
        .concat(range(page - leftWidth, page + rightWidth))
        .concat([0])
        .concat(range(totalPages - sideWidth + 1, totalPages));
}

function pagination_boostrap(obj) {
    var id = obj.id ? ('#' + obj.id + ' ') : '';
    $(id + '.pagination').html('');
    // Total pages rounded upwards
    var totalPages = obj.totalPages;
    // Number of buttons at the top, not counting prev/next,
    // Must be at least 5:
    var paginationSize = obj.paginationSize;
    var currentPage;
    function showPage(whichPage, id) {
        if (whichPage < 1 || whichPage > totalPages) return false;
        currentPage = whichPage;
        // Replace the navigation items (not prev/next):
        $(id + ".pagination li").slice(1, -1).remove();
        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $('<li>')
                .addClass(
                    "page-item " +
                    (item ? "current-page " : "") +
                    (item === currentPage ? "active " : "")
                )
                .append(
                    $("<a>")
                        .addClass("page-link")
                        .attr({
                            href: "javascript:void(0)",
                            //dot3: item?"false":"true"
                        })
                        .text(item || "...")
                )
                .insertBefore(id + ".next-page");
        });
        if (typeof obj.showData() === 'function') {
            obj.showData();
        }
        return true;
    }
    if (totalPages > 1) {
        // Include the prev/next buttons:
        $(id + ".pagination").append(
            $("<li>").addClass("page-item previous-page").append(
                $("<a>")
                    .addClass("page-link")
                    .attr({
                        href: "javascript:void(0)"
                    })
                    .html('<i class="iconmoon iconmoon-Back1"></i>')
            ),
            $("<li>").addClass("page-item next-page").append(
                $("<a>")
                    .addClass("page-link")
                    .attr({
                        href: "javascript:void(0)"
                    })
                    .html('<i class="iconmoon iconmoon-Next"></i>')
            )
        );
    }
    // Show the page links
    showPage(1, id);
    // Use event delegation, as these items are recreated later
    $(
        document
    ).on("click", id + ".pagination li.current-page:not(.active)", function () {
        return showPage(+$(this).text(), id);
    });
    $(id + ".next-page").on("click", function () {
        return showPage(currentPage + 1, id);
    });

    $(id + ".previous-page").on("click", function () {
        return showPage(currentPage - 1, id);
    });
    //$(id + ".pagination").on("click",".page-item.current-page", function () {
    //    if (obj.scrollData) {
    //        if (typeof obj.scrollData() === 'function') {
    //            obj.scrollData();
    //        }
    //    }
    //    //$("html,body").animate({ scrollTop: 0 }, 0);
    //});
}
function init_autocomplete_input(obj) {
    /**
         *  Auto Complete, copyright by NTKIEN
         * */
    var inputSearch = obj.inputSearch || "#inputSearch";
    var buttonSearch = obj.buttonSearch || "#buttonSearch";
    var intervalAutoComplete = null, timeNum = 0;

    $(inputSearch).keyup(function (event) {
        var textSearch = $(this).val().trim();
        //console.log(textSearch);
        //nguoi dung xoa het du lieu se ko goi tim kiem
        //if (!textSearch) {
        //    clearInterval(intervalAutoComplete);
        //}
        //else {
        timeNum = 0;
        clearInterval(intervalAutoComplete);

        //neu nguoi dung dung nhap du lieu trong 0.5s thi tu dong goi tim kiem
        intervalAutoComplete = setInterval(function () {
            timeNum++;
            if (timeNum > 5) {
                clearInterval(intervalAutoComplete);
                $(buttonSearch).click();
            }
        }, 100);
        //}

        //nguoi dung chu dong bam enter
        if (event) {
            var keyboard = event.keyCode || event.which || event.charCode;

            if (keyboard === 13 && textSearch) {
                clearInterval(intervalAutoComplete);
                $(buttonSearch).click();
            }
        }
    });
}
function crop_image(obj) {
    var options_get = {};
    if ($('#crop_image').length) {
        var height = $('#crop_image')[0].height;
        var width = $('#crop_image')[0].width;
        options_get = resize_image_upload(width, height);
    }
    $('#crop_image').cropper('getCroppedCanvas', options_get).toBlob((blob) => {

        var file_crop = new File([blob], $('#' + obj.idinputfile)[0].files[0].name, { type: $('#' + obj.idinputfile)[0].files[0].type });
        uploadApi(obj.api_file, file_crop,
            function (e) {
                obj.callback(e);
                $('#init_dialog_crop_image').modal('hide');
                $('#' + obj.idinputfile).val('');
            }, obj.options_upload);
    });
}
function init_dialog_crop_image_and_upload(obj) {
    $.ajax({
        url: _RootBase + "General/GetHtmlFromView",
        //dataType: "json",
        type: "GET",
        data: {
            pathView: 'Views/General/ModalCropImage.cshtml',
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
                InitDialogCourse({
                    id: 'init_dialog_crop_image',
                    fullscreen: true,
                    width: $(window).width() * 0.9,
                    title: _localizer_layout.chinhsuahinhanh,
                    body: data,
                    footer: {
                        button: [
                            {
                                text: _localizer_layout.huy,
                                isClose: true,
                                style: 'background-color:#B7BDD3;',
                                click: function () {
                                    $('#' + obj.idinputfile).val('');
                                }
                            },
                            {
                                text: _localizer_layout.luulai,
                                style: 'background-color:#5C77D0;',
                                click: function () {
                                    var options_get = {};
                                    if ($('#crop_image').length) {
                                        var height = $('#crop_image')[0].height;
                                        var width = $('#crop_image')[0].width;
                                        options_get = resize_image_upload(width, height);
                                    }
                                    $('#crop_image').cropper('getCroppedCanvas', options_get).toBlob((blob) => {

                                        var file_crop = new File([blob], $('#' + obj.idinputfile)[0].files[0].name, { type: $('#' + obj.idinputfile)[0].files[0].type });
                                        uploadApi(obj.api_file, file_crop,
                                            function (e) {
                                                obj.callback(e);
                                                $('#init_dialog_crop_image').modal('hide');
                                                $('#' + obj.idinputfile).val('');
                                            }, obj.options_upload);
                                    });
                                },
                                isClose: false,
                            },
                        ]
                    }
                });
                //init
                loadimage_from_inputfile($('#' + obj.idinputfile), $('#crop_image'), function () {
                    init_crop_image({
                        id: 'crop_image',
                        idpreview: 'crop_img_preview',
                        aspectRatio: obj.aspectRatio
                    });
                });
                //

            }
        },
        error: function (err) {
            //console.log(err)
        }
    });
    function loadimage_from_inputfile($this, $image, callback) {
        var uploadedImageURL;
        var files = $($this)[0].files;
        var file;
        if (files && files.length) {
            file = files[0];
            if (/^image\/\w+$/.test(file.type)) {

                if (uploadedImageURL) {
                    URL.revokeObjectURL(uploadedImageURL);
                }
                uploadedImageURL = URL.createObjectURL(file);
                $image.attr('src', uploadedImageURL);
                $($image).on("load", function () {
                    setTimeout(function () {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, 500)
                }).attr("src", uploadedImageURL);

            } else {
                window.alert('Please choose an image file.');
            }
        }
    }
    function resize_image_upload(width, height) {
        if (width < 500 && height < 500) {
            return {};
        }
        var max_height = 500;
        var max_width = 500;
        if (width > height) {
            if (width > max_width) {
                height = height * (max_width / width);
                width = max_width;
            }
        } else {
            if (height > max_height) {
                width = width * (max_height / height);
                height = max_height;
            }
        }
        return { width: width, height: height };
    }
}
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}
function init_watting_popup(id) {
    //    id = (id ? id : `watting_popup`);
    //    $('#' + id).remove();
    //    var html = `<div class="modal" style="z-index:` + (getMaxZIndex() + 3) + `" id="` + id + `" data-backdrop="static">
    //    <div class="modal-dialog modal-dialog-centered">
    //        <div class="modal-content" style="background-color:transparent;border:none">            
    //            <div class="modal-body">
    //               <div style="text-align:center">
    //                   <!--<img src="`+ _RootBase + `images/watting.svg" style="user-select: none;height: 100px;" />-->
    //<div class="lds-dual-ring"></div>
    //               </div>
    //            </div>            
    //        </div>
    //    </div>
    //</div>`;
    //$('body').append(html);


    //$('#' + id).modal();
    $('body').addClass('lds-dual-ring');

}
function remove_watting_popup(id) {
    //id = (id ? id : 'watting_popup');
    //$('#' + id).modal('hide');
    //setTimeout(function () {
    //    //$('#' + id).remove();
    //}, 2000)
    $('body').removeClass('lds-dual-ring');

}
var getSizeHD = function (subW, subH) {
    let window_w = $(window).width() - (subW || 0),
        window_h = $(window).height() - (subH || 0),
        factor = 0.5625,
        new_w = 0,
        new_h = 0;

    //tỉ lệ màn hình cao hơn hát đê
    if (window_w * factor <= window_h) {
        new_w = window_w;
        new_h = new_w * factor;
    }
    //tỉ lệ màn hình dài hơn hát đê
    else {
        new_h = window_h;
        new_w = new_h / factor;
    }

    return {
        w: new_w,
        h: new_h
    };
}
var remove_protocols = function (url) {
    return url.replace(/(^\w+:|^)\/\//, '');
}
var convertUnsign = function (str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
}
var parseBool = function (str) {
    if (str === true || str === 1) {
        return true;
    }
    else if (str === false || str === 0 || str === null || str === undefined || str === NaN) {
        return false;
    }

    switch ((str).toLowerCase().trim()) {
        case 'true': case 'yes': case '1': {
            return true;
        }
        case 'false': case 'no': case '0': case 'null': case 'undefined': case 'NaN': {
            return false;
        }
        default: {
            return Boolean(str);
        }
    }
}
function init_drag_drop_question(obj) {
    var id = '#' + obj.id + ' ';
    $(id + ".draggable").kendoDraggable({
        hint: function (element) {
            var hintElement = $("<div class='item_question_hint'>" + $(element).text() + "</div>");
            return hintElement;
        },
        dragstart: draggableOnDragStart,
        dragend: draggableOnDragEnd
    });

    $(id + ".droptarget").kendoDropTarget({
        dragenter: droptargetOnDragEnter,
        dragleave: droptargetOnDragLeave,
        drop: droptargetOnDrop
    });
    $(id + '.item_answer').on('click', '.icon-delete', function () {
        $(this).parents('.item_answer').removeClass('completed');
        $(this).parents('.item_answer').removeAttr('ans');
        $(this).parents('.item_answer').find('.droptarget').text('Kéo câu trả lời vào đây');
        check_status_drag($(this));
    });
    function draggableOnDragStart(e) {
        //bắt đầu kéo
        $(e.currentTarget).parents('.list-group-item').first().addClass("hollow");

    }

    function droptargetOnDragEnter(e) {
        //thả kéo vào ô chứa
        $(e.dropTarget).addClass("painted");
    }

    function droptargetOnDragLeave(e) {
        //rời khỏi ô chứa
        $(e.dropTarget).removeClass("painted");
    }

    function droptargetOnDrop(e) {
        //console.log('thành công')
        //thả thành công
        $(e.dropTarget).removeClass("painted");
        $(e.dropTarget).text($(e.draggable.currentTarget).text());
        $(e.dropTarget).parents('.item_answer').attr('ans', ($(e.draggable.currentTarget).attr('rel')));
        $(e.dropTarget).parents('.item_answer').addClass('completed');
        $(e.draggable.currentTarget).parents('.list-group-item').first().addClass("draggable_completed");
    }

    function draggableOnDragEnd(e) {
        //console.log('kết thúc')
        //kết thúc kéo thả
        $(e.currentTarget).parents('.list-group-item').first().removeClass("hollow");
    }
    function check_status_drag($this) {
        var $thisques = $($this).parents('.item-question').first();
        $($thisques).find('.draggable_completed').each(function () {
            var ans = $(this).find('.draggable').attr('rel');
            var flag = false;
            $($thisques).find('.item_answer.completed').each(function () {
                if ($(this).attr('ans') == ans) {
                    flag = true;
                    return false;
                }
            });
            if (!flag) {
                $(this).removeClass('draggable_completed');
            }
        });
    }
    setTimeout(function () {
        $('#' + obj.id + ' .list_answer_drop').css({
            'max-height': ($('#cnt_takeexam .cnt-question').height() - 100) + 'px'
        })
    }, 300);
}
function formatMoney(numMoney, character) {
    if (!numMoney) return 0;
    if (!character) character = ".";
    numMoney = parseFloat(numMoney);

    if (numMoney <= 0) return 0;

    if (numMoney) {
        //return numMoney.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');

        //chuyển string thành mảng và đảo ngược mảng
        numMoney = numMoney.toString().split("").reverse();
        var arrMoney = [];
        var strMoney = '';

        $.each(numMoney, function (index, value) {
            if (index % 3 == 0)
                arrMoney.push(character);
            arrMoney.push(value);
        });

        if (arrMoney[0] == character)
            arrMoney[0] = "";

        //đảo lại mảng và nối thành chuỗi
        return arrMoney.reverse().join("");
    }
    else {
        return 0;
    }
}
function checkYoutubeUrl(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    var matches = url.match(p);
    if (matches) {
        return true;
    }
    return false;
}
str_replaceAll = function (string, search, replace) {
    return string.split(search).join(replace);
}
function changelanguage($this) {
    $.ajax({
        url: _RootBase + "Home/SetLanguage",
        dataType: "json",
        type: "POST",
        data: {
            culture: $($this).attr('data-val'),
            returnUrl: $('#changelanguage').attr('data-url')
        },
        success: function (data) {
            if (data && data.ReturnCode == 0) {
                location.reload(true);
            }
        },
        error: function (err) {
            //console.log(err)
        }
    });
}
getPlainText_TagWord = function (val) {
    var regexp = /\%[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_\&\;|$|!|@|#|*|.]+\%/gi;
    var matches_array = val.match(regexp);
    return matches_array;
}
function get_template_plaintext(id, $this) {
    var plaintext = getPlainText_TagWord(CKEDITOR.instances[id].getData());
    //console.log(plaintext);
    if (plaintext != null) {
        if (plaintext.length > 0) {
            for (var i = 0; i < plaintext.length; i++) {
                var text_tag = str_replaceAll(plaintext[i], '[[', '');
                text_tag = str_replaceAll(text_tag, ']]', '').toLowerCase();
                text_tag = str_replaceAll(text_tag, '&nbsp;', ' ');
                if ($($this).find('.item_tag_content[rel="' + text_tag + '"]').length == 0) {
                    FillControlTagWord($this, text_tag);
                }
            }
            //kiểm tra và xóa những thành phần dư thừa dữ liệu
            $($this).find('.item_tag_content').each(function
                () {
                var flag = false;
                for (var i = 0; i < plaintext.length; i++) {
                    var text_tag = str_replaceAll(plaintext[i], '[[', '');
                    text_tag = str_replaceAll(text_tag, ']]', '');
                    text_tag = str_replaceAll(text_tag, '&nbsp;', ' ');
                    if (text_tag.toLowerCase() == $(this).attr('rel').toLowerCase()) {
                        flag = true;
                        break;
                    }
                }
                if (flag == false) {
                    $(this).remove();
                }
            });

        }
    }
    else {
        $($this).find('.item_tag_content').remove();
    }
}
function removeVietnameseTones(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}

function FormatFileSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};



var _ArrUploadFile = [];
function UploadFile(files, obj) {
    if (!files || files.length == 0) { return null; }
    if (!obj) { obj = {}; }

    _ArrUploadFile = [];
    var totalFile = files.length;
    var IdRandomModal = Math.floor(Math.random() * 1000000000);

    var html = '';
    html += '<div class="modal in" id="' + IdRandomModal + '" style="background-color:rgba(0,0,0,0.5); display: block;z-index:10010">';
    html += '<div class="modal-dialog" style="position: absolute;left: 0;right: 0;top: 0;bottom: 0;">';
    html += '<div class="modal-content" style="max-height: 100%;overflow: auto;">';
    html += '<div class="modal-header" style="padding: 10px;color: #669FC7;background: repeat-x #f7f7f7;background-image: linear-gradient(to bottom,#FFF 0,#EEE 100%);"><h4 class="modal-title">' + (obj.modalHeaderText ? obj.modalHeaderText : 'Tải lên file') + ' (' + totalFile + ')' + '</h4></div>';
    html += '<div class="modal-body"></div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    $("body").append(html);

    var counter = 0;
    var totalSuccess = 0;
    var totalError = 0;
    var arrFileError = [];
    var arrFileSuccess = [];

    var formData = new FormData();

    $.each(files, function (index, file) {
        var IdRandomProgress = Math.floor(Math.random() * 1000000000);
        Upload(file, formData, IdRandomProgress, true);

    });

    function Upload(file, formData, IdRandomProgress, IsCreateProgress) {
        formData = new FormData();
        formData.append("isUser", (obj.isUser === false || obj.isUser ? obj.isUser : true));
        formData.append("subFolder", (obj.subFolder ? obj.subFolder : ""));
        formData.append("fileType", (obj.fileType ? obj.fileType : ""));
        formData.append("isExists", (parseBool(obj.isExists) ? parseBool(obj.isExists) : false));
        formData.append("isScaleImage", (parseBool(obj.isScaleImage) ? parseBool(obj.isScaleImage) : false));
        formData.append("file", file);

        var fileName = file.name;
        var FileSize = FormatFileSize(file.size);
        var async = (parseBool(obj.async) ? parseBool(obj.async) : true);
        $.ajax({
            url: _RootBase + "DocExam/Upload",
            data: formData,
            processData: false,
            contentType: false,
            async: async,
            type: 'POST',
            beforeSend: function () {
                if (IsCreateProgress) {
                    var htmlProgress = '<div class="row" id=' + IdRandomProgress + '>'
                        + '<div class="col-xs-12">'
                        + '<p style="margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="' + fileName + ' (' + FileSize + ')' + '">' + fileName + ' (' + FileSize + ')' + '</p>'
                        + '</div>'
                        + '<div class="col-xs-12">'
                        + '<div class="progress">'
                        + '<div class="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width:20%"> ' + _localizer.doitailen + ' </div>'
                        + '</div></div></div>';
                    $("#" + IdRandomModal + ' .modal-body').append(htmlProgress)
                }
            },
            xhr: function () {
                if (async) {
                    var myXhr = $.ajaxSettings.xhr();
                    if (myXhr.upload) {
                        myXhr.upload.addEventListener('progress',
                            function (e) {
                                if (e.lengthComputable) {
                                    var percent = (e.loaded * 100) / e.total;
                                    if (percent < 100) {
                                        $('#' + IdRandomProgress + ' .progress-bar').css({
                                            "width": percent + '%'
                                        }).text(parseInt(percent) + "%");
                                    }
                                    else {
                                        $('#' + IdRandomProgress + ' .progress-bar').css({
                                            "width": '100%'
                                        }).text(_localizer.dangxuly);
                                    }
                                }
                            },
                            false);
                    }
                    return myXhr;
                }
            },
            success: function (e) {
                counter++;
                var ReturnName = _localizer.hethongtuchoifile;
                if (e) {
                    if (e.returnCode == "0") {
                        totalSuccess++;
                        ReturnName = "Hoàn tất";
                        $('#' + IdRandomProgress + ' .progress-bar').addClass("progress-bar-success").html(ReturnName + '<div class="pull-right"><span class="btnRemoveFile glyphicon glyphicon-remove" style="margin-right:5px;cursor:pointer" title="' + _localizer.xoafile + '"></span></div>');
                        arrFileSuccess.push(e);

                        $("#" + IdRandomProgress + ' .btnRemoveFile').click(function () {
                            var fileName = e.fileName;
                            var subFolder = (obj.subFolder ? obj.subFolder : "");
                            CallDeleteFile('#' + IdRandomProgress + ' .progress-bar', fileName, subFolder);
                        });
                    }
                    else {
                        totalError++;
                        switch (e.returnCode) {
                            case '500': { ReturnName = _localizer.error500; break; }
                            case '501': { ReturnName = _localizer.error501; break; }
                            case '502': { ReturnName = _localizer.error502; break; }
                            case '503': { ReturnName = _localizer.error503; break; }
                            case '504': { ReturnName = _localizer.error504; break; }
                            case '505': { ReturnName = _localizer.error505; break; }
                            case '506': { ReturnName = _localizer.error506; break; }
                            default: { ReturnName = _localizer.chuacothongtinmaloi + " (#" + e.returnCode + ")"; break; }
                        }
                        $('#' + IdRandomProgress + ' .progress-bar').addClass("progress-bar-warning").text(ReturnName);
                        arrFileError.push({
                            file: file,
                            IdRandomProgress: IdRandomProgress,
                            ReturnName: ReturnName,
                            returnCode: e.returnCode,
                            fileName: fileName,
                            FileSize: FileSize
                        });
                        debugger
                    }
                }
                else {
                    totalError++;
                    $('#' + IdRandomProgress + ' .progress-bar').addClass("progress-bar-warning").text(ReturnName);

                    arrFileError.push({
                        file: file,
                        IdRandomProgress: IdRandomProgress,
                        ReturnName: ReturnName,
                        fileName: fileName,
                        FileSize: FileSize
                    });
                }
                $('#' + IdRandomProgress).appendTo($("#" + IdRandomModal + ' .modal-body'));
                CallSuccess(e.fileName);
            },
            error: function (e) {
                //console.log('error');
                var ReturnName = _localizer.hethongtuchoifile;
                counter++;
                totalError++;
                $('#' + IdRandomProgress + ' .progress-bar').addClass("progress-bar-danger").text(ReturnName);
                arrFileError.push({
                    file: file,
                    IdRandomProgress: IdRandomProgress,
                    ReturnName: ReturnName,
                    fileName: fileName,
                    FileSize: FileSize
                });
                CallSuccess(e.fileName);
            }
        });
    }

    function CallSuccess(fileName) {
        
        if (counter >= totalFile) {
            var htmlSuccess = ''
            htmlSuccess += '<div class="modal-footer">';

            htmlSuccess += '<div class="text-left">';
            htmlSuccess += '<h4 class="header text-uppercase">' + _localizer.ketqua + '</h4>';

            htmlSuccess += '<ul class="list-inline">';
            htmlSuccess += '<li class="no-padding-left">' + _localizer.tongcongtailen + ': <strong>' + totalFile + '</strong>. ' + '</li>';
            htmlSuccess += '<li>' + _localizer.thanhcong + ': <strong>' + totalSuccess + '</strong>. ' + '</li>';
            htmlSuccess += '<li>' + _localizer.loi + ': <strong>' + totalError + '</strong>.' + '</li>';
            htmlSuccess += '</ul>';

            if (arrFileError.length > 0) {
                htmlSuccess += '<p>' + _localizer.danhsachfileloi + ':</p>';
                htmlSuccess += '<style>ul.errorUpload li:nth-child(2n + 1) {background-color: rgba(0, 0, 0, 0.03);}ul.errorUpload li:nth-child(2n) {background-color: rgba(0, 0, 0, 0.07);}</style>';
                htmlSuccess += '<ul class="errorUpload list-unstyled col-xs-12 no-padding-right">';
                $.each(arrFileError, function (index, value) {
                    htmlSuccess += '<li class="row" style="padding: 5px 0">'
                        + '<div class="col-xs-1 text-right">' + (index + 1) + '. ' + '</div>'
                        + '<div class="col-xs-7">' + '<strong>' + value.fileName + ' (' + value.FileSize + ')' + '</strong>' + '</div>'
                        + '<div class="col-xs-4">' + value.ReturnName + '</div>'
                        + '</li>';
                });
                htmlSuccess += '</ul>';
            }
            htmlSuccess += '</div>';
            htmlSuccess += '<button data-bb-handler="success" type="button" class="btnSuccess btn btn-sm btn-primary"><i class="ace-icon fa fa-check"></i> ' + _localizer.tieptuc + '</button>';
            if (totalError > 0) {
                htmlSuccess += '<button data-bb-handler="click" type="button" class="btnRefresh btn btn-sm btn-info"><i class="ace-icon fa fa-refresh"></i> ' + _localizer.tailaiteploi + '</button>';
                htmlSuccess += '<button data-bb-handler="button" type="button" class="btnClose btn btn-sm"><i class="ace-icon fa fa-close"></i> ' + _localizer.huy + '</button>';
            }
            htmlSuccess += '</div>';

            $('#' + IdRandomModal + ' .modal-footer').remove();
            $('#' + IdRandomModal + ' .modal-content').append(htmlSuccess).animate({ scrollTop: $('#' + IdRandomModal + ' .modal-content')[0].scrollHeight }, 1000);

            $('#' + IdRandomModal + ' .btnSuccess').click(function (fileName) {
                $('#' + IdRandomModal).remove();
                var ExcuteFunc = (obj.change ? obj.change : function (fileName) { });
                ExcuteFunc(fileName);
            });

            $('#' + IdRandomModal + ' .btnClose').click(function () {
                $('#' + IdRandomModal).remove();
            });

            $('#' + IdRandomModal + ' .btnRefresh').click(function () {
                $('#' + IdRandomModal + ' .modal-footer').remove();
                $.each(arrFileError, function (index, value) {
                    Upload(value.file, formData, value.IdRandomProgress, false)
                });
                counter -= arrFileError.length;
                arrFileError = [];
                totalError = 0;
            });

            _ArrUploadFile = arrFileSuccess.concat(arrFileError);

            if (parseBool(obj.autoComplete) && totalError == 0) {
                $('#' + IdRandomModal).remove();
                var ExcuteFunc = (obj.change ? obj.change : function (fileName) { /*console.log("no function change to complete")*/ });
                ExcuteFunc(fileName);
            }
            else {
                /*console.log(totalError + " upload error, do not auto complete");*/
            }
            if (arrFileError.length > 0) {
                //reset || xóa file trên UI khi lỗi
                if ($('.ace-file-input .ace-file-name').length == 1) {
                    $('.ace-file-input a.remove').trigger('click');
                    $('.ace-file-input.ace-file-multiple .remove').trigger('click');
                }
                if ($('.k-dialog-custom .ace-file-input.ace-file-multiple .ace-file-name').length == 1) {
                    $('.k-dialog-custom .ace-file-input.ace-file-multiple .remove').trigger('click');
                }
                for (var i = 0; i < arrFileError.length; i++) {
                    $('.ace-file-input .ace-file-name').each(function () {
                        if ($(this).attr('data-title') == arrFileError[i].fileName) {
                            $(this).remove();
                        }
                    });
                }
            }
        }
    }

    function CallDeleteFile(element, fileName, subFolder) {
        $.ajax({
            url: _RootBase + "FileManager/Delete",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            type: "POST",
            data: JSON.stringify({
                fileName: fileName,
                subFolder: subFolder
            }),
            beforeSend: function () {
                $(element).html('<div class="wt-waiting"></div>');
            },
            success: function (e) {
                if (e) {
                    if (e.returnCode == "0") {
                        $(element).css("background-color", "#999").text(_localizer.xoafilethanhcong);
                    }
                    else {
                        var ReturnName = "";
                        switch (e.returnCode) {
                            case '507': { ReturnName = _localizer.error507; break; }
                            case '508': { ReturnName = _localizer.error508; break; }
                            case null: case undefined: case '': { ReturnName = _localizer.hethongbiloi; break; }
                            default: { ReturnName = _localizer.chuacothongtinmaloi + " (#" + e.returnCode + ")"; break; }
                        }
                        $(element).addClass("progress-bar-warning").html(ReturnName + '<div class="pull-right"><span class="btnRemoveFile glyphicon glyphicon-remove" style="margin-right: 5px;cursor:pointer" title="' + _localizer.xoafile + '"></span></div>');
                        $(element).find(".btnRemoveFile").click(function () {
                            CallDeleteFile(fileName, fileName, subFolder);
                        });
                    }
                }
                else {
                    $(element).addClass("progress-bar-warning").html(_localizer.hethongbiloi + ' <div class="pull-right"><span class="btnRemoveFile glyphicon glyphicon-remove" style="margin-right: 5px;cursor:pointer" title="' + _localizer.xoafile + '"></span></div>');
                    $(element).find(".btnRemoveFile").click(function () {
                        CallDeleteFile(fileName, fileName, subFolder);
                    });
                }
            },
            error: function () {
                $(element).addClass("progress-bar-warning").html(_localizer.hethongbiloi + ' <div class="pull-right"><span class="btnRemoveFile glyphicon glyphicon-remove" style="margin-right: 5px;cursor:pointer" title="' + _localizer.xoafile + '"></span></div>');
                $(element).find(".btnRemoveFile").click(function () {
                    CallDeleteFile(fileName, fileName, subFolder);
                });
            }
        });
    }
}


getParamUrl = function (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

function activeMenu(id) {
    $(id).addClass('active');
}
const testEmbedCode = (str) => {
    return /<\/?[a-z][\s\S]*>/i.test(str);
} 