import {
    Row,
    Col,
    Card,
    Table, Button, Space, Input, Tag, message,
} from "antd";

import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import dayjs from "dayjs";
import Highlighter from "react-highlight-words";
import {SearchOutlined} from "@ant-design/icons";
import EditReserved from "../components/EditReserved/EditReserved.jsx";


const editIcon = [
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path
                d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
]

function Reservation() {

    const [data, setData] = useState([])

    useEffect(() => {
        const getReserved = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/getReserves`,
                {},
                {withCredentials: true}
            );
            setData(data)
        }
        getReserved()
    }, [data]);

    const banUser = async (id, ban) => {
        const user = {
            id: id,
            ban: ban
        }
        const {data} = await axios.post(
            `${url}/api/v1/admin/banTgUser`,
            {...user},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message)
        }
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]?.toString()?.toLowerCase()?.includes(value?.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "",
            dataIndex: "chat_id",
            key: "chat_id",
            align:'center',
            width: '5%',
            render: (_,record) =>
                <>
                    {record?.declined ? <Tag color="red">Бронь отменена</Tag> : <></>}
                    {record?.accepted ? <Tag color="green">Бронь подтверждена</Tag> : <></>}
                    {!record?.accepted && !record?.declined ? <Tag color="orange">В ожидании</Tag> : <></>}
                </>
            ,
        },
        {
            title: "Пользователь",
            dataIndex: "chat_id",
            key: "chat_id",
            align:'center',
            ...getColumnSearchProps('chat_id'),
            render: (_,record) =>
                <div style={{display:'flex', flexDirection:'column'}}>
                    {record.user.username !== 'Not specified' ?
                        <>
                            <span>{record.first_name}</span>
                            <a href={`https://t.me/${record.user.username}`}
                               target="_blank"
                               rel="noreferrer">{record.user.username}</a><span>({record.user.chat_id})</span>
                        </>
                        :
                        <><span>{record.first_name}</span>{record.user.username} <span>({record.user.chat_id})</span></>
                    }

                </div>
            ,
        },
        {
            title: "Количество",
            dataIndex: "count_people",
            key: "count_people",
            align:'center',
            width:'5%'
        },
        {
            title: "Время бронирования",
            key: "date",
            dataIndex: "date",
            align:'center',
            render: (_, record) => {
                const time = record?.time
                const date = record?.date
                return dayjs(`${time} ${date}`).format('HH:mm:ss DD.MM.YYYY')
            },
            sorter: (a, b) => dayjs(`${a.time} ${a.date}`).unix() - dayjs(`${b.time} ${b.date}`).unix(),
        },

        {
            title: "Бронь создана",
            key: "createdAt",
            dataIndex: "createdAt",
            align:'center',
            render: (createdAt) => <>{dayjs(createdAt).format('HH:mm:ss DD.MM.YYYY')}</>,
            sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
        },
        {
            title: "Последнее обновление брони",
            key: "updatedAt",
            dataIndex: "updatedAt",
            align:'center',
            render: (updatedAt) => <>{dayjs(updatedAt).format('HH:mm:ss DD.MM.YYYY')}</>,
            sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
        },
        {
            title: "",
            key: "ban",
            dataIndex: "ban",
            align:'center',
            render: (_,record) =>
                <div style={{display:'flex'}}>
                    <EditReserved id={record._id}/>
                </div>
            ,
        },
    ];

    return (
        <>
            <div className="tabled">
                <Row gutter={[24, 0]}>
                    <Col xs="24" xl={24}>
                        <Card
                            bordered={false}
                            className="criclebox Reservationpace mb-24"
                        >
                            <div className="table-responsive">
                                <Table
                                    columns={columns}
                                    dataSource={data}
                                    className="ant-border-space"
                                    size='small'
                                    responsive={['md']}
                                />
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Reservation;
