using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using backend.Helpers;


namespace backend.WebSockets;

public class WebSocketAuthorization {

    public readonly byte[] _Buffer = new byte[1024 * 4];
    private readonly RequestDelegate? _Next;
    private WebSocketServer _WebSocketServer;

    public WebSocketAuthorization(RequestDelegate __Next, WebSocketServer __WebSocketServer) {
        _Next = __Next;
        _WebSocketServer = __WebSocketServer;
    }

    private async Task ConnectAsync(WebSocket WebSocketClient) {

        var User = "";
        var GeneratedId = Guid.NewGuid().ToString();
        var Result = await WebSocketClient.ReceiveAsync(new ArraySegment<byte>(_Buffer), CancellationToken.None);

        while (!Result.CloseStatus.HasValue) {

            var Token = Encoding.UTF8.GetString(_Buffer, 0, Result.Count);
            var Claims = await JwtHelper.ValidateTokenAsync(Token);

            if (Claims == null) {

                _WebSocketServer._WebSocketServer!.TryAdd(GeneratedId, new ConcurrentDictionary<string, WebSocket>(new [] { new KeyValuePair<string, WebSocket>(GeneratedId, WebSocketClient) }));
                await WebSocketClient.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes(GeneratedId)), WebSocketMessageType.Text, true, CancellationToken.None);

            } else {

                User = Claims.FindFirst(ClaimTypes.NameIdentifier)!.Value;

                _WebSocketServer._WebSocketServer.AddOrUpdate(User,
                    new ConcurrentDictionary<string, WebSocket>(new [] { new KeyValuePair<string, WebSocket>(GeneratedId, WebSocketClient) }),
                    (key, WebSocketClients) => {
                        WebSocketClients.TryAdd(GeneratedId, WebSocketClient);
                        return WebSocketClients;
                    }
                );

                switch (Claims.FindFirstValue(ClaimTypes.Role)) {

                    case "AccountManager": 
                        _WebSocketServer._AccountManagers.Add(User);
                        break;

                    case "User":
                        _WebSocketServer._Users.Add(User);
                        break;
                }
            }

            Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_WebSocketServer._WebSocketServer, Newtonsoft.Json.Formatting.Indented));

            Result = await WebSocketClient.ReceiveAsync(new ArraySegment<byte>(_Buffer), CancellationToken.None);
        }


        if (string.IsNullOrEmpty(User)) {

            _WebSocketServer._WebSocketServer!.Remove(GeneratedId, out var _);

        } else {

            _WebSocketServer._WebSocketServer!.TryGetValue(User, out var WebSocketClients);
            WebSocketClients!.Remove(GeneratedId, out var _);

            if (WebSocketClients!.Count == 0) {
                _WebSocketServer._WebSocketServer.Remove(User, out var _);
            }
        }
        
        Console.WriteLine(Newtonsoft.Json.JsonConvert.SerializeObject(_WebSocketServer._WebSocketServer, Newtonsoft.Json.Formatting.Indented));

        await WebSocketClient.CloseAsync(Result.CloseStatus!.Value, Result.CloseStatusDescription, CancellationToken.None);
    }


    public async Task InvokeAsync(HttpContext Context) {

        if (Context.WebSockets.IsWebSocketRequest && Context.Request.Path == "/websocket/connect") {

            var WebSocketClient = await Context.WebSockets.AcceptWebSocketAsync();
            if (WebSocketClient.State != WebSocketState.Open) {
                Context.Response.StatusCode = StatusCodes.Status400BadRequest;
                return;
            }

            await ConnectAsync(WebSocketClient);

        } else {

            await _Next!(Context);
        }
    }
}
