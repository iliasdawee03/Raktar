namespace Raktar.Dtos
{
    public class OrderItemDto
    {
        public class OrderItemReadDto
        {
            public int ProductId { get; set; }
            public string ProductName { get; set; }
            public int Quantity { get; set; }
        }

        public class OrderItemCreateDto
        {
            public int ProductId { get; set; }
            public int Quantity { get; set; }
        }
    }
}
