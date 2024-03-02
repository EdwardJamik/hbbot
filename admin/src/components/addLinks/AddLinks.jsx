import React, {useState} from 'react';
import axios from "axios";
import {url} from "../../Config.jsx";
import {Button, Col, Input, message, Modal} from "antd";
import {EditOutlined, LinkOutlined} from "@ant-design/icons";

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

const AddLinks = ({type,id,content}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isData, setData] = useState({title:{ru:'',en:''},link:''});

    const showModal = async () => {
        setIsModalOpen(!isModalOpen)

        if(id === 0 || id){
            const {data} = await axios.post(
                `${url}/api/v1/getGroupLink`,
                {id:id,type},
                {withCredentials: true}
            );

            setData({...data})
        }
    }

    const handleOk = async () => {

        const {data} = await axios.post(
            `${url}/api/v1/createGroupLink`,
            {id: id, type: type, content, isData},
            {withCredentials: true}
        );

        if (data.access) {
            setData({title: {ru: '', en: ''}, link: ''})
            setIsModalOpen(false);
            message.success(data.access_message)
        }
        else
        {
            message.warning(data.access_message)
        }

    };

    const handleCancel = () => {
        setData({title: {ru: '', en: ''}, link: ''})
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
                    <Button key="ok" type="primary" onClick={handleOk}>{content ? 'Сохранить' : 'Создать'}</Button>,
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="RU"
                           value={isData.title.ru}
                           onChange={(e) => setData({ ...isData, title: {...isData.title,ru:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="EN"
                           value={isData.title.en}
                           onChange={(e) => setData({ ...isData, title: {...isData.title,en:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Посилання"
                           value={isData.link}
                           onChange={(e) => setData({ ...isData, link: e.target.value })}
                           prefix={<LinkOutlined />} />
                </Col>
            </Modal>
        </>
    );
};

export default AddLinks;