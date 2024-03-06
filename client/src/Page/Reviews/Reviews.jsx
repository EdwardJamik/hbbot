import React, {useState} from 'react';
import background from "../../assets/img.png";
import Translate from "../../Components/Translate/Translate.jsx";
import './reviews.scss'
import {Button, Flex, message, Rate} from "antd";
import TextArea from "antd/es/input/TextArea.js";
import axios from "axios";
import {url} from "../../Config.jsx";
import {useSelector} from "react-redux";
import copy from 'clipboard-copy';

const Reviews = () => {
    const [value, setValue] = useState(0);
    const [isReview, setReview] = useState('');
    const [isModal, setModal] = useState(false);
    const chat_id = useSelector((state) => state.chat_id);

    const tg = window.Telegram.WebApp;
    const language = useSelector(state => state.language)

   const handleCopyToClipboard = async () => {
       copy(isReview);
       const {data} = await axios.post(
           `${url}/api/v1/admin/webAppTranslate`,
           {id_response: 'success_copy_alert', language},
           {withCredentials: true}
       );
       message.success(data)
   };

    const sendReviews = async () => {
            if (value >= 4 && isModal || value < 4) {
                const {data} = await axios.post(
                    `${url}/api/v1/admin/sendReviewUser`,
                    {review_text: isReview, chat_id, review_star: value},
                    {withCredentials: true}
                );

                if (data.access)
                    tg.close();
                else
                    message.warning(data.eMessage)
            } else {
                setModal(true)
            }
    }

    return (
        <>
            <div className='reviews_container' style={{
                background: `url(${background})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
                <div className="title">
                    <Translate keyWord='reviews_title_text'/>
                </div>
                <p><Translate keyWord='reviews_description_text'/></p>
            </div>
            <div className='rateContainer'>
                <Flex className='rate_stars' gap="middle" vertical>
                    <Rate onChange={setValue} allowClear={false} value={value}/>
                </Flex>
                    <div className={'feedback_form open'}>
                        <h4><Translate keyWord='reviews_problem_text'/></h4>
                        <TextArea value={isReview} onChange={(e)=>{setReview(e.target.value)}} rows={4} placeholder="maxLength is 6" maxLength={600} />
                    </div>
                <Button className='rate_answer' onClick={()=>{sendReviews()}}><Translate keyWord='reviews_send_text'/></Button>
            </div>

            <div className={`googleReview ${isModal ? 'open' : ''}`}>
                <div className='container'>
                    <h4><Translate keyWord='reviews_share_google_text'/></h4>
                    <Button className='copyReviews' onClick={() => handleCopyToClipboard()} style={{display:'block',margin:'10px auto 0', background:'none'}}>Скопировать мой отзыв</Button>
                    <div className='buttons'>
                        <button className='decline' onClick={()=>sendReviews()}><Translate keyWord='reviews_share_google_decline'/></button>
                        <a className='accept' target='_blank' href='https://www.google.com/maps/place/Hookah+Lounge+Hubble+Bubble/@25.9250542,-80.1429944,15.75z/data=!4m8!3m7!1s0x88d9ad0bbc9ecbcf:0x24cd9eee3383fe19!8m2!3d25.9295097!4d-80.134796!9m1!1b1!16s%2Fg%2F11r9vglsw3?entry=ttu'><Translate keyWord='reviews_share_google_confirm'/></a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Reviews;