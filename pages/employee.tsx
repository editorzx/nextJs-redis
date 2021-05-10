import { Col, Row, Table, Tag, Space } from 'antd'
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import Layout_Body from '../components/Layout'
import Axios from 'axios';
import Maincontext, * as main from "../contexts/main-context";

interface Props {
    
}

const { Column, ColumnGroup } = Table;

const positionNeed = 3

export default function employee({}: Props): ReactElement {
	
	const [getEmployeeData, setEmployeeData] = useState([])
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
	  
	const checkPosition = () => {
		if (stateMain?.user.position < positionNeed &&  typeof window !== "undefined") 
			window.location.href = "/"
	}
	
	const columns = [
		{
		  title: "Code",
		  dataIndex: "code",
		  key: "code",
		  align: 'center',
		},
		{
		  title: "Name",
		  dataIndex: "name",
		  key: "name",
		  align: 'center',
		},
		{
		  title: "Telephone Number",
		  dataIndex: "tel",
		  key: "tel",
		  align: 'center',
		  render: (values: string) => {
			return <Tag color={"red"}>{values}</Tag>;
		  },
		},
		{
		  title: "Position",
		  dataIndex: "position",
		  key: "position",
		  align: 'center',
		  render: (values: string) => {
			let data = ""
			switch(values){
				case 1: data = "พนักงาน"; break;
				case 2: data = "ผู้จัดการ"; break;
				case 3: data = "เจ้าของกิจการ"; break;
				default: data = "ผิดพลาด"
			}
			return <span color={"blue"}>{data}</span>;
		  },
		},
		{
		  title: "Sell Amount",
		  dataIndex: "sell_amount",
		  key: "sell_amount",
		  align: 'center',
		},
	];
	
	const getEmployeeDetail = async (empID) =>  {
		let employeeDetail = []
		await Axios({ //getEmployeeDetail
			url: `http://127.0.0.1:2222/rest_api/employee/getEmployeeDetail/${empID}`,
			method: "GET",
		})
		.then((res2) => {
			const data = res2.data.data
			employeeDetail =  {
				key: data.code,
				code: data.code,
				name: data.name,
				tel: data.tel,
				position: data.position,
				sell_amount: data.sell_amount
			}
		})
		.catch((err) => {
			console.log(err)
		});
		return employeeDetail
	}
	
	useEffect(() => { //getAllEmployee		
        Axios({
            url: `http://127.0.0.1:2222/rest_api/employee/getAllEmployee`,
            method: "GET",
        })
        .then((res) => {
            const result = res.data.data
			const arrayResult = []
			result.sort();
			
			async function loopCheck(){
				for (const item of result) {
					const employeeId = item.split('_')[1]
					const asnycResult = await getEmployeeDetail(employeeId)
					arrayResult.push(asnycResult)
				}
				setEmployeeData(arrayResult);	
			}
			loopCheck();
        })
        .catch((err) => {
            console.log(err)
        });
    }, [])
	
    return (
		<>	
		{checkPosition()}
        <Layout_Body>
            <Row gutter={16} justify={'center'} align={'middle'}>
                <Col span={24}>
                    <Table columns={columns} dataSource={getEmployeeData} pagination={{ defaultCurrent: 1, size:"small", defaultPageSize:5, showSizeChanger: false }}/>
                </Col>
            </Row>
        </Layout_Body>
		</>
    )
}
