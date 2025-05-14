using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Raktar.Services;
using static Raktar.Dtos.ProductDto;

namespace Raktar.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Authorize(Roles = "Admin")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;

        public ProductsController(IProductService productService)
        {
            _productService = productService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductReadDto>>> GetAll()
        {
            var products = await _productService.GetAllAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductReadDto>> GetById(int id)
        {
            var product = await _productService.GetByIdAsync(id);
            return product == null ? NotFound() : Ok(product);
        }


        [HttpPost]
        public async Task<ActionResult<ProductCreateDto>> Create(ProductCreateDto dto)
        {
            var createdProduct = await _productService.CreateAsync(dto);
            return Ok(dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductCreateDto dto)
        {
            var result = await _productService.UpdateAsync(id, dto);
            return result ? NoContent() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _productService.DeleteAsync(id);
            return result ? NoContent() : NotFound();
        }
    }
}
