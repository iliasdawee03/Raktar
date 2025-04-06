namespace Raktar.Dtos
{
    public class TransportDto
    {
        public class TransportReadDto
        {
            public int Id { get; set; }
            public int CarrierId { get; set; }
            public int OrderId { get; set; }
            public string Status { get; set; }
            public DateTime? StartDate { get; set; }
            public DateTime? EndDate { get; set; }
        }

        public class TransportCreateDto
        {
            public int CarrierId { get; set; }
            public int OrderId { get; set; }
            public string Status { get; set; }
        }
    }
}
