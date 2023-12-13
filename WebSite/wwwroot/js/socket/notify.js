//xin cấp quyền gửi notify trên trình duyệt
document.addEventListener('DOMContentLoaded', function () {
    if (!Notification) {
        return;
    }

    if (Notification.permission !== 'granted')
        Notification.requestPermission();
});
window.addEventListener('load', function () {
    var u_connect = $('.connectionidAdmin').attr('data-connect');
    if (u_connect && u_connect != '') {
        var connection = _connection(WEBSOCKET_URL, WEBSOCKET_PATH, window.location.hostname, { room: SOCKETROOM, user: u_connect }, function () { });
        window.connection = connection;
        connection.receive(function (message, id) {
            if (message.content != '' && message.to != '' && u_connect == message.to) {
                view_notify(message.content, message.id);
            }
        });
    }

});

function send_socket_notify(from, to, content, id) {
    window.connection.send({
        from: from,//obj
        id: id,//obj
        //chat: true,
        content: content,
        to: to
    });
}
//gửi notify qua trình duyệt cho người nhận
function send_notify_browser(title, icon, body, link) {
    if (Notification.permission !== 'granted')
        Notification.requestPermission();
    else {
        var notification = new Notification(title, {
            icon: icon,
            body: body,
        });
        notification.onclick = function () {
            window.open(link);
        };
    }
}
//hiển thị notify
function view_notify(message, id) {
    $.ajax({
        url: _RootBase + "Notification/LazyLoadNotify",
        //dataType: "json",
        type: "GET",
        data: {
            notifyrecvid: id,
            ishide: null,
            posstart: 1,
            numofrow: 1
        },
        success: function (result) {
            if (result) {
                $('#list_header_notify').prepend(result);
                //cập nhật lại số trên header
                var total_my_notify = $('#total_notify').attr('data-val');
                var new_notify = parseInt(total_my_notify) + 1;
                $('#total_notify').attr('data-val', new_notify)
                $('#total_notify').text((new_notify > 99 ? '99+' : new_notify));
                //popup
                $('#total_notify').text(new_notify);
                //trang my notify
                $('#total_notify_list').text(new_notify);
                $('#list_header_notify_list').prepend(result);
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'bottom-end',
                    showConfirmButton: false,
                    timer: 7000,
                    showCloseButton: true,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener('mouseenter', Swal.stopTimer)
                        toast.addEventListener('mouseleave', Swal.resumeTimer)
                    }
                })
                Toast.fire({
                    icon: 'success',
                    title: message,
                    color: '#000'
                })
            }
            try {
                var title = 'Thông báo';
                var icon = '';
                var body = '';
                var link = '';
                icon = $('#list_header_notify .dropdown-item img').first().attr('src');
                body = $('#list_header_notify .dropdown-item .item-notify').first().text();
                link = $('#list_header_notify .dropdown-item .item-notify').first().attr('href');
                send_notify_browser(title, icon, body, link);
            }
            catch (err) {
            }
        },
    });
}