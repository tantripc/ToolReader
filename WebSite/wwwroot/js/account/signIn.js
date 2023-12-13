
//function SignInSubmit() {

//    if ($('#formlogin').val()) {
//        SignIn();
//    } else {
//    }
//}

function Loadbutton() {
    var check_username_empty = document.getElementById('username').value;
    var check_password_empty = document.getElementById('password').value;
    if (check_username_empty != '' && check_password_empty != '') {
        var nameradio = $('input[name=ogr]:checked').val();
        if (nameradio && nameradio != '') {
            SignIn_issynclibrary(nameradio);
        }
        else {
            SignIn();
        }
    }
    else {
        toastr["error"](_localizer.vuilongnhaptentaikhoanvamatkhau, _localizer.thongbao);
    };
    
}
function SignIn(emailaddr, signinoauth, providername, provideruserid, profilephoto, lastname, firstname, gender, birthday) {
    var returncode = 0;
    var username = "";
    var password = "";

    if (signinoauth == undefined) {
        username = $('#username').val();
        password = $('#password').val();
    }

    //var res = true;
    //var DeviceKey = null;
    //try {
    //    //var client = new ClientJS();
    //    //DeviceKey = client.getFingerprint();
    //    var fp = new Fingerprint({
    //        canvas: true,
    //        ie_activex: true,
    //        screen_resolution: true
    //    });
    //    var DeviceKey = fp.get();
    //}
    //catch (e) {
    //    DeviceKey = 12345689;
    //}
    //var returnurl = getQueryVariableUrl('returnurl') ? getQueryVariableUrl('returnurl') : '';
    //return false;
    //if (res) {
        $.ajax({
            url: _RootBase + "Account/SignIn",
            dataType: "json",
            type: "POST",
            async: true,
            data: {
                username: emailaddr != undefined ? emailaddr : username,
                password: password  ,
              /*  DeviceKey: DeviceKey,*/
                Language: navigator.language || null,
                UserAgent: navigator.userAgent || null,
                Vendor: navigator.vendor,
             /*   returnurl: returnurl ? returnurl : '',*/
                signinoauth: signinoauth ? signinoauth : false,
                providername: providername ? providername : '',
                provideruserid: provideruserid ? provideruserid : '',
                profilephoto: profilephoto ? profilephoto : ''
            },
            //beforeSend: function () {
            //    init_watting_popup();
            //},
            //complete: function () {
            //    remove_watting_popup();
            //},
            success: function (data) {
               
                if (data != null) {
                    returncode = data.returncode;
                    //return false;
                    if (returncode == 0) {
                        location.href = url_Home;
                    }
                    else {
                        if (signinoauth == undefined) {
                            if (returncode == -1) {
                                toastr["error"](_localizer_layout.loidocghicosodulieu, _localizer.thongbao);
                            }
                            else {
                                toastr["error"](_localizer.taikhoanhoacmatkhaukhongdung, _localizer.thongbao);
                            }
                        }
                        else {
                            if (returncode != 86) {
                                toastr["error"](_localizer.taikhoanhoacmatkhaukhongdung, _localizer.thongbao);
                            }
                            else {
                                socialnetworksignup(providername, provideruserid, emailaddr, gender, firstname, lastname, profilephoto, birthday);
                            }
                        }
                    }
                }
            },
            error: function (err) {
                console.log(err);
                /*remove_watting_popup();*/
            }
        });
    //}
    return returncode;
}
function SignIn_issynclibrary(nameradio) {
    if ($('#formlogin').valid()) {
        var username = $('#username').val();
        var password = $('#password').val();
        var res = true;
        var DeviceKey = null;
        try {
            var fp = new Fingerprint({
                canvas: true,
                ie_activex: true,
                screen_resolution: true
            });
            var DeviceKey = fp.get();
        }
        catch (e) {
            DeviceKey = 12345689;
        }
        if (res) {
            $.ajax({
                url: _RootBase + "Account/SignIn_Library",
                dataType: "json",
                type: "POST",
                async: true,
                data: {
                    UserName: username,
                    Password: password,
                    DeviceKey: DeviceKey,
                    Language: navigator.language || null,
                    UserAgent: navigator.userAgent || null,
                    Vendor: navigator.vendor,
                    orgid: nameradio,
                    returnurl: getQueryVariableUrl('returnurl') ? getQueryVariableUrl('returnurl') : ''
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
                            location.href = data.url;
                        }
                        else if (returncode == -5) {
                            console.log("active");
                        }
                        else if (returncode == -4) {
                            console.log("detail-part2");
                        }
                        else if (returncode == -3) {
                            console.log("register");
                        }
                        else if (returncode == -2) {
                            console.log("detail");
                        }
                        else if (data.reps.error_description == "The user name or password is incorrect.") {
                            toastr["error"](_localizer.taikhoanhoacmatkhaukhongdung, _localizer.thongbao);
                        }
                        else if (returncode == -1) {
                            toastr["error"](data.reps.error_description, _localizer.thongbao);
                        }
                        else {
                            toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
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
}