
(function () {
    if (SwalResource && typeof SwalResource === "object") {
        Object.assign(SwalResource, {
            warningBrowserNotSupportOnWindows: {
                title: "Trình duyệt này không hỗ trợ kết nối phòng họp!",
                text: "Thử lại với trình duyệt Google Chrome hoặc Firefox trên hệ điều hành Windows"
            },
            warningBrowserNotSupportOnMacOS: {
                title: "Trình duyệt này không hỗ trợ kết nối phòng họp!",
                text: "Thử lại với trình duyệt Google Chrome hoặc Firefox trên hệ điều hành MacOS"
            },
            warningBrowserNotSupportOnIOS: {
                title: "Trình duyệt này không hỗ trợ kết nối phòng họp!",
                text: "Thử lại với trình duyệt Safari trên thiết bị IOS (Iphone, Ipad)"
            },
            questionDelete: {
                title: "Bạn có chắc muốn xóa?",
                text: "Dữ liệu sau khi xóa sẽ không thể khôi phục lại!",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy"
            },
            questionEnableSpeaker: {
                title: "Bạn có chắc chắn?",
                text: "Bắt đầu chương trình của diễn giả này trong sự kiện!",
                confirmButtonText: "Bắt đầu!",
                cancelButtonText: "Đóng!"
            },
            questionDisableSpeaker: {
                title: "Bạn có chắc chắn?",
                text: "Dừng chương trình của diễn giả này trong sự kiện!",
                confirmButtonText: "Dừng lại",
                cancelButtonText: "Đóng!"
            },
            questionChangeDocument: {
                title: "Bạn có chắc chắn?",
                text: "Mở tài liệu này trong sự kiện!",
                confirmButtonText: "Mở tài liệu!",
                cancelButtonText: "Đóng!"
            }
        });
    }
})();