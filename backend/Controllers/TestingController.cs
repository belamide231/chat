using System.Security.Claims;
using Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class TestingController : ControllerBase {

    public readonly Mongo _Mongo;
    public readonly UserManager<UserSchema> _UserManager;
    public TestingController(Mongo __Mongo, UserManager<UserSchema> __UserManager) {
        _Mongo = __Mongo;
        _UserManager = __UserManager;
    }

    [HttpPost("TestAPI")]
    [Authorize(Policy = "user")]
    public IActionResult TestAPI() {
        return Ok();
    }

    [HttpPost("Register")]
    public async Task<IActionResult> Registration(RegisterDTO DTO) {

        Console.WriteLine("Triggers");

        try {

            var Result = await _UserManager.CreateAsync(new UserSchema(DTO.Id, DTO.Role), "Hesoyam2000@");

            Console.WriteLine(Result.Succeeded);
            foreach(var Error in Result.Errors) {
                Console.WriteLine(Error.Description);
            }

            return StatusCode(StatusCodes.Status201Created);

        } catch {

            return StatusCode(StatusCodes.Status500InternalServerError);
        }

    }
}


