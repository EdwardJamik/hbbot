import React, {useState} from 'react';
import axios from "axios";
import {url} from "../../Config.jsx";
import {Button, Col, Input, message, Modal, Upload} from "antd";
import {DollarOutlined, EditOutlined, UploadOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea.js";
import {useParams} from "react-router-dom";

const pencil = [
    <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        key={0}
    >
        <path
            d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
            className="fill-gray-7"
        ></path>
        <path
            d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
            className="fill-gray-7"
        ></path>
    </svg>,
];
const addbutton = [
    // eslint-disable-next-line react/jsx-key
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"  key={1}>
        <path d="M15 12L12 12M12 12L9 12M12 12L12 9M12 12L12 15" stroke="#1C274C" strokeWidth="1.5"
              strokeLinecap="round"></path>
        <path
            d="M7 3.33782C8.47087 2.48697 10.1786 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 10.1786 2.48697 8.47087 3.33782 7"
            stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round"></path>
    </svg>
]

const EditProduct = ({id,content}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isData, setData] = useState({title:{en:'',ru:'',uk:'',es:''}, category: '', price:'', description:{en:'',ru:'',uk:'',es:''}, photo:''});
    const [fileList, setFileList] = React.useState([]);
    const [newFileName, setNewFileName] = useState(null);
    const { idProduct } = useParams();
    const showModal = async () => {
        setIsModalOpen(!isModalOpen)

        if(id){
            const {data} = await axios.post(
                `${url}/api/v1/admin/getProductField`,
                {id:id},
                {withCredentials: true}
            );

            if(data.photo !== '' && data.photo !== null && data.photo){
                setNewFileName(data.photo)
                setFileList([{
                    uid: '-1',
                    name: data.photo,
                    status: 'done',
                    url: `${url}/images/${data.photo}`,
                },])
            }

            setData(data)
        }
    }

    const handleOk = async () => {

        let appsData = isData
        appsData.category = idProduct

        const {data} = await axios.post(
            `${url}/api/v1/admin/createProduct`,
            {isData:appsData,id},
            {withCredentials: true}
        );

        if (data.access) {
            setData({title:{en:'',ru:'',uk:'',es:''}, category: '', price:'', description:{en:'',ru:'',uk:'',es:''}, photo:''})
            setIsModalOpen(false);
            setFileList([])
            setNewFileName(null)
            message.success(data.access_message)
        }
        else
        {
            message.warning(data.access_message)
        }

    };

    const handleCancel = () => {
        setData({title:{en:'',ru:'',uk:'',es:''}, category: '', price:'', description:{en:'',ru:'',uk:'',es:''}, photo:''})
        setIsModalOpen(false);
        setFileList([])
        setNewFileName(null)
    };

    const props = {
        action: `${url}/upload`,
        accept: ".jpg, .jpeg, .png",
        listType: "picture",
        maxCount: 1,
        onChange(info) {
            if (info.file.status === 'done') {
                if (newFileName !== null) {
                    axios.post(`${url}/delete`, {filename: newFileName })
                        .then(() => {
                            setData(prevFormData => ({
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
                setData(prevFormData => ({
                    ...prevFormData,
                    photo: info.file.response.newFileName,
                }));
            } else if (info.file.status === 'error') {
                message.error(`Ошибка, изображение '${info.file.name}' не было загружено.`);
            }
            setFileList(info.fileList);
        },
        onRemove(file) {
            axios.post(`${url}/delete`, { filename: newFileName  })
                .then(response => {
                    setNewFileName(null)
                    setData(prevFormData => ({
                        ...prevFormData,
                        photo: '',
                    }));
                    message.success('Изображение категории удалено удалено')
                })
                .catch(error => {
                    console.error('Error deleting file:', error);
                });
        },
    };

    return (
        <>
            {content ?
                <Button onClick={() => showModal()} type="link" className="darkbtn">
                    {pencil} Изменить
                </Button>
                :
                <Button onClick={() => showModal()} style={{padding:'0', borderRadius:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>{addbutton}</Button>
            }
            <Modal
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Скасувати</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>{content ? 'Сохранить' : 'Создать'}</Button>,
                ]}
            >
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Product Name (En)"
                           value={isData.title.en}
                           onChange={(e) => setData({ ...isData, title: {...isData.title, en:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Название продукта (Ru)"
                           value={isData.title.ru}
                           onChange={(e) => setData({ ...isData, title: {...isData.title, ru:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Назва продукту (Uk)"
                           value={isData.title.uk}
                           onChange={(e) => setData({ ...isData, title: {...isData.title, uk:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <Input type='text'  placeholder="Nombre del producto (Es)"
                           value={isData.title.es}
                           onChange={(e) => setData({ ...isData, title: {...isData.title, es:e.target.value} })}
                           prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Описание</h4>
                    <TextArea type='text'  placeholder="Description (En)"
                           value={isData.description.en}
                           onChange={(e) => setData({ ...isData, description: {...isData.description, en:e.target.value} })}
                           prefix={<EditOutlined />} />
                    <TextArea style={{marginTop:'10px'}} type='text'  placeholder="Описание (Ru)"
                              value={isData.description.ru}
                              onChange={(e) => setData({ ...isData, description: {...isData.description, ru:e.target.value} })}
                              prefix={<EditOutlined />} />
                    <TextArea style={{marginTop:'10px'}} type='text'  placeholder="Опис (Uk)"
                              value={isData.description.uk}
                              onChange={(e) => setData({ ...isData, description: {...isData.description, uk:e.target.value} })}
                              prefix={<EditOutlined />} />
                    <TextArea style={{marginTop:'10px'}} type='text'  placeholder="Descripción (Es)"
                              value={isData.description.es}
                              onChange={(e) => setData({ ...isData, description: {...isData.description, es:e.target.value} })}
                              prefix={<EditOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Цена</h4>
                    <Input type='number'  placeholder="Цена"
                           value={isData.price}
                           onChange={(e) => setData({ ...isData, price: e.target.value })}
                           prefix={<DollarOutlined />} />
                </Col>
                <Col style={{margin: '7px'}}>
                    <h4>Фото</h4>
                    <Upload
                        {...props}
                        fileList={fileList}
                        style={{margin:'0 auto'}}
                    >
                        <Button style={{display:'flex',alignItems:'center',margin:'0 auto'}} icon={<UploadOutlined />}>Загрузить (Max: 1)</Button>
                    </Upload>
                </Col>

            </Modal>
        </>
    );
};

export default EditProduct;