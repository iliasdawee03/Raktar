namespace Raktar.Entity
{
    public class Complaint
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public string Description { get; set; }
        public string Status { get; set; } //   New, Processing, Resolved
        public DateTime CreatedAt { get; set; }
    }
}
