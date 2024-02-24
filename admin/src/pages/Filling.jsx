import {
    Row,
    Col,
    Card,
    Table, Button, message
} from "antd";
import {useEffect, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import TextArea from "antd/es/input/TextArea.js";


function Filling() {

    const [data, setData] = useState([])

    async function onUpdated() {
        try {
            await axios.post(`${url}/api/v1/admin/updatedFilling`, data);
            message.success(`Сохранено`);
        } catch (err) {
            console.error(err);
        }
    }

    const onChange = (e) => {
        let filling = data
        const index = filling.findIndex(item => item._id === e.target.name);
        filling[index].response[e.target.id] =  e.target.value;
        setData(filling)
    };

    const columns = [
        {
            title: "EN",
            dataIndex: "response",
            key: "response",
            align:'center',
            width: "25%",
            render: (_, record) => (
                <>
                    <TextArea
                        rootClassName="textarea__filling"
                        showCount
                        style={{
                            height: 200,
                            resize: 'none',
                        }}
                        maxLength={768}
                        name={record?._id}
                        id='en'
                        defaultValue={record?.response?.en}
                        onChange={onChange}
                        placeholder="disable resize"
                        className="answer_textarea"
                    />
                </>
            ),
        },
        {
            title: "UA",
            dataIndex: "response",
            key: "response",
            align:'center',
            width: "25%",
            render: (_, record) => (
                <>
                    <TextArea
                        rootClassName="textarea__filling"
                        showCount
                        style={{
                            height: 200,
                            resize: 'none',
                            fontWeight:'400'
                        }}
                        maxLength={768}
                        name={record?._id}
                        id='uk'
                        defaultValue={record?.response?.uk}
                        onChange={onChange}
                        placeholder="disable resize"
                        className="answer_textarea"
                    />
                </>
            ),
        },
        {
            title: "ES",
            dataIndex: "response",
            key: "response",
            align:'center',
            width: "25%",
            render: (_, record) => (
                <>
                    <TextArea
                        rootClassName="textarea__filling"
                        showCount
                        style={{
                            height: 200,
                            resize: 'none',
                            fontWeight:'400'
                        }}
                        maxLength={768}
                        name={record?._id}
                        id='es'
                        defaultValue={record?.response?.es}
                        onChange={onChange}
                        placeholder="disable resize"
                        className="answer_textarea"
                    />
                </>
            ),
        },
        {
            title: "RU",
            dataIndex: "response",
            key: "response",
            align:'center',
            width: "25%",
            render: (_, record) => (
                <>
                    <TextArea
                        rootClassName="textarea__filling"
                        showCount
                        style={{
                            height: 200,
                            resize: 'none',
                            fontWeight:'400'
                        }}
                        maxLength={768}
                        name={record?._id}
                        id='ru'
                        defaultValue={record?.response?.ru}
                        onChange={onChange}
                        placeholder="disable resize"
                        className="answer_textarea"
                    />
                </>
            ),
        }
    ];


    useEffect(() => {
        const fillingData = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/fillingData`,
                {},
                {withCredentials: true}
            );
            setData(data)
        }
        fillingData()
    }, []);

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title="Текста бота"
                            extra={<Button type='primary' onClick={()=>onUpdated()} style={{fontSize:'14px', fontWeight:'400'}} >Оновити</Button>}
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    pagination={false}
                                    className="ant-border-space"
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Filling;
