import {
    Row,
    Col,
    Card,
    Table
} from "antd";

import {useEffect, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import dayjs from "dayjs";

function Reviews() {

    const [data, setData] = useState([])

    const [isReview, setReview] = useState(0)

    useEffect(() => {
        const getReview = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/getReviews`,
                {},
                {withCredentials: true}
            );
            setData(data)
            let sumReview = 0;
            for(let i = 0; i < data.length; i++){
                sumReview += Number(data[i].review_star)
            }
            setReview((sumReview/data.length).toFixed(1))
        }
        getReview()
    }, []);

    const columns = [
        {
            title: "Оценка",
            dataIndex: "review_star",
            key: "review_star",
            align: 'center',
            width:'10%',
            sorter: (a, b) => a.review_star - b.review_star,
            render: (review_star) =>
                <>
                    {review_star >= 1 ? '⭐' : ''}{review_star >= 2 ? '⭐' : ''}{review_star >= 3 ? '⭐' : ''}{review_star >= 4 ? '⭐' : ''}{review_star >= 5 ? '⭐' : ''} - {review_star}
                </>
            ,
        },
        {
            title: "Отзыв",
            dataIndex: "review_text",
            key: "review_text",
            align: 'center',
            width:'20%',
            render: (_,record) =>
                <>
                    {record?.review_text ? record?.review_text : 'Not specified'}
                </>
            ,
        },
        {
            title: "Username",
            dataIndex: "user.username",
            key: "user.username",
            align: 'center',
            width:'8%',
            render: (_,record) =>
                <>
                    {record?.user?.username !== 'Not specified' ?
                        <a href={`https://t.me/${record?.user?.username}`}
                           target="_blank" rel="noreferrer">{record?.user?.username}</a>
                        :
                        record?.user?.username
                    }
                </>
            ,
        },
        {
            title: "First name",
            key: "user.first_name",
            align: 'center',
            width:'8%',
            dataIndex: "user.first_name",
            render: (_,record) =>
                <>
                    {record?.user?.first_name}
                </>
            ,
        },
        {
            title: "Время отзыва",
            key: "createdAt",
            align: 'center',
            width:'8%',
            dataIndex: "createdAt",
            render: (createdAt) => <>{dayjs(createdAt).format('HH:mm:ss DD.MM.YYYY')}</>,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },

    ];

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            title={<div style={{display:'flex', justifyContent:'space-between'}}><div>Отзывы</div><div>{isReview >= 1 ? '⭐' : ''}{isReview >= 2 ? '⭐' : ''}{isReview >= 3 ? '⭐' : ''}{isReview >= 4 ? '⭐' : ''}{isReview >= 5 ? '⭐' : ''} {isReview}</div></div>}
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={data}
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

export default Reviews;
