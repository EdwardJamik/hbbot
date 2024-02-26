import React from 'react';
import {Button} from "antd";
import {Link} from "react-router-dom";


const bot = [
    <svg fill="#C6AC47" viewBox="0 0 24 24" width='50px' height='50px'>
            <path
                d="M21 10.975V8a2 2 0 0 0-2-2h-6V4.688c.305-.274.5-.668.5-1.11a1.5 1.5 0 0 0-3 0c0 .442.195.836.5 1.11V6H5a2 2 0 0 0-2 2v2.998l-.072.005A.999.999 0 0 0 2 12v2a1 1 0 0 0 1 1v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a1 1 0 0 0 1-1v-1.938a1.004 1.004 0 0 0-.072-.455c-.202-.488-.635-.605-.928-.632zM7 12c0-1.104.672-2 1.5-2s1.5.896 1.5 2-.672 2-1.5 2S7 13.104 7 12zm8.998 6c-1.001-.003-7.997 0-7.998 0v-2s7.001-.002 8.002 0l-.004 2zm-.498-4c-.828 0-1.5-.896-1.5-2s.672-2 1.5-2 1.5.896 1.5 2-.672 2-1.5 2z"></path>
    </svg>
]

const webApp = [
    <svg xmlns="http://www.w3.org/2000/svg" fill="#C6AC47" viewBox="0 0 24 24" width='50px' height='50px'>
            <path
                d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"></path>
    </svg>
]

const SelectedFilling = () => {
    return (
        <>
        <div className='container_Select_Filling'>
            <Link to='/filling/bot'>
                {bot}
            </Link>
            <Link to='/filling/webapp'>
                {webApp}
            </Link>
        </div>
        </>
    );
};

export default SelectedFilling;