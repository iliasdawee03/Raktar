namespace Raktar.Entity
{
    public class Supplier
    {
        public int SupplierId { get; set; }
        public string Name { get; set; }
        public List<Product> Products { get; set; }
        public User user { get; set; }
    }
}
