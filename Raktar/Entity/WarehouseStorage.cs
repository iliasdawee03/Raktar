namespace Raktar.Entity
{
    public class WarehouseStorage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public string LocationCode { get; set; } // E2-21
        public int Quantity { get; set; }
    }
}
