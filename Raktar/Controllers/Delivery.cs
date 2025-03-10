namespace Raktar.Controllers
{
    public enum DeliveryStatus
    {
        InProgress,
        Completed,
        Delayed
    }
    public class Delivery
    {
        public int Id { get; set; }
        public int CarrierId { get; set; }
        public int OrderId { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public DeliveryStatus Status { get; set; }

        public Carrier Carrier { get; set; }
        public Order Order { get; set; }
    }
}
