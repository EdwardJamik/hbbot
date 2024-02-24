import React, {useEffect} from 'react';
import Category from "../../Components/Category/Category.jsx";

import './menu.scss'
import {Col, Row} from "antd";

import category_img_1 from '../../assets/category_1.png'
import category_img_2 from '../../assets/category_2.png'
import category_img_3 from '../../assets/category_3.png'
import category_img_4 from '../../assets/category_4.png'
import {useSelector} from "react-redux";

const style = {
    // background: '#0092ff',
    padding: '8px 0',
};


const Menu = () => {

    const language = useSelector(state => state.language)
    const category = useSelector(state => state.category)

    useEffect(() => {

    }, [category]);

    return (
        <>
            <Category/>
            <div className="menu_list">
                {category === null ?
                    <Row className="menu_items" gutter={[16, 24]}>
                        <Col className="gutter-row" span={12}>
                            <a href='#'>
                                <div className='menu_item'>
                                    <img src={category_img_1} alt=""/>
                                    <a className="button" href='#'>STARTERS & SOUPS</a>
                                </div>
                            </a>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <a href='#'>
                                <div className='menu_item'>
                                    <img src={category_img_2} alt=""/>
                                    <a className="button" href='#'>SANDWICHES & SALADS</a>
                                </div>
                            </a>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <a href='#'>
                                <div className='menu_item'>
                                    <img src={category_img_3} alt=""/>
                                    <a className="button" href='#'>COFFEE & LEMONADES</a>
                                </div>
                            </a>
                        </Col>
                        <Col className="gutter-row" span={12}>
                            <a href='#'>
                                <div className='menu_item'>
                                    <img src={category_img_4} alt=""/>
                                    <a className="button" href='#'>DESSERTS</a>
                                </div>
                            </a>
                        </Col>
                    </Row>
                    :
                    <></>
                }


            </div>
        </>
    );
};

export default Menu;