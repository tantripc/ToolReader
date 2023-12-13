var api = null;
var list_participantJoined = [];
var is_joined = false;
function init_video_conference(obj) {    
    const domain = obj.url;//remove_protocols(urlWebApiVideoConference);
    const options = {       
        roomName: obj.roomName,
        width: obj.width,
        height: obj.height,
        parentNode: document.querySelector('#' + obj.id),
        //configOverwrite: config,
        //interfaceConfigOverwrite: interfaceConfig,              
        //invitees: obj.invitees
    };    
    api = new JitsiMeetExternalAPI(domain, options);

    api.executeCommands({
        displayName: obj.displayName,
        email: obj.email,
        avatarUrl: obj.avatarUrl
    });
    if (obj.isownner) {
        api.on('videoConferenceJoined', function () {
            setTimeout(function () {
                api.executeCommand('password', obj.password);
                api.executeCommand('subject', obj.subject);
            }, 100);
            if (typeof obj.init_room === 'function') {
                obj.init_room();
            }
        }); 
        api.on('participantJoined', function (e) {
            list_participantJoined.push(e.id);
        });
        api.on('videoConferenceLeft', function (e) {
            console.log(e);
            //đá tất cả học sinh ra khỏi phòng
            api.executeCommand('kickParticipants', list_participantJoined);
            console.log(list_participantJoined);

            if (typeof obj.callback === 'function') {
                obj.callback();
            }
            api.dispose();
            //location.href = obj.urlBack;
        });
    }
    else {
        api.on('videoConferenceJoined', function (e) {
            is_joined = true;
        });
        api.on('videoConferenceLeft', function (e) {
            if (is_joined) {
                location.href = obj.urlBack;
            }
        });
        api.on('participantLeft', function (e) {
            console.log(e);
        })
        api.on('participantKickedOut', function (e) {
            console.log(1);
            if (is_joined) {
                location.href = obj.urlBack;
            }
        })
    }    
    window.onunload = function () {  
        //đá tất cả học sinh ra khỏi phòng
        //api.executeCommand('kickParticipants', list_participantJoined);

        //if (typeof obj.callback === 'function') {
        //    obj.callback();
        //}        
        //api.dispose();
        location.href = obj.urlBack;
    }
}