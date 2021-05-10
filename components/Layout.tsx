import { Layout, Menu, Row } from 'antd';
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import Footers from './Footers'
import Header from './header'
import LeftMenu from './LeftMenu'
import { useDispatch, useSelector } from 'react-redux'
import Login_pages from '../pages/login'
import Maincontext, * as main from "../contexts/main-context";
import { BrowserRouter, Link, useHistory } from "react-router-dom";

const { Sider, Content } = Layout;

interface Props {
    children: ReactNode
}


export default function Layout_Body({children}: Props): ReactElement {
    //const authenReducer = useSelector(({authenReducer}) => authenReducer)
    //const isLogin = authenReducer.user ? true : false
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
    return (
        <> 
			
			<Maincontext.Provider value={{ stateMain, dispatchMain }}>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js"></script>
            <Layout style={{ width: "100vw", height: "100vh" }}>
                {
                    stateMain.user.uid !== "" ? (
                    <>
                        
                        <LeftMenu/>
                        <Layout>
                            <Content
                            className="site-layout-background"
                            style={{
                                margin: '24px 16px',
                                padding: 24,
                                minHeight: 360
                            }}
                            >
                                {children}
                            </Content>
                            <Footers/>
                        </Layout>
                    </>
                    ):(
                        <>
                        <Login_pages/>
                        <Footers/>
                        </>
                    )
               }
                
               
            </Layout>
			</Maincontext.Provider>
			
        </>
    )
}
