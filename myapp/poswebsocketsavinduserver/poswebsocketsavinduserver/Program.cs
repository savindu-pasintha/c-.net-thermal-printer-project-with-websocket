using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;

namespace poswebsocketsavinduserver
{
    public class Echo : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("Received from client /Echo : " + e.Data);
            Send(e.Data);//send to client
        }
    }

    public class EchoAll : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("Received from client /EchoAll : " + e.Data);
            Sessions.Broadcast(e.Data);// broadcast/send to all
        }
    }
    public class POSMSGES : WebSocketBehavior
    {
        protected override void OnMessage(MessageEventArgs e)
        {
            Console.WriteLine("Received from client /POSMSG: " + e.Data);
            Sessions.Broadcast(e.Data);
        }
    }
    internal class Program
    {
        static void Main(string[] args)
        {
            //localhost:7890 == ip => 127.0.0.1:7890 
            WebSocketServer wssv = new WebSocketServer("ws://127.0.0.1:7890");
            wssv.AddWebSocketService<Echo>("/Echo");
            wssv.AddWebSocketService<EchoAll>("/EchoAll");
            wssv.AddWebSocketService<POSMSGES>("/POSMSGES");
            wssv.Start();
            Console.WriteLine("WS server started on ws://127.0.0.1:7890/Echo");
            Console.WriteLine("WS server started on ws://127.0.0.1:7890/EchoAll");
            Console.WriteLine("WS server started on ws://127.0.0.1:7890/POSMSGES");
            Console.ReadKey();//when use click any key auto stop
            wssv.Stop();
        }
    }
}
