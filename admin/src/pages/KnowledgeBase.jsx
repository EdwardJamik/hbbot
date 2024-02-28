import React, {useEffect, useState} from 'react';
import TextArea from "antd/es/input/TextArea.js";
import {Button, message} from "antd";
import axios from "axios";
import {url} from "../Config.jsx";

const KnowledgeBase = () => {

    const [isData, setData] = useState('')

    useEffect(() => {
        const getInstruction = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/getInstruction`,
                {},
                {withCredentials: true}
            );
            setData(data)
        }
        getInstruction()
    }, []);

    const savedInstruction = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/admin/savedInstruction`,
            {data:isData},
            {withCredentials: true}
        );

        if(data.success)
            message.success(data?.eMessage)


    }

    return (
        <div style={{height: '100%'}}>
            <div style={{marginBottom: '10px'}}>
                    <Button style={{width:'100%'}} onClick={()=>savedInstruction()} type='primary'>Сохранить</Button>
            </div>
            <TextArea value={isData} onChange={(e)=>{setData(e.target.value)}} style={{height: '90%'}}/>
        </div>
    );
};

export default KnowledgeBase;