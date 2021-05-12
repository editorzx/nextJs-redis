import { Layout, Menu } from 'antd';
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
	TransactionOutlined,
	RadarChartOutlined,
  } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux'
import action from '../redux/actions'
import Maincontext, * as main from "../contexts/main-context";
import { useHistory } from 'react-router-dom';
import { useRouter, withRouter } from 'next/router'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckSquare, faCoffee, faHome } from '@fortawesome/free-solid-svg-icons'

const { Header, Sider, Content } = Layout;

interface Props {
    
}

export default function LeftMenu({}: Props): ReactElement {
    const [state, setstate] = useState(false)
    const Routers = useRouter()
    //const dispatch = useDispatch()
	const history = useHistory()
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
	const [getMenuSelected, setMenuSelected] = useState("")
	
	const menuItems = [
	  { key: '1', label: 'หน้าแรก', path: '/', icon: <FontAwesomeIcon icon={faHome} />, positionNeed: 1 },
	  { key: '2', label: 'จัดการพนักงาน', path: '/employee', icon: <UserOutlined />, positionNeed: 3},
	  { key: '3', label: 'จัดการรายการสินค้า', path: '/productdata', icon: <UploadOutlined />, positionNeed: 3 },
	  { key: '4', label: 'บันทึกการโอนสินค้า', path: '/tranferpd', icon: <TransactionOutlined />, positionNeed: 3 },
	  { key: '5', label: 'จัดการบริษัทคู่ค้า', path: '/dealersdata', icon: <RadarChartOutlined />, positionNeed: 3 },
	  { key: '6', label: 'ขายสินค้า', path: '/sellproduct', icon: <MenuFoldOutlined />, positionNeed: 1 },
	]
	
    const Goto = (pages) => {
        Routers.push(pages)
    }

    const Logout_FN = async () => {
        const confirm_sure = await confirm('ต้องการออกจากระบบ?')
        if(confirm_sure)
        {
           // dispatch(action.clear())
			localStorage.clear();
			dispatchMain({ type: "clearUser" });
            alert("Log out")
			window.location.reload(false);
        }
    }
	
	useEffect(() => {
		const pathName = Routers.pathname
		for(const item in menuItems){
			if(pathName == menuItems[item].path){
				setMenuSelected(menuItems[item].key)
			}
		}
	}, [Routers.pathname])

    return (
        <Sider breakpoint={"xxl"} trigger={true} collapsible collapsed={state}>
            <div className="logo" >
				{process.env.NEXT_PUBLIC_TITLE_PROJECT}
            </div>
            <Menu theme="dark" mode="inline" selectedKeys={[getMenuSelected]}>
				
				{menuItems.map((item) => (
					Number(stateMain.user.position) >= Number(item.positionNeed) ? (
						<Menu.Item key={item.key} onClick={(e) => Goto(item.path)} icon={item.icon}>
							{item.label}
						</Menu.Item>
					) : (<></>)
				))}
				<Menu.Item key="99" onClick={(e) => Logout_FN()} icon={<UploadOutlined />}>
                    Logout
                </Menu.Item>
            </Menu>
        </Sider>
      
    )
}
