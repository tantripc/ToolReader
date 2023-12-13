CKEDITOR.dialog.add('html5video', function (editor) {
    return {
        title: editor.lang.html5video.title,
        minWidth: 500,
        minHeight: 100,
        contents: [{
            id: 'info',
            label: editor.lang.html5video.infoLabel,
            elements: [
                {
                    type: 'vbox',
                    padding: 0,
                    children: [
                        {
                            type: 'hbox',
                            widths: ['365px', '110px'],
                            align: 'right',
                            children: [{
                                type: 'text',
                                id: 'url',
                                label: editor.lang.html5video.allowed,
                                required: true,
                                validate: CKEDITOR.dialog.validate.notEmpty(editor.lang.html5video.urlMissing),
                                setup: function (widget) {
                                    this.setValue(widget.data.src);
                                },
                                commit: function (widget) {
                                    widget.setData('src', this.getValue());
                                }
                            },
                            {
                                type: 'button',
                                id: 'browse',
                                // v-align with the 'txtUrl' field.
                                // TODO: We need something better than a fixed size here.
                                style: 'display:inline-block;margin-top:14px;',
                                align: 'center',
                                label: editor.lang.common.browseServer,
                                hidden: true,
                                filebrowser: 'info:url'
                            }]
                        }]
                },
                {
                    type: 'checkbox',
                    id: 'responsive',
                    label: editor.lang.html5video.responsive,
                    setup: function (widget) {
                        this.setValue(widget.data.responsive);
                    },
                    commit: function (widget) {
                        widget.setData('responsive', this.getValue() ? 'true' : '');
                    }
                },
                {
                    type: 'vbox',
                    padding: 0,

                    children: [{
                        type: 'hbox',
                        widths: ['365px', '110px'],
                        align: 'right',
                        children: [{
                            type: 'text',
                            id: 'poster',
                            label: editor.lang.html5video.poster,
                            setup: function (widget) {
                                this.setValue(widget.data.poster);
                            },
                            commit: function (widget) {
                                widget.setData('poster', this.getValue());
                            }
                        },
                        {
                            type: 'button',
                            id: 'browseposter',
                            // v-align with the 'txtUrl' field.
                            // TODO: We need something better than a fixed size here.
                            style: 'display:inline-block;margin-top:14px;',
                            align: 'center',
                            label: editor.lang.common.browseServer,
                            hidden: true,
                            filebrowser: { action: "Browse", target: "info:poster", url: editor.config.filebrowserImageBrowseUrl }
                        }]
                    }]
                },
                {
                    type: 'checkbox',
                    id: 'controls',
                    label: editor.lang.html5video.controls,
                    setup: function (widget) {
                        this.setValue(widget.data.controls);
                    },
                    commit: function (widget) {
                        widget.setData('controls', this.getValue() ? 'true' : '');
                    }
                },
                {
                    type: 'hbox',
                    id: 'size',
                    children: [{
                        type: 'text',
                        id: 'width',
                        label: editor.lang.common.width,
                        setup: function (widget) {
                            if (widget.data.width) {
                                this.setValue(widget.data.width);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('width', this.getValue());
                        }
                    },
                    {
                        type: 'text',
                        id: 'height',
                        label: editor.lang.common.height,
                        setup: function (widget) {
                            if (widget.data.height) {
                                this.setValue(widget.data.height);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('height', this.getValue());
                        }
                    },
                    ]
                },

                {
                    type: 'hbox',
                    id: 'alignment',
                    children: [{
                        type: 'radio',
                        id: 'align',
                        label: editor.lang.common.align,
                        items: [
                            [editor.lang.common.alignCenter, 'center'],
                            [editor.lang.common.alignLeft, 'left'],
                            [editor.lang.common.alignRight, 'right'],
                            [editor.lang.common.alignNone, 'none']
                        ],
                        'default': 'center',
                        setup: function (widget) {
                            if (widget.data.align) {
                                this.setValue(widget.data.align);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('align', this.getValue());
                        }
                    }]
                }]
        },
        {
            id: 'Upload',
            hidden: false,
            filebrowser: 'uploadButton',
            label: editor.lang.html5video.upload,
            elements: [{
                type: 'file',
                id: 'upload',
                label: editor.lang.html5video.btnUpload,
                style: 'height:40px',
                size: 38,
                onClick: function () {
                    var input = this.getInputElement();
                    input.$.accept = 'video/*';
                },
                onChange: function (e) {
                    //call function upload video
                    var input_text_video = $('#' + e.sender.domId).parents('.cke_dialog_contents').first().find('input.cke_dialog_ui_input_text').first().attr('id');
                    var this_dialog = this.getDialog();
                    if (uploadApi && _api_file_upload) {
                        var options = {
                            subFolder: 'Ckeditor',
                            fileType: 'video',
                            //isconvertvideo:true
                        };
                        if (e.sender && e.sender._ && e.sender._.frameId) {
                            $('.cke_dialog.cke_browser_webkit').css('position', 'relative');
                            var file_upload = $('#' + (e.sender._.frameId))[0].contentWindow.document.querySelector('input[type="file"]').files[0];   
                            
                            uploadApi(_api_file_upload, file_upload, function (e) {
                                $('.cke_dialog.cke_browser_webkit').css('position', 'fixed');
                                if (e.ReturnCode == 0) {
                                    $('#' + input_text_video).val(e.root + e.PathFileName);
                                    setTimeout(function () {
                                        this_dialog.selectPage('info');
                                    }, 300)
                                }
                            }, options);
                        }
                    }
                }
            },
            {
                type: 'fileButton',
                id: 'uploadButton',
                hidden: true,
                filebrowser: 'info:url',
                label: editor.lang.html5video.btnUpload,
                'for': ['Upload', 'upload'],
                onChange: function () {
                    //call function upload video
                    //console.log('uploadvideo')
                }
            }]
        },
        {
            id: 'advanced',
            label: editor.lang.html5video.advanced,
            elements: [{
                type: 'vbox',
                padding: 10,
                children: [{
                    type: 'hbox',
                    widths: ["33%", "33%", "33%"],
                    children: [{
                        type: 'radio',
                        id: 'autoplay',
                        label: editor.lang.html5video.autoplay,
                        items: [
                            [editor.lang.html5video.yes, 'yes'],
                            [editor.lang.html5video.no, 'no']
                        ],
                        'default': 'no',
                        setup: function (widget) {
                            if (widget.data.autoplay) {
                                this.setValue(widget.data.autoplay);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('autoplay', this.getValue());
                        }
                    },
                    {
                        type: 'radio',
                        id: 'loop',
                        label: editor.lang.html5video.loop,
                        items: [
                            [editor.lang.html5video.yes, 'yes'],
                            [editor.lang.html5video.no, 'no']
                        ],
                        'default': 'no',
                        setup: function (widget) {
                            if (widget.data.loop) {
                                this.setValue(widget.data.loop);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('loop', this.getValue());
                        }
                    },
                    {
                        type: 'radio',
                        id: 'allowdownload',
                        label: editor.lang.html5video.allowdownload,
                        items: [
                            [editor.lang.html5video.yes, 'yes'],
                            [editor.lang.html5video.no, 'no']
                        ],
                        'default': 'no',
                        setup: function (widget) {
                            if (widget.data.allowdownload) {
                                this.setValue(widget.data.allowdownload);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('allowdownload', this.getValue());
                        }
                    }]
                },
                {
                    type: 'hbox',
                    children: [{
                        type: "text",
                        id: 'advisorytitle',
                        label: editor.lang.html5video.advisorytitle,
                        'default': '',
                        setup: function (widget) {
                            if (widget.data.advisorytitle) {
                                this.setValue(widget.data.advisorytitle);
                            }
                        },
                        commit: function (widget) {
                            widget.setData('advisorytitle', this.getValue());
                        }
                    }]
                }]
            }]
        }]
    };
});
