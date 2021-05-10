import { Col, Row, Table, Tag, Space, Button, Modal, Input, Tooltip, Select, InputNumber, notification  } from 'antd'
import React, { ReactElement, ReactNode, useReducer, useContext, useEffect, useState } from 'react'
import Layout_Body from '../components/Layout'
import Axios from 'axios';
import Maincontext, * as main from "../contexts/main-context";
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

interface Props {
    
}

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const positionNeed = 3

export const getProductDetail = async (name) =>  {
	let productDetail = []
	await Axios({ //getEmployeeDetail
		url: `http://127.0.0.1:2222/rest_api/product/getProductDetail/${name}`,
		method: "GET",
	})
	.then((res2) => {
		const data = res2.data.data
		productDetail = data
	})
	.catch((err) => {
		console.log(err)
	});
	
	return productDetail
}

export default function productdata({}: Props): ReactElement {
	
	const [getProductData, setProductData] = useState([])
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [getModalState, setModalState] = useState(0); // 1 Add, 2 Edit, 3 delete
	const [priceFormatNumber, setpriceFormatNumber] = useState(1);
	const [safetyFormatNumber, setsafetyFormatNumber] = useState(1);
	const [instockFormatNumber, setinstockFormatNumber] = useState(1);
	
	const [getProductName, setProductName] = useState("");
	const [getBarcode, setBarcode] = useState("");
	const [getCatagory, setCatagory] = useState("");
	
	const [getpublicKey, setpublicKey] = useState("");
	
	const catagoryItemList = [
		{
			name: "Fruit", 
			title: "ผลไม้",
		},
		{
			name: "Food", 
			title: "อาหาร",
		},
		{
			name: "Beverages", 
			title: "น้ำดื่ม",
		},
	]
	const columns = [
		/*{
		  title: "Id",
		  dataIndex: "key",
		  key: "key",
		  align: 'center',
		},*/
		{
		  title: "Name",
		  dataIndex: "name",
		  key: "name",
		  align: 'center',
		},
		{
		  title: "Catagory",
		  dataIndex: "catagory",
		  key: "catagory",
		  align: 'center',
		  
		},
		{
		  title: "Price",
		  dataIndex: "price",
		  key: "price",
		  align: 'center',
		  render: (values: string) => {
			return <Tag color={"green"}>{values}</Tag>;
		  },
		},
		{
		  title: "Barcode",
		  dataIndex: "barcode",
		  key: "barcode",
		  align: 'center',
		  render: (values: string) => {
			return <span color={"red"}>{values != "" ? values : "ยังไม่ได้ลงทะเบียนบาร์โค๊ด"}</span>;
		  },
		},
		{
		  title: "Safety Stock",
		  dataIndex: "safety_stock",
		  key: "safety_stock",
		  align: 'center',
		  render: (values: string) => {
			return <Tag color={"red"}>{values}</Tag>;
		  },
		},
		{
		  title: "In Stock",
		  dataIndex: "in_stock",
		  key: "in_stock",
		  align: 'center',
		},
		{
			title: "Action",
			key: "action",
			align: 'center',
			render: (values: string, record: any) => {
				return 	<Space size="middle">
							{/*<a>แก้ไข {record.key}</a>*/}
							<Button type="primary" shape="circle" icon={<EditOutlined  />} size={"small"} onClick={() => modalEditProduct(record.key)} />
							<Button type="danger" shape="circle" icon={<DeleteOutlined  />} size={"small"} onClick={() => removeModal(record.key)}  />
						</Space>;
			},
		},
	];
	
	
	const checkPosition = () => {
		if (stateMain?.user.position < positionNeed &&  typeof window !== "undefined") 
			window.location.href = "/"
	}
		
	//Notification
	const showNotification = async(key, name, value) => {
		notification.info({
		  message: `แจ้งเตือนสินค้า`,
		  description: `${name} กำลังจะหมดขนาดนี้อยู่ในคลังเพียง ${value} ชิ้น`,
		  placement : 'bottomRight',
		});
	}
	
	// Modal Function

	const removeModal = async (key) => {
		
		async function callRemoveApi(){
			await Axios({ 
				url: `http://127.0.0.1:2222/rest_api/product/removeProduct/${key}`,
				method: "GET",
			})
			.then((res) => {
				if(res.data.data.status == "ok"){
					Modal.success({
						title: 'แจ้งเตือนข้อมูล',
						content: 'ลบเรียบร้อย',
						okText: 'ยืนยัน',
					});
				}
			})
			.catch((err) => {
				console.log(err)
			});
		}
		
		Modal.confirm({
			title: 'แจ้งเตือนข้อมูล',
			content: 'ยืนยันการลบใช่หรือไม่ ?',
			okText: 'ยืนยัน',
			cancelText: 'ยกเลิก',
			async onOk() {
				setProductData([])
				await callRemoveApi()
			},
		});
	}
	
	const modalEditProduct = async (key) => {
		setModalState(2)
		setIsModalVisible(true);
		const productDetail = await getProductDetail(key)
		setProductName(productDetail.name)
		setCatagory(productDetail.catagory)
		setpriceFormatNumber(productDetail.price)
		setBarcode(productDetail.barcode)
		setsafetyFormatNumber(productDetail.safety_stock)
		setinstockFormatNumber(productDetail.in_stock)
		
		setpublicKey(key)
	}
	
	const modalAdd = () => {
		return (
		 <>
			{/* Modal */}
			<Modal title="Add Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
				<Input
					placeholder="Enter product name"
					prefix={<MinusOutlined className="site-form-item-icon" />}
					name="product"
					defaultValue={""}
					onChange={onChange}
					suffix={
						<Tooltip title="Product name">
						<InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
						</Tooltip>
					}
				/>
				<br />
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
				{catagoryItemList.map((value) => {
					return <Option value={value.name}>{value.title}</Option>
				  })
				}
				</Select>
				<br />
				<Input
				  name={"price"}
				  suffix={"฿"}
				  placeholder="Enter price"
				  value={priceFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
				<Input
				  name={"barcode"}
				  addonAfter={"Barcode Tag"}
				  placeholder="Enter Barcode"
				  defaultValue={""}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={12}
				/>
				<Input
				  name={"safety"}
				  addonAfter={"Safety"}
				  placeholder="Enter safety stock"
				  value={safetyFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
				<Input
				  name={"instock"}
				  addonAfter={"In Stock"}
				  placeholder="Enter In stock"
				  value={instockFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
			</Modal>
		 </>
		)
	}
	
	const modalEdit = () => {
		return (
		 <>
			{/* Modal */}
			<Modal title="Edit Modal" visible={isModalVisible} onOk={handleEditOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
				<Input
					placeholder="Enter product name"
					prefix={<MinusOutlined className="site-form-item-icon" />}
					name="product"
					value={getProductName}
					onChange={onChange}
					suffix={
						<Tooltip title="Product name">
						<InfoCircleOutlined style={{ color: 'rgba(0,0,0,.45)' }} />
						</Tooltip>
					}
				/>
				<br />
				<Select
					showSearch
					style={{ width: "100%", marginTop: "10px" }}
					placeholder="Select Catagory"
					optionFilterProp="children"
					onChange={selectChange}
					value={getCatagory}
					filterOption={(input, option) =>
					  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
					}
				>
				{catagoryItemList.map((value) => {
					return <Option value={value.name}>{value.title}</Option>
				  })
				}
				</Select>
				<br />
				<Input
				  name={"price"}
				  suffix={"฿"}
				  placeholder="Enter price"
				  value={priceFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
				<Input
				  name={"barcode"}
				  addonAfter={"Barcode Tag"}
				  placeholder="Enter Barcode"
				  value={getBarcode}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={12}
				/>
				<Input
				  name={"safety"}
				  addonAfter={"Safety"}
				  placeholder="Enter safety stock"
				  value={safetyFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
				<Input
				  name={"instock"}
				  addonAfter={"In Stock"}
				  placeholder="Enter In stock"
				  value={instockFormatNumber}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={numberChange}
				/>
				<br />
			</Modal>
		 </>
		)
	}
	
	const handleOk = async () => {
		setConfirmLoading(true)
		const param = {
			name: getProductName, 
			catagory: getCatagory, 
			price: priceFormatNumber, 
			barcode: getBarcode, 
			safetyStock: safetyFormatNumber, 
			inStock: instockFormatNumber
		}
		Axios({ 
			url: `http://127.0.0.1:2222/rest_api/product/addProduct`,
			method: "PUT",
			data: param,
		})
		.then((res) => {
			setConfirmLoading(false)
			setIsModalVisible(false)
			setModalState(0)
			if(res.data.data.status == "ok"){
				Modal.success({
					title: 'แจ้งเตือนข้อมูล',
					content: 'เพิ่มรายการเรียบร้อย',
					okText: 'ยืนยัน',
				});
			}
		})
		.catch((err) => {
			console.log(err)
		});
    };
	
	const handleEditOk = async () => {
		setConfirmLoading(true)
		Axios({ 
			url: `http://127.0.0.1:2222/rest_api/product/editProduct`,
			method: "PUT",
			data: {
				key: getpublicKey,
				name: getProductName, 
				catagory: getCatagory, 
				price: priceFormatNumber, 
				barcode: getBarcode, 
				safetyStock: safetyFormatNumber, 
				inStock: instockFormatNumber
			},
		})
		.then((res) => {
			setConfirmLoading(false)
			setIsModalVisible(false)
			setModalState(0)
			if(res.data.data.status == "ok"){
				Modal.success({
					title: 'แจ้งเตือนข้อมูล',
					content: 'แก้ไขข้อมูลของ ' +res.data.data.name,
					okText: 'ยืนยัน',
				});
			}
		})
		.catch((err) => {
			console.log(err)
		});
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
	
	
	
	const numberChange = (val) => {
		const { value, name } = val.target;
		const reg = /^-?\d*(\.\d*)?$/;
		if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
		  if(name === "price")
			setpriceFormatNumber(Number(value))
		  else if(name === "safety")
			setsafetyFormatNumber(Number(value))
		  else if(name === "instock")
			setinstockFormatNumber(Number(value))
		}
    }
	
	const selectChange = (val) => {
		setCatagory(val)
    }
	
	const onChange = (val) => {
		const data = val.target
		if(data.name === "product")
			setProductName(data.value)
		else if(data.name === "barcode")
			setBarcode(data.value)
			
    }
	
	const showModalAddProduct = () => {
		setModalState(1)
		setIsModalVisible(true);
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
						catagory: asnycResult.catagory.toUpperCase(),
						price: asnycResult.price,
						barcode: asnycResult.barcode,
						safety_stock: asnycResult.safety_stock,
						in_stock: asnycResult.in_stock,
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
	
	const alertFunc = () => {
		useEffect(() => {
			Axios({
				url: `http://127.0.0.1:2222/rest_api/product/getAllProduct`,
				method: "GET",
			})
			.then((res) => {
				const result = res.data.data
				result.sort();
				
				async function loopCheck(){
					for (const item of result) {
						const asnycResult = await getProductDetail(item)
						if(asnycResult.in_stock < asnycResult.safety_stock)
						  showNotification(item, asnycResult.name, asnycResult.in_stock)
					}
				}
				loopCheck();
			})
			.catch((err) => {
				console.log(err)
			});
		}, [])
	}
	
    return (
        <>	
		{checkPosition()}
		{alertFunc()}
        <Layout_Body>
			 <Row gutter={16} justify={'end'}>
				 <Col span={3}>
					<Button type="primary" size="medium" onClick={() => showModalAddProduct()}>
					  Add Product
					</Button>
				</Col>
			</Row>
            <Row gutter={16} justify={'center'} align={'middle'}>
                <Col span={24}>
                    <Table columns={columns} dataSource={getProductData} pagination={{ defaultCurrent: 1, size:"small", defaultPageSize:10, showSizeChanger: false }}/>
                </Col>
            </Row>
        </Layout_Body>
			{(getModalState == 1) ? (modalAdd()) : ("")}
			{(getModalState == 2) ? (modalEdit()) : ("")}
		</>
    )
}
