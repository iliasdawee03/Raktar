namespace Raktar.Controllers
{
    public class WarehouseWorker
    {
        public int WarehouseWorkerId { get; set; }
        public string Name { get; set; }
        public List<Product> AssignedProducts { get; set; }
    }
}
