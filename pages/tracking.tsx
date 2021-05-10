/*import { Card, Col, Row } from 'antd'
import React, { ReactElement, useEffect, useState } from 'react'
import Layout_Body from '../components/Layout'
import Axios from 'axios';
import { useDispatch, useSelector } from 'react-redux'
import Meta from 'antd/lib/card/Meta';
import { useRouter } from 'next/dist/client/router';

interface Props {
    
}

export default function tracking({}: Props): ReactElement {
    const authenReducer = useSelector(({authenReducer}) => authenReducer)
    const [valueTracking, setvalueTracking] = useState([])
    const routers = useRouter()

    const gotoTracking = (companyId:any) =>{
        routers.push('/productdata')
    }

    useEffect(() => {
        Axios({
            url: `http://kdxr.xyz:7777/tracking_api/tracking/GetTracking`,
            data: {UserID : authenReducer.user ? authenReducer.user.uid : 0},
            method: "PUT",
        })
        .then((res) => {
            console.log(res.data)   
            const result = res.data.data
            const arrayResult = []
            for (const key in result) {
                if (Object.prototype.hasOwnProperty.call(result, key)) {
                    const element = result[key];
                    arrayResult.push(
                        <>
                        <Col span={16} xs={2} sm={4} md={6} lg={8} xl={10} xxl={12}>
                            <Card hoverable title="Company Name is Here !!" bordered={true} onClick={() => gotoTracking(element[0].company_data.id)} >
                                <b style={{textAlign: 'center'}}>{element[0].company_data.name}</b>
                            </Card>
                        </Col>
                        </>
                    )
                }
            }    
            setvalueTracking(arrayResult)         
        })
        .catch((err) => {
            console.log(err)
        });
    }, null)

    return (
        <Layout_Body>
            <Row gutter={24} justify='space-between' align='middle'>
                {valueTracking}
            </Row>
        </Layout_Body>
    )
}
*/