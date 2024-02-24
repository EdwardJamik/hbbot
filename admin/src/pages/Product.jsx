import {
    Row,
    Col,
    Card,
    Button,
    Descriptions, Popconfirm, message,
} from "antd";

import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import EditGame from "../components/editGame/EditGame.jsx";


const Product = () => {

    const [data, setData] = useState([])
    const [isCategory, setCategory] = useState('')
    const { id } = useParams();
    useEffect(() => {
        const gameCategory = async () => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const {data} = await axios.post(
                `${url}/api/v1/admin/getCategory`,
                {id},
                {withCredentials: true}
            );
            console.log(data)
            setData(data)
            // setCategory(data.category)
        }
        gameCategory()
    }, [data]);

    const deletebtn = [
        <svg
            width="16"
            height="16"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={0}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9 2C8.62123 2 8.27497 2.214 8.10557 2.55279L7.38197 4H4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6L4 16C4 17.1046 4.89543 18 6 18H14C15.1046 18 16 17.1046 16 16V6C16.5523 6 17 5.55228 17 5C17 4.44772 16.5523 4 16 4H12.618L11.8944 2.55279C11.725 2.214 11.3788 2 11 2H9ZM7 8C7 7.44772 7.44772 7 8 7C8.55228 7 9 7.44772 9 8V14C9 14.5523 8.55228 15 8 15C7.44772 15 7 14.5523 7 14V8ZM12 7C11.4477 7 11 7.44772 11 8V14C11 14.5523 11.4477 15 12 15C12.5523 15 13 14.5523 13 14V8C13 7.44772 12.5523 7 12 7Z"
                fill="#111827"
                className="fill-danger"
            ></path>
        </svg>,
    ];

    const confirm = async (id) => {
        const {data} = await axios.post(
            `${url}/api/v1/deletedAppsToCategory`,
            {id: id},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.access_message)
        }
    };

    return (
        <>
            <Row gutter={[24, 0]}>
                <Col span={24} md={24} className="mb-24">
                    <Card
                        className="header-solid h-full"
                        bordered={false}
                        title={[<div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}><h6 className="font-semibold m-0">Додатки з категорії: {isCategory}</h6><EditGame content={false}/></div>]}
                        bodyStyle={{paddingTop: "0" }}
                    >
                        <Row gutter={[24, 24]}>
                            {data.map((item, index) => (
                                <Col span={12} key={index}>
                                    <Card className="card-billing-info" bordered="false">
                                        <div className="col-info">
                                            <Descriptions title={<>{item.title}</>}>
                                                <Descriptions.Item label="Реліз" span={3}>
                                                    {item.version}
                                                </Descriptions.Item>
                                            </Descriptions>
                                        </div>
                                        <div className="col-action" style={{flexDirection:'column'}}>
                                            <Popconfirm
                                                title="Підтвердіть дію"
                                                onConfirm={()=>confirm(item._id)}
                                                okText="Видалити"
                                                cancelText="Скасувати"
                                            >
                                                <Button type="link" danger>
                                                    {deletebtn} Видалити
                                                </Button>
                                            </Popconfirm>
                                            <EditGame id={item._id} content={true}/>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Product;
