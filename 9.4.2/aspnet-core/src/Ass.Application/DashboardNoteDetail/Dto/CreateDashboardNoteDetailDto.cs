using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ass.DashboardNoteDetail.Dto
{
    public class CreateDashboardNoteDetailDto
    {
        [Required]
        public long UserId { get; set; }
        public string HtmlContent { get; set; }
    }
}
