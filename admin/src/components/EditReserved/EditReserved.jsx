import React, {useState} from 'react';
import axios from "axios";
import {url} from "../../Config.jsx";
import {Button, Col, Input, message, Modal, Tag} from "antd";
import {EditOutlined} from "@ant-design/icons";
import dayjs from "dayjs";

const EditReserved = ({id}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isData, setData] = useState({});
    const currentDate = dayjs();
    const showModal = async () => {
        setIsModalOpen(!isModalOpen)

        if(id){
            const {data} = await axios.post(
                `${url}/api/v1/admin/getReservInfo`,
                {id},
                {withCredentials: true}
            );

            setData(...data)
        }
    }

    const handleOk = async (accepted) => {

        const {data} = await axios.post(
            `${url}/api/v1/admin/acceptedReserved`,
            {isData:{...isData, accepted: accepted ? accepted : false, declined: accepted ? false: !accepted},id,accepted},
            {withCredentials: true}
        );

        if (data.access) {
            setIsModalOpen(false);
            message.success(data.access_message)
        }
        else
        {
            message.success(data.access_message)
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <>
                <Button onClick={() => showModal()} type="link" className="darkbtn">
                 Изменить
                </Button>
            <Modal
                title={<>
                    {isData?.declined ? <Tag color="red">Бронь отменена</Tag> : <></>}
                    {isData?.accepted ? <Tag color="green">Бронь подтверждена</Tag> : <></>}
                    {!isData?.accepted && !isData?.declined ? <Tag color="orange">В ожидание</Tag> : <></>}
                </>}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    currentDate.isBefore(`${isData.date} ${isData.time}`) ?(
                    !isData?.declined ? <Button key="cancel" danger onClick={()=>handleOk(false)}>Отменить</Button> : <Button key="cancel_opening"  onClick={()=>handleCancel()}>Закрыть</Button>,
                    !isData?.accepted ? <Button key="ok" type="primary" onClick={()=>handleOk(true)}>Подтвердить</Button> : (<><Button key="cancel" danger onClick={()=>handleOk(false)}>Отменить</Button><Button key="ok" type="primary" onClick={()=>handleOk(true)}>Изменить</Button></>)
                    ) : (<Button key="cancel_opening"  onClick={()=>handleCancel()}>Закрыть</Button>)
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <h4>Бронь на имя</h4>
                    <Input type='text'  placeholder="EN" style={{padding:'0px 10px'}}
                           value={isData.first_name}
                           onChange={(e) => setData({ ...isData, first_name: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Количество людей</h4>
                    <Input type='text'  placeholder="EN" style={{padding:'0px 10px'}}
                           value={isData.count_people}
                           onChange={(e) => setData({ ...isData, count_people: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Номер телефона</h4>
                    <Input type='text' placeholder="EN" style={{padding:'0px 10px'}}
                           value={isData.phone}
                           onChange={(e) => setData({ ...isData, phone: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Время</h4>
                    <Input type='time' placeholder="EN" style={{padding:'0px 10px'}}
                           value={isData.time}
                           onChange={(e) => setData({ ...isData, time: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Дата</h4>
                    <Input type='date' placeholder="EN" style={{padding:'0px 10px'}}
                           value={isData.date}
                           onChange={(e) => setData({ ...isData, date: e.target.value })}
                           prefix={<EditOutlined />} />
                </Col>
            </Modal>
        </>
    );
};

export default EditReserved;