function drag_drop_question() {
    $('.cnt-question .item-question[data-t="9405"]').each(function () {
        var id = $(this).attr('id');
        var obj = {
            id: id
        }
        init_drag_drop_question(obj);
    });
    //sapxep
    $('.cnt-question .item-question[data-t="9411"]').each(function () {
        var id = $(this).attr('id');
        var obj = {
            id: id
        }
        init_drag_drop_question(obj);
    });
}
function init_drag_drop_question(obj) {
    var id = '#' + obj.id + ' ';

    $(id + ".draggable").kendoDraggable({
        hint: function (element) {
            var text_drag = $(element).find('span').last().html();
            var hintElement = $("<div class='item_question_hint'>" + text_drag + "</div>");
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
        var text_label = 'Kéo câu trả lời vào đây';
        if ($(this).parents('.item-question').attr('data-t') =='9411') {
            text_label = $(this).parents('.item_answer').attr('rel');
        }
        $(this).parents('.item_answer').find('.droptarget').html(text_label);
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
        var text_drop = $(e.draggable.currentTarget).find('span').last().html();
        $(e.dropTarget).removeClass("painted");
        $(e.dropTarget).html(text_drop);
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

    $('.list_answer_drop').css({
        'max-height': ($(window).height() - 250) + 'px'
    })
}
function answer_question(questionid) {
    if (parent.answer_question) {
        parent.answer_question(player, _id_content, questionid);
    }
}
function view_again(questionid) {
    if (parent.view_again) {
        parent.view_again(player, _id_content, questionid);
    }
}