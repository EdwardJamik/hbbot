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

function Tables() {

  const [data, setData] = useState([])

  useEffect(() => {
    const tgUserData = async () => {
      const {data} = await axios.get(
          `${url}/api/v1/admin/tgUsers`,
          {},
          {withCredentials: true}
      );
      setData(data)
    }
    tgUserData()
  }, [data]);

  const banUser = async (id,ban) => {
    const user = {
      id: id,
      ban:ban
    }
    const {data} = await axios.post(
        `${url}/api/v1/admin/banTgUser`,
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

  const columns = [
    {
      title: "chat_id",
      dataIndex: "chat_id",
      key: "chat_id",
      ...getColumnSearchProps('chat_id'),
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      ...getColumnSearchProps('username'),
      render: (username) =>
          <>
            {username !== 'Not specified' ?
                <a href={`https://t.me/${username}`}
                   target="_blank" rel="noreferrer">{username}</a>
                :
                username
            }

          </>
      ,
    },
    {
      title: "First name",
      key: "first_name",
      dataIndex: "first_name",
      ...getColumnSearchProps('first_name'),
    },
    {
      title: "Language",
      key: "language",
      dataIndex: "language",
      align:'center',
      sorter: (a, b) => a.language - b.language,
    },
    {
      title: "Присоеденился",
      key: "createdAt",
      dataIndex: "createdAt",
      align:'center',
      render: (createdAt) => <>{dayjs(createdAt).format('HH:mm:ss DD.MM.YYYY')}</>,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: "Последнее взаимодействие",
      key: "updatedAt",
      dataIndex: "updatedAt",
      align:'center',
      render: (updatedAt) => <>{dayjs(updatedAt).format('HH:mm:ss DD.MM.YYYY')}</>,
      sorter: (a, b) => dayjs(a.updatedAt).unix() - dayjs(b.updatedAt).unix(),
    },
    {
      title: "Статус",
      key: "user_bot_ban",
      dataIndex: "user_bot_ban",
      align:'center',
      render: (user_bot_ban) => <>{user_bot_ban ? <Tag color="red">Пользователь заблокировал бота</Tag> : <></>}</>,
      sorter: (a, b) => a.user_bot_ban - b.user_bot_ban,
    },
    {
      title: "",
      key: "ban",
      dataIndex: "ban",
      align:'center',
      sorter: (a, b) => a.ban - b.ban,
      render: (_,record) =>
          <div style={{display:'flex'}}>
            <Button danger={!record.ban} onClick={() => banUser(record._id,!record.ban)}>{record.ban ? 'UnBan' : 'Ban'}</Button>
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
              title="Telegram users"
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

export default Tables;
