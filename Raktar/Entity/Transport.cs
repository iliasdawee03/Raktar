namespace Raktar.Entity
{
    public class Transport
    {
        public int Id { get; set; }
        public int CarrierId { get; set; }
        public User Carrier { get; set; }
        public int OrderId { get; set; }
        public Order Order { get; set; }
        public string Status { get; set; } //   Ready, In Transit, Delivered
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}
