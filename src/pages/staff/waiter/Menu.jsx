import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { toast } from "react-toastify";
import NavBarStaff from "../../../components/staffComponent/NavBarStaff"
import SidebarStaff from "../../../components/staffComponent/SidebarStaff"
import axiosInstance from "../../../utils/axiosInstance";
import { FaPlusCircle } from "react-icons/fa";
import { formatVND } from "../../../utils/format";
import { addToCart } from "../../../actions/cartActions";
import { useDispatch } from "react-redux";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";


function Menu(){
    const {slug} = useParams();
    const [dishesList, setDishesList] = useState([]);
    const dispatch = useDispatch();
    const [messages, setMessages] = useState([]);
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [orderId, setOrderId] = useState();

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/websocket');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        setConnected(true);
        stompClient.subscribe('/topic/order', (message) => {
          setMessages(prevMessages => [...prevMessages, message.body]);
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

  const addDish = (message) => {
    if (client && connected) {
      client.publish({
        destination: '/app/addDishes',
        body: JSON.stringify(message),
      });
    } else {
      console.error("Client is not connected");
    }
  };


    useEffect(() => {
        axiosInstance
        .get(`/api/dish/category/${slug}`)
        .then(res => {
            const data = res.data;
            setDishesList(data.result);
        })
        .catch((err) => {
          if (err.response) {
            const errorRes = err.response.data;
            toast.error(errorRes.message);
          } else if (err.request) {
            toast.error(err.request);
          } else {
            toast.error(err.message);
          }
        });

        
    },[slug])


    const handleAddDish = (dish) => {
        let dishAdd;
        if(!dish?.name){
            dishAdd = {
                dishId: null,
                name: dish.comboName,
                code: null,
                weight: null,
                description: dish.description,
                price: dish.comboPrice,
                imageUrl: dish.imageUrl,
                comboId: dish.id
            }
        }else{
            dishAdd = {
                dishId: dish.id,
                name: dish.name,
                code: dish.code,
                weight: dish.weight,
                description: dish.description,
                price: dish.price,
                imageUrl: dish.imageUrl,
                comboId: null
            }
        }
        console.log(dishAdd);

        const action = addToCart(dishAdd);
        dispatch(action);
        toast.success('add success')
        const result = {
            dishOrderRequests:[
                {
                    dishId: 1,
                    comboId: null,
                    quantity: 1 
                }
            ],
            orderId: 1
        }
        addDish(result)
    }

    return(
        <div className="">
            <div className="flex">
                <div className="basis-[12%] h-[100vh]">
                    <SidebarStaff/>
                </div>
                <div className="basis-[88%] border overflow-scroll h-[100vh]">
                    <NavBarStaff />
                    <div className="flex flex-wrap mt-4">
                        
                        {dishesList?.map((d, index) => {
                            return (
                                <a 
                                    href="#"
                                    className="w-full md:w-1/2 flex flex-col items-center md:flex-row"
                                    key={index}
                                >
                                    <div className="flex-shrink-0 w-full md:w-1/2">
                                        <img className="object-cover h-full w-full md:h-auto" src={d?.imageUrl} alt=""/>
                                    </div>
                                    <div className="relative flex flex-col p-4 leading-normal w-full">
                                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{d?.name}</h5>
                                        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{formatVND(d?.price)}</p>
                                        <div className="absolute bottom-4 right-4 cursor-pointer" onClick={() => handleAddDish(d)}>
                                            <FaPlusCircle className="text-red-600 size-7 hover:text-secondary transition ease-in-out duration-300"/>
                                        </div>
                                    </div>
                                </a>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>


    )
}

export default Menu