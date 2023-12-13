namespace WebApi.Models
{
    public class returnval
    {
        public int? returncode { get; set; }
        public string? returnmsg { get; set; }
        public long? v_role { get; set; }
        //public long userid { get; set; }
        public long? id { get; set; }
        public int? rowaffect { get; set; }
    }

    public class ReturnCode
    {
        // Cac ma loi chung
        // 0 -> 29
        public const int DO_OK = 0;

        public const int GENERAL_INVALIDPARAM = 1;
        public const int GENERAL_SYSTEM_ERR = 2;
        public const int GENERAL_DATABASE_ERR = 3;
        public const int GENERAL_NOTPERMIT = 4;
        public const int GENERAL_NOTFOUND = 5;
        public const int GENERAL_HIGHEST_LOCATION = 6;
        public const int GENERAL_LOWEST_LOCATION = 7;
        public const int GENERAL_EXISTS = 8;
        public const int GENERAL_INUSED = 9;
        public const int GENERAL_UNSUCCESS = 10;


        // SignIn
        // error code: 30 -> 59
        //public const int SIGNIN_ACCOUNTEMPTYOREXPIRY = 30; //1
        public const int SIGNIN_USERNAMEORPASSWORDINCORRECT = 31; //2
        public const int SIGNIN_USERINACTIVATE = 32; //35 //6
        public const int SIGNIN_ISFIRSTLOGIN_CHANGEPASS = 33; //39 //10
        public const int SIGNIN_USERISBLOCKED = 34; //40 //11
                                                    //public const int SIGNIN_PERSONTYPEORROLEINCORRECT = 35; //36 //7
                                                    //public const int SIGNIN_USERNAMEORFORGOTPWDCODE_INCORRECT = 36; //37 //8
                                                    //public const int SIGNIN_FORGOTPWDCODE_EXPIRE = 37; //38 //9


        // Users
        // error code: 60 -> 89
        public const int USERS__USERNAMEORPASSWORDINCORRECT = 60;
        public const int USERS__USERNAMENOTACTIVATED = 61;
        public const int USERS__USERNAMEBLOCKEDORDELETED = 62;
        public const int USERS__USERNAMENOTEXIST = 63;
        public const int USERS__CODEACTIVEFALSE = 64;
        public const int USERS__USERNAMEACTIVATED = 65;
        public const int USERS__FORGOTCODEOUTOFDATE = 66;
        public const int USERS__FORGOTCODEUSED = 67;
        public const int USERS__USERROLEDOESNOTEXIST = 68; //This user role does not exist in the system
        public const int USERS__USERALREADYEXISTS = 69; //user already exists
        public const int USERS__COUNTRYDOESNOTEXISTS = 70; //This country does not exist in the system
        public const int USERS__CITYDOESNOTEXISTS = 71; //This city does not exist in the system
        public const int USERS__DISTRICTDOESNOTEXISTS = 72; //District / District does not exist in the system
        public const int USERS__AREADOESNOTEXISTS = 73; //This area does not exist in the system
        public const int USERS__ACADEMYDOESNOTEXISTS = 74; //This academy does not exist in the system
        public const int USERS__LEVELEDUCATIONDOESNOTEXISTS = 75; //This level of education does not exist in the system
        public const int USERS__PROFESSIONALSKILLDOESNOTEXISTS = 76; //This professional skill does not exist in the system
        public const int USERS__DONOTENTEREMAIL = 77;
        public const int USERS__DONOTENTERPASSWORD = 78;
        public const int USERS__DONOTENTERNAME = 79;
        public const int USERS__DONOTENTERDOB = 80;
        public const int USERS__NOTEXISTRELATION = 81;
        public const int USERS__DONOTENTERGENDER = 82;
        public const int USERS__V_TITLE_DOESNOTEXISTS = 83;
        public const int USERS__REGISTERED_LEARNER = 84;
        public const int USERS__CREATED_PWD_IN24H = 85;
        public const int USERS__LEARNERCODEEX_EXIST = 86;


        // General
        // error code: 90 -> 119
        public const int MAILTEMPLATE_NAMEEXIST = 90;


        // Subject
        // error code: 120 -> 149
        public const int TOPIC_NEAR_NOTFOUND = 120;
        public const int TOPIC_HAS_CHILD = 121;
        public const int TOPIC_HAS_DOC = 122;
        public const int TOPIC_NAME_EMPTY = 123;
        public const int TOPIC_PARENT_NOTFOUND = 124;


        // Course
        // error code: 150 -> 179
        public const int DOC_NEAR_NOTFOUND = 150;
        public const int DOC_HAS_COURSE = 151;
        public const int DOC_HAS_LESSON = 152;
        public const int DOC_NOTFOUND = 153;
        public const int DOC_TOPIC_NOTFOUND = 154;
        public const int DOC_HAS_LEARNER = 155;
        public const int DOC_LEARNER_EXISTS = 156;
        public const int DOC_LIVE_EXISTS = 157;
        public const int DOC_LIVE_NAME_EXISTS = 158;
        public const int DOC_LEARNER_ISDELETED = 159;
        public const int DOC_USER_NOTFOUND = 160;
        public const int DOC_NO_LEARNER = 161;
        public const int DOC_NO_EXERCISE = 162;
        public const int DOC_LEARNER_EXISTSRESULT = 163;
        public const int DOC_STARTEDNOTREGISTER = 164;
        public const int DOC_NOT_SELF_REGISTER = 165;
        public const int DOC_LESSTHAN_REGISTER = 166; // Chua den thoi gian dang ky ghi danh khoa hoc
        public const int DOC_EXPIRE_REGISTER = 167; // Da het thoi gian dang ky ghi danh khoa hoc
        public const int DOC_CONTENT_NOTEXISTS = 168;
        public const int DOC_DUPLICATE = 169;
        public const int DOC_TITLE_EMPTY = 170;
        public const int DOC_TITLE_EXIST = 171;
        public const int DOC_NO_ATTACHFILE  = 172;



        // Lesson
        // error code: 180 -> 209
        public const int LESSON_NEAR_NOTFOUND = 180;
        public const int LESSON_HAS_LESSON = 181;
        public const int LESSON_WRONG_SEQUENCE = 182;
        public const int LESSON_CONTENT_NOTFOUND = 183;
        public const int LESSON_USER_NOTFOUND = 184;


        // LibraryItem
        // error code: 210 -> 239
        public const int LIB_NAME_ISEMPTY = 210;
        public const int LIB_SUBJECT_NOTFOUND = 211;
        public const int LIB_REF_INCORRECT = 212;
        public const int LIB_USE_INCOURSE = 213;
        public const int LIB_USE_INLESSON = 214;
        public const int LIB_COURSE_NOTEXIST = 215;
        public const int LIB_LESSON_NOTEXIST = 216;


        // Ref_certificate_template
        // error code: 240 -> 269
        public const int CERT_NAME_NULL = 240;
        public const int CERT_FROM_MODULE_NULL = 241;   //Tên module không hợp lệ.
        public const int CERT_FILLIN_TEMPLATE_NULL = 242;   //Template không hợp lệ.
        public const int CERT_CATEGORY_NULL = 243;  //Loại template không hợp lệ.
        public const int CERT_FILE_PATH_NAME_NULL = 244;  //Đường dẫn file không hợp lệ. 
        public const int CERT_IS_EXISTS = 245;  //Đường dẫn file không hợp lệ.
        public const int CERT_NOT_FOUND = 246;
        public const int CERT_PRINT_ERR = 247;
        public const int CERT_SAVE_ERR = 248;

        // News
        // error code: 270 -> 299
        public const int NEWS_SUBJECT_NOTEXISTS = 270;


        //Question_bank
        // error code: 300 -> 329
        public const int QUESTION_BANK_V_QUESTIONTYPE_NOTEXISTS = 300;
        //public const int QUESTION_BANK_V_QUESTIONCATG_NOTEXISTS = 301;
        public const int QUESTION_BANK_V_QUESTIONLEVEL_NOTEXISTS = 302;
        public const int QUESTION_BANK_V_QUESTIONTYPE_NOTSUPPORT = 303;
        public const int QUESTION_BANK_SUBJECT_NOTEXISTS = 304;
        public const int QUESTION_BANK_ISAPPROVED = 305;
        public const int QUESTION_BANK_ISUSED = 306;
        public const int QUESTION_BANK_NOTEXISTS = 307;

        //public const int QUESTION_BANK ... = ...;


        // QnrTemp
        // error code: 330 -> 359
        public const int QNRTEMP_SUBJECT_NOTEXISTS = 330;
        public const int QNRTEMP_COURSE_NOTEXISTS = 331;
        public const int QNRTEMP_LESSON_NOTEXISTS = 332;


        // Questionnaire
        // error code: 360 -> 389
        public const int QNR__USER_NOTEXISTS = 360;
        public const int QNR__QNRTEMP_NOTEXISTS = 361;
        public const int QNR__NOGEN_QNR = 362;
        public const int QNR__NOPERMIT_GENPREVIEWMODE = 363;
        public const int QNR__EMPTY = 364;
        public const int QNR__QNRTEMP_INCORRECT = 365;
        public const int QNR__NOT_ENOUGH_QBANK = 366;
        public const int QNR__INUSED = 367;


        // Gui_Banner
        // error code: 390 -> 419
        public const int GBN_NOT_EXISTS = 390;


        // course_qnr
        // error code: 420 -> 449
        public const int COURSE_QNR__COURSE_NOTFOUND = 420;
        public const int COURSE_QNR__LESSON_NOTFOUND = 421;
        public const int COURSE_QNR__QNR_NOTFOUND = 422;
        public const int COURSE_QNR__HAS_RESULT = 423;
        public const int COURSE_QNR__QNR_TEMP_MISSING = 424;
        public const int COURSE_QNR__QNR_TEMP_NOTFOUND = 425;
        public const int COURSE_QNR__QNR_TEMP_NOTAPPROVED = 426;
        public const int COURSE_QNR__SCORINGMETHOD_NOTFOUND = 427;


        // course_learnertask
        // error code: 450 -> 479
        public const int COURSE_LEARNERTASK__LEARNERID_INCORRECT = 450;
        public const int COURSE_LEARNERTASK__EXERCISEID_INCORRECT = 451;
        public const int COURSE_LEARNERTASK__QNR_EMPTY = 452;
        public const int COURSE_LEARNERTASK__ISCLOSED = 453;
        public const int COURSE_LEARNERTASK__QNR_INVALID = 454; // De thi khong thuoc danh sach de thi duoc chon
        public const int COURSE_LEARNERTASK__QNR_NOT_APPROVED = 455;  // De thi chua duoc Phe duyet
        public const int COURSE_LEARNERTASK__QNR_TEMP_MISSING = 456;
        public const int COURSE_LEARNERTASK__IS_NOT_CLOSED = 457;
        public const int COURSE_LEARNERTASK__NO_SCORE_ENTERED = 458; //Chua nhap diem cho phan cham bai tu luan.
        public const int COURSE_LEARNERTASK__DATE_NOT_BEGIN_OR_ENDED = 459;
        public const int COURSE_LEARNERTASK__CANNOT_RETEST_BEYOND_NUMOFTIMES = 460;
        public const int COURSE_LEARNERTASK__NOTEXISTS = 461;


        // course_learner
        // error code: 480 -> 509
        public const int COURSE_LEARNER_NOT_EXISTS = 480;
        public const int COURSE_LEARNER_PAYMENT_FAILED = 481;

        // notify
        // error code: 510 -> 539
        public const int NOTIFY_NOT_EXISTS = 510;
        public const int NOTIFY_TYPE_NOT_EXISTS = 511;//Loại thông báo không tồn tại.

        //Payment
        //error code: 540 -> 569
        public const int PAYMENT_ = 540;

        //signature
        //error code: 570 -> 599
        public const int SIGNATURE_NOTEXISTS = 570;

        //curr_schedule
        //error code: 600 -> 629
        public const int SCHEDULE_NOTEXISTS = 600;

        //holiday
        //error code: 630 -> 659
        public const int HOLIDAY_NOTEXISTS = 630;

        // user_group
        // error code: 660 -> 689
        public const int UG_NOTEXISTS = 660;


        // SCORM
        // error code: 690 -> 719
        public const int SCORM_FILENAME_ISEMPTY = 690;
        public const int SCORM_FILE_NOTEXIST = 691;
        public const int SCORM_EXTRACT_FOLDER_ISEMPTY = 692;
        public const int SCORM_EXTRACT_FOLDER_NOTEXIST = 693;
        public const int SCORM_FILETYPE_INCORRECT = 694;
        public const int SCORM_DECOMPRESS_ERR = 695;
        public const int SCORM_FILECONTENT_INCORRECT = 696;
        public const int SCORM_TEMPDIR_NOTEXIST = 697;
        public const int SCORM_UPLOAD_FOLDER_NOTEXIST = 698;

        //organization
        // error code: 720 -> 749
        public const int ORGANIZATION_NOTEXIST = 720;

        //application
        // error code: 750 -> 779
        public const int APPLICATION_EXISTS = 750;
        public const int APPLICATION_ROUTING_EXISTS = 751;
        public const int APPLICATION_NOT_EXISTS = 752;

        //report
        // error code: 780 -> 809
        public const int REPORT_EXISTS = 780;
        public const int REPORT_NOT_EXISTS = 781;
        public const int REPORT_TITLE_EXISTS = 782;
        public const int REPORT_KEY_EXISTS = 783;

        //process
        // error code: 810 -> 829
        public const int PROCESS_NOTEXISTS = 810;

        //program
        // error code: 830 -> 859
        public const int PROGRAM_NOTEXISTS = 830;
        public const int PROGRAM_ALREADY_EXISTS = 831;


        // Comment
        // error code: 860 -> 879
        public const int COMMENT_NOTEXISTS = 860;
        public const int COMMENT_PARENT_NOTEXISTS = 861;
        public const int COMMENT_NOCONTENT = 862;
        public const int COMMENT_CHANGE_EXPIRE = 863;
        public const int COMMENT_NOT_OWNER = 864;
    }

    public class Constant
    {
        public const string CULTUREDEFAULT = "vi-VN";
        public const string DATETIMEFORMATSIMPLE = "dd/MM/yyyy";
        public const string DATETIMEFORMATFULL = "dd/MM/yyyy HH:mm:ss";
        public const string MONTHDAYFORMAT = "MM/dd";
        public const string MONTHYEARFORMAT = "MM/yyyy";
        public const string LONGDATETIMEFORMATFULL = "yyyy-MM-ddTHH:mm:ss.FFFzzz"; //2014-08-14T22:38:25.35+07:00


        // Sort field
        public const int SortField_Order = 1;// (so thu tu)
        public const int SortField_Catalog_Name = 2;
        public const int SortField_Title = 3;//
        //public const int SortField_Author = 4;//
        //public const int SortField_Publisher = 5;// (nha xuat ban)
        //public const int SortField_PublishYear = 6;// (nam xuat ban)
        //public const int SortField_NumPage = 7;//
        //public const int SortField_DocSize = 8;// (dung luong)
        //public const int SortField_CoverPrice = 9;// (gia bia)
        //public const int SortField_OriginPrice = 10;// (gia goc)
        //public const int SortField_Price = 11;// (gia ban)
        //public const int SortField_PromotePrice = 12;// (gia khuyen mai)
        //public const int SortField_PercentDiscount = 13;// (phan tram giam gia)
        //public const int SortField_DocStatus = 14;//
        //public const int SortField_CreateByUserID = 15;//
        public const int SortField_CreateDate = 16;//
        //public const int SortField_ModifiedByUserID = 17;//
        public const int SortField_ModifiedDate = 18;//
        //public const int SortField_BuyDate = 19;// (ngay mua)
        //public const int SortField_DownloadDate = 20;// (ngay download)
        //public const int SortField_DownloadCount = 21;// (so lan download)
        //public const int SortField_NumDocInGroup = 22;
        //public const int SortField_PercentPromote = 23;
        //public const int SortField_BuyCount = 24;
        //public const int SortField_Rate = 25;
        //public const int SortField_Test_QuestionName = 26;
        //public const int SortField_Test_QuestionText = 27;
        //public const int SortField_Test_Score = 28;
        //public const int SortField_Test_CreateByUserID = 29;
        public const int SortField_Test_Register_StartDate = 30;
        public const int SortField_Test_Register_EndDate = 31;
        public const int SortField_Test_StartDate = 32;
        public const int SortField_Test_EndDate = 33;
        //public const int SortField_Test_CommentDate = 34;
        //public const int SortField_Lecture_Name = 35;
        //public const int SortField_Lecture_CreateDate = 36;
        //public const int SortField_Lecture_ModifiedDate = 37;
        //public const int SortField_Lecture_Ordinal = 38;
        //public const int SortField_News_Title = 39;
        //public const int SortField_News_CreateDate = 40;
        //public const int SortField_News_ModifiedDate = 41;
        //public const int SortField_News_Ordinal = 42;
        public const int SortField_Lesson_Name = 43;
        //public const int SortField_Lesson_CreateDate = 44;
        //public const int SortField_Lesson_ModifiedDate = 45;
        //public const int SortField_Lesson_Ordinal = 46;

        //public const int SortField_School_Name = 47;
        //public const int SortField_School_Address = 48;
        //public const int SortField_School_CreatedDate = 49;
        //public const int SortField_School_ModifiedDate = 50;
        //public const int SortField_School_ID = 254;

        //public const int SortField_Class_Name = 51;
        //public const int SortField_Class_SchoolYear = 52;
        //public const int SortField_Class_StartDate = 53;
        //public const int SortField_Class_EndDate = 54;
        //public const int SortField_Class_GradeLevel = 55;
        //public const int SortField_Class_NumberOfSeats = 56;
        //public const int SortField_Class_CreatedDate = 57;
        //public const int SortField_Class_ModifiedDate = 58;

        //public const int SortField_Learner_FirstName = 59;
        //public const int SortField_Learner_LastName = 60;


        //public const int SortField_Instructor_FirstName = 61;
        //public const int SortField_Instructor_LastName = 62;
        //public const int SortField_Instructor_V_TitleName = 63; // danh xung 
        //public const int SortField_Instructor_V_TitleNameEN = 64;

        public const int SortField_SubjectName = 65;

        //public const int SortField_Email = 66;
        //public const int SortField_LearnerStatusName = 67;

        //public const int SortField_TextBookName = 68;
        //public const int SortField_PublisherName = 69;
        //public const int SortField_AuthorName = 70;

        //public const int SortField_Subject_Ordinal = 71;

        //public const int SortField_TextBooksRecent_LastViewDate = 72; // Thoi gian xem gan nhat
        //public const int SortField_TextBooksRecent_ViewNumber = 73; // so lan xem

        //public const int SortField_TrainingProgramDetails_ItemName = 74; // ten chi tiet cua chuong trinh khung
        //public const int SortField_TrainingProgramDetails_SchoolHourNumber = 75; // thu tu tiet/gio hoc

        //public const int SortField_TrainingProgram_TrainingProgTitle = 76; // TEN CHUONG TRINH KHUNG

        //public const int SortField_LibraryItems_LibItemName = 77; // TEN FILE hoac LINK chia se trong tap tin hoc lieu mo
        //public const int SortField_ClassLibraryStructure_FolderName = 78; // ten folder cua giao vien  
        //public const int SortField_LibItem_CreatedDate = 79;
        //public const int SortField_LibItemSize = 80; // kich thuoc tap tin/bai giang
        //public const int SortField_IsOCWs = 81; // phan biet tap tin/lien ket hoac sach hoac bai giang trong thu muc chia se

        //public const int SortField_SupAppName = 82; //tên ứng dụng
        //public const int SortField_LastUpdate = 83; //thời điểm cập nhật ứng dụng sau cùng
        //public const int SortField_FileSize = 84; //kích thước ứng dụng

        //public const int SortField_CommunityName = 85;//tên cộng đồng
        //public const int SortField_CommunityStarted = 86;//ngày bắt đầu
        //public const int SortField_CommunityEnded = 87;//ngày kết thúc
        //public const int SortField_TotalMember = 88;//số lượng thành viên
        //public const int SortField_Status = 96;//tình trạng

        //public const int SortField_DiscussedTopic = 89; //tên chủ đề thảo luận
        //public const int SortField_PostedDateTime = 90;//ngày tạo chủ đề thảo luận

        //public const int SortField_SentDateTime = 91;//ngày gửi tin nhắn.
        //public const int SortField_ReplyDateTime = 251;//ngày trả lời 

        //public const int SortField_IdiomsVNese = 92;//loại/tác giả trích dẫn
        //public const int SortField_UsingNumber = 93;//số lượng người sử dụng trích dẫn.

        //public const int SortField_CountryName = 94;//tên quốc gia
        //public const int SortField_CountryCode = 95;//mã quốc gia

        //public const int SortField_IsExtracurricular = 96; // CHUONG TRINH KHUNG CHUAN

        //public const int SortField_GradeLevel = 98;//cấp lớp
        //public const int SortField_LectureName = 99;//tên bài giảng
        //public const int SortField_UploadedDate = 100;//ngày tải lên
        //public const int SortField_DistributedDate = 101;//ngày phân phối chương trình


        public const int SortField_LiveCourseTitle = 102; // tieu de tiet hoc truc tuyen

        //public const int SortField_GradingSystemName = 103; // TEN THANG DIEM
        //public const int SortField_ExamTitle = 104; // TIEU DE BAI TAP/ BAI KIEM TRA
        //public const int SortField_UploadedDateTime = 105; // THOI GIAN TAO BAI TAP/BAI KIEM TRA
        //public const int SortField_V_ExamTypes = 106;
        //public const int SortField_Factor = 107;
        //public const int SortField_Subject = 108;
        //public const int SortField_DueDate = 109;
        //public const int SortField_TurnedInDate = 110;
        public const int SortField_Score = 111;

        //public const int SortField_QMComment = 112; // nhan xet cham bai
        //public const int SortField_QMCode = 113;

        //public const int SortField_AppliedDate = 114;  // ngay ap dung

        public const int SortField_LearnerCode = 115;
        public const int SortField_FullName = 116;

        //public const int SortField_QMCategoryName = 118;
        //public const int SortField_QMCategoryOrdinal = 119;
        //public const int SortField_AvailableDateFrom = 120;

        //public const int SortField_V_TrainingForm = 121;
        //public const int SortField_V_TrainingFormAndGradelevel = 122;
        //public const int SortField_ReportDateTime = 123;
        //public const int SortField_V_ReportStatus = 124;
        //public const int SortField_Revision = 125;
        //public const int SortField_ReportTitle = 126;
        //public const int SortField_CreatedDate = 127;
        //public const int SortField_TestOrdinal = 128;
        //public const int SortField_Testtypename = 129;
        //public const int SortField_questionname = 130;
        //public const int SortField_questiontext = 131;
        //public const int SortField_createdate = 132;
        //public const int SortField_qlevel = 133;
        //public const int SortField_score = 134;
        //public const int SortField_qtype = 135;
        //public const int SortField_Test_modifieddate = 136;
        //public const int SortField_CareerTitle = 137;
        //public const int SortField_CareerTitleEN = 138;
        //public const int SortField_CarDTitle = 139;
        //public const int SortField_CarDOrdinal = 140;
        //public const int SortField_CurrTime_DistributedDate_StartTime = 141;
        //public const int SortField_CurrTime_ClassName = 142;
        //public const int SortField_CurrTime_IsLiveCourse = 143;
        //public const int SortField_LiveCourse_StartDateTime = 144;
        //public const int SortField_FirstName = 145;
        //public const int SortField_LastName = 146;

        //public const int SortField_PollQuestion_Content = 148;
        //public const int SortField_PollQuestion_CreateDate = 149;
        //public const int SortField_Nationality = 150;
        //public const int SortField_Nationality_Ordinal = 151;

        //public const int SortField_DateLogLecture = 152; //  ngày ghi log bài giảng
        //public const int SortField_LectureID = 153; // ID bài giảng
        //public const int SortField_AccountID = 154; //AccountID

        //public const int SortField_DateLogSystem = 155; //  ngày ghi log hệ thống
        //public const int SortField_LoggingLevel = 156; // ID bài giảng
        //public const int SortField_Class = 157;
        //public const int SortField_Method = 158; // phương thức thực thi

        //public const int SortField_TextBookID = 159;
        //public const int SortField_KeepTrackDateTime = 160;
        //public const int SortField_KeepTrackAccountID = 161;
        //public const int SortField_V_TextBookStatus = 162;

        //public const int SortField_RefFileTemplates_Ordinal = 163;
        //public const int SortField_RefFileTemplates_TemplateName = 164;

        //public const int SortField_OwnerFullName = 165;

        //public const int SortField_MailTemplateName = 166;
        //public const int SortField_ReportTemplateOrdinal = 167;
        //public const int SortField_ReportTemplatePathName = 168;

        //public const int SortField_V_DocTypes = 169;
        //public const int SortField_RatedDateTime = 170;
        public const int SortField_ApprovedDateTime = 171;

        //public const int SortField_V_SchoolForm = 172;
        //public const int SortField_V_SchoolTypes = 173;
        //public const int SortField_V_SchoolSpecificities = 174;

        //public const int SortField_TPlanTitle = 175;
        //public const int SortField_SchoolYear = 176;

        //public const int SortField_IdxTrainingPlanDetail = 177;
        //public const int SortField_DTPlanTitle = 178;
        public const int SortField_StartDate = 179;
        public const int SortField_EndDate = 180;

        //public const int SortField_AppraisalProcessesApprovalDatetime = 181;
        //public const int SortField_ApprovalStatus = 182;
        //public const int SortField_V_PlannedStage = 183;

        //public const int SortField_ExamV_Semester = 184;
        //public const int SortField_V_ExamLevel = 185;
        //public const int SortField_V_ExamMethod = 186;
        //public const int SortField_V_ExamStatus = 187;
        //public const int SortField_Examinationname = 188;
        //public const int SortField_Exams_StartDate = 189;
        //public const int SortField_Exams_EndDate = 190;

        //public const int SortField_SchoolGalleriesOrdinal = 191;
        //public const int SortField_SchoolGalleriesUploadDate = 192;
        //public const int SortField_SchoolGalleriesRealIndex = 193;

        //public const int SortField_QuestionnaireTemplateName = 194;
        //public const int SortField_QuestionnaireTemplate_SpecName = 195;
        //public const int SortField_QuestionnaireTemplate_SubjectName = 196;

        ////QuestionBank
        //public const int TimeDefaultQuestionIQ = 30; // cau hoi IQ thoi gian = 30s
        //public const int QuestionLevelDefaultImport = 9600;// muc do cau hoi khi defaul import file txt (V_QuestionLevel)
        //public const int QuestionApprovalStatusDefault = 8204;    //(nV_ApprovalStatus) chua hoan tat
        //public const int QuestionScoreDefault = 1; // diem so
        //// ProductType
        //public const string ProductType_Book = "book";
        //public const string ProductType_ReadOnline = "readonline";

        //public const int SortField_QuestionFeedbackDateTime = 197;
        //public const int SortField_QuestionFeedbackV_FeedbackResultOrdinal = 198;
        //public const int SortField_QuestionFeedbackApprovalDateTime = 199;

        //public const int SortField_KeepingDate = 200;

        //public const int SortField_QNRName = 201;
        //public const int SortField_ModifiedDateLate = 202;
        //public const int SortField_ExamDuration = 203;
        //public const int SortField_WithinSchoolScope = 204;
        //public const int SortField_EduSysName = 205;

        //public const int SortField_FullNameUserAccount = 206;
        //public const int SortField_ModifiedDateUserAccount = 207;

        //public const int SortField_UGID = 208;

        //public const int SortField_ExamID = 209;
        //public const int SortField_EnrlDateTime = 210;
        public const int SortField_ViewCount = 211;

        //public const int SortField_ForumCatgTitle = 212;
        //public const int SortField_TotalTopic = 213;

        //public const int SortField_DocID = 214;

        //public const int SortField_AnnTypeName = 215;
        //public const int SortField_TotalAnnID = 216;
        //public const int SortField_FilterName = 217;

        //public const int SortField_PostedDate = 218;
        //public const int SortField_LogDate = 219;

        //public const int SortField_RequestedDate = 220;
        public const int SortField_Ordinal = 221;
        //public const int SortField_WardName = 222;
        //public const int SortField_TotalComment = 223;
        //public const int SortField_V_QuestionType = 224;
        //public const int SortField_ReportExamDefault = 225;

        //public const int SortField_Album_NumPhoto = 226;
        //public const int SortField_ChatName = 227; // CHAT NAME

        //public const int SortField_PublishDate = 227;
        public const int SortField_DateLastSave = 228;
        //public const int SortField_MarkedDate = 229;
        //public const int SortField_FaqComQuest = 230;
        //public const int SortField_V_AccountAppearStatusOrdinal = 231;
        //public const int SortField_TotalUse = 232;

        //public const int SortField_ExerciseSolveMethod_Title = 233;
        //public const int SortField_ExerciseSolveMethod_CreatedDate = 234;

        //public const int SortField_Rank = 235;


        //// Card
        //public const int SortField_Serial = 233;
        public const int SortField_ExpiryDate = 234;
        //public const int SortField_ActiveDate = 235;
        //public const int SortField_ActiveByFullName = 236;
        //public const int SortField_DisableDate = 237;
        //public const int SortField_DisableByFullName = 238;
        public const int SortField_UsedDate = 239;

        //// THEM LibItem
        //public const int SortField_LibItem_ModifiedDate = 240;

        ////GetQuestionnaireTemplates
        public const int SortField_QNRT_TotalTime = 241;
        public const int SortField_QNRT_NumberOfQuestions = 242;
        //public const int SortField_QNRT_TotalExamUsed = 243;

        //public const int SortField_Lecture_CurricularTime_PeriodIdx = 244;
        //public const int SortField_MPBIProcessUnit_Ordinal = 245;
        //public const int SortField_MPBIProcessUnit_CreatedDate = 246;
        //public const int SortField_MPBIProcessUnit_RPUName = 247;
        //public const int SortField_MPBIProcessUnit_PUName = 248;
        //public const int SortField_UniversityName = 249;

        ////Contact
        //public const int SortField_Contact_IsReply = 250;

        ////Search PBI Teacher
        //public const int SortField_DOB = 252;
        //public const int SortField_Teacher_Adsress = 253;
        //public const int SortField_DistrictID = 255;
        //public const int SortField_GradeLevelName = 256;

        ////Search WorkingShedule
        //public const int SortField_WorkingScheduleName = 257;

        //public const int SortField_District_Ordinal = 258;
        //public const int SortField_District_Name = 259;
        public const int SortField_LogTime = 260;
    }

    public class return_token : returnval
    {
        public string? tokenkey { get; set; }
    }
}
