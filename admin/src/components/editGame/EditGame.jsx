import React, {useState} from 'react';
import axios from "axios";
import {url} from "../../Config.jsx";
import {Button, Col, Input, message, Modal, Select} from "antd";
import {EditOutlined, LinkOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea.js";

const pencil = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
        <path
            d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
            className="fill-gray-7"
        ></path>
        <path
            d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
            className="fill-gray-7"
        ></path>
    </svg>,
];
const addbutton = [
    // eslint-disable-next-line react/jsx-key
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" strokeWidth="1.5"
              strokeLinecap="round"></path>
        <path
            d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
            stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
]

const EditGame = ({id,content}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isData, setData] = useState({title:'', category: '', description:{en:'',ru:''}, mod:{en:'',ru:''}, type:'games',version:'', image:'',link:'',trigger:''});

    const [isCategory, setCategroy] = useState([])

    const showModal = async () => {
        setIsModalOpen(!isModalOpen)

        if(id === 0 || id){
            const {data} = await axios.post(
                `${url}/api/v1/getGameField`,
                {id:id},
                {withCredentials: true}
            );

            setData(...data)
        }

        const {data} = await axios.post(
            `${url}/api/v1/getGameCategory`,
            {id:id},
            {withCredentials: true}
        );

        setCategroy(data)
    }

    const handleOk = async () => {
        const splitTriggers = isData.trigger.split('\n').filter(Boolean);

        const appsData = isData
        appsData.trigger = splitTriggers

        const {data} = await axios.post(
            `${url}/api/v1/createGameToCategory`,
            {isData:appsData,id},
            {withCredentials: true}
        );

        if (data.access) {
            setData({title:'', category: '', description:{en:'',ru:''}, mod:{en:'',ru:''}, type:'games',version:'', image:'',link:'',trigger:''})
            setIsModalOpen(false);
            message.success(data.access_message)
        }
        else
        {
            message.warning(data.access_message)
        }

    };

    const handleCancel = () => {
        setData({title:'', category: '', description:{en:'',ru:''}, mod:{en:'',ru:''}, type:'games',version:'', image:'',link:'',trigger:''})
        setIsModalOpen(false);
    };

    return (
        <>
            {content ?
                <Button onClick={() => showModal()} type="link" className="darkbtn">
                    {pencil} Изменить
                </Button>
                :
                <Button onClick={() => showModal()} style={{padding:'0', borderRadius:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>{addbutton}</Button>
            }
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Скасувати</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>{content ? 'Зберегти' : 'Створити'}</Button>,
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Title"
                           value={isData.title}
                           onChange={(e) => setData({ ...isData, title: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Опис</h4>
                    <TextArea type='text'  placeholder="EN"
                           value={isData.description.en}
                           onChange={(e) => setData({ ...isData, description: {...isData.description,en:e.target.value} })}
                           prefix={<EditOutlined />} />
                    <TextArea style={{marginTop:'10px'}} type='text'  placeholder="RU"
                              value={isData.description.ru}
                              onChange={(e) => setData({ ...isData, description: {...isData.description,ru:e.target.value} })}
                              prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Тип</h4>
                    <Select
                        value={isData.type}
                        style={{
                            width: '100%',
                        }}
                        onChange={(value)=>{
                            setData({ ...isData, type: value })}}
                        options={[
                            {
                                value: 'games',
                                label: 'Ігра',
                            },
                            {
                                value: 'apps',
                                label: 'Додаток',
                            },
                        ]}
                    />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Категорія</h4>
                    <Select
                        value={isData.category}
                        style={{
                            width: '100%',
                        }}
                        onChange={(value)=>{setData({ ...isData, category: value })}}
                        options={isCategory}
                    />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Реліз</h4>
                    <Input type='text'  placeholder="Release"
                           value={isData.version}
                           onChange={(e) => setData({ ...isData, version: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Фото</h4>
                    <Input type='text'  placeholder="Photo"
                           value={isData.image}
                           onChange={(e) => setData({ ...isData, image: e.target.value })}
                           prefix={<LinkOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Посилання (пост в каналі)</h4>
                    <Input type='text'  placeholder="Link"
                           value={isData.link}
                           onChange={(e) => setData({ ...isData, link: e.target.value })}
                           prefix={<LinkOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Тригери для пошуку (новий тригер з нової стрічки)</h4>
                    <TextArea type='text'  placeholder="Trigger"
                           value={isData.trigger}
                              style={{minHeight:'200px'}}
                           onChange={(e) => setData({ ...isData, trigger: e.target.value })}
                           prefix={<LinkOutlined />} />
                </Col>
            </Modal>
        </>
    );
};

export default EditGame;