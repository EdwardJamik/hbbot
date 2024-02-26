import {
    Row,
    Col,
    Card,
    Table, Button, message, Tabs, List, Divider, Skeleton
} from "antd";
import {useEffect, useState} from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from "axios";
import {url} from "../Config.jsx";
import TextArea from "antd/es/input/TextArea.js";

function Filling() {

    const [data, setData] = useState([])
    const [isLanguage, setLanguage] = useState('ru')
    const [islanguageEdit, setLanguageEdit] = useState('ru')
    const [isTranslate, setTranslate] = useState(0)

    useEffect(() => {
        const currentUrl = window.location.href;
        if (currentUrl.includes('bot')) {
            const fillingData = async () => {
                const {data} = await axios.post(
                    `${url}/api/v1/admin/fillingData`,
                    {value:false},
                    {withCredentials: true}
                );
                setData(data)
            }
            fillingData()
        } else{
            const fillingData = async () => {
                const {data} = await axios.post(
                    `${url}/api/v1/admin/fillingData`,
                    {value:true},
                    {withCredentials: true}
                );
                setData(data)
            }
            fillingData()
        }

    }, []);

    async function onUpdated() {
        try {
            const currentUrl = window.location.href;
            if (currentUrl.includes('bot')) {
                await axios.post(`${url}/api/v1/admin/updatedFilling`, {value:false, data});
                message.success(`Сохранено`);
            } else{
                await axios.post(`${url}/api/v1/admin/updatedFilling`, {value:true, data});
                message.success(`Сохранено`);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const editFilling = (index,language,value) => {
        let filling = [...data];
        filling[index] = {
            ...filling[index],
            response: {
                ...filling[index].response,
                [language]: value
            }
        };
        setData(filling)
    };

    const itemsLanguge = [
        {
            key: 'ru',
            label: 'RU',
        },
        {
            key: 'en',
            label: 'EN',
        },
        {
            key: 'uk',
            label: 'UA',
        },
        {
            key: 'es',
            label: 'ES',
        },
    ];


    const tranlateFilling = (index) =>{
        setTranslate(index)

        if(islanguageEdit !== isLanguage){
            setLanguageEdit(isLanguage)
        }
    }

    return (
        <>
            <div className="tabled" style={{height:'100%'}}>
                <Row gutter={[24, 0]} style={{height:'100%'}}>
                    <Col xs="24" xl={24} style={{height:'100%'}}>
                        <Card
                            bordered={false}
                            className="criclebox tablespace mb-24"
                            extra={<Button type='primary' onClick={()=>onUpdated()} style={{fontSize:'14px', fontWeight:'400'}} >Сохранить</Button>}
                        >
                            <div className="table-responsive" style={{padding:'20px'}}>
                                <Tabs
                                    defaultActiveKey={isLanguage}
                                    centered
                                    onChange={(value)=> setLanguage(value)}
                                    items={itemsLanguge}
                                />
                                <div
                                    id="scrollableDiv"
                                    style={{
                                        height: 400,
                                        overflow: 'auto',
                                        padding: '0 16px',
                                        border: '1px solid rgba(140, 140, 140, 0.35)',
                                    }}
                                >
                                    <InfiniteScroll
                                        dataLength={data.length}
                                        loader={
                                            <Skeleton
                                                avatar
                                                paragraph={{
                                                    rows: 1,
                                                }}
                                                active
                                            />
                                        }
                                        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
                                        scrollableTarget="scrollableDiv"
                                    >
                                        <List
                                            dataSource={data}
                                            renderItem={(item, index) => (
                                                <List.Item key={item._id} className='translateItem' onClick={()=>tranlateFilling(index)}>
                                                    <div>{item.response[isLanguage]}</div>
                                                </List.Item>
                                            )}
                                        />
                                    </InfiniteScroll>
                                </div>

                                {data ?
                                <div style={{padding:'20px 0'}}>
                                    <Tabs
                                        activeKey={islanguageEdit}
                                        onChange={(value)=>setLanguageEdit(value)}
                                        items={itemsLanguge}
                                    />
                                    <TextArea style={{height:'200px'}} value={data[isTranslate]?.response[islanguageEdit]} onChange={(e)=>editFilling(isTranslate,islanguageEdit,e.target.value)}/>
                                </div>
                                :
                                <></>
                                }
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
}

export default Filling;
