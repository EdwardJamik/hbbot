import { useState } from "react";

import {
  Row,
  Col,
  Card,
  Button,
  message, Input,
} from "antd";
import {url} from "../Config.jsx";
import axios from "axios";


function Profile() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);

  const changeAdminData = async () => {

    const {data} = await axios.post(
        `${url}/api/v1/updatedAdminData`,
        {username, password},
        {withCredentials: true}
    );

    if (data.success) {
      setUsername("")
      setPassword("")
      message.success(data.message)
    } else {
      message.warning(data.message)
    }
  }


  return (
    <>
      <Row gutter={[24, 0]}>
        <Col span={24} md={24} className="mb-24 ">
          <Card
              bordered={false}
              className="header-solid h-full justify-content-center d-flex flex-column"
              title={<h6 className="font-semibold m-0">Смена доступов в админ панель</h6>}
          >
            <form>
              <div className="mb-3" style={{marginBottom: '10px'}}>
                <label htmlFor="email" className="form-label">Username</label>
                <Input type="email" value={username} onChange={(e) => {
                  setUsername(e.target.value)
                }} className="form-control" id="email"/>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <Input type="password" value={password} onChange={(e) => {
                  setPassword(e.target.value)
                }} className="form-control" id="password"/>
              </div>
              <Button style={{width:'100%', marginTop:'10px'}} key="save" className="button_continue" onClick={()=>changeAdminData()}>
                Изменить
              </Button>
            </form>
          </Card>
        </Col>
      </Row>

    </>
  );
}

export default Profile;
