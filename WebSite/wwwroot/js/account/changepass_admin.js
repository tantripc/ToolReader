$('#confirmpassword').on('keyup', function () {
    if ($('#newpassword').val() == $('#confirmpassword').val()) {
        $('#message').html('').css('color', 'green');
    } else
        $('#message').html(_localizer.matkhaukhongkhop).css('color', 'red');
});
function newpasswordfunc() {
    var x = document.getElementById("newpassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function confirmpasswordfunc() {
    var x = document.getElementById("confirmpassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function currentpassword() {
    var x = document.getElementById("currentpassword");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
function changepassword(userid) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var confirmpassword = $('#confirmpassword').val();
        var password = $('#password').val();
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Account/changepass_admin",
            dataType: "json",
            type: "POST",
            data: {
                userid: userid,
                newpwd: confirmpassword,
                pwd: password,

            },
            async: true,
            beforeSend: function () {
                init_watting_popup();
            },
            complete: function () {
                remove_watting_popup();
            },
            success: function (data) {
                if (data != null) {
                    var returncode = data.returncode;
                    if (returncode == 0) {
                        InitDialogCourse({
                            id: 'changepass_admin_id',
                            width: 600,
                            title: _localizer.thongbao,
                            body: '<div style="text-align:center;font-size: 1.53125rem;">' + _localizer.doimatkhauthanhcong + '</div>',
                            footer: {
                                //text: 'Text null sẽ bị ẩn!',
                                button: [
                                    {
                                        text: _localizer.dong,
                                        style: 'background-color:#5C77D0;',
                                        click: function () {
                                            location.reload();
                                        },
                                        isClose: true,
                                    }
                                ]
                            }
                        });
                    }
                    else {
                        if (returncode == -1) {
                            toastr["error"](_localizer.doimatkhauthatbai, _localizer.thongbao);
                        }
                        else {
                            toastr["error"](data.returnmsg, _localizer.thongbao);
                        }
                    }
                }
            },
            error: function (err) {
                console.log(err)
            }
        });
    }
}