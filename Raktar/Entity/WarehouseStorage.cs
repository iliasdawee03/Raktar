namespace Raktar.Entity
{
    public class WarehouseStorage
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public Product Product { get; set; }
        public LocationCode LocationCode { get; set; }
        public int Quantity { get; set; }
    }

    public enum LocationCode
    {
        E1,
        E2,
        E3,
        E4,
        E5,
        E6,
        E7,
        E8,
        E9,
    }
}
