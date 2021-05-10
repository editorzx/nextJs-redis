import { Footer } from 'antd/lib/layout/layout'
import React, { ReactElement } from 'react'
import { useDispatch, useSelector } from 'react-redux'
interface Props {
    
}

export default function Footers({}: Props): ReactElement {
    //const authenReducer = useSelector(({authenReducer}) => authenReducer)
    return (
        <Footer style={{ textAlign: 'center' }}>KDxR 2020</Footer>
    )
}
