namespace Raktar.Controllers
{
    public class Complaint
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Description { get; set; }
        public DateTime DateFiled { get; set; }
        public Order Order { get; set; }
    }
}

