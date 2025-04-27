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
            public string Phone { get; set; }
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
            [MinLength(6)]
            public string Password { get; set; }

            [Phone]
            public string PhoneNumber { get; set; }
            public UserRole Role { get; set; }
        }

        public class UserLoginDTO
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Required]
            public string Password { get; set; }
        }
        public class UserUpdateDTO
        {
            [Required]
            [StringLength(50)]
            public string Username { get; set; }

            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Phone]
            public string PhoneNumber { get; set; }

            public IList<int> RoleIds { get; set; }
        }
    }
}
