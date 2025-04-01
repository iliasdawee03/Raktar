using System.ComponentModel.DataAnnotations;

namespace Raktar.Dtos
{
    public class OrderDTO
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
        public DateTime OrderDate { get; set; }
        public string Status { get; set; }
    }

    public class OrderItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }

    public class OrderItemCreateDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1,int.MaxValue)]
        public int Quantity { get; set; }
    }
    
    public class OrderCreateDto
    {
        [Required]
        public int CustomerId { get; set; }
        [Required]
        public List<OrderItemCreateDto> Items { get; set; } = new();
    }
}
