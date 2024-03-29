import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../../Config.jsx';
import { useSelector } from 'react-redux';

function Translate({ keyWord }) {
    const [translatedData, setTranslatedData] = useState(null);
    const language = useSelector((state) => state.language);

    console.log(language)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.post(
                    `${url}/api/v1/admin/webAppTranslate`,
                    { id_response: keyWord, language },
                    { withCredentials: true }
                );
                setTranslatedData(data);
            } catch (error) {
                console.error('Error fetching translation:', error);
            }
        };

        fetchData();
    }, [keyWord, language]);

    if (translatedData === null) {
        return null;
    }

    return <div>{translatedData}</div>;
}

export default Translate;
