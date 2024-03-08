import React from 'react';

import './category.scss'

import background from '../../assets/img.png'
import {useSelector} from "react-redux";
import Translate from "../Translate/Translate.jsx";
import {Link} from "react-router-dom";

const Category = ({id,visible}) => {

    return (
        <div className='category_container' style={{
            background: `url(${background})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="title">
                {!id ? <Translate keyWord='main_menu_text'/> : <Translate keyWord='menu_product_text'/>}
            </div>
            <a href={'/book'} className="book_a_table"><Translate keyWord='book_a_table'/></a>
            {visible ? <a href='/' className="back_to_menu"></a> : <></>}

        </div>
    );
};

export default Category;