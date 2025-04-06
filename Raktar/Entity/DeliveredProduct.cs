namespace Raktar.Entity
{
    public class DeliveredProduct
    {
        public int Id { get; set; }
        public int DeliveryFormId { get; set; }
        public DeliveryForm DeliveryForm { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public int Quantity { get; set; }
    }

}
