using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class TestingController : ControllerBase {
    private readonly TestingServices _TestServices;

    public TestingController(TestingServices testServices) {
        _TestServices = testServices;
    }

    [HttpPost("TestMessage")]
    public async Task<IActionResult> TestMessage() {
        dynamic Result = await _TestServices.SendMessage(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return StatusCode(Result.Status, Result.Data);
    }
}