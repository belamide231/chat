using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;


public class WebSocketServer {

    public ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>> _WebSocketServer;
    public List<string> _AccountManagers;
    public List<string> _Users;
    public List<string> _Guest;

    public WebSocketServer() {
        _WebSocketServer = new ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>>();
        _AccountManagers = new List<string>();
        _Users = new List<string>();
        _Guest = new List<string>();
    }

    public async Task NotifyUserForNewMessage(List<string> Recepients, int MessageId) {

        var Data = Encoding.ASCII.GetBytes(
            Newtonsoft.Json.JsonConvert.SerializeObject(new {
                RealTime = "Message",
                Id = MessageId
            }, 
            Newtonsoft.Json.Formatting.Indented)
        );

        foreach (var Recepient in Recepients) {

            _WebSocketServer.TryGetValue(Recepient, out var WebSockets);
            foreach (var WebSocket in WebSockets!) {

                await WebSocket.Value.SendAsync(new ArraySegment<byte>(Data), WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}