import { Button, Col, Form, Input, Modal, Row, Select } from 'antd'
import React, { ReactElement } from 'react'
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

const { Option } = Select;

interface Props {
    
}

export default function register({}: Props): ReactElement {

    const dispatch = useDispatch()
    const routers = useRouter()
    const onFinish = (values) => {
        const param = {
                Email : values.email, 
                Mobile : values.password,
                Prefix : values.prefix,
                FirstName : values.firstname,
                LastName : values.lastName,
                NickName : values.nickName
        }
        console.log(param)
        Axios({
            url: `http://kdxr.xyz:7777/tracking_api/authen/register`,
            data: param,
            method: "PUT",
        })
        .then(async (res) => {
            console.log(res.data)
            if(res.data.message !== "done")
                alert("Denied")
            else{
                await dispatch(action.login({
                    email: values.email, 
                    name: res.data.data.first_name + " " + res.data.data.last_name,
                    uid: res.data.data.id,
                    token: res.data.data.access_token
                }))

                const modal = Modal.success({
                    title: 'สมัครสมาชิกเรียบร้อย',
                    content: `ขอบคุณที่สนใจเรานะจร๊า อุอิคุคิ มุมิ.`,
                })
                setTimeout(() => {
                    modal.destroy();
                    routers.push("/")
                }, 5000)
                
            }
                
        })
        .catch((err) => {
            console.log(err)
            if(err.response.status === 401)
                alert("Login Failed")
        });
    };

    return (
        <div style={{width: '100vw', minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>  
        <div>
            <Form
            name="Register"
            onFinish={onFinish}
            >
            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your Email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: false, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>


            <Form.Item name="prefix" label="prefix" rules={[{ required: true }]}>
                <Select
                    placeholder="prefix"
                    allowClear
                >
                    <Option value="นาย">นาย</Option>
                    <Option value="นางสาว">นางสาว</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Firstname"
                name="firstname"
                rules={[{ required: true, message: 'Please input your Name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="LastName"
                name="lastName"
                rules={[{ required: true, message: 'Please input your Name!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="NickName"
                name="nickName"
                rules={[{ required: true, message: 'Please input your Name!' }]}
            >
                <Input />
            </Form.Item>


            <Form.Item >
                <Button type="primary" htmlType="submit"  style={{marginLeft: '6vw',marginRight: '4vw'}}>
                    Register
                </Button>
                <Button type="dashed" htmlType="reset">
                    Clear
                </Button>
            </Form.Item>
            </Form>
        </div>  
    </div>
    )
}
