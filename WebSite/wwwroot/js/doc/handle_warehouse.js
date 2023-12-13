// A $( document ).ready() block.
$(document).ready(function () {
    initList_Warehouse();
});


//var count = $("#selected").parents('.k-widget').find('.k-reset[role="listbox"]').children().length;
//if (count == 0) {
//    if ($("#selected").data('kendoListBox')) {
//        $("#selected").data('kendoListBox').destroy();
//        $("#selected").parents('.k-widget').find('.k-reset[role="listbox"]').remove();
//    }
//}
//else {
//    $("#selected").data('kendoListBox').destroy();
//    $("#selected").parents('.k-widget').find('.k-reset:not(:first-child)').remove();
//}

var learnerTemplate = '<span class="k-state-default" style="background-image: url(\'#if(data.issync ==false){#' + link_api_file + '#: iscoverfile_noissync(data.coverfile)##}else{##:issyncapi(data.docid)##: iscoverfile(data.docid)##}#\')"></span>' +
    '<span class="k-state-default"><h3 data-val="#: data.docid #" id="title_docinfo">#: data.title #</h3><p>#if(data.author!=null){##:data.author# #}else{##:isauthor(data.docid)##}#</p></span>';
function initList_Warehouse(topicid) {
    var count = $("#selected").parents('.k-widget').find('.k-reset[role="listbox"]').children().length;
    if (count != 0) {
        var docids = $('#selected').data('kendoListBox').dataItems();
    }
    if ($("#optional").data('kendoListBox')) {
        $("#optional").data('kendoListBox').destroy();
        $("#optional").parents('.k-widget').find('.k-reset[role="listbox"]').remove();
    }
    if ($("#selected").data('kendoListBox')) {
        $("#selected").data('kendoListBox').destroy();
        $("#selected").parents('.k-widget').find('.k-reset[role="listbox"]').remove();
    }
   
    if (count != 0) {
        var Doc = [];
        for (var i = 0; i < docids.length; i++) {
            Doc += '' + docids[i].docid + ";" + '';
            var result = Doc.slice(0, Doc.lastIndexOf(";")) + "" + Doc.slice(Doc.lastIndexOf(";") + ";".length);
        }
        $("#optional").kendoListBox({
            dataTextField: "title",
            dataValueField: "docid",
            template: learnerTemplate,
            dataSource: {
                transport: {
                    read: function (options) {
                        $.ajax({
                            url: _RootBase + "Doc/GetBook_Partner",
                            type: "POST",
                            dataType: "json",
                            async: false,
                            data: {
                                posstart: 1,
                                numofrow: 500,
                                topicids: topicid ? topicid : null,
                                docids: result
                            },
                            success: function (result) {
                                var data = result.data;
                                options.success(data);
                            },
                            error: function (result) {
                                options.error(result);
                            }
                        });

                    }
                },
            },
            draggable: { placeholder: customPlaceholder },
            dropSources: ["selected"],
            connectWith: "selected",
            toolbar: {
                position: "right",
                tools: ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
            },
            messages: {
                tools: {
                    transferTo: _localizer.chonsach,
                    transferFrom: _localizer.bochonsach,
                    transferAllTo: _localizer.chontatcasach,
                    transferAllFrom: _localizer.bochontatcasach
                }
            },
            selectable: "multiple",
        });
    }
    else {
    $("#optional").kendoListBox({
        dataTextField: "title",
        dataValueField: "docid",
        template: learnerTemplate,
        dataSource: {
            transport: {
                read: function (options) {
                    $.ajax({
                        url: _RootBase + "Doc/GetBook_Partner",
                        type: "POST",
                        dataType: "json",
                        async: false,
                        data: {
                            posstart: 1,
                            numofrow: 500,
                            topicids: topicid ? topicid : null,
                            docids: result
                        },
                        success: function (result) {
                            var data = result.data;
                            options.success(data);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
        },
        draggable: { placeholder: customPlaceholder },
        dropSources: ["selected"],
        connectWith: "selected",
        toolbar: {
            position: "right",
            tools: ["transferTo", "transferFrom", "transferAllTo", "transferAllFrom"]
        },
        messages: {
            tools: {
                transferTo: _localizer.chonsach,
                transferFrom: _localizer.bochonsach,
                transferAllTo: _localizer.chontatcasach,
                transferAllFrom: _localizer.bochontatcasach
            }
        },
        selectable: "multiple",
    });
    }
$("#selected").kendoListBox({
    dataTextField: "title",
    dataValueField: "docid",
    template: learnerTemplate,
    draggable: { placeholder: customPlaceholder },
    dropSources: ["optional"],
    connectWith: "optional"
});
}
function customPlaceholder(draggedItem) {
    return draggedItem
        .clone()
        .addClass("custom-placeholder")
        .removeClass("k-ghost");
    }

$("#searchBox").on("input", function (e) {
    var listBox = $("#optional").getKendoListBox();
    var searchString = $(this).val();
    listBox.dataSource.filter({ field: "title", operator: "contains", value: searchString });
});
$('#search_icon').on('click', function () {
    var listBox = $("#optional").getKendoListBox();
    var searchString = $('#searchBox').val();
    listBox.dataSource.filter({ field: "title", operator: "contains", value: searchString });
})
$("#searchBoxselect").on("input", function (e) {
    var listBox = $("#selected").getKendoListBox();
    var searchString = $(this).val();
    listBox.dataSource.filter({ field: "title", operator: "contains", value: searchString });
});
$('#search_iconselect').on('click', function () {
    var listBox = $("#selected").getKendoListBox();
    var searchString = $('#searchBox').val();
    listBox.dataSource.filter({ field: "title", operator: "contains", value: searchString });
});
function iscoverfile_noissync(data) {
    if (data != null) {
        return data;
    }
    else {
        return "CoverSheet/default.jpg";
    }
}
function iscoverfile(data) {
    var coverfile = "";
    if (data != null) {
        $.ajax({
            url: _RootBase + "Doc/Detail_Book",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                docid: data
            },
            success: function (result) {
                if (result.data.coverfile == null) {
                    coverfile = "CoverSheet/default.jpg";
                    return coverfile;
                }
                else {
                    coverfile = result.data.coverfile;
                    return coverfile;
                }
            },
            error: function (result) {
                options.error(result);
            }

        });
        return coverfile;
    }

}
function isauthor(data) {
    var author = "";
    if (data != null) {
        $.ajax({
            url: _RootBase + "Doc/Detail_Book",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                docid: data
            },
            success: function (result) {
                if (result.data.author == null) {
                    return author;
                }
                else {
                    author = result.data.author;
                    return author;
                }
            },
            error: function (result) {
                options.error(result);
            }

        });
        return author;
    }

}
function issyncapi(data) {
    var link = link_api_file;
    var check_link_issync = false;
    if (data != null) {
        $.ajax({
            url: _RootBase + "Doc/Detail_Book",
            type: "POST",
            dataType: "json",
            async: false,
            data: {
                docid: data
            },
            success: function (result) {
                if (result.data.issync == false) {
                    check_link_issync = false;
                    return check_link_issync;
                }
                else {
                    check_link_issync = true;
                    link = result.data.syncapi;
                    return check_link_issync;
                }
            },
            error: function (result) {
                options.error(result);
            }
            
        });
        if (check_link_issync == false) {
            return link;
        }
        else {
            return link
        }
    }
}
