namespace Raktar.Dtos
{
    public class DeliveryDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int CarrierId { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
        public string Status { get; set; }
    }
}
