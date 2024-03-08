import React, {useEffect, useState} from 'react';
import Category from "../../Components/Category/Category.jsx";

import './menu.scss'
import {Col, Row} from "antd";

import {useSelector} from "react-redux";
import axios from "axios";
import {url} from "../../Config.jsx";
import {useParams} from "react-router-dom";

import Product from '../../Components/Product/Product.jsx'

const Menu = () => {
    const [isCategory, setCategory] = useState([])
    const [isProduct, setProduct] = useState([])

    const language = useSelector(state => state.language)
    const category = useSelector(state => state.category)

    const {idCategory} = useParams()

    useEffect(() => {
        if(!idCategory) {
            const getCategory = async () => {
                const {data} = await axios.get(
                    `${url}/api/v1/admin/getCategory/`,
                    {withCredentials: true}
                );

                if (data)
                    setCategory(data)
            }
            getCategory()
        } else{
            const getProduct = async () => {
                const {data} = await axios.post(
                    `${url}/api/v1/admin/getProduct`,
                    {id:idCategory},
                    {withCredentials: true}
                );

                if (data)
                    setProduct(data)
            }
            getProduct()
        }

    }, [category]);

    return (
        <>
            <Category id={idCategory} visible={idCategory}/>
            <div className="menu_list">
                <Row className="menu_items" gutter={[16, 24]}>
                {!idCategory ?
                    isCategory ?
                        isCategory.map((item,index)=>
                            <Col className="gutter-row" span={12} key={item._id}>
                                <a href={`${item._id}`}>
                                    <div className='menu_item'>
                                        <img src={`${url}/images/${item.photo}`} alt={`${item.title[language]}`}/>
                                        <a className="button" href={`${item._id}`}>{item?.title[language]}</a>
                                    </div>
                                </a>
                            </Col>
                        )
                        :
                        <></>
                    :
                    isProduct ?
                        isProduct.map((item,index)=>
                            <Product item={item} index={index}/>
                        )
                        :
                    <></>
                }
                </Row>


            </div>
        </>
    );
};

export default Menu;