namespace Raktar.Dtos
{
    public class ProductDto
    {
        public class ProductReadDto
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Description { get; set; }
            public string SKU { get; set; }
            public decimal Price { get; set; }
        }

        public class ProductCreateDto
        {
            public string Name { get; set; }
            public string Description { get; set; }
            public string SKU { get; set; }
            public decimal Price { get; set; }
        }
    }
}
