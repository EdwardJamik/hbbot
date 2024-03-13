import React, { useState} from 'react';
import axios from "axios";
import {url} from "../../Config";
import {Button, DatePicker, message, Select, Spin, Tabs, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import {UploadOutlined} from "@ant-design/icons";

const SendingList = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [fileList, setFileList] = React.useState([]);
    const [fileListVideo, setFileListVideo] = React.useState([]);
    const [newFileName, setNewFileName] = useState(null);
    const [newFileNameVideo, setNewFileNameVideo] = useState(null);
    const [isDate, setDate] = useState('');
    const [formData, setFormData] = useState({
        text: {en:'',uk:'',ru:'',es:''},
        date: '',
        type: [],
        button: false,
        video: null,
        photo: null,
    });

    const showModal = () => {
        setOpen(!open);
    };

    const resetFormData = () => {
        setDate('')
        setFormData({
            text: {en:'',uk:'',ru:'',es:''},
            date: '',
            type: [],
            button: false,
            video: null,
            photo: null,
        });

    };

    const acceptedIcon = [
        <svg viewBox="0 0 24 24" width='20px' height='20px' fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5163 8.93451L11.0597 14.7023L8.0959 11.8984" stroke="green" strokeWidth="2"></path>
                <path
                    d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                    stroke="green" strokeWidth="2"></path>
        </svg>
    ]

    const handleInputChange = (e) => {
        const {name, value, files} = e.target;
        if (files) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const options = [{label: 'Пользователям бота',value:'private'},{label: 'Групам/Каналам',value:'group'}];

    const handleChange = (value) => {
        setFormData({...formData, type: value})
    };

    const props = {
        action: `${url}/uploadSending`,
        accept: ".jpg, .jpeg, .png",
        listType: "picture",
        maxCount: 1,
        onChange(info) {
            if (info.file.status === 'done') {
                if (newFileName !== null) {
                    axios.post(`${url}/deleteUploadSending`, {filename: newFileName })
                        .then(() => {
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                photo: null,
                            }));
                        })
                        .catch(error => {
                            console.error('Error deleting file:', error);
                        });
                }
                message.success(`Изображение ${info.file.name} успешно загружено`);
                setNewFileName(info.file.response.newFileName);
                setFormData(prevFormData => ({
                    ...prevFormData,
                    photo: info.file.response.newFileName,
                }));
            } else if (info.file.status === 'error') {
                message.error(`Ошибка, изображение '${info.file.name}' не было загружено.`);
            }
            setFileList(info.fileList);
        },
        onRemove(file) {
            axios.post(`${url}/deleteUploadSending`, { filename: newFileName  })
                .then(response => {
                    setNewFileName(null)
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        photo: null,
                    }));
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                });
        },
    };

    const propsVideo = {
        action: `${url}/uploadSending`,
        accept:".mp4",
        maxCount:1,
        onChange(info) {
            if (info.file.status === 'done') {
                if(newFileNameVideo !== null){
                    axios.post(`${url}/deleteUploadSending`, { filename: newFileNameVideo  })
                        .then(response => {
                            setFormData(prevFormData => ({
                                ...prevFormData,
                                video: null,
                            }));
                        })
                        .catch(error => {
                            console.error('Error deleting file:', error);
                        });
                }
                message.success(`Видео ${info.file.name} успешно загружено`);
                setNewFileNameVideo(info.file.response.newFileName);

                setFormData(prevFormData => ({
                    ...prevFormData,
                    video: info.file.response.newFileName,
                }));
            } else if (info.file.status === 'error') {
                message.error(`Ошибка, видео '${info.file.name}' не загружено.`);
            }
            setFileListVideo(info.fileList);
        },
        onRemove(file) {
            axios.post(`${url}/deleteUploadSending`, { filename: newFileNameVideo  })
                .then(response => {
                    setFormData(prevFormData => ({
                        ...prevFormData,
                        video: null,
                    }));
                    setNewFileNameVideo(null)
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                });
        },
    };

    const disabledDate = (current) => {
        return current && current.isBefore(dayjs(), 'day');
    };

    const disabledHours = () => {
        const currentHour = dayjs().hour();
        return Array.from({ length: currentHour }, (_, i) => i);
    };

    const disabledMinutes = (selectedHour) => {
        if (selectedHour === dayjs().hour()) {
            const currentMinute = dayjs().minute();
            return Array.from({ length: currentMinute }, (_, i) => i);
        }
        return [];
    };

    const handleDateChange = (date) => {
        const sending_date = dayjs(date).locale('uk').format()
        setDate(date)
        setFormData({
            ...formData,
            date: sending_date,
        });
    };

    const handleUpload = async () => {
        try {
            if (formData.video !== null || formData.photo !== null || formData.text !== '') {

                if (formData.photo !== null && (formData.text.en).length <= 768 && (formData.text.ru).length <= 768 && (formData.text.uk).length <= 768 && (formData.text.es).length <= 768 || formData.video !== null && (formData.text.en).length <= 768 && (formData.text.ru).length <= 768 && (formData.text.uk).length <= 768 && (formData.text.es).length <= 768 || formData.video === null && formData.photo === null && formData.text !== '') {
                    if((formData.text.en).length || (formData.text.ru).length || (formData.text.uk).length || (formData.text.es).length) {
                        if (formData.type?.length) {
                            resetFormData()
                            setFileList([])
                            setFileListVideo([])
                            setNewFileName(null)
                            setNewFileNameVideo(null)
                            let createSeminarResponse = await axios.post(
                                `${url}/api/v1/admin/createSending`,
                                {...formData},
                                {withCredentials: true}
                            );

                            if (createSeminarResponse) {
                                message.success('Рассылку создано')
                                setLoading(false)
                                showModal()
                            }
                        } else {
                            message.warning('Выберите тип чатов для рассылки')
                        }
                    } else{
                        message.warning('Заполните текст для рассылки')
                    }

                } else {
                    setLoading(false)
                    message.warning('Рассылку с фото/видео должно иметь не больше 768 символов')
                }

            } else {
                if (!(formData.type).length) {
                    message.warning('Укажите тип пользователей для рассылки')
                } else if (formData.text === '' && formData.photo === null && formData.video === null) {
                    message.warning('Заполните текстовую форму или загрузите фото/видео для рассылки')
                }
            }

        } catch (error) {
            console.error('Произошла ошибка при загрузке файла:', error);
        }
    };

    const items = [
        {
            key: '1',
            label: <>{formData.text.en ? <div style={{display:'flex', alignItems:'center'}}><span style={{marginRight:'4px'}}>En</span>{acceptedIcon}</div> : 'En'}</>,
            children: <TextArea
                rootClassName="textarea__buttons"
                showCount
                style={{
                    height: 200,
                    resize: 'none',
                }}
                name="text"
                value={formData.text.en}
                onChange={(e)=>{setFormData({...formData,text:{...formData.text,en:e.target.value}})}}
                className="answer_textarea"
            />,
        },
        {
            key: '2',
            label: <>{formData.text.uk ? <div style={{display:'flex', alignItems:'center'}}><span style={{marginRight:'4px'}}>Uk</span>{acceptedIcon}</div> : 'Uk'}</>,
            children: <TextArea
                rootClassName="textarea__buttons"
                showCount
                style={{
                    height: 200,
                    resize: 'none',
                }}
                name="text"
                value={formData.text.uk}
                onChange={(e)=>{setFormData({...formData,text:{...formData.text,uk:e.target.value}})}}
                className="answer_textarea"
            />,
        },
        {
            key: '3',
            label: <>{formData.text.ru ? <div style={{display:'flex', alignItems:'center'}}><span style={{marginRight:'4px'}}>Ru</span>{acceptedIcon}</div> : 'Ru'}</>,
            children: <TextArea
                rootClassName="textarea__buttons"
                showCount
                style={{
                    height: 200,
                    resize: 'none',
                }}
                name="text"
                value={formData.text.ru}
                onChange={(e)=>{setFormData({...formData,text:{...formData.text,ru:e.target.value}})}}
                className="answer_textarea"
            />,
        },
        {
            key: '4',
            label: <>{formData.text.es ? <div style={{display:'flex', alignItems:'center'}}><span style={{marginRight:'4px'}}>Es</span>{acceptedIcon}</div> : 'Es'}</>,
            children: <TextArea
                rootClassName="textarea__buttons"
                showCount
                style={{
                    height: 200,
                    resize: 'none',
                }}
                name="text"
                value={formData.text.es}
                onChange={(e)=>{setFormData({...formData,text:{...formData.text,es:e.target.value}})}}
                className="answer_textarea"
            />,
        }
    ];

    return (
        <div className='modal_sendings_forms'>
            {loading && <Spin className='loading_spin'/>}
            <form className="modal_sendings_creator">
                <div>
                    <Tabs centered defaultActiveKey="1" items={items} />
                </div>
                <div>
                    <p>Дата и время рассылки</p>
                    <DatePicker
                        value={isDate}
                        showTime={{
                            format: 'HH:mm',
                            disabledHours: disabledHours,
                            disabledMinutes: disabledMinutes,
                        }}
                        changeOnBlur={true}
                        format="YYYY-MM-DD HH:mm"
                        onChange={handleDateChange}
                        disabledDate={disabledDate}/>
                </div>
                <div>
                    {!formData.photo &&
                        <>
                            <p>Відео</p>
                            <Upload
                                {...propsVideo}
                                fileList={fileListVideo}
                                style={{margin:'0 auto'}}
                            >
                                <Button style={{display:'flex',alignItems:'center',margin:'0 auto'}} icon={<UploadOutlined />}>Загрузить (Max: 1)</Button>
                            </Upload>
                        </>
                    }
                </div>
                <div>
                    {!formData.video &&
                        <>
                            <p>Фото</p>
                            <Upload
                                {...props}
                                fileList={fileList}
                                style={{margin:'0 auto'}}
                            >
                                <Button style={{display:'flex',alignItems:'center',margin:'0 auto'}} icon={<UploadOutlined />}>Загрузить (Max: 1)</Button>
                            </Upload>
                        </>
                    }
                </div>
                <div>
                    <p>Рассылка для:</p>
                    <Select
                        mode="tags"
                        style={{
                            width: '100%',
                        }}
                        id="roots"
                        placeholder="Выберите тип чатов для рассылки"
                        value={formData.type}
                        onChange={handleChange}
                        options={options}
                    />
                </div>
                <Button key="saved" type="primary" onClick={() => handleUpload()}>
                    Создать
                </Button>
            </form>
        </div>
    );
};

export default SendingList;