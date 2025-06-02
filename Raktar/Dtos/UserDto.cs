using Raktar.Entity;
using System.ComponentModel.DataAnnotations;

namespace Raktar.Dtos
{
    public class UserDto
    {
        public class UserReadDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public int Phone { get; set; }
            public UserRole Role { get; set; }
        }

        public class UserCreateDto
        {
            [Required]
            [StringLength(50)]
            public string Username { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }

            public int PhoneNumber { get; set; }
        }

        public class UserLoginDto
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }
        }
        public class UserUpdateDto
        {
            [Required]
            [StringLength(50)]
            public string Username { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Phone]
            public int PhoneNumber { get; set; }

            public string Password { get; set; }
        }
    }
}
