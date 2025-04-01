namespace Raktar.Entity
{
    public enum OrderStatus
    {
        Pending,
        Shipped,
        Delivered,
        Cancelled
    }
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        public List<Complaint> Complaints { get; set; }

        public User User { get; set; }
        public List<Carrier> AssignedCarriers { get; set; }
    }
}
