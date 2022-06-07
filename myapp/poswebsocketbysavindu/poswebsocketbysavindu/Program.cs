using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebSocketSharp;
using WebSocketSharp.Server;
using Newtonsoft.Json;
using System.Threading;

namespace poswebsocketbysavindu
{
    class Vector
    {
        public double x, y;
    }
    internal class Program
    {
        

        static void Main(string[] args)
        {
            // Create a scoped instance of a WS client that will be properly disposed
            //using (WebSocket ws = new WebSocket("ws://simple-websocket-server-echo.glitch.me/"))
            //using (WebSocket ws = new WebSocket("ws://127.0.0.1:7890/EchoAll"))
            string ws_server_paths1 = "ws://127.0.0.1:7890/POSMSGES";
            string ws_server_paths2 = "ws://127.0.0.1:7890/Echo";
            string ws_server_paths3 = "ws://127.0.0.1:7890/EchoAll";
            using (WebSocket ws = new WebSocket(ws_server_paths1))
            {
                ws.OnMessage += Ws_OnMessage;
                ws.Connect();

                //send data
               /* for(int i=0; i<9000; i++)
                {
                    Thread.Sleep(500);
                    ws.Send(" msg "+i);
                    Thread.Sleep(500);
                }
               */
            
                Console.ReadKey();
            }
        }
        private static void Ws_OnMessage(object sender, MessageEventArgs e)
        {
            string ws_server_paths1 = "ws://127.0.0.1:7890/POSMSGES";
            string ws_server_paths2 = "ws://127.0.0.1:7890/Echo";
            string ws_server_paths3 = "ws://127.0.0.1:7890/EchoAll";
            Console.WriteLine(ws_server_paths1+" " + e.Data);
        }
        
        /*
                private static void Ws_OnMessage(object sender, MessageEventArgs e)
                {
                    Console.WriteLine("Received from the server: " + e.Data);
                    try
                    {
                        Vector pos = JsonConvert.DeserializeObject<Vector>(e.Data);
                        //Console.WriteLine("Created a vector: " + pos.x + "," + pos.y);
                        DrawDot(pos.x, pos.y, 50, 15, 1);
                    }
                    catch (Exception ex)
                    {
                        //Console.WriteLine(ex);
                        Console.WriteLine("I don't know what to do with \"" + e.Data + "\"");
                    }
                   }

               static void DrawDot(double xpos, double ypos, int width, int height, int borderWidth)
                {
                    // Convert from normalized coordinates to "pixel" coordinates
                    int x = (int)Math.Round(xpos * width);
                    int y = (int)Math.Round(ypos * height);

                    for (int j = 0; j < height; j++)
                    {
                        for (int i = 0; i < width; i++)
                        {
                            if (i == x && j == y)
                            {
                                Console.Write("O");
                            }
                            else if (j < borderWidth || j > height - 1 - borderWidth
                                || i < borderWidth || i > width - 1 - borderWidth)
                            {
                                Console.Write('#');
                            }
                            else
                            {
                                Console.Write(' ');
                            }
                        }
                        Console.WriteLine();
                    }

                    Console.WriteLine();
                }
          */
    }
}
