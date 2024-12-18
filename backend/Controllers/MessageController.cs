using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

public class MessageController : ControllerBase {

    private readonly MessageServices _MessageServices;
    public MessageController(MessageServices __MessageServices) {
        _MessageServices = __MessageServices;
    }


    [HttpPost("SendMessage")]
    public async Task<IActionResult> SendMessage(SendMessageDTO Data) {
        
        return Ok();
    }


    [HttpPost("GetConversation")]
    public async Task<IActionResult> GetConversation([FromBody] GetConversationDTO Data) {

        //dynamic Result = await _MessageServices.GetConversation(Data, User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
        //return StatusCode(Result.Status, Result.Data);

        return Ok();
    }


    [HttpPost("GetConversationsHeadsControl")]
    public async Task<IActionResult> GetConversationsHeadsControl() {

        dynamic Result = await _MessageServices.GetConversationsHeadsService(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return StatusCode(Result.Status, Result.Data);
    }

    [HttpPost("GetConversationControl")]
    public async Task<IActionResult> GetConversationControl([FromBody] GetConversationDTO Data) {

        dynamic Result = await _MessageServices.GetConversationService(User.FindFirstValue(ClaimTypes.NameIdentifier)!, Data);
        return StatusCode(Result.Status, Result.Data);
    }
}
