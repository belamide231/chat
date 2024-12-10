using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using backend.Helpers;
using Microsoft.AspNetCore.Authorization;


namespace backend.WebSockets;

public class AuthenticationWebSocket : WebSocketClients {

    public readonly byte[] _Buffer = new byte[1024 * 4];
    private readonly RequestDelegate? _Next;
    private readonly ILogger<AuthenticationWebSocket>? _Logger;

    public AuthenticationWebSocket(RequestDelegate __Next, ILogger<AuthenticationWebSocket> __Logger) {
        _Next = __Next;
        _Logger = __Logger;
    }

    private async Task ConnectAsync(WebSocket WebSocketClient) {

        var UserId = "";
        var GeneratedId = Guid.NewGuid().ToString();
        var Result = await WebSocketClient.ReceiveAsync(new ArraySegment<byte>(_Buffer), CancellationToken.None);

        while (!Result.CloseStatus.HasValue) {

            var Token = Encoding.UTF8.GetString(_Buffer, 0, Result.Count);
            var Claims = await JwtHelper.ValidateTokenAsync(Token);

            if (Claims == null) {

                _PreLoggedClients!.TryAdd(GeneratedId, WebSocketClient);
                await WebSocketClient.SendAsync(new ArraySegment<byte>(Encoding.ASCII.GetBytes(GeneratedId)), WebSocketMessageType.Text, true, CancellationToken.None);

            } else {

                UserId = Claims.FindFirst(ClaimTypes.NameIdentifier)!.Value;

                if(Claims.FindFirstValue(ClaimTypes.Role) == "AccountManager") {

                    _AccountManagers!.AddOrUpdate(UserId,
                        new ConcurrentDictionary<string, WebSocket>(new [] { new KeyValuePair<string, WebSocket>(GeneratedId, WebSocketClient) }),
                        (key, WebSocketClients) => {
                            WebSocketClients.TryAdd(GeneratedId, WebSocketClient);
                            return WebSocketClients;
                        }
                    );

                } else {

                    _PostLoggedClients!.AddOrUpdate(UserId,
                        new ConcurrentDictionary<string, WebSocket>(new [] { new KeyValuePair<string, WebSocket>(GeneratedId, WebSocketClient) }),
                        (key, WebSocketClients) => {
                            WebSocketClients.TryAdd(GeneratedId, WebSocketClient);
                            return WebSocketClients;
                        }
                    );
                }
            }

            Console.WriteLine("PRELOG");
            foreach(var PreLogClient in _PreLoggedClients!) {
                Console.WriteLine("\t" + PreLogClient.Key);
            }
            Console.WriteLine("POSTLOG");
            foreach(var PostLogClient in _PostLoggedClients) {
                Console.WriteLine("\t" + PostLogClient.Key);
            }
            Console.WriteLine("ACCOUNT");
            foreach(var AccountManager in _AccountManagers) {
                Console.WriteLine("\t" + AccountManager.Key);
            }
            //Console.WriteLine("PRELOG: " + Newtonsoft.Json.JsonConvert.SerializeObject(_PreLoggedClients, Newtonsoft.Json.Formatting.Indented));
            //Console.WriteLine("POSTLOG: " + Newtonsoft.Json.JsonConvert.SerializeObject(_PostLoggedClients, Newtonsoft.Json.Formatting.Indented));
            //Console.WriteLine("ACCOUNTS: " + Newtonsoft.Json.JsonConvert.SerializeObject(_AccountManagers, Newtonsoft.Json.Formatting.Indented));


            Result = await WebSocketClient.ReceiveAsync(new ArraySegment<byte>(_Buffer), CancellationToken.None);
        }


        if (string.IsNullOrEmpty(UserId)) {

            _PreLoggedClients!.Remove(GeneratedId, out var _);

        } else {

            _PostLoggedClients!.TryGetValue(UserId, out var WebSocketClients);
            WebSocketClients!.Remove(GeneratedId, out var _);

            if (WebSocketClients!.Count == 0) {
                _PostLoggedClients.Remove(UserId, out var _);
            }
        }

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
