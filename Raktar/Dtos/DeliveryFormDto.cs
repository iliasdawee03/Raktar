using System.ComponentModel.DataAnnotations;
using static Raktar.Dtos.DeliveredProductDto;

namespace Raktar.Dtos
{
    public class DeliveryFormDto
    {
        public class DeliveryFormReadDto
        {
            public int Id { get; set; }
            public int SupplierId { get; set; }
            public DateTime ExpectedDeliveryDate { get; set; }

            public DateTime CreatedAt = DateTime.UtcNow;
            public string Status { get; set; }
            public List<DeliveredProductReadDto> DeliveredProducts { get; set; }
        }

        public class DeliveryFormCreateDto
        {
            [Required]
            public int SupplierId { get; set; }
            [Required]
            public DateTime ExpectedDeliveryDate { get; set; }
            public List<DeliveredProductCreateDto> DeliveredProducts { get; set; }
        }
    }
}
