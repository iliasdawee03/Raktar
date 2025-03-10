namespace Raktar.Controllers
{
    public class Product
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }

        public List<OrderItem> OrderItems { get; set; }
        public List<Supplier> Suppliers { get; set; }
    }
}
