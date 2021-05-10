
import { Menu } from 'antd'
import { Header } from 'antd/lib/layout/layout'
import Link from 'antd/lib/typography/Link'
import { useRouter } from 'next/dist/client/router'
import React, { ReactElement, useState } from 'react'


interface Props {
    
}

export default function Header_Body({}: Props): ReactElement {
    const [menuState, setmenuState] = useState("1")
    const router = useRouter()
    const goto = (page,keys) =>{
        setmenuState(keys)
        router.push(page)
    }

    return (
        <Header>
            <Menu theme="dark" mode="horizontal" selectedKeys={[menuState]}>
                <Menu.Item 
                onClick={(e) => {goto("/tracking", "1")}} key="1">
                    Tracking Data
                </Menu.Item>
                <Menu.Item 
                onClick={(e) => {goto("/cost", "2")}} key="2">
                    Cost Data
                </Menu.Item>
                <Menu.Item key="3">
                    ซัมมารั่ว
                </Menu.Item>
            </Menu>
        </Header>
    )
}
