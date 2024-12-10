using System.Collections.Concurrent;
using System.Net.WebSockets;


public class WebSocketClients {

    protected ConcurrentDictionary<string, WebSocket>? _PreLoggedClients;
    protected ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>> _PostLoggedClients;
    protected ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>> _AccountManagers;

    public WebSocketClients() {
        _PreLoggedClients = new ConcurrentDictionary<string, WebSocket>();
        _PostLoggedClients = new ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>>();
        _AccountManagers = new ConcurrentDictionary<string, ConcurrentDictionary<string, WebSocket>>();
    }

    public async Task SendMessageWebSocket(string Role, string ConversationId, MessageSchema Message) {

        if(Role == "AccountManager") {

            

        } else {



        }
    }
}