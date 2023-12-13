$(document).ready(function () {
    init_comment();
})
//các nút nhấn
function init_comment() {
    var saveComment = function (data) {
        // Convert pings to human readable format
        $(data.pings).each(function (index, id) {
            var user = usersArray.filter(function (user) { return user.id == id })[0];
            data.content = data.content.replace('@' + id, '@' + user.fullname);
        });
        return data;
    }
    var usersArray = [];
    $('#list_doccomment').comments({
        profilePictureURL: url_avatar,
        textareaPlaceholderText: _localizer.nhapbinhluan,
        sendText: _localizer.gui,
        replyText: _localizer.traloi,
        editText: _localizer.chinhsua,
        editedText: _localizer.dachinhsua,
        youText: full_name != undefined ? full_name : '',
        saveText: _localizer.luu,
        deleteText: _localizer.xoa,
        noCommentsText: _localizer.khongcobinhluan,
        viewAllRepliesText: _localizer.xemtatca__replyCount__traloi,
        hideRepliesText: _localizer.antraloi,
        newText: _localizer.moi,
        postCommentOnEnter: false,
        currentUserId: userid,
        roundProfilePictures: true,
        textareaRows: 4,
        enableAttachments: false,
        enableHashtags: true,
        enablePinging: true,
        enableUpvoting: false,
        enableNavigation: false,
        currentUserIsAdmin: true,
        fieldMappings: {
            id: 'doccmtid',
            parent: 'pdoccmtid',
            created: 'createddate',
            modified: 'modifieddate',
            content: 'comment',
            file: 'file',
            fileURL: 'file_url',
            fileMimeType: 'file_mime_type',
            pings: 'pings',
            creator: 'creator',
            fullname: 'fullname',
            //profileURL: 'profilephoto',
            profilePictureURL: 'profilephoto',
            isNew: 'is_new',
            //createdByAdmin: 'postby',
            createdByCurrentUser: 'postbycurrentuser',
        },
        getUsers: function (success, error) {
            setTimeout(function () {
                success(usersArray);
            }, 500);
        },
        getComments: function (success, error) {
            $.ajax({
                url: _RootBase + "DocComment/DocComment_Get",
                dataType: "json",
                type: "POST",
                data: {
                    pdoccmtid: null,
                    docid: _docid,
                    recursive: true,
                    posstart: 1,
                    numofrow: -1
                },
                success: function (commentsArray) {
                    for (var i = 0; i < commentsArray.data.length; i++) {
                        if (commentsArray.data[i].profilephoto == undefined || commentsArray.data[i].profilephoto == null) {
                            commentsArray.data[i].profilephoto = "/Avatar/NoAvatar.png";
                        }
                        commentsArray.data[i].profilephoto = validURL(commentsArray.data[i].profilephoto) ? commentsArray.data[i].profilephoto : (urlfile + commentsArray.data[i].profilephoto);
                        commentsArray.data[i].modifieddate = (commentsArray.data[i].ismodified == true ? commentsArray.data[i].modifieddate : commentsArray.data[i].createddate);
                        if (commentsArray.data[i].userid == userid) {
                            commentsArray.data[i]["postbycurrentuser"] = true;
                        }
                        else {
                            commentsArray.data[i]["postbycurrentuser"] = false;
                        }
                    }
                    success(commentsArray.data);
                },
                error: error
            });
        },
        postComment: function (data, success, error) {
            if (userid == -1) {
                toastr["error"](commentsArray.returnmsg, _localizer.thongbao);
                login_modal();
                setParamUrl({
                    returnurl: location.href
                });
            } else {
                $.ajax({
                    url: _RootBase + "DocComment/DocComment_Add",
                    dataType: "json",
                    type: "POST",
                    data: {
                        pdoccmtid: data.pdoccmtid,
                        docid: _docid,
                        comment: data.comment,
                        postby: userid
                    },
                    success: function (commentsArray) {
                        if (commentsArray.returncode == 0) {
                            data.news_commentid = commentsArray.id;
                            success(saveComment(data));

                        }
                        else {
                            toastr["error"](commentsArray.returnmsg, _localizer.thongbao);
                        }
                    },
                    error: error
                });
            }
        },
        putComment: function (data, success, error) {
            $.ajax({
                url: _RootBase + "DocComment/DocComment_Add",
                dataType: "json",
                type: "POST",
                data: {
                    doccmtid: data.doccmtid,
                    docid: _docid,
                    comment: data.comment,
                    postby: userid
                },
                success: function (commentsArray) {
                    if (commentsArray.returncode == 0) {
                        success(saveComment(data));
                    }
                    else {
                        toastr["error"](commentsArray.returnmsg, _localizer.thongbao);
                    }
                },
                error: error
            });
        },
        deleteComment: function (data, success, error) {
            $.ajax({
                url: _RootBase + "DocComment/DocComment_Delete",
                dataType: "json",
                type: "POST",
                data: {
                    doccmtid: data.doccmtid
                },
                success: function (commentsArray) {
                    if (commentsArray.returncode == 0) {
                        toastr["success"](_localizer.xoabinhluanthanhcong, _localizer.thongbao);
                        success();

                    }
                    else {
                        toastr["error"](commentsArray.returnmsg, _localizer.thongbao);
                    }
                },
                error: error
            });
        },
        uploadAttachments: function (dataArray, success, error) {
            setTimeout(function () {
                success(dataArray);
            }, 500);
        },
        validateAttachments: function (attachments, callback) {
            setTimeout(function () {
                callback(attachments);
            }, 500);
        },
    });
}












