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

export default function dealerData({}: Props): ReactElement {
	
	const [getDealersData, setDealersData] = useState([])
	const [stateMain, dispatchMain] = useReducer(main.reducer, main.initState);	 
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);
	const [getModalState, setModalState] = useState(0); // 1 Add, 2 Edit, 3 delete
	
	const [getDealerName, setDealerName] = useState("");
	const [getDealerTel, setDealerTel] = useState("");
	
	const [getpublicKey, setpublicKey] = useState("");
	
	const columns = [
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
		  
		},
		{
			title: "Action",
			key: "action",
			align: 'center',
			render: (values: string, record: any) => {
				return 	<Space size="middle">
							<Button type="primary" shape="circle" icon={<EditOutlined  />} size={"small"} onClick={() => modalEditDealer(record.key)} />
							<Button type="danger" shape="circle" icon={<DeleteOutlined  />} size={"small"} onClick={() => removeModal(record.key)}  />
						</Space>;
			},
		},
	];
	
	
	const checkPosition = () => {
		if (stateMain?.user.position < positionNeed &&  typeof window !== "undefined") 
			window.location.href = "/"
	}
		
	
	// Modal Function

	const removeModal = async (key) => {
		
		async function callRemoveApi(){
			await Axios({ 
				url: `http://127.0.0.1:2222/rest_api/dealers/removeDealers/${key}`,
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
				await callRemoveApi()
			},
		});
	}
	
	const modalEditDealer = async (key) => {
		setModalState(2)
		setIsModalVisible(true);
		const dealerDetail = await getDealerDetail(key)
		setDealerName(dealerDetail.name)
		setDealerTel(dealerDetail.tel)
		
		setpublicKey(key)
	}
	
	const modalAdd = () => {
		return (
		 <>
			{/* Modal */}
			<Modal title="Add Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} confirmLoading={confirmLoading}>
				<Input
				  name={"name"}
				  addonAfter={"Name"}
				  placeholder="Dealers Name"
				  defaultValue={""}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={22}
				/>
				<Input
				  name={"tel"}
				  addonAfter={"Telephone Number"}
				  placeholder="Enter Telephone Number"
				  defaultValue={""}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={12}
				/>
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
				  name={"name"}
				  addonAfter={"Name"}
				  placeholder="Dealers Name"
				  value={getDealerName}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={22}
				/>
				<Input
				  name={"tel"}
				  addonAfter={"Telephone Number"}
				  placeholder="Enter Telephone Number"
				  value={getDealerTel}
				  style={{ width: "100%", marginTop: "10px" }}
				  onChange={onChange}
				  maxLength={12}
				/>
			</Modal>
		 </>
		)
	}
	
	const handleOk = async () => {
		setConfirmLoading(true)
		Axios({ 
			url: `http://127.0.0.1:2222/rest_api/dealers/addDealers`,
			method: "PUT",
			data: {
				name: getDealerName,
				tel: getDealerTel
			},
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
			url: `http://127.0.0.1:2222/rest_api/dealers/editDealers`,
			method: "PUT",
			data: {
				key: getpublicKey,
				name: getDealerName, 
				tel: getDealerTel
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
	
	
		
	const onChange = (val) => {
		const data = val.target
		if(data.name === "name")
			setDealerName(data.value)
		else if(data.name === "tel")
			setDealerTel(data.value)
			
    }
	
	const showModalAddDealers = () => {
		setModalState(1)
		setIsModalVisible(true);
	}
	
	const getDealerDetail = async (name) =>  {
		let dealerDetail = []
		await Axios({ //getEmployeeDetail
			url: `http://127.0.0.1:2222/rest_api/dealers/getDealersDetail/${name}`,
			method: "GET",
		})
		.then((res) => {
			const data = res.data.data
			dealerDetail = data
		})
		.catch((err) => {
			console.log(err)
		});
		return dealerDetail
	}

	
	useEffect(() => { //getAllDealer		
        Axios({
            url: `http://127.0.0.1:2222/rest_api/dealers/getAllDealer`,
            method: "GET",
        })
        .then((res) => {
            const result = res.data.data
			const arrayResult = []
			result.sort();
			
			async function loopCheck(){
				for (const item of result) {
					const asnycResult = await getDealerDetail(item)
					if(asnycResult !== null)
					{
						arrayResult.push({
							name: asnycResult.name,
							tel: asnycResult.tel,
							key: item
							
						})
					}
				}
				
				setDealersData(arrayResult);	
			}
			loopCheck();
        })
        .catch((err) => {
            console.log(err)
        });
    }, [getDealersData])
	
	
    return (
        <>	
		{checkPosition()}
        <Layout_Body>
			 <Row gutter={16} justify={'end'}>
				 <Col span={3}>
					<Button type="primary" size="medium" onClick={() => showModalAddDealers()}>
					  Add Dealers
					</Button>
				</Col>
			</Row>
            <Row gutter={16} justify={'center'} align={'middle'}>
                <Col span={24}>
                    <Table columns={columns} dataSource={getDealersData} pagination={{ defaultCurrent: 1, size:"small", defaultPageSize:10, showSizeChanger: false }}/>
                </Col>
            </Row>
        </Layout_Body>
			{(getModalState == 1) ? (modalAdd()) : ("")}
			{(getModalState == 2) ? (modalEdit()) : ("")}
		</>
    )
}
