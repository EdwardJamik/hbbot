import {
    Row,
    Col,
    Card,
    Table, Button, Space, Input, message, Select,
} from "antd";

import React, {useEffect, useRef, useState} from "react";
import axios from "axios";
import {url} from "../Config.jsx";
import Highlighter from "react-highlight-words";
import {SearchOutlined} from "@ant-design/icons";

function BotChannel() {

    const [data, setData] = useState([])

    useEffect(() => {
        const tgUserData = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/botChannels`,
                {},
                {withCredentials: true}
            );
            setData(data)
        }
        tgUserData()
    }, [data]);

    const botChannelAccess = async (id,access) => {
        const user = {
            id: id,
            access:access
        }

        const {data} = await axios.post(
            `${url}/api/v1/admin/changeAccess`,
            {...user},
            {withCredentials: true}
        );

        if(data.success){
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

    const options = [{label: 'En',value:'en'},{label: 'Uk',value:'uk'},{label: 'Ru',value:'ru'},{label: 'Es',value:'es'}];

    const handleChange = async (value,id) => {
        const {data} = await axios.post(
            `${url}/api/v1/admin/changeAccessLanguage`,
            {language:value,id},
            {withCredentials: true}
        );

        if (data.success) {
            message.success(data.message)
        }
    };

    const columns = [
        {
            title: "chat_id",
            dataIndex: "chat_id",
            key: "chat_id",
            ...getColumnSearchProps('chat_id'),
        },
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            ...getColumnSearchProps('title'),
        },
        {
            title: "Language",
            key: "language",
            dataIndex: "language",
            align:'center',
            sorter: (a, b) => a.language - b.language,
            render: (_,record) =>
                <div style={{display:'flex'}}>
                    <Select
                        style={{
                            margin:'0 auto'
                        }}
                        id="roots"
                        placeholder="Доступ"
                        defaultValue={record.language}
                        onChange={(value) => {handleChange(value,record._id)}}
                        options={options}
                    />
                </div>
            ,
        },
        {
            title: "",
            key: "ban",
            dataIndex: "ban",
            align:'center',
            sorter: (a, b) => a.ban - b.ban,
            render: (_,record) =>
                <div style={{display:'flex'}}>
                    <Button danger={record?.access} onClick={() => botChannelAccess(record._id,!record.access)}>{record.access ? 'Запретить рассылку' : 'Разрешить рассылку'}</Button>
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
                            className="criclebox tablespace mb-24"
                            title="Каналы для рассылки"
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

export default BotChannel;
