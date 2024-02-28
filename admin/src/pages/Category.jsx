import {
    Row,
    Col,
    Card,
    Button,
    Descriptions, Popconfirm, message,
} from "antd";

import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import EditCategory from "../components/editCategory/EditCategory.jsx";

function Category() {

    const [data, setData] = useState([])

    useEffect(() => {
        const gameCategory = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/getCategory`,
                {},
                {withCredentials: true}
            );
            setData(data)
        }
        gameCategory()
    }, [data]);

    const view = [
        // eslint-disable-next-line react/jsx-key
        <svg width="20"
             height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9ZM11 12C11 11.4477 11.4477 11 12 11C12.5523 11 13 11.4477 13 12C13 12.5523 12.5523 13 12 13C11.4477 13 11 12.5523 11 12Z"
                      fill="#A3842E"></path>
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M21.83 11.2807C19.542 7.15186 15.8122 5 12 5C8.18777 5 4.45796 7.15186 2.17003 11.2807C1.94637 11.6844 1.94361 12.1821 2.16029 12.5876C4.41183 16.8013 8.1628 19 12 19C15.8372 19 19.5882 16.8013 21.8397 12.5876C22.0564 12.1821 22.0536 11.6844 21.83 11.2807ZM12 17C9.06097 17 6.04052 15.3724 4.09173 11.9487C6.06862 8.59614 9.07319 7 12 7C14.9268 7 17.9314 8.59614 19.9083 11.9487C17.9595 15.3724 14.939 17 12 17Z"
                      fill="#A3842E"></path>
        </svg>
    ]

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
            `${url}/api/v1/deletedCategoryGame`,
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
                        title={[<div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}><h6 className="font-semibold m-0">Категории</h6><EditCategory content={false}/></div>]}
                        bodyStyle={{paddingTop: "0" }}
                    >
                        <Row gutter={[24, 24]}>
                            {data ? data.map((item, index) => (
                                <Col span={12} key={index}>
                                    <Card className="card-billing-info" bordered="false">
                                        <div className="col-info">
                                            <Descriptions title={<>{item.title.ru}</>}>
                                            </Descriptions>
                                        </div>
                                        <div className="col-action" style={{flexDirection:'column'}}>
                                            <Popconfirm
                                                title="При удаление категори, будет удалена вся продукция данной категории"
                                                onConfirm={()=>confirm(item._id)}
                                                okText="Удалить"
                                                cancelText="Отменить"
                                            >
                                                <Button type="link" danger>
                                                    {deletebtn} Удалить
                                                </Button>
                                            </Popconfirm>
                                            <EditCategory id={item._id} content={true}/>
                                            <Link to={`/product/${item._id}`} type="link">
                                                <Button type="link">
                                                    {view} Продукция
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                </Col>
                            )) : <></>}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default Category;
