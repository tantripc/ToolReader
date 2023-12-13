using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class docinfo : generalmodels
    {
        public long? docid { get; set; } // ID sách
        public string? doccode { get; set; } // Mã sách
        public long? topicid { get; set; } // ID chủ đề
        public string? topicname { get; set; } // Chủ đề
        public string? title { get; set; } // Tiêu đề sách/tên sách
        public string? author { get; set; } // Tác giả
        public string? translator { get; set; } // Dịch giả
        public string? collector { get; set; } // Người Tổng hợp
        public string? publisher { get; set; } // Nhà xuất bản
        public string? publishyear { get; set; } // Năm xuất bản
        public string? abstractcontent { get; set; } // Tóm tắt/mô tả sách
        public string? abstracttxt { get; set; } // Tóm tắt/mô tả sách
        public string? desct { get; set; } // Mô tả ngắn
        public string? descttxt { get; set; } // Mô tả ngắn

        [Display(Description = "Gia goc")]
        public double? originprice { get; set; } // Giá gốc


        [Display(Description = "Gia ban. Neu khong co chinh sach giam gia, mac dinh price=originprice")]
        public double? price { get; set; } // Giá bán
        public double? price_from { get; set; } // Giá (chỉ có model, dùng cho hàm search)
        public double? price_to { get; set; } // Giá (chỉ có model, dùng cho hàm search)

        public double? percentdiscount { get; set; } // Phần trăm giảm giá (db tự tính sau khi có 2 giá trị originprice và price)
        public string? currency { get; set; } // Đơn vị tiền tệ 'VND', 'USD'
        public int? publishnum { get; set; } // Lần xuất bản thứ mấy
        public string? genre { get; set; } // [Tạm thời không dùng]
        public int? numpage { get; set; } // Số trang
        public int? numpage_from { get; set; } // Chỉ có model - dùng cho hàm search
        public int? numpage_to { get; set; } // Chỉ có model - dùng cho hàm search
        public long? docsize { get; set; } // Dung lượng file sách (byte)
        public long? docsize_from { get; set; } // Chỉ có model - dùng cho hàm search
        public long? docsize_to { get; set; } // Chỉ có model - dùng cho hàm search
        public string? keyword { get; set; } // Từ khóa tìm kiếm sách
        public string? isbn { get; set; } // ISBN sách
        public double? rate { get; set; } // Đánh giá (số sao - *)
        public int? ratecount { get; set; } // Tổng số người đánh giá
        public int? numcomment { get; set; } // Tổng số bình luận
        public string? language { get; set; } // [Tạm thời không dùng]
        public string? attachfile { get; set; } // Đường dẫn file sách
        public string? attachlink { get; set; } // Link file sách
        public long? createdby { get; set; } // userid của người tạo sách
        public DateTime? createddate { get; set; } // Thời gian tạo sách
        public long? modifiedby { get; set; } // userid của người cập nhật sách
        public DateTime? modifieddate { get; set; } // Thời gian cập nhật sách
        public int? pagewidth { get; set; } // Chiều rộng trang sách (giá trị này DB tự động tính dựa vào file sách)
        public int? pageheight { get; set; } // Chiều cao trang sách (giá trị này DB tự động tính dựa vào file sách)
        public bool? ishide { get; set; } // true: ẩn
        public long? hideby { get; set; } // userid của người đánh dấu ẩn sách
        public DateTime? hidedate { get; set; } // Thời gian ẩn sách
        public bool? isblock { get; set; } // true: sách tạm khóa
        public long? blockby { get; set; } // userid của người khóa sách
        public DateTime? blockdate { get; set; } // Thời gian khóa sách
        public string? blockreason { get; set; } // Lý do khóa sách
        public bool? isdelete { get; set; } // true: sách đã xóa
        public long? deleteby { get; set; } // userid người xóa sách
        public DateTime? deletedate { get; set; } // Thời gian xóa

        [Display(Description = "File hinh bia sach")]
        public string? coverfile { get; set; } // Đường dẫn file ảnh bìa sách


        [Display(Description = "Trang xem truoc, co dang ''1,3,6-9''")]
        public string? pagepreview { get; set; } // Trang xem trước, có dạng: '1,3,6-9'

        //public long? catgid { get; set; }
        public bool? isfavorite { get; set; } // true: sách đã được đánh dấu yêu thích
        public string? catg_jss { get; set; } // Thể loại. json có dạng: '[{"catgid": 1, "catgname": ""}, {"catgid": 2, "catgname": ""}]'
        public List<category>? catg_js { get; set; } // Thể loại
        public string? catgname { get; set; } // Tên các thể loại sách, dùng để view. Có dạng: 'Giáo dục, Học tập'
        //public long? docattachid { get; set; } // ID cua file đính kèm và mục lục sách
        //public string? toc { get; set; } // Mục lục sách
        public bool? getinchildtopic { get; set; } // Chỉ dùng để search và khi topicid!=null. 'true': tìm sách thuộc topicid và tất cả topic con của nó
        public List<docattach>? docattach_js { get; set; } // Một hoặc nhiều file sách đính kèm
        public string? docattach_jss { get; set; } // File đính kèm (string)
        public bool? foredit { get; set; }
        public long? cprid { get; set; } // ID tác quyền (table copyright)
        public string? cprname { get; set; } // Tên tác quyền
        public string? shortname { get; set; } // Tên (ngắn) tác quyền
        public int? numquiz { get; set; } // Tổng số bài kiểm tra
        public int? numquiz_complete { get; set; } // Tổng số bài kiểm tra đã hoàn tất
        public long? getby { get; set; } // userid
        public long? orgid { get; set; }
        public string? orgname { get; set; }
        public bool? isinterest { get; set; }// false chưa là sách hay(sách interest)

        // Dong bo Vebrary
        public bool? issync { get; set; } // true: tai lieu dong bo
        public string? syncid { get; set; } // ID tai lieu dong bo
        public DateTime? syncdate { get; set; } // Thoi gian dong bo sau cung
        public string? syncapi { get; set; } // Link API cua partner/thu vien

        // Copy
        public bool? iscopy { get; set; } // true: tai lieu duoc copy tu tai lieu khac
        public string? copyfrom { get; set; } // json, thong tin cua tai lieu duoc copy '{ "docid": long }'
    }

    public class docattach : generalmodels
    {
        // File sách đính kèm
        public long? docattachid { get; set; }
        public long? docid { get; set; } // ID sách
        public string? attachfile { get; set; } // Đường dẫn file sách
        public string? attachlink { get; set; } // Link file sách

        [Display(Description = "DVT: byte")]
        public long? docsize { get; set; } // Dung lượng file sách (byte)

        public int? ordinal { get; set; } // Số thứ tự
        public bool? isdefault { get; set; } // File sách mặc định của cuốn sách. Mỗi cuốn sách chỉ được set 1 file mặc định
        public DateTime? createddate { get; set; }
        public DateTime? modifieddate { get; set; }

        [Display(Description = "suc/err")]
        public string? doconline_status { get; set; } // 

        public string? doconline_format { get; set; } // 
        public int? doconline_numpage { get; set; } // 

        [Display(Description = "true: file sach mac dinh. 1 sach co the nhieu file sach dinh kem, nhung moi sach chi 1 file isdefault=true")]

        public long? modifiedby { get; set; } // UserID của người cập nhật
        public bool? issync { get; set; } // true: tai lieu dong bo tu Vebrary
        public string? syncapi { get; set; } // API Vebrary
    }

    public class doccontent : generalmodels
    {
        public long? docid { get; set; } // ID sách (mỗi cuốn sách có thể có một hoặc nhiều file đính kèm)
        public long? docattachid { get; set; } // ID của mỗi file sách đính kèm
        public long? userid { get; set; }
        public bool? ignorestatus { get; set; }
        public bool? overwrite { get; set; }
    }
}
