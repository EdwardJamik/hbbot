import React, {useState} from 'react';
import {Button, Checkbox, Col, FloatButton, Input, message, Modal, Select} from "antd";

import {UserAddOutlined, MailOutlined,UserOutlined,KeyOutlined} from "@ant-design/icons";
import axios from "axios";
import {url} from "../../Config.jsx";

const AddUsers = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
            username:'',
            password:'',
            root:[]
        }
    );

    const resetData = () =>{
        setFormData({
            username:'',
            password:'',
            root:{}
        })
    }

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = async () => {

        const {data} = await axios.post(
            `${url}/api/v1/admin/createUser`,
            {...formData},
            {withCredentials: true}
        );

        if(data.success){
            resetData()
            setIsModalOpen(false);
            message.success(data.message)
        } else{
            message.warning(data.message)
        }

    };

    const handleCancel = () => {
        resetData()
        setIsModalOpen(false);
    };

    const options = [{label: 'Бронирование',value:'0'},{label: 'Продукция',value:'1'},{label: 'Отзывы',value:'2'},{label: 'ChatGPT',value:'3'},{label: 'Пользователи',value:'4'},{label: 'Переводы',value:'5'},{label: 'Рассылка',value:'6'},{label: 'Каналы',value:'7'}];

    const handleChange = (value) => {
        setFormData(formData, {root: value})
    };

    return (
        <div>
            <FloatButton onClick={showModal}
                icon={<UserAddOutlined />}
                type="primary"
                style={{
                    bottom: 54,
                    right: 54,
                }}
            />
            <Modal
                title="Создание аккаунта менеджера"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Закрыть</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>Создать</Button>,
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <Input  placeholder="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} prefix={<UserOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input.Password placeholder="Password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} prefix={<KeyOutlined />}/>
                </Col>
                <Col style={{margin: '7px',width:'100%',maxWidth:'97%'}} span={8}>
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        id="roots"
                        placeholder="Доступ"
                        onChange={handleChange}
                        options={options}
                    />
                </Col>
            </Modal>
        </div>
    );
};

export default AddUsers;