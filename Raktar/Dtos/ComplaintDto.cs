namespace Raktar.Dtos
{
    public class ComplaintDto
    {
        public class ComplaintReadDto
        {
            public int Id { get; set; }
            public int OrderId { get; set; }
            public int UserId { get; set; }
            public string? Description { get; set; }
            public string? Status { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class ComplaintCreateDto
        {
            public int OrderId { get; set; }
            public int UserId { get; set; }
            public string? Description { get; set; }
        }

    }
}
