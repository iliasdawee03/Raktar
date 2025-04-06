using static Raktar.Dtos.OrderItemDto;

namespace Raktar.Dtos
{
    public class OrderDto
    {
        public class OrderReadDto
        {
            public int Id { get; set; }
            public int CustomerId { get; set; }
            public DateTime PlacedAt { get; set; }
            public DateTime? ClosedAt { get; set; }
            public string Status { get; set; }
            public List<OrderItemReadDto> Items { get; set; }
        }

        public class OrderCreateDto
        {
            public int CustomerId { get; set; }
            public List<OrderItemCreateDto> Items { get; set; }
        }
    }
}
