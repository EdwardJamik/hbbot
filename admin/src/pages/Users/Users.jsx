import React, {lazy, useEffect, useRef, useState} from 'react';
import Highlighter from 'react-highlight-words';
import './users.scss'
import {Button, Input, message, Space, Table, Tag} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import {url} from "../../Config.jsx";
import axios from "axios";

const EditUser = lazy(() => import("./EditUser"))
const AddUsers = lazy(() => import("./AddUsers"))
const Users = () => {

    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
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

    const removeUser = async (id) => {
        const {data} = await axios.post(
            `${url}/api/v1/admin/RemoveUser`,
            {id},
            {withCredentials: true}
        );
        message.success(data.message)
    }

    useEffect(()=>{
        const userList = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/admin/userList`,
                {},
                {withCredentials: true}
            );
            setUsers(data.array)
        }
        userList()
    },[users])

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
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
                        icon={<SearchOutlined />}
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
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
            title: 'Login',
            dataIndex: 'username',
            key: 'username',
            width:'25%',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Доступ к административным страницам',
            dataIndex: 'root',
            key: 'root',
            width:'75%',
            render: (root) => (
                <>
                    {root &&
                        <>
                            {root[0] ? ` | Бронирование` : ''}
                            {root[1] ? ` | Продукция` : ''}
                            {root[2] ? ` | Отзывы` : ''}
                            {root[3] ? ` | ChatGPT` : ''}
                            {root[4] ? ` | Пользователи` : ''}
                            {root[5] ? ` | Переводы` : ''}
                            {root[6] ? ` | Рассылка` : ''}
                            {root[7] ? ` | Каналы` : ''}
                        </>

                    }
                    {!root && <></>}
                </>
            ),

        },
        {
            title: '',
            key: 'action',
            width:'33.3%',
            render: (_, record) => (
                <Space size="middle">
                    <EditUser record={record}/>
                    {record.username === 'admin' ? <></> :
                        <Button onClick={()=>removeUser(record._id)} type="text" danger>
                            Удалить
                        </Button>}
                </Space>
            ),
        },
    ];

    return (
        <div className='admin_container'>
            <Table columns={columns} dataSource={users} />
            <AddUsers/>
        </div>
    );
};

export default Users;