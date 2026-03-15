using AllTheBean.Core.Models;
using AllTheBean.Core.Services;
using Microsoft.AspNetCore.Mvc;

namespace All_The_Beans_Project.Controllers;

[Route("order")]
public class OrderFormController : Controller
{
    private readonly IFormService _formService;

    public OrderFormController(IFormService formService)
    {
        _formService = formService;
    }

    [HttpPost("submit")]
    [ValidateAntiForgeryToken]
    public IActionResult Submit([FromForm] OrderFormModel model)
    {
        if (!string.IsNullOrEmpty(model.Website))
            return Ok(new { success = true, redirectUrl = "/order/success" });

        var result = _formService.ValidateOrderForm(model);

        if (!result.IsValid)
            return BadRequest(new { success = false, errors = result.Errors });

        return Ok(new { success = true, redirectUrl = "/order/success" });
    }

    [HttpGet("success")]
    public IActionResult Success() => View("~/Views/orderSuccess.cshtml");
}
