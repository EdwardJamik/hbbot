import React, {useEffect, useState} from 'react';
import background from "../../assets/img.png";
import Translate from "../../Components/Translate/Translate.jsx";
import {Button, Input, message, Result} from "antd";
import './book.scss'
import {url} from "../../Config.jsx";
import axios from "axios";
import {useSelector} from "react-redux";
import {useParams} from "react-router-dom";

const userGroup = [
    <svg viewBox="0 0 16 16" width='30px' height='30px' version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#a3842e">
            <rect width="16" height="16" id="icon-bound" fill="none"></rect>
            <path d="M14,12.5C14,11.837 13.737,11.201 13.268,10.732C12.799,10.263 12.163,10 11.5,10C9.447,10 6.553,10 4.5,10C3.837,10 3.201,10.263 2.732,10.732C2.263,11.201 2,11.837 2,12.5C2,14.147 2,15 2,15L14,15C14,15 14,14.147 14,12.5ZM12,6L14,6C14.53,6 15.039,6.211 15.414,6.586C15.789,6.961 16,7.47 16,8L16,11L14.663,11C14.101,9.818 12.896,9 11.5,9L10.645,9C11.476,8.267 12,7.194 12,6ZM1.337,11L0,11C0,11 0,9.392 0,8C0,7.47 0.211,6.961 0.586,6.586C0.961,6.211 1.47,6 2,6L4,6C4,7.194 4.524,8.267 5.355,9L4.5,9C3.104,9 1.899,9.817 1.337,11ZM8,3C9.656,3 11,4.344 11,6C11,7.656 9.656,9 8,9C6.344,9 5,7.656 5,6C5,4.344 6.344,3 8,3ZM4.127,4.996C4.085,4.999 4.043,5 4,5C2.896,5 2,4.104 2,3C2,1.896 2.896,1 4,1C4.954,1 5.753,1.67 5.952,2.564C5.061,3.097 4.394,3.966 4.127,4.996ZM10.048,2.564C10.247,1.67 11.046,1 12,1C13.104,1 14,1.896 14,3C14,4.104 13.104,5 12,5C11.957,5 11.915,4.999 11.873,4.996C11.606,3.966 10.939,3.097 10.048,2.564Z"></path>
    </svg>
]

const dateTime = [
    <svg fill="#a3842e" viewBox="0 0 32 32" width='30px' height='30px' version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16q0-3.232 1.28-6.208t3.392-5.12 5.12-3.392 6.208-1.28q3.264 0 6.24 1.28t5.088 3.392 3.392 5.12 1.28 6.208q0 3.264-1.28 6.208t-3.392 5.12-5.12 3.424-6.208 1.248-6.208-1.248-5.12-3.424-3.392-5.12-1.28-6.208zM4 16q0 3.264 1.6 6.048t4.384 4.352 6.016 1.6 6.016-1.6 4.384-4.352 1.6-6.048-1.6-6.016-4.384-4.352-6.016-1.632-6.016 1.632-4.384 4.352-1.6 6.016zM14.016 16v-5.984q0-0.832 0.576-1.408t1.408-0.608 1.408 0.608 0.608 1.408v4h4q0.8 0 1.408 0.576t0.576 1.408-0.576 1.44-1.408 0.576h-6.016q-0.832 0-1.408-0.576t-0.576-1.44z"></path>
    </svg>
]

const date = [
    <svg viewBox="0 0 24 24" width='30px' height='30px' fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M20 10V7C20 5.89543 19.1046 5 18 5H6C4.89543 5 4 5.89543 4 7V10M20 10V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V10M20 10H4M8 3V7M16 3V7"
                stroke="#a3842e" strokeWidth="2" strokeLinecap="round"></path>
            <rect x="6" y="12" width="3" height="3" rx="0.5" fill="#a3842e"></rect>
            <rect x="10.5" y="12" width="3" height="3" rx="0.5" fill="#a3842e"></rect>
            <rect x="15" y="12" width="3" height="3" rx="0.5" fill="#a3842e"></rect>
    </svg>
]

const userName = [
    <svg viewBox="0 -0.5 17 17" width='30px' height='30px' version="1.1" xmlns="http://www.w3.org/2000/svg"
         className="si-glyph si-glyph-badge-name" fill="#a3842e">
        <path
            d="M7.997,4.883 C7.469,4.883 7.04,4.671 7.04,3.892 L7.04,0.856 C7.04,0.075 7.469,4.54747351e-13 7.997,4.54747351e-13 C8.525,4.54747351e-13 8.953,0.075 8.953,0.856 L8.953,3.892 C8.953,4.671 8.525,4.883 7.997,4.883 L7.997,4.883 Z"
            className="si-glyph-fill"></path>
        <path
            d="M10,3.938 L10.058,4.553 C10.058,5.741 9.13649991,6.04999999 7.99949991,6.04999999 C6.86049991,6.04999999 5.936,5.741 5.936,4.553 L5.936,4 L2.047,3.938 C0.938,3.938 0.041,4.807 0.041,5.938 L0.041,12.938 C0.041,14.07 0.937,14.93 2.047,14.93 L13.955,14.93 C15.06,14.93 15.958,14.012 15.958,12.88 L15.958,6.05 C15.958,4.919 15.061,4 13.955,4 L10,3.938 Z M5.49910501,6.938 C6.32696897,6.938 7,7.62560028 7,8.47364061 C7,9.31984735 6.32696897,10.938 5.49910501,10.938 C4.67124105,10.938 4,9.31893055 4,8.47364061 C4.00089499,7.62560028 4.67213604,6.938 5.49910501,6.938 L5.49910501,6.938 Z M8.98256822,12.938 L2.00166571,12.938 C2.00166571,12.938 1.88188822,10.9507215 3.67372082,10.9507215 C4.04657655,11.5240972 4.56142656,12.0765734 5.5080551,12.0765734 C6.45661553,12.0765734 6.90674706,11.5204625 7.27863685,10.938 C9.29456926,10.9389087 8.98256822,12.938 8.98256822,12.938 L8.98256822,12.938 Z M14,12.896 L10,12.896 L10,11.896 L14,11.896 L14,12.896 L14,12.896 Z M14,10.892 L10,10.892 L10,9.892 L14,9.892 L14,10.892 L14,10.892 Z M14,8.896 L10,8.896 L10,7.896 L14,7.896 L14,8.896 L14,8.896 Z" className="si-glyph-fill"></path>
    </svg>
]

const phone = [
    <svg height="30px" width="30px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#a3842e">
        <path className="st0" d="M255.998,0.002C114.606,0.012,0.01,114.604,0,256c0.01,141.406,114.65,255.328,255.926,255.998h0.334 l0.297-0.009c27.124,0.038,49.507-8.527,64.961-22.594c15.468-14.01,23.727-33.254,23.708-52.736 c0.02-9.148-1.914-18.306-5.521-27.024c6.086-3.464,10.143-6.612,11.301-7.444c4.152-2.957,16-18.766,7.693-31.79 c-8.344-13.014-38.042-42.678-46.152-47.702c-8.086-5.015-21.598-0.124-28.105,9.426c-6.526,9.55-11.674,6.689-11.674,6.689 s-18.516-14.957-44.124-66.621c-25.607-51.694-26.263-75.454-26.263-75.454s0.833-5.847,12.388-5.263 c11.53,0.621,23.598-7.168,24.516-16.66c0.928-9.464-4.698-51.091-10-65.598c-5.316-14.516-25.062-14.65-29.928-13.138 c-4.89,1.502-55.033,13.712-59.014,66.21c-3.966,52.506,9.565,100.18,28.943,139.309c19.387,39.119,49.128,78.765,93.3,107.406 c17.89,11.598,35.058,13.1,49.493,10.67c2.483,5.54,3.718,11.291,3.746,16.985c-0.028,11.292-4.621,22.354-14.066,30.966 c-9.469,8.564-24.071,14.928-45.2,14.967l-0.516,0.009C130.797,481.96,29.387,381.09,29.397,256 c0.01-62.621,25.339-119.186,66.367-160.237c41.053-41.023,97.612-66.354,160.234-66.364c62.621,0.01,119.181,25.34,160.232,66.364 c41.033,41.052,66.354,97.606,66.373,160.237c-0.01,38.67-9.666,74.966-26.698,106.784c-9.531,17.837-21.397,34.23-35.177,48.812 c-5.569,5.905-5.301,15.206,0.594,20.776c5.894,5.578,15.205,5.32,20.784-0.584c15.54-16.46,28.937-34.976,39.712-55.139 C501.071,340.717,512,299.589,512,256C511.98,114.604,397.389,0.012,255.998,0.002z"></path>
    </svg>
]

const Book = () => {

    const [isCountPeople, setCountPeople] = useState('')
    const [isDate, setDate] = useState('')
    const [isName, setName] = useState('')
    const [isPhone, setPhone] = useState('')
    const [isTime, setTime] = useState('')
    const [isClose, setClose] = useState(false)

    const chat_id = useSelector((state) => state.chat_id);
    const language = useSelector((state) => state.language);
    const tg = window.Telegram.WebApp;

    const { id } = useParams();

    useEffect(() => {
        const getBook = async () => {
            const {data} = await axios.post(
                `${url}/api/v1/admin/getBookTable`,
                {id},
                {withCredentials: true}
            );

            if(data){
                setCountPeople(data?.count_people)
                setDate(data?.date)
                setName(data?.first_name)
                setPhone(data?.phone)
                setTime(data?.time)

                if(data?.declined || data?.accepted)
                    setClose(true)
            }
        }

        getBook()
    }, [id]);

    const sendBook = async () => {
        const {data} = await axios.post(
            `${url}/api/v1/admin/sendBookTable`,
            {count_people: isCountPeople, chat_id, language:language, date:isDate, time:isTime, first_name:isName, phone: isPhone, id:id},
            {withCredentials: true}
        );

        if(data?.access){
            tg.close()
        } else{
            message.warning(data?.eMessage)
        }
    }

    return (
        <>
            <div className='book_container' style={{
                background: `url(${background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className="title">
                    <Translate keyWord='book_title_text'/>
                </div>
            </div>
            <div className='bookContainer'>
                {isClose ?
                    <>
                        <Result
                            status="warning"
                            title={<Translate keyWord='book_not_edited_text'/>}
                        />
                    </>
                    :
                    <>
                        <div className='countPeople'>
                            <h5><Translate keyWord='book_countPeople_text'/></h5>
                            <Input className='bookInput' value={isCountPeople} onChange={(e) => {
                                setCountPeople(e.target.value)
                            }} type="number" prefix={userGroup}/>
                        </div>
                        <div className='date'>
                            <h5><Translate keyWord='bool_date_title_text'/></h5>
                            <Input
                                className='bookInput'
                                type="date"
                                prefix={date}
                                value={isDate}
                                onChange={(e) => {
                                    setDate(e.target.value)
                                }}
                            />
                        </div>
                        <div className='time'>
                            <h5><Translate keyWord='book_time_title_text'/></h5>
                            <Input className='bookInput' prefix={dateTime} type="time" value={isTime} onChange={(e) => {
                                setTime(e.target.value)
                            }}/>
                        </div>
                        <div className='time'>
                            <h5><Translate keyWord='book_name_title_text'/></h5>
                            <Input className='bookInput' prefix={userName} value={isName}
                                   onChange={(e) => setName(e.target.value)} type="text"/>
                        </div>
                        <div className='time'>
                            <h5><Translate keyWord='book_phone_title_text'/></h5>
                            <Input className='bookInput' value={isPhone} prefix={phone} type="number" onChange={(e) => {
                                setPhone(e.target.value)
                            }}/>
                        </div>
                        <Button className='rate_answer' onClick={() => {
                            sendBook()
                        }}>
                            {id ?
                                <Translate keyWord='book_update_button_text'/>
                                :
                                <Translate keyWord='book_send_button_text'/>
                            }
                        </Button>
                    </>
                }

            </div>

        </>
    );
};

export default Book;