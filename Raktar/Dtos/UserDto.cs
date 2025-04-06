using Raktar.Entity;

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
            public string Name { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string Password { get; set; }
            public UserRole Role { get; set; }
        }
    }
}
