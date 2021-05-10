import { Col, Row, Table, Tag, Space, Button, Modal, Input, Tooltip, Select, InputNumber, notification  } from 'antd'
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import Layout_Body from '../components/Layout'
import Axios from 'axios';
import Maincontext, * as main from "../contexts/main-context";
import { useRouter, withRouter } from 'next/router'
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined,
	EditOutlined,
	DeleteOutlined,
	FileAddOutlined,
	InfoCircleOutlined,
	MinusOutlined,
  } from '@ant-design/icons';
  
import {getProductDetail} from './productdata';
import { DateTime } from "luxon";

interface Props {
    
}

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const positionNeed = 3

export default function tranferPd({}: Props): ReactElement {
	
	const [isModalVisible, setIsModalVisible] = useState(true)
	const [getProductData, setProductData] = useState([])
	const routers = useRouter()
	
	const [getProductName, setProductName] = useState("")
	const [getBranch, setBranch] = useState("")
	const [getSecondBranch, setSecondBranch] = useState("")
	const [getQuantity, setQuantity] = useState(0)
	
	const handleOk = async () => {
		const nowTime = DateTime.now().toString();
        Axios({
            url: `http://127.0.0.1:2222/rest_api/tranfers/addTranfers`,
            data: {
				product: getProductName,
				branch: getBranch,
				secondbranch: getSecondBranch,
				quantity: getQuantity,
				datetime: nowTime,
			},
            method: "PUT",
        })
        .then(async (res) => {
            if(res.data.message !== "done")
                alert("Denied")
            else{
                setIsModalVisible(false);
				if(res.data.data.status == "ok"){
					Modal.success({
						title: 'แจ้งเตือนข้อมูล',
						content: 'บันทึกข้อมูลเรียบร้อย',
						okText: 'ยืนยัน',
						onOk() {
							window.location.reload(false);
						}
					});
				}
                   
            }
                
        })
        .catch((err) => {
            console.log(err)
        });
    }

    const handleCancel = () => {
        setIsModalVisible(false);
		routers.push("/")
    }
	
	const onChange = (val) => {
        const data = val.target
        if(data.name === "branch")
            setBranch(data.value)
		else if(data.name == "secondbranch")
			setSecondBranch(data.value)
    }
	
	const selectChange = (val) => {
		setProductName(val)
    }
	
	const numberChange = (val) => {
		const { value, name } = val.target;
		const reg = /^-?\d*(\.\d*)?$/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
		  if(name === "quantity")
			setQuantity(Number(value))
		}
    }
	
	useEffect(() => { //getAllProduct		
        Axios({
            url: `http://127.0.0.1:2222/rest_api/product/getAllProduct`,
            method: "GET",
        })
        .then((res) => {
            const result = res.data.data
			const arrayResult = []
			result.sort();
			
			async function loopCheck(){
				for (const item of result) {
					const asnycResult = await getProductDetail(item)
					arrayResult.push({
						name: asnycResult.name,
						key: item,
						
					})
				}
				
				setProductData(arrayResult);	
			}
			loopCheck();
        })
        .catch((err) => {
            console.log(err)
        });
    }, [getProductData])
	
    return (
        <>	
        <Layout_Body>
			<Modal title="Tranfer Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
               <Select
					showSearch
					style={{ width: "100%", marginTop: "10px" }}
					placeholder="Select Catagory"
					optionFilterProp="children"
					onChange={selectChange}
					filterOption={(input, option) =>
					  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
				{getProductData.map((value) => {
					return <Option value={value.name}>{value.name}</Option>
				  })
				}
				</Select>
				<br />
				<Input
				  name={"quantity"}
				  addonAfter={"Quantity"}
				  placeholder="Enter Quantity"
				  value={getQuantity}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<Input
				  name={"branch"}
				  addonAfter={"Branch"}
				  placeholder="Enter Main Branch"
				  value={getBranch}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={24}
				/>
				<Input
				  name={"secondbranch"}
				  addonAfter={"Second Branch"}
				  placeholder="Enter Second Branch"
				  value={getSecondBranch}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={24}
				/>
            </Modal>
        </Layout_Body>
		</>
    )
}
