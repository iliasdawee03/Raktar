namespace Raktar.Entity
{
    public enum UserRole
    {
        Customer,
        Supplier,
        Carrier,
        WarehouseStaff,
        Admin
    }
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int Phone { get; set; }
        public string PasswordHash { get; set; }
        public UserRole Role { get; set; }

    }
}
