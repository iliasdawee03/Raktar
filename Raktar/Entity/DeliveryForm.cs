namespace Raktar.Entity
{
    public class DeliveryForm
    {
        public int Id { get; set; }
        public int SupplierId { get; set; }
        public User Supplier { get; set; }
        public DateTime ExpectedDeliveryDate { get; set; }
        public string Status { get; set; } // e.g. "Filled", "Processed"
        public List<DeliveredProduct> DeliveredProducts { get; set; }
    }
}
