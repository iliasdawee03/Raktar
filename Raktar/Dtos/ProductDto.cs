using System.ComponentModel.DataAnnotations;

namespace Raktar.Dtos
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int StockQuantity { get; set; }
    }

    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }
    }
    public class ProductUpdateDto 
    {
        public string Name { get; set; }
        = string.Empty;

        public string Description { get;set } = string.Empty;

        public decimal Price { get; set; }

        public int StockQuantity { get; set; }  

    }
}
