namespace Raktar.Entity
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public User Customer { get; set; }
        public DateTime PlacedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string Status { get; set; }  //Open, Closed, In Transit
        public int? CarrierId { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
