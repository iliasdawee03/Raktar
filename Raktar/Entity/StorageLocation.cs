namespace Raktar.Entity
{
    public class StorageLocation
    {
        public int StorageLocationId { get; set; }
        public string LocationCode { get; set; }
        public List<Product> Products { get; set; }
    }
}
