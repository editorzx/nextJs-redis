import { Button, Col, Form, Input, Row } from 'antd'
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

interface Props {
    
}

export default function index({}: Props): ReactElement {


    return (
        <Layout_Body>
            Index
        </Layout_Body>
    )
}
