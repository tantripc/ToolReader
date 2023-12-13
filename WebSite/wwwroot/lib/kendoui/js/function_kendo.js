//loadKendoTreeList({
//    id: id,
//    url: url,
//    async: true || false,
//    data: data,
//    schema: schema,
//    height: height,
//    sortable:true||false,
//    columns: columns,
//    pageSize: pageSize || 20,
//    pageSizes: pageSizes || [5,10],
//    editable:'popup'||false
//})
function loadKendoTreeList(obj) {
    $("#" + obj.id).kendoTreeList({
        dataSource: {
            serverFiltering: true,
            //serverPaging: true, 
            pageSize: obj.pageSize ? obj.pageSize : 20,
            transport: {
                read: function (options) {
                    var data = filterKendoTreeList(obj.data, options, obj.columns);
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : false,
                        data: data,
                        success: function (result) {
                            console.log(result);
                            options.success(result);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: obj.model,
                data: 'data',
                total: 'total'
            },
        },
        height: obj.height ? obj.height : ($(window).height() - 102),
        resizable: obj.resizable ? obj.resizable : true,
        filterable: {
            extra: false,
            messages: {
                operators: "and",
            },
            operators: {
                string: {
                    contains: "Contains...",
                }
            }
        },
        filterMenuOpen: function (e) {
            e.container.find('input.k-textbox').focus();
        },
        selectable: "row",
        sortable: obj.sortable ? obj.sortable : true,
        columns: obj.columns,
        pageable: {
            buttonCount: 3,
            refresh: true,
            pageSizes: obj.pageSizes ? obj.pageSizes : [5, 10, 20, 50, 100, 200, "all"],
        },
        editable: obj.editable ? obj.editable : false,
        dataBound: function (e) {

            if (obj.isCustomtool) {
                //đoạn code hiển thị đám button custom
                init_custom_tool_table(e, obj.id);
            }

            if (typeof obj.dataBound === 'function') {
                obj.dataBound(e);
            }
            //chỉnh lại chiều cao khi chọn all
            setTimeout(function () {
                if ($('#' + obj.id + ' .k-pager-sizes.k-label select[data-role="dropdownlist"]').attr('aria-label') == 'all') {
                    var height_content = $('#' + obj.id + ' .k-grid-content.k-auto-scrollable').height() - 42.636;
                    $('#' + obj.id + ' .k-grid-content.k-auto-scrollable').height(height_content);
                }
            }, 100);

        },
        collapse: function (e) {
        },
        expand: function (e) {
            if (typeof obj.dataBound === 'function') {
                setTimeout(function () {
                    obj.dataBound(e);
                }, 100)

            }
        }
    });
}
function init_custom_tool_table(e, id) {
    //đoạn code hiển thị đám button custom    
    var num_total = e.sender.dataSource._pristineTotal;
    var num_in_page = e.sender.dataSource._pageSize ? e.sender.dataSource._pageSize : num_total;
    if (num_in_page > 0 && num_total > 0) {
        if (num_total < num_in_page) {
            num_in_page = num_total;
        }
        ////bắt sự kiện hover
        //$('#' + id + '.k-grid tr').hover(function (e) {
        //    $('#' + id + '.k-grid tr').removeClass('txbinh-custom').removeClass('k-state-selected');
        //    $('#' + id + '.k-grid tr td.k-command-cell').removeClass('translate3d');
        //    $(this).addClass('k-state-selected').addClass('txbinh-custom');
        //    if ($(this).index() >= (num_in_page - 3) && $(this).index() > 3) {
        //        $(this).find('td.k-command-cell').addClass('translate3d');
        //    }
        //});
        //bắt sự kiện hover v2
        $('#' + id + '.k-grid').on('mouseenter', 'tr', function () {
            $('#' + id + '.k-grid tr').removeClass('txbinh-custom').removeClass('k-state-selected');
            $('#' + id + '.k-grid tr td.k-command-cell').removeClass('translate3d');
            $(this).addClass('k-state-selected').addClass('txbinh-custom');
            if ($(this).index() >= (num_in_page - 3) && $(this).index() > 3) {
                $(this).find('td.k-command-cell').addClass('translate3d');
            }
        });
        //bắt sự kiện click
        $('#' + id + '.k-grid tr').on('click', function (e) {
            $('#' + id + '.k-grid tr').removeClass('txbinh-custom');
            $('#' + id + '.k-grid tr td.k-command-cell').removeClass('translate3d');
            $(this).addClass('txbinh-custom');
            if ($(this).index() >= (num_in_page - 3) && $(this).index() > 3) {
                $(this).find('td.k-command-cell').addClass('translate3d');
            }
        });
    }

}

function add_info_command_column(column, id) {
    if (column && column.length) {
        for (var i = 0; i < column.length; i++) {
            if (column[i].title == "STT") {
                column[i].field = 'stt';
                column[i].filterable = false;
            }
            if (column[i].command) {
                column[i].title = '<div class="column_header_hide" onclick="kendo_view_column(this)"><i class="iconmoon iconmoon-HocPhan"></i> Ẩn hiện cột</div>';
                column[i].field = 'command';
                column[i].headerAttributes = { style: "text-align: right;" };
                break;
            }
        }
    }
    //lấy dữ liệu local đổ vào
    var data_store = getValueLocalStorage('grid_setting');
    if (data_store != null && data_store != undefined) {
        var data_grid_setting = JSON.parse(data_store);
        var column_hide = [];
        for (var i = 0; i < data_grid_setting.length; i++) {
            if (data_grid_setting[i].grid == id) {
                column_hide = data_grid_setting[i].column;
                break;
            }
        }
        if (column_hide.length > 0) {
            for (var i = 0; i < column.length; i++) {
                column[i].hidden = false;
                for (var j = 0; j < column_hide.length; j++) {
                    if (column[i].field == column_hide[j].name) {
                        column[i].hidden = true;
                        break;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < column.length; i++) {
                column[i].hidden = false;
            }
        }
    }
    return column;
}

function createLocalStorageItem(nameOfItem, value) {
    localStorage.setItem(nameOfItem, value);
}
function getValueLocalStorage(nameOfItem) {
    return localStorage.getItem(nameOfItem);
}


function init_custom_column_table(e, id) {
    var column = e.sender.columns;
    if (column && column.length) {
        var html = '<div class="contain_hide_column">';
        html += '<ul>';
        for (var i = 0; i < column.length; i++) {
            var text_column = column[i].title;
            var field_column = column[i].field;

            var ishide = column[i].hidden;
            if (text_column && field_column != 'command') {
                html += `<li><label class="switch switch-label switch-primary">
                                        <input id="is_check_`+ field_column + `" class="switch-input" data-val="` + field_column + `" type="checkbox" ` + (ishide == true ? `` : `checked="checked"`) + `>
                                        <span class="switch-slider" data-checked="Bật" data-unchecked="Tắt"></span>
                                    </label><span class="label_column">`+ text_column + `</span></li>`;
            }
        }
        html += '<ul>';
        html += '</div>';
    }
    $('#' + id).append(html);
    $('#' + id + ' .contain_hide_column input[type="checkbox"]').on('change', function () {

        var field = $(this).attr('data-val');
        var index_field = null;
        for (var i = 0; i < column.length; i++) {
            if (column[i].field == field) {
                index_field = i;
                break;
            }
        }
        if (index_field != null) {
            var is_show = $(this).is(':checked');
            var grid_this = $('#' + id).data('kendoGrid');
            if (is_show == true) {
                grid_this.showColumn(index_field);
            }
            else {
                grid_this.hideColumn(index_field);
            }
            //lưu dữ liệu
            var data_store = getValueLocalStorage('grid_setting');
            if (data_store != null && data_store != undefined) {
                var data_grid_setting = JSON.parse(data_store);
                var column_curent = $('#' + id).data('kendoGrid').columns;
                var column_hide = [];
                for (var i = 0; i < column_curent.length; i++) {
                    if (column_curent[i].hidden == true) {
                        column_hide.push({
                            name: column_curent[i].field
                        })
                    }
                }
                for (var i = 0; i < data_grid_setting.length; i++) {
                    if (data_grid_setting[i].grid == id) {
                        data_grid_setting[i].column = column_hide;
                        break;
                    }
                }
                createLocalStorageItem('grid_setting', JSON.stringify(data_grid_setting));
            }
        }
    });
    window.addEventListener('click', function (e) {
        if ($(e.target).parents('.contain_hide_column').length == 0 && ($(e.target).parents('.column_header_hide').length == 0 && $(e.target).hasClass('column_header_hide') == false)) {
            $('.contain_hide_column,.column_header_hide').removeClass('active');
        }
    });
    //lưu dữ liệu local store
    var column_hide = [];
    for (var i = 0; i < column.length; i++) {
        if (column[i].hidden == true) {
            column_hide.push({
                name: column[i].field
            })
        }
    }
    var data_store = getValueLocalStorage('grid_setting');
    if (data_store == null || data_store == undefined) {

        data_store = [{
            grid: id,
            column: column_hide
        }];
        createLocalStorageItem('grid_setting', JSON.stringify(data_store));
    }
    else {
        var data_grid_setting = JSON.parse(data_store);
        var is_exist = false;
        for (var i = 0; i < data_grid_setting.length; i++) {
            if (data_grid_setting[i].grid == id) {
                is_exist = true;
                break;
            }
        }
        if (is_exist == false) {
            data_grid_setting.push({
                grid: id,
                column: column_hide
            });
        }
        createLocalStorageItem('grid_setting', JSON.stringify(data_grid_setting));
    }
}
function kendo_view_column($this) {

    if ($($this).hasClass('active')) {
        $($this).removeClass('active');
        $('.contain_hide_column').removeClass('active');
    }
    else {
        $($this).addClass('active');
        $('.contain_hide_column').addClass('active');
    }
}
function filterKendoTreeList(data, options, columns) {
    var lst = [];
    if (data) lst = data;
    //remove filter nếu có
    if (columns && columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].filterable) {
                lst[columns[i].field] = '';
            }
        }
    }
    //lst.posstart = options.data.pageSize ? (((options.data.page - 1) * options.data.pageSize) + 1) : 1;
    //lst.numofrow = options.data.pageSize ? options.data.pageSize : -1;
    if (options.data.filter && options.data.filter.filters && options.data.filter.filters.length > 0) {
        var filters = options.data.filter.filters;
        for (var i = 0; i < filters.length; i++) {
            lst[filters[i].field] = filters[i].value;
        }
    }
    return lst;
}

function loadKendoComboBox(obj) {
    if ($("#" + obj.id).data('KendoComboBox')) {
        $("#" + obj.id).data('KendoComboBox').destroy();
    }
    $("#" + obj.id).kendoComboBox({
        placeholder: obj.placeholder,
        dataTextField: obj.dataTextField,
        dataValueField: obj.dataValueField,
        value: obj.value,
        template: obj.isLevel == true ? '<div style="padding-left:#:((data.level-1)*15)#px" class="#:data.isDisabled ?\'k-state-disabled\':\'\'#">#:data.' + obj.dataTextField + '#</div>' : (obj.template ? obj.template : ''),
        filter: "contains",
        filtering: function (e) {
            var filter = e.filter;
            if (filter.field && obj.data && filter.value) {
                obj.data[filter.field] = filter.value;
            }
        },
        dataSource: obj.dataSource ? obj.dataSource : {
            type: "jsonp",
            serverFiltering: false,
            transport: {
                read: function (options) {
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: obj.data,
                        success: function (result) {
                            console.log(result);
                            options.success(result.data);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            }
        },
        change: obj.onChange ? obj.onChange : function () { },
        dataBound: function (e) {
            var widget = $('#' + obj.id).getKendoComboBox();
            widget.input.on("focus", function () {
                widget.open();
            });
            if (obj.isrequired == true) {
                $('input[aria-owns="' + obj.id + '_listbox"]').attr('required', 'required')
            }
            if (typeof obj.dataBound === 'function') {
                obj.dataBound(e);
            }
        },
        select: obj.select ? obj.select : function (e) {

        },
    });

}
//if ($("#" + obj.id).data('kendoMultiSelect')) {
//    $("#" + obj.id).data('kendoMultiSelect').destroy();
//    $('#' + obj.id).parent().find('.k-multiselect-wrap.k-floatwrap[role="listbox"]').remove();
//}

//if ($("#" + obj.id).data('kendoGrid')) {
//    $("#" + obj.id).data('kendoGrid').destroy();
//}
function loadKendoDropDownList(obj) {
    if ($("#" + obj.id).data('KendoDropDownList')) {
        $("#" + obj.id).data('KendoDropDownList').destroy();
        //$('#' + obj.id).parent().find('.k-multiselect-wrap.k-floatwrap[role="listbox"]').remove();
    }
    $("#" + obj.id).kendoDropDownList({
        optionLabel: obj.optionLabel,
        dataTextField: obj.dataTextField,
        dataValueField: obj.dataValueField,
        value: obj.value,
        template: obj.isLevel == true ? '<div style="padding-left:#:((data.level-1)*15)#px">#:data.' + obj.dataTextField + '#</div>' : (obj.template ? obj.template : ''),
        filter: "contains",
        dataSource: obj.dataSource ? obj.dataSource : {
            type: "jsonp",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: obj.data,
                        success: function (result) {
                            //console.log(result);
                            options.success(result.data);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            }
        },
        change: obj.onChange ? obj.onChange : function () { },
    });
}
//loadKendoMultiSelect({
//    id: id,
//    placeholder: placeholder,
//    dataTextField: dataTextField,
//    dataValueField: dataValueField,
//    value: value,
//    url: url,
//    data: data
//})
function loadKendoMultiSelect(obj) {
    if ($("#" + obj.id).data('kendoMultiSelect')) {
        $("#" + obj.id).data('kendoMultiSelect').destroy();
        $('#' + obj.id).parent().find('.k-multiselect-wrap.k-floatwrap[role="listbox"]').remove();
    }

    $("#" + obj.id).kendoMultiSelect({
        placeholder: obj.placeholder,
        dataTextField: obj.dataTextField,
        dataValueField: obj.dataValueField,
        value: obj.value,
        filter: "contains",
        dataSource: obj.dataSource ? obj.dataSource : {
            type: "jsonp",
            serverFiltering: false,
            transport: {
                read: function (options) {
                    let data = (filterKendoMultiSelect(obj.data, options, obj.dataTextField));
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: data,
                        success: function (result) {
                            options.success(result.data);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            }
        },
        headerTemplate: obj.headerTemplate,
        footerTemplate: obj.footerTemplate,
        itemTemplate: obj.itemTemplate,
        tagTemplate: obj.tagTemplate,
        maxSelectedItems: obj.maxSelectedItems ? obj.maxSelectedItems : null,
        autoClose: obj.autoClose ? obj.autoClose : true,
        dataBound: obj.dataBound ? obj.dataBound : function () { },
        change: obj.change ? obj.change : function () { },
    });
    if (typeof obj.callback === 'function') {
        obj.callback();
    }
}
function filterKendoMultiSelect(data, options, dataSearchField) {
    let lst = [];
    if (data) lst = data;
    //remove filter nếu có
    lst[dataSearchField] = '';
    if (options.data.filter && options.data.filter.filters && options.data.filter.filters.length > 0) {
        var filters = options.data.filter.filters;
        for (var i = 0; i < filters.length; i++) {
            lst[filters[i].field] = filters[i].value;
        }
    }
    return lst;
}
//loadKendoGrid({
//    id: id,
//    url: _url,
//    pageSize: url,
//    data: { },
//    model: model,
//    height: 500,
//    columns: columns
//});
function loadKendoGrid(obj) {
    if ($("#" + obj.id).data('kendogrid')) {
        $("#" + obj.id).data('kendogrid').destroy();
    }
    if (obj.columns) {
        obj.columns = add_info_command_column(obj.columns, obj.id);
    }
    $("#" + obj.id).kendoGrid({
        dataSource: {
            serverFiltering: true,
            serverPaging: obj.serverPaging ? obj.serverPaging : true,
            pageSize: obj.pageSize ? obj.pageSize : 20,
            transport: {
                read: function (options) {
                    let data = filterKendoGrid(obj.data, options, obj.columns);
                    if (obj.serverPaging == false) {
                        data.numofrow = -1;
                    }
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: data,
                        success: function (result) {
                            options.success(result);
                            console.log(result)
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: obj.model,
                data: "data",
                total: "total"
            },

        },
        resizable: obj.resizable ? obj.resizable : true,
        height: obj.height ? obj.height : ($(window).height() - 102),
        groupable: false,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: obj.pageSizes ? obj.pageSizes : [5, 10, 20, 50, 100, 200, "all"],
            buttonCount: 3
        },
        selectable: obj.selectable ? obj.selectable : "row",
        filterable: {
            extra: false,
            messages: {
                operators: "and",
            },
            operators: {
                string: {
                    contains: "Contains...",
                }
            }
        },
        filterMenuInit: function (e) {
            //setTimeout(function () {
            //    e.container.find('input.k-textbox').focus();
            //}, 500);            
        },
        filterMenuOpen: function (e) {
            e.container.find('input.k-textbox').focus();
        },
        columns: obj.columns,
        editable: obj.editable ? obj.editable : true,
        dataBound: function (e) {
            if (obj.isCustomtool) {
                //đoạn code hiển thị đám button custom
                init_custom_tool_table(e, obj.id);
            }
            //thêm nút ẩn hiển cột
            init_custom_column_table(e, obj.id);
            if (typeof obj.dataBound === 'function') {
                obj.dataBound(e);
            }
        },
        dataBinding: obj.dataBinding ? obj.dataBinding : function () {

        },
        detailInit: obj.detailInit ? obj.detailInit : false,
        persistSelection: obj.persistSelection ? obj.persistSelection : false,
        change: obj.change ? obj.change : function () {
        },
        detailTemplate: obj.detailTemplate
    });
}
function filterKendoGrid(data, options, columns) {
    let lst = [];
    if (data) lst = data;
    //remove filter nếu có
    if (columns && columns.length > 0) {
        for (var i = 0; i < columns.length; i++) {
            if (columns[i].filterable) {
                lst[columns[i].field] = '';
            }
        }
    }
    lst.posstart = options.data.pageSize ? (((options.data.page - 1) * options.data.pageSize) + 1) : 1;
    lst.numofrow = options.data.pageSize ? options.data.pageSize : -1;
    if (options.data.filter && options.data.filter.filters && options.data.filter.filters.length > 0) {
        var filters = options.data.filter.filters;
        for (var i = 0; i < filters.length; i++) {
            lst[filters[i].field] = filters[i].value;
        }
    }
    return lst;
}

function loadKendoDatePicker(obj) {
    $("#" + obj.id).kendoDatePicker({
        value: obj.value,
        dates: obj.dates,
        //weekNumber: obj.weekNumber,
        month: obj.month,
        footer: obj.footer,
        disableDates: obj.disableDates,
        format: obj.format,
        max: obj.max,
        min: obj.min,
        dateInput: obj.dateInput,
        culture: obj.culture ? obj.culture : "vi-VN"
    });
}
function loadKendoYear(obj) {
    $("#" + obj.id).kendoDatePicker({
        start: "decade",
        depth: "decade",
        format: "yyyy",
        value: obj.value
    });
}
function loadkendoNumber(obj) {
    $("#" + obj.id).kendoNumericTextBox({
        min: 1
    });
};
function printKendoGrid(obj) {
    var isloading = true;
    $('body').append('<div id="' + obj.id + '"></div>');
    var template_print = `<div class="page-template-print-pdf">
            <div class="header">
                <div style="float: right">Trang #: pageNum # of #: totalPages #</div>
                Lạc Việt
            </div>
            <div class="watermark">Lạc Việt</div>
            <div class="footer">
                Trang #: pageNum # of #: totalPages #
            </div>
        </div>`;
    $("#" + obj.id).kendoGrid({
        dataSource: {
            serverFiltering: true,
            serverPaging: obj.serverPaging ? obj.serverPaging : true,
            pageSize: obj.pageSize ? obj.pageSize : 20,
            transport: {
                read: function (options) {
                    let data = filterKendoGrid(obj.data, options, obj.columns);
                    if (obj.serverPaging == false) {
                        data.numofrow = -1;
                    }
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: data,
                        success: function (result) {
                            console.log(result);
                            options.success(result);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            },
            schema: {
                model: obj.model,
                data: "data",
                total: "total"
            },

        },
        resizable: obj.resizable ? obj.resizable : true,
        height: obj.height ? obj.height : ($(window).height() - 102),
        groupable: false,
        sortable: true,
        pageable: {
            refresh: true,
            pageSizes: obj.pageSizes ? obj.pageSizes : [5, 10, 20, 50, 100, 200, "all"],
            buttonCount: 3
        },
        selectable: obj.selectable ? obj.selectable : "row",
        filterable: {
            extra: false,
            messages: {
                operators: "and",
            },
            operators: {
                string: {
                    contains: "Contains...",
                }
            }
        },
        filterMenuInit: function (e) {
            //setTimeout(function () {
            //    e.container.find('input.k-textbox').focus();
            //}, 500);            
        },
        filterMenuOpen: function (e) {
            e.container.find('input.k-textbox').focus();
        },
        columns: obj.columns,
        editable: obj.editable ? obj.editable : false,
        dataBound: function (e) {
            if (isloading == true) {
                setTimeout(function () {
                    $('#' + obj.id + ' .k-header.k-grid-toolbar .k-grid-pdf').trigger('click');
                }, 300);                //
                isloading = false;
            }
            if (typeof obj.dataBound === 'function') {
                obj.dataBound(e);
            }
        },
        dataBinding: obj.dataBinding ? obj.dataBinding : function () {

        },
        detailInit: obj.detailInit ? obj.detailInit : false,
        persistSelection: obj.persistSelection ? obj.persistSelection : false,
        change: obj.change ? obj.change : function () {
        },
        detailTemplate: obj.detailTemplate,
        toolbar: ["pdf"],
        pdf: {
            allPages: true,
            avoidLinks: true,
            paperSize: "A4",
            margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
            landscape: true,
            repeatHeaders: true,
            template: obj.template ? obj.template : template_print,
            scale: 0.8,
            fileName: obj.fileName ? obj.fileName : "grid_print.pdf"
        },
        pdfExport: function (e) {
            init_watting_popup();
            e.promise
                .progress(function (e) {
                })
                .done(function () {
                    remove_watting_popup();
                    $('body #' + obj.id).remove();
                });
        },
    });
}
function loadKendoDropDownTree(obj) {
    //dataSource: [
    //    { id: 1, name: "Apples" },
    //    { id: 2, name: "Oranges" }
    //],
    $("#" + obj.id).kendoDropDownTree({
        dataSource: obj.dataSource ? obj.dataSource : {
            type: "jsonp",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    $.ajax({
                        url: obj.url,
                        type: "POST",
                        dataType: "json",
                        async: obj.async ? obj.async : true,
                        data: obj.data,
                        success: function (result) {
                            console.log(result);
                            options.success(result.data);
                        },
                        error: function (result) {
                            options.error(result);
                        }
                    });
                }
            }
        },
        change: obj.onChange ? obj.onChange : function () { },
        dataBound: function (e) {
            //var widget = $('#' + obj.id).getKendoComboBox();
            //widget.input.on("focus", function () {
            //    widget.open();
            //});
            if (obj.isrequired == true) {
                $('input[aria-owns="' + obj.id + '_listbox"]').attr('required', 'required')
            }
            if (typeof obj.dataBound === 'function') {
                obj.dataBound(e);
            }
        },
        select: obj.select ? obj.select : function (e) {

        },
        dataTextField: obj.dataTextField,
        dataValueField: obj.dataValueField,
        checkboxes: true,
        tagMode: "single"
    });
}