import React, {useState} from 'react';
import {Button, Checkbox, Col, Input, message, Modal, Select} from "antd";
import {KeyOutlined, MailOutlined, UserOutlined} from "@ant-design/icons";
import axios from "axios";
import {url} from "../../Config.jsx";

const EditUser = ({record}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
            id:'',
            username: '',
            password: '',
            root: []
        }
    );

    const resetData = () => {
        setFormData({
            id:'',
            username: '',
            password: '',
            root: []
        })
    }

    const showModal = (record) => {

        let keys = record?.root ? record?.root.map((value, index) => value === true ? index.toString() : undefined).filter(index => index !== undefined) : false;
        setFormData({
            id:record._id,
            username: record.username,
            root: keys,
        })

        setIsModalOpen(true);
    };

    const handleOk = async () => {

        const {data} = await axios.post(
            `${url}/api/v1/admin/updateUser`,
            {...formData},
            {withCredentials: true}
        );

        if (data.success) {
            resetData()
            setIsModalOpen(false);
            message.success(data.message)
        } else {
            message.warning(data.message)
        }


    };
    const handleCancel = () => {
        resetData()
        setIsModalOpen(false);
    };

    const options = [{label: 'Бронирование',value:'0'},{label: 'Продукция',value:'1'},{label: 'Отзывы',value:'2'},{label: 'ChatGPT',value:'3'},{label: 'Пользователи',value:'4'},{label: 'Переводы',value:'5'},{label: 'Рассылка',value:'6'},{label: 'Каналы',value:'7'}];

    const handleChange = (value) => {
        setFormData({...formData, root: value})
    };

    return (
        <>
            <Button onClick={() => {showModal(record)}} type="dashed">
                Изменить
            </Button>

            <Modal
                title="Редактирования аккаунта менеджера"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Закрыть</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>Сохранить</Button>,
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <Input placeholder="Username" value={formData.username}
                           onChange={(e) => setFormData({...formData, username: e.target.value})}
                           prefix={<UserOutlined/>}/>
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input.Password placeholder="Password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} prefix={<KeyOutlined />}/>
                </Col>
                <Col style={{margin: '7px',maxWidth:'98%'}} span={8}>
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        id="roots"
                        placeholder="Доступ"
                        defaultValue={formData.root}
                        onChange={handleChange}
                        options={options}
                    />
                </Col>
            </Modal>
        </>
    );
};

export default EditUser;