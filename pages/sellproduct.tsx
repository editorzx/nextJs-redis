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
	const [getPrice, setPrice] = useState(0)
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
	const [getQuantity, setQuantity] = useState(1)
	
	const handleOk = async () => {
		const nowTime = DateTime.now().toString();
        Axios({
            url: `http://127.0.0.1:2222/rest_api/sells/addSelling`,
            data: {
				product: getProductName,
				quantity: getQuantity,
				price: getPrice,
				time: nowTime,
				seller: stateMain?.user.name,
				customeruId: ""
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
						content: 'ขายสินค้าเรียบร้อย',
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
	
	
	const selectChange = (val, t) => {
		setProductName(val)
		setPrice(t["data-price"])
    }
	
	
	const numberChange = (val) => {
		const { value, name } = val.target;
		const reg = /^-?\d*(\.\d*)?$/;
		if ((!isNaN(value) && reg.test(value) && value !== "") /*|| value === '' || value === '-'*/) {
		  if(name === "quantity")
		  {
			setQuantity(Number(value))
			setPrice(Number(getPrice*value))
		  }
		}else{
			setQuantity(0)
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
						price: asnycResult.price,
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
			<Modal title="Selling Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
               <Select
					showSearch
					style={{ width: "100%", marginTop: "10px" }}
					placeholder="Select Product"
					optionFilterProp="children"
					onChange={selectChange}
					filterOption={(input, option) =>
					  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
				{getProductData.map((value) => {
					return <Option value={value.name} data-price={value.price}>{value.name}</Option>
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
				  name={"price"}
				  addonAfter={"Price"}
				  placeholder="Enter Price"
				  value={getPrice}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				  disabled={true}
				/>
            </Modal>
        </Layout_Body>
		</>
    )
}
