/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: VI (Vietnamese; Tiếng Việt)
 */
$.extend( $.validator.messages, {
	required: "Trường này bắt buộc.",
	remote: "Trường này cần cập nhật.",
	email: "Nhập đúng định dạng email.",
    url: "Nhập đúng định dạng URL.",
    date: "Nhập đúng định dạng ngày.",
    dateISO: "Nhập đúng định dạng ngày (ISO).",
    number: "Chỉ cho nhập chữ số.",
	digits: "Chỉ cho nhập chữ số.",
	creditcard: "Nhập số thẻ tín dụng.",
	equalTo: "Dữ liệu không khớp.",
	extension: "Phần mở rộng không đúng.",
	maxlength: $.validator.format( "Cho phép nhập từ {0} kí tự trở xuống." ),
    minlength: $.validator.format( "Cho phép nhập từ {0} kí tự trở lên." ),
    rangelength: $.validator.format( "Cho phép nhập từ {0} đến {1} kí tự." ),
    range: $.validator.format( "Cho phép nhập từ {0} đến {1}." ),
    max: $.validator.format( "Cho phép nhập từ {0} trở xuống." ),
    min: $.validator.format("Cho phép nhập từ {0} trở lên."),
    noSpace:"Trường này không được chứa khoảng trắng"
} );
