using System.Security.Claims;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;


[Route("api/[controller]")]

[ApiController]
public class MessageController : ControllerBase {

    private readonly MessageServices _MessageServices;

    public MessageController(MessageServices __MessageServices) {
        _MessageServices = __MessageServices;
    }

    [HttpPost("SendMessage")]
    [Authorize]
    public async Task<IActionResult> SendMessage(SendMessageDTO Data) {
        
        dynamic Result = await _MessageServices.SendMessage(Data, User.FindFirstValue(ClaimTypes.Role)!);
        return StatusCode(Result.Status, Result.Data);
    }

    [HttpPost("GetConversation")]
    [Authorize]
    public async Task<IActionResult> GetConversation(GetConversationDTO Data) {

        dynamic Result = await _MessageServices.GetConversation(Data, User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        return StatusCode(Result.Status, Result.Data);
    }
}
