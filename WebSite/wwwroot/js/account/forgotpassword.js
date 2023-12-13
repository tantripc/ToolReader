function forgotpassword() {
    if ($('#form_forgot').valid()) {
        var email = $('#email').val();
        $.ajax({
            url: _RootBase + "Account/Forgotpassword",
            dataType: "json",
            type: "POST",
            async: true,
            data: {
                emailaddr: email
            },
            beforeSend: function () {
                init_watting_popup();
            },
            complete: function () {
                remove_watting_popup();
            },
            success: function (data) {
                if (data != null) {
                    returncode = data.returncode;
                    if (returncode == 0) {
                        
                        Swal.fire({
                            icon: 'success',
                            title: _localizer.thongbao,
                            html: _localizer.daguimathanhcongvuilongkiemtraemail,
                            confirmButtonText: _localizer.dong,
                        }).then(function () {
                            if (data.returnurl) {
                                location.href = decodeURIComponent(data.returnurl);
                            } else {
                                location.reload(true);
                            }
                        });
                        window.location.href = url_Home;

                    }
                    else {
                        if (returncode == -1) {
                            Swal.fire({
                                icon: 'error',
                                title: _localizer.thongbao,
                                html: _localizer.loidocghicosodulieu,
                                confirmButtonText: _localizer.dong,
                            }).then(function () {
                            });
                        }
                        else {
                            Swal.fire({
                                icon: 'error',
                                title: _localizer.thongbao,
                                html: data.returnmsg,
                                confirmButtonText: _localizer.dong,
                            }).then(function () {
                            });
                        }
                    }
                }
            },
            error: function (err) {
                console.log(err);
                remove_watting_popup();
            }
        });
    }
}

