$(document).ready(function () {
    loadKendoComboBox({
        id: "vrole",
        dataTextField: "objectvalue",
        dataValueField: "lookupid",
        value: vrole != '' ? vrole : '',
        url: _RootBase + "General/searchreflookup",
        data: {
            objectname: 'v_role'
        },
        isrequired: true
    });
    loadKendoComboBox({
        id: "org",
        dataTextField: "orgname",
        dataValueField: "orgid",
        value: _orgid != '' ? _orgid : '',
        url: _RootBase + "Organization/get_organization",
        data: {
            numofrow: 500,
            posstart: 1,
            porgid: -1
        },
        isrequired: true

    });
    loadKendoDatePicker({
        id: 'dob',
        weekNumber: true,
        format: 'dd/MM/yyyy',
        value: _dob.toString("yyyy/MM/dd")

    });
});
function update_user(id) {
    if ($('form').valid()) {
        // lấy value của form nhập dữ liệu
        var user_code = $('#user_code').val();
        var firstname = $('#firstname').val();
        var lastname = $('#lastname').val();
        var username = $('#username').val();
        var emailaddr = $('#emailaddr').val();
        var password = $('#password').val();
        var diachi = $('#diachi').val();
        var dob = $('#dob').val();
        var sodienthoai = $('#sodienthoai').val();
        var gender = $("input[name='gender']:checked").val();
        var vrole = $('#vrole').data('kendoComboBox').value();
        //kiểm tra dữ liệu
        // check dữ liệu ngày tháng
        //check_date_valid
        //gọi api cập nhật dữ liệu =>> trả thông báo
        $.ajax({
            url: _RootBase + "Account/Action_addupdate",
            dataType: "json",
            type: "POST",
            data: {
                userid: id,
                firstname: firstname,
                lastname: lastname,
                username: username,
                emailaddr: emailaddr,
                pwd: password,
                contacts: diachi,
                user_code: user_code,
                dob: dob,
                mobile: sodienthoai,
                gender: gender,
                v_role: vrole,
                orgid: _orgid
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
                        toastr["success"](_localizer.capnhattaikhoanthanhcong,_localizer.thongbao);
                    }
                    else {
                        if (returncode == -1) {
                            toastr["error"](_localizer.loidocghicosodulieu, _localizer.thongbao);
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
$('#coversheet').on('change', function () {
    var options = {
        subFolder: 'Certificate',
        fileType: 'image'
    };
    init_dialog_crop_image_and_upload({
        idinputfile: 'coversheet',
        aspectRatio: 16 / 9,
        api_file: api_file,
        callback: function (e) {
            if (e.ReturnCode == 0) {
                $('#imgcoversheet').attr('src', _api_file + e.PathfileName).show();
                $('#coversheet').attr('data-name', e.PathfileName);
            }
        },
        options_upload: options
    })
});
function updatecoversheet() {
    $('#coversheet').trigger('click');
}