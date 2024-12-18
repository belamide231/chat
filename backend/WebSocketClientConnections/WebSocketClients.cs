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


    /* Function ni siya na maka send ug message sa accounts. */
    protected async Task SendMessageToAccounts(string ConversationId) {

    }


    /* Function ni siya na maka send ug message sa user. */
    protected async Task SendMessageToUser(string ConversationId) {

    }

    /* Function ni siya na maka send ug message sa client nga way account. */
    protected async Task SendMessageToAnonymousClient(string ConversationId) {

    }
}