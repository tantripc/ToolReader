// Our dialog definition.
CKEDITOR.dialog.add('mathliveDialog', function (editor) {
    var mf;
    return {

        // Basic properties of the dialog window: title, minimum size.
        title: 'Chèn công thức toán',
        minWidth: 600,
        minHeight: 200,

        // Dialog window content definition.
        contents: [
            {
                // Definition of the Basic Settings dialog tab (page).
                id: 'tab-mathlive',                
                // The tab content.
                elements: [
                    {
                        type: 'html',
                        html: '<div class="mathfield" id="mf_' + editor.id + '"></div><div style="margin-top:20px;">Latex:</div><div class= "output" id="result_' + editor.id+'" style="width: 600px;white-space: initial;"></div>'
                    },
                ],                
            },
        ],
        onLoad: function (e) {
            $('div[name="tab-mathlive"]').parent().css('overflow', 'hidden');
            mf = MathLive.makeMathField('mf_' + editor.id, {
                onContentDidChange: updateOutput,
                virtualKeyboardMode: 'onfocus',
                virtualKeyboards: 'all',
            });

            function updateOutput(mathfield) {
                const result = mathfield.$latex();
                document.getElementById('result_' + editor.id).innerHTML = typeof result !== 'undefined' ? result.toString() : '';
            }
            //MathLive.renderMathInElement(
            //    document.getElementById('mf'), {
            //        ignoreClass: 'instruction|source',
            //        TeX: {
            //            delimiters: {
            //                inline: [['$', '$'], ['\\(', '\\)']],
            //                display: [['$', '$'], ['\\(', '\\)']],
            //            }
            //        },
            //        renderAccessibleContent: 'mathml speakable-text'
            //    }
            //);
            //(function () {
                
            //})();
        },
        // This method is invoked once a user clicks the OK button, confirming the dialog.
        onOk: function () {

            // The context of this function is the dialog object itself.
            // http://docs.ckeditor.com/ckeditor4/docs/#!/api/CKEDITOR.dialog
            //var dialog = this;

            // Create a new <abbr> element.
            var mathlive = editor.document.createElement('span');
            mathlive.setText('$$' + $('div[name="tab-mathlive"] #result_' + editor.id).text()+'$$');

            // Finally, insert the element into the editor at the caret position.
            editor.insertElement(mathlive);
            mf.$perform('deleteAll')
            //$('.ML__fieldcontainer__field,#result,.sr-only').html('');
            //MathLive.revertToOriginalContent('mf');
            //const mf = MathLive.makeMathField('mf', {
            //    onContentDidChange: updateOutput,
            //    virtualKeyboardMode: 'manual',
            //    virtualKeyboards: 'all',
            //});

            //function updateOutput(mathfield) {
            //    const result = mathfield.$latex();
            //    document.getElementById('result').innerHTML = typeof result !== 'undefined' ? result.toString() : '';
            //}
            //MathLive.makeMathField('mf').virtualKeyboardVisible = false;
        },        

    };
});