using System.ComponentModel.DataAnnotations;

namespace WebApi.Models
{
    public class category : generalmodels
    {
        public long? catgid { get; set; } // ID thể loại sách

        [Display(Description = "ID cua the loai cap cha")]
        public long? pcatgid { get; set; } // ID thể loại sách cấp cha

        public string? catgname { get; set; } // Thể loại sách
        public string? catgname_en { get; set; } // Thể loại sách (tiếng Anh)
        public int? ordinal { get; set; } // Số thứ tự
        public bool? iseffect { get; set; } // true: đang dùng/hiệu lực
        public long? createdby { get; set; } // userid của người thêm thể loại sách
        public DateTime? createddate { get; set; } // Thời gian thêm thể loại
        public long? modifiedby { get; set; } // userid của người cập nhật thể loại sách
        public DateTime? modifieddate { get; set; } // Thời gian cập nhật thể loại
        public long? deletedby { get; set; } // userid của người xóa thể loại
    }
}
