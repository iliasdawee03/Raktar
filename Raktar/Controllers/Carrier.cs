namespace Raktar.Controllers
{
    public class Carrier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Delivery> Deliveries { get; set; }
    }
}
