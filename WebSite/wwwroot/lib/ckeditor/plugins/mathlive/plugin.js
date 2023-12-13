/**
 * Copyright (c) 2014-2018, CKSource - Frederico Knabben. All rights reserved.
 * Licensed under the terms of the MIT License (see LICENSE.md).
 *
 * Basic sample plugin inserting current date and time into the CKEditor editing area.
 *
 * Created out of the CKEditor Plugin SDK:
 * http://docs.ckeditor.com/ckeditor4/docs/#!/guide/plugin_sdk_intro
 */
CKEDITOR.plugins.add('mathlive', {
    icons: 'mathlive',
    init: function (editor) {
        editor.addCommand('mathlive', new CKEDITOR.dialogCommand('mathliveDialog'));
        editor.ui.addButton('Mathlive', {
            label: 'Chèn công thức toán',
            command: 'mathlive',
            toolbar: 'insert'
        });
        CKEDITOR.document.appendStyleSheet(this.path + 'mathlive.css');
        CKEDITOR.document.appendStyleSheet(this.path + 'mathlive.core.css');
        CKEDITOR.document.appendStyleSheet(this.path + 'custom.css');
        CKEDITOR.scriptLoader.load(this.path + 'mathlive.js', function (success) {            
        });
        CKEDITOR.dialog.add('mathliveDialog', this.path + 'dialogs/mathliveDialog.js');
    },

});
