using System.ComponentModel.DataAnnotations;

namespace Ass.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}