import { Button, Col, Form, Input, Row } from 'antd'
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import Layout_Body from '../components/Layout'
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import Sider from 'antd/lib/layout/Sider';
import SubMenu from 'antd/lib/menu/SubMenu';
import { Content } from 'antd/lib/layout/layout';
import { useDispatch, useSelector } from 'react-redux'
import action from '../redux/actions'
import Axios from 'axios';
import { useRouter } from 'next/dist/client/router';
import { useHistory } from 'react-router-dom';

import Maincontext, * as main from "../contexts/main-context";

interface Props {
    
}

export default function Login_pages({}: Props): ReactElement {
    //const dispatch = useDispatch()
    const routers = useRouter()
	const history = useHistory()
	const { stateMain, dispatchMain } = useContext(Maincontext);
    const onFinish = (values) => {
        Axios({
            url: `http://127.0.0.1:2222/rest_api/employee/getEmployeeDetail/${values.uid}`,
            data: {id : values.uid},
            method: "GET",
        })
        .then((res) => {
            
            if(res.data.data == null)
                alert("Denied")
            else{
				const data = res.data.data
                /*dispatch(action.login({
                    tel: data.tel, 
                    name: data.name,
                    uid: data.code,
                    position: data.position
                }))*/
				dispatchMain && dispatchMain({type: 'setUser', payload: {
					tel: data.tel, 
                    name: data.name,
                    uid: data.code,
                    position: data.position
				}})
				localStorage.setItem("user", 
					JSON.stringify({
						tel: data.tel, 
						name: data.name,
						uid: data.code,
						position: data.position
					})
				)
				//console.log(stateMain?.uid.name)
				//routers.push("/")
				window.location.href = "/"
            }
                
        })
        .catch((err) => {
            console.log(err)
            alert("Login Failed")
        });
    };

    return (
        <div style={{width: '100vw', minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>  
            <div>
                <Form
                name="LOGINGIN"
                onFinish={onFinish}
                >
                <Form.Item
                    label="UID"
                    name="uid"
                    rules={[{ required: true, message: 'Please input your uid !' }]}
                >
                    <Input />
                </Form.Item>


                <Form.Item >
                    <Button type="primary" htmlType="submit"  style={{marginLeft: '6vw',marginRight: '4vw'}}>
                        Login
                    </Button>
                    <Button type="primary" onClick={() => routers.push('/register')} htmlType="button">
                        Register
                    </Button>
                </Form.Item>
                </Form>
            </div>             
        </div>
        
    )
}
