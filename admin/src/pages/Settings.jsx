import {useEffect, useState} from "react";

import {
    Card,
    Col,
    Row,
    Typography,
    Space , Input, Button, Switch, message,
} from "antd";

import axios from "axios";
import {url} from "../Config.jsx";
import {CheckOutlined, CloseOutlined} from "@ant-design/icons";
import AddLinks from "../components/addLinks/AddLinks.jsx";

function Settings() {
    const { Title } = Typography;

    const [isBotAccess,setBotAccess] = useState(false)
    const [isMainLinks,setMainLinks] = useState([])
    const [isGroupLinks,setGroupLinks] = useState([])
    const [isImageLinks,setImageLinks] = useState(false)
    const [isImageDefLinks,setImageDefLinks] = useState(false)

    useEffect(() => {
        const getData = async () => {
            const {data} = await axios.get(
                `${url}/api/v1/getSettingData`,
                {},
                {withCredentials: true}
            );

            if(!isImageLinks)
                setImageLinks({main_img:data.setting.main_img, game_img: data.setting.game_img, apps_img: data.setting.apps_img})

            if(!isImageDefLinks)
                setImageDefLinks({main_img:data.setting.main_img, game_img: data.setting.game_img, apps_img: data.setting.apps_img})

            if(!isBotAccess)
                setBotAccess(data.access)

            setMainLinks(data.setting.main_links)
            setGroupLinks(data.setting.group_links)

        }
        getData()
    }, [isMainLinks,isGroupLinks]);

    const changeAccessBot = async (id) => {
        const {data} = await axios.post(
            `${url}/api/v1/updateAccessBot`,
            {_id:id},
            {withCredentials: true}
        );

        if(data.access)
            message.success(data.access_message)
        else
            message.warning(data.access_message)
    }

    const changeLinks = async (type, value) => {
        const {data} = await axios.post(
            `${url}/api/v1/updateImgLink`,
            {type: type, value:value},
            {withCredentials: true}
        );

        if (data.access) {
            message.success(data.access_message)
            setImageDefLinks({
                main_img: data.setting.main_img,
                game_img: data.setting.game_img,
                apps_img: data.setting.apps_img
            })
        }
    }

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

    const saveIcon = [
        // eslint-disable-next-line react/jsx-key
        <svg  width="20"
              height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd"
                      d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                      fill="#FFF"></path>
        </svg>
    ]

    const profile = [
        // eslint-disable-next-line react/jsx-key
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M14.2647 15.9377L12.5473 14.2346C11.758 13.4519 11.3633 13.0605 10.9089 12.9137C10.5092 12.7845 10.079 12.7845 9.67922 12.9137C9.22485 13.0605 8.83017 13.4519 8.04082 14.2346L4.04193 18.2622M14.2647 15.9377L14.606 15.5991C15.412 14.7999 15.8149 14.4003 16.2773 14.2545C16.6839 14.1262 17.1208 14.1312 17.5244 14.2688C17.9832 14.4253 18.3769 14.834 19.1642 15.6515L20 16.5001M14.2647 15.9377L18.22 19.9628M18.22 19.9628C17.8703 20 17.4213 20 16.8 20H7.2C6.07989 20 5.51984 20 5.09202 19.782C4.7157 19.5903 4.40973 19.2843 4.21799 18.908C4.12583 18.7271 4.07264 18.5226 4.04193 18.2622M18.22 19.9628C18.5007 19.9329 18.7175 19.8791 18.908 19.782C19.2843 19.5903 19.5903 19.2843 19.782 18.908C20 18.4802 20 17.9201 20 16.8V13M11 4H7.2C6.07989 4 5.51984 4 5.09202 4.21799C4.7157 4.40973 4.40973 4.71569 4.21799 5.09202C4 5.51984 4 6.0799 4 7.2V16.8C4 17.4466 4 17.9066 4.04193 18.2622M18 9V6M18 6V3M18 6H21M18 6H15"
                    stroke="#fff" ></path>
        </svg>,
    ];

    const groupLinkDeleted = async (id,type) => {
        const {data} = await axios.post(
            `${url}/api/v1/deletedGroupLink`,
            {id: id,type},
            {withCredentials: true}
        );

        if (data.access) {
            message.success(data.access_message)
        }
    }


    return (
        <>
            <div className="layout-content">
                <Row className="rowgap-vbox" gutter={[24, 0]}>
                        <Col
                            key='keys_1'
                            xs={24}
                            sm={24}
                            md={12}
                            lg={12}
                            xl={8}
                            className="mb-24"
                        >
                            <Card bordered={false} className="criclebox ">
                                <div className="number">
                                    <Row align="middle" gutter={[24, 0]}>
                                        <Col xs={18}>
                                            <span>Зображення головного меню</span>
                                            <Col style={{margin:'10px 0',padding:'0'}}>
                                                <Space.Compact
                                                    style={{
                                                        width: '100%',
                                                    }}
                                                >
                                                    <Input value={isImageLinks.main_img} onChange={(e)=>{
                                                        setImageLinks(prevState => ({
                                                            ...prevState,
                                                            main_img: e.target.value
                                                        }));
                                                    }} style={{fontSize:'14px',height:'36px'}}/>
                                                    {isImageLinks.main_img !== isImageDefLinks.main_img ?
                                                        <Button onClick={()=>changeLinks('main_img',isImageLinks.main_img)} style={{height:'36px',display: 'flex', alignItems: 'center'}} type='primary'>{saveIcon}</Button>
                                                        :
                                                        <></>
                                                    }
                                                </Space.Compact>
                                            </Col>
                                        </Col>
                                        <Col xs={6}>
                                            <div className="icon-box">{profile}</div>
                                        </Col>
                                    </Row>
                                </div>
                            </Card>
                        </Col>
                    <Col
                        key='keys_2'
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={8}
                        className="mb-24"
                    >
                        <Card bordered={false} className="criclebox ">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={18}>
                                        <span>Зображення меню ігр</span>
                                        <Col style={{margin:'10px 0',padding:'0'}}>
                                            <Space.Compact
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Input value={isImageLinks.game_img} onChange={(e)=>{
                                                    setImageLinks(prevState => ({
                                                        ...prevState,
                                                        game_img: e.target.value
                                                    }));
                                                }} style={{fontSize:'14px',height:'36px'}}/>
                                                {isImageLinks.game_img !== isImageDefLinks.game_img ?
                                                    <Button onClick={()=>changeLinks('game_img',isImageLinks.game_img)} style={{height:'36px',display: 'flex', alignItems: 'center'}} type='primary'>{saveIcon}</Button>
                                                    :
                                                    <></>
                                                }
                                            </Space.Compact>
                                        </Col>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="icon-box">{profile}</div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                    <Col
                        key='keys_3'
                        xs={24}
                        sm={24}
                        md={12}
                        lg={12}
                        xl={8}
                        className="mb-24"
                    >
                        <Card bordered={false} className="criclebox ">
                            <div className="number">
                                <Row align="middle" gutter={[24, 0]}>
                                    <Col xs={18}>
                                        <span>Зображення меню додатків</span>
                                        <Col style={{margin:'10px 0',padding:'0'}}>
                                            <Space.Compact
                                                style={{
                                                    width: '100%',
                                                }}
                                            >
                                                <Input value={isImageLinks.apps_img} onChange={(e)=>{
                                                    setImageLinks(prevState => ({
                                                        ...prevState,
                                                        apps_img: e.target.value
                                                    }));
                                                }} style={{fontSize:'14px',height:'36px'}}/>
                                                {isImageLinks.apps_img !== isImageDefLinks.apps_img ?
                                                    <Button onClick={()=>changeLinks('apps_img',isImageLinks.apps_img)} style={{height:'36px',display: 'flex', alignItems: 'center'}} type='primary'>{saveIcon}</Button>
                                                    :
                                                    <></>
                                                }
                                            </Space.Compact>
                                        </Col>
                                    </Col>
                                    <Col xs={6}>
                                        <div className="icon-box">{profile}</div>
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[24, 0]} className="rowgap-vbox">
                    <Col xs={24} sm={24} md={12} lg={12} xl={12} className="mb-24">
                        <Card bordered={false} className="criclebox cardbody h-full">
                            <div className="project-ant">
                                <div style={{width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                                    <Title level={5}>Посилання в головному меню бота</Title>
                                    <AddLinks type='main_links' content={false}/>
                                </div>
                            </div>
                            <div className="ant-list-box table-responsive">
                                <table className="width-100">
                                    <thead>
                                    <tr>
                                        <th>Текст</th>
                                        <th>Посилання</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isMainLinks ? isMainLinks.map((d, index) => (
                                        <tr key={index}>
                                            <td>
                                                <h5>
                                                    <b>RU</b>:{d.title.ru}
                                                </h5>
                                                <h5>
                                                    <b>EN</b>:{d.title.en}
                                                </h5>
                                            </td>
                                            <td><a href={`${d.link}`} target="_blank" rel="noreferrer">Посилання</a></td>
                                            <td style={{display:'flex', justifyContent:'center'}}>
                                                <Button type="link" onClick={()=>groupLinkDeleted(index,'main_links')} danger>
                                                    {deletebtn} Видалити
                                                </Button>
                                                <AddLinks type='main_links' id={index} content={true}/>
                                            </td>
                                        </tr>
                                    )) : <tr>
                                        <td>

                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={12} lg={24} xl={12} className="mb-24">
                        <Card bordered={false} className="criclebox cardbody h-full">
                            <div className="project-ant">
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Title level={5}>Посилання в чатах</Title>
                                    <AddLinks type='group_links'/>
                                </div>
                            </div>
                            <div className="ant-list-box table-responsive">
                                <table className="width-100">
                                    <thead>
                                    <tr>
                                        <th>Текст</th>
                                        <th>Посилання</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isGroupLinks ? isGroupLinks.map((d, index) => (
                                        <tr key={index}>
                                            <td>
                                                <h5>
                                                    <b>RU</b>:{d.title.ru}
                                                </h5>
                                                <h5>
                                                    <b>EN</b>:{d.title.en}
                                                </h5>
                                            </td>
                                            <td><a href={`${d.link}`} target="_blank" rel="noreferrer">Посилання</a>
                                            </td>
                                            <td style={{display: 'flex', justifyContent: 'center'}}>
                                                <Button type="link" onClick={()=>groupLinkDeleted(index,'group_links')} danger>
                                                    {deletebtn} Видалити
                                                </Button>
                                                <AddLinks type='group_links' id={index} content={true}/>
                                            </td>
                                        </tr>
                                    )) : <tr>
                                        <td>

                                        </td>
                                        <td>
                                        </td>
                                        <td>
                                        </td>
                                    </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={[24, 0]} className="rowgap-vbox">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mb-24">
                        <Card bordered={false} className="criclebox cardbody h-full">
                            <div className="project-ant">
                                <div>
                                    <Title level={5}>Дозвіл взаємодії з ботом</Title>
                                    Канали, групи та супергрупи
                                </div>
                            </div>
                            <div className="ant-list-box table-responsive">
                                <table className="width-100">
                                    <thead>
                                    <tr>
                                        <th>chat_id</th>
                                        <th>Назва</th>
                                        <th>Тип</th>
                                        <th>Дозвіл</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {isBotAccess ? isBotAccess.map((d, index) => (
                                        <tr key={index}>
                                            <td>
                                                {d.chat_id}
                                            </td>
                                            <td>{d.chat_name}</td>
                                            <td>{d.groupType}</td>
                                            <td>{d.access}
                                                <Switch
                                                    checkedChildren={<CheckOutlined />}
                                                    unCheckedChildren={<CloseOutlined />}
                                                    defaultChecked={d.access}
                                                    onChange={()=>changeAccessBot(d._id)}
                                                />
                                            </td>
                                        </tr>
                                    )) : <tr>
                                        <td>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Settings;
