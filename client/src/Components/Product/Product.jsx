import React, {useEffect, useState} from 'react';
import {Button, Col, Drawer, Tag} from "antd";
import {url} from "../../Config.jsx";
import {useSelector} from "react-redux";

const Product = ({item, index}) => {
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState('bottom');
    const language = useSelector(state => state.language)

    const showDrawer = () => {
        setOpen(!open);
    };

    return (
        <>
            <Col className="gutter-row" onClick={() => setOpen(!open)} span={12} key={item._id}>
                <div className='menu_item'>
                    <Tag className='modal_price'><span>{item.price}$</span>
                        <div></div>
                    </Tag>
                    <img src={`${url}/images/${item.photo}`} alt={`${item.title[language]}`}/>
                    <div className="button" href={`${item._id}`}>{item.title[language]}</div>
                </div>
            </Col>
            <Drawer
                className="product_modal"
                placement={placement}
                closable={false}
                style={{
                    background: '#000',
                    color: '#fff',
                    border: '1px solid rgba(163, 132, 46, .8)',
                    borderLeft:'0',
                    borderRight:'0',
                    borderBottom:'0',
                    borderTopRightRadius: '60px',
                    borderTopLeftRadius: '60px'
                }}
                onClose={() => setOpen(!open)}
                open={open}
                key={placement}
                height={'80%'}
            >
                <div style={{height: '100%', padding: '270px 0px 0px'}}>
                    <div style={{
                        position: 'absolute',
                        top: '0px',
                        right: '0px',
                        borderRadius: '40px 40px 8% 8%',
                        border: '1px solid rgba(163, 132, 46, .8)',
                        width: '100%',
                        height: '280px',
                        background: `url(${url}/images/${item.photo})`,
                        backgroundSize:'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: '0em 0em 2em 0em rgb(163, 132, 46)',
                        padding: '0'
                    }}>
                    </div>
                    <Button className='closableButton' onClick={()=>{showDrawer()}}></Button>
                    <Tag style={{
                        position:'absolute',
                        right:'-8px',
                        top:'240px',
                        height:'40px',
                        fontSize:'20px',
                        fontWeight:'600px',
                        width:'auto',
                        minWidth:'100px',
                        maxWidth:'200px',
                        color:'#fff',
                        display:'flex',
                        justifyContent:'center',
                        alignItems:'center',
                        padding:'0 10px',
                        borderRadius: '10px 2px 24px 10px',
                        borderColor:'rgba(0, 0, 0, 0)',
                        background:'rgb(163, 132, 46)'}}
                    >
                        <span>
                            {item.price}$
                        </span>
                    </Tag>
                    <div style={{zIndex: '5'}}>
                        <div style={{display:'flex',alignItems:'center', margin: '24px 0 10px'}}>
                            <h4 style={{fontSize: '22px', fontWeight: '500', color: '#fff'}}>{item.title[language]}</h4>
                        </div>
                        <p style={{fontSize:'16px'}}>{item.description[language]}</p>
                    </div>
                </div>
            </Drawer>
        </>
    );
};

export default Product;