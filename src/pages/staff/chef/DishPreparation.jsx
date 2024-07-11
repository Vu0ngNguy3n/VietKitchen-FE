import { Client } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import SidebarStaff from "../../../components/staffComponent/SidebarStaff"


function DishPreparation(){
     const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.subscribe('/topic/order', (message) => {
            console.log(message);
          setMessages(prevMessages => [...prevMessages, JSON.parse(message.body)]);
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, []);

    return(
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarStaff/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarStaff />
                    <div className="flex flex-wrap mt-4">
                         {messages.map((msg, index) => (
                            <li key={index}>{msg?.orderId}</li>
                            ))}
                    </div>
                </div>
            </div>
        </div>


    )
}

export default DishPreparation