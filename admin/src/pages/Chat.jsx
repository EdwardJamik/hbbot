import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";
import {url} from "../Config.jsx";
import {message} from "antd";

const Chat = () => {

    const [isData,setData] = useState([])
    const { id } = useParams();

    useEffect(() => {
        if(id){
            const getChat = async () => {
                const {data} = await axios.post(
                    `${url}/api/v1/admin/getUserChat`,
                    {id},
                    {withCredentials: true}
                );
                console.log(data?.chat)
                if(data?.chat)
                    setData(data?.chat)
                else
                    message.error(data?.eMessage)
            }
            getChat()
        }
    }, [id]);

    return (
        <>
            <ul className="chat-thread">
            {isData ? isData?.map((item,index) => (
                <li>{item.content}</li>
            ))
            :
                <></>
            }
            </ul>
        </>
    );
};

export default Chat;