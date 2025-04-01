namespace Raktar.Dtos
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public string Description { get; set; }
        public string Status { get; set; }
    }
}
