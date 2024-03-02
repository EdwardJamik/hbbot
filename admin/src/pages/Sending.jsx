import "../assets/styles/telegramSending.css"

import SendingList from "../components/sending/SendingList.jsx";
import React from "react";
import SendingListReport from "../components/sending/SendingListReport";

export default function Sending() {
    return (
        <div className="telegram_users">
            <h3>Рассылка</h3>
            <SendingList/>
            <SendingListReport/>
        </div>
    )
}
