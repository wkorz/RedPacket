import React, { Component } from 'react';
import './App.css';
import './reset.css';
import * as artifact from './contracts/RedPacket'

import moment from 'moment'
import 'antd/dist/antd.css'
import { Modal, Button, Layout, Input, InputNumber, Switch, Icon } from 'antd'
const {
    Header, Footer, Sider, Content,
} = Layout

const { TextArea } = Input;

class App extends Component {

    constructor(props) {
        super(props);

        window.tronWeb.setDefaultBlock('latest');

        this.contract = null;
        this.state = {
            address: null,
            balance: null,
            contract: null,
            tokenBalance: null,
            result_0: null,
            result_1: null,
            result_2: null,
            getAllpacket: [],
            sendModal: false,
            sendStep: 0,
            detailModal: false,
            getPacketstructRecords: [],
            currentPacket: {
                recordList: [],
            },
        }
    }

    //获取未领取的红包列表

    //我的记录
    async getUser() {
        let result_0 = await this.contract.getUser().call()
        let usercreate = result_0[1].length
        let listcreate = []
        for (let i = 0; i < usercreate; i++) {
            listcreate.push(JSON.parse(result_0[1][i]))
        }
        let userget = result_0[2].length
        let listget = []
        for (let i = 0; i < userget; i++) {
            listget.push(JSON.parse(result_0[2][i]))
        }
        this.setState({ getUserKey: JSON.parse(result_0[0]) })
        this.setState({ getUserCreate: listcreate.join(",") || 0 })
        this.setState({ getUserGet: listget.join(",") || 0 })
    };


    //创建红包
    createPacket = async () => {
        let tron = 10 * 1000000;
        let result_0 = await this.contract.createPacket(10, 2, "true", "true", "tron", "hello").send({
            feeLimit: 100000000,
            callValue: tron,
            shouldPollResponse: true
        })
        console.log(result_0)
        this.setState({ createPacket: JSON.stringify(result_0) })
    };

    //抢红包
    getPacket = async () => {
        let result_0 = await this.contract.getPacket(2, "tron").send()
        console.log(result_0)
        this.setState({ getPacket: JSON.stringify(result_0) })
    };

    //获取红包信息

    getPacketstruct = async (pId) => {
        let tron = 1000000
        let result_0 = await this.contract.getPacketstruct(pId).call()
        const getPacketstructAddress = result_0[1]
        const getPacketstructTime = moment(JSON.parse(result_0[2])).format('YYYY-MM-DD HH:mm:ss')
        const getPacketstructMoney = JSON.parse(result_0[3]) / tron
        const getPacketstructAllcount = JSON.parse(result_0[4])
        const getPacketstructCount = JSON.parse(result_0[5])
        const getPacketstructAve = String(result_0[6])
        const getPacketstructCrypto = String(result_0[7])
        const getPacketstructFinish = String(result_0[8])
        const getPacketstructRecords = result_0[9]
        const getPacketstructBalance = JSON.parse(result_0[10]) / tron
        const getPacketstructContent = result_0[11]
        return {
            getPacketstructAddress,
            getPacketstructTime,
            getPacketstructMoney,
            getPacketstructAllcount,
            getPacketstructCount,
            getPacketstructAve,
            getPacketstructCrypto,
            getPacketstructFinish,
            getPacketstructRecords,
            getPacketstructBalance,
            getPacketstructContent,
        }
    };

    //获取记录信息
    getRecord = async (id) => {
        let tron = 1000000
        let result_0 = await this.contract.getRecord(id).call()
        console.log(result_0)
        return {
            getRecordId: JSON.parse(result_0[0]),
            getRecordOwner: result_0[1],
            getRecordTime: moment(JSON.parse(result_0[2])).format('MM-DD HH:mm'),
            getRecordMoney: (JSON.parse(result_0[3]) / tron).toFixed(2),
        }
    };

    //获取所有红包key
    getPacketkey = async () => {
        let result_0 = await this.contract.getPacketkey().call()
        console.log(result_0)
        this.setState({ getPacketkey: JSON.parse(result_0) })
    };


    //获取已抢光的红包key
    getFinishkey = async () => {
        let result_0 = await this.contract.getFinishkey().call()
        console.log(result_0)
        let finishpacket = [];
        for (let i = 1; i < result_0; i++) {
            let packet = JSON.parse(await this.contract.getFinishpacket(i).call())
            finishpacket.push(packet)
        }
        this.setState({ getFinishkey: JSON.parse(result_0) })
    };

    //获取有效的红包key
    getAllpacket = async () => {
        let result_0 = JSON.parse(await this.contract.getPacketkey().call())
        console.log(result_0)
        let packet = [];
        for (let i = 1; i < result_0; i++) {
            packet.push(i);
        }
        let result_1 = JSON.parse(await this.contract.getFinishkey().call())
        console.log(result_1)
        for (let i = 1; i < result_1; i++) {
            let j = JSON.parse(await this.contract.getFinishpacket(i).call())
            packet[j - 1] = -1;
        }
        let Allpacket = []
        for (let index = 0; index < packet.length; index++) {
            let pId = packet[index]
            let p = await this.getPacketstruct(pId)
            p.id = pId
            p.recordList = []
            Allpacket.push(p)
        }
        this.setState({ getAllpacket: Allpacket })
    };

    async componentDidMount() {

        let tronWeb = window.tronWeb;
        // console.log('address', tronWeb.defaultAddress.base58)
        this.setState({ address: tronWeb.defaultAddress.base58 });
        let address = tronWeb.address.fromHex(artifact.networks['*'].address);
        // console.log(artifact.abi, artifact.networks['*'].address, address)
        this.contract = tronWeb.contract(artifact.abi, address);
        console.log(this.contract);
        this.getUser()
        this.getAllpacket()
    }

    getPacketRecords = async (packet) => {
        const { getPacketstructRecords } = packet
        let reslist = []
        for (let index = 0; index < getPacketstructRecords.length; index++) {
            const id = getPacketstructRecords[index]
            const res = await this.getRecord(id)
            reslist.push(res)
        }
        packet.recordList = reslist
        return reslist
    }
    showDetail = async (packet) => {
        await this.getPacketRecords(packet)
        console.log(packet.recordList)
        this.setState({
            currentPacket: packet,
            detailModal: true,
        })
    }
    hideDetailModal = async () => {
        this.setState({
            detailModal: false,
        })
    }

    showModal = async () => {
        this.setState({
            sendModal: true,
            sendStep: 0,
        })
    }
    hideSendModal = async () => {
        this.setState({
            sendModal: false,
        })
    }
    sendStep1 = async () => {
        this.setState({
            sendStep: 1,
        })
    }
    sendStep2 = async () => {
        this.setState({
            sendStep: 2,
        })
    }



    render() {
        return (
            <div className="App">
                <div className='top'><p className='address'>{this.state.address}</p></div>
                <Layout className='layout' id='gradient'>
                    <Sider width='260' className='App-sider border-box container'>
                        <ul className='info-list'>
                            <li>我发出的 <var>{this.state.getUserCreate}</var> 个</li>
                            <li>我收到的 <var>{this.state.getUserGet}</var> 个</li>
                        </ul>
                        <div className='send-box'>
                            <div className='send-img' onClick={this.showModal}>
                                <p>发红包</p>
                            </div>
                        </div>
                    </Sider>
                    <Content className='App-content border-box container'>
                        <ul className='p-list'>
                            {this.state.getAllpacket.map((packet) => (
                                <li onClick={this.showDetail.bind(this, packet)}>
                                    <div className='p-img'></div>
                                    <p className='text'>{packet.getPacketstructContent}</p>
                                    {packet.getPacketstructCrypto ? <p className='text tip'>【口令红包】</p> : null}
                                </li>
                            ))}
                        </ul>
                    </Content>
                    {/* <Footer className='App-footer border-box container'>footer</Footer> */}
                </Layout>
                <Modal
                    visible={this.state.sendModal}
                    onCancel={this.hideSendModal}
                    footer={null}
                    className='send-modal'
                >
                    {
                        this.state.sendStep == 0 ? <div>
                            <p className='send-btn' onClick={this.sendStep1}>普通红包</p>
                            <p className='send-btn' onClick={this.sendStep2}>口令红包</p>
                        </div> :
                            <div className='step2-box'>
                                <InputNumber
                                    placeholder='总金额'
                                    precision='2'
                                    min='1'
                                ></InputNumber>
                                <InputNumber
                                    placeholder='红包个数'
                                    precision='0'
                                    min='1'
                                    max='9999'
                                ></InputNumber>
                                <TextArea
                                    placeholder='祝福语'
                                    autosize={{ minRows: 4, maxRows: 4 }}
                                ></TextArea>
                                {this.state.sendStep == 2 ?
                                    <Input placeholder='请输入口令'></Input> : null}
                                <div className='switch-box'>
                                    <Switch defaultChecked checkedChildren={<Icon type="check" />} unCheckedChildren={<Icon type="close" />}></Switch><span className='switch-text'>拼手气</span>
                                </div>
                                <p className='send-btn' onClick={this.sendStep2}>塞钱进红包!</p>
                            </div>
                    }
                </Modal>
                <Modal
                    visible={this.state.detailModal}
                    onCancel={this.hideDetailModal}
                    footer={null}
                    className='detail-modal'
                >
                    {
                        this.state.currentPacket.getPacketstructCrypto ?
                            <div>
                                <Input placeholder='请输入口令' className='command-input'></Input>
                                <p className='send-btn' onClick={this.sendStep2}>拆红包!</p>
                            </div>
                            :
                            <div>
                                <p className='text'>{this.state.currentPacket.getPacketstructContent}</p>
                                <p className='text time'>{this.state.currentPacket.getPacketstructTime}</p>
                                <p className='text left'>领取 {this.state.currentPacket.getPacketstructCount}/{this.state.currentPacket.getPacketstructAllcount}, 共<var>{this.state.currentPacket.getPacketstructMoney}</var> TRX</p>
                                <ul className='record-list'>
                                    {
                                        this.state.currentPacket.recordList.map(item => (
                                            <li>
                                                <div className='left'>
                                                    <p className='addr'>{item.getRecordOwner}</p>
                                                    <p className='time'>{item.getRecordTime}</p>
                                                </div>
                                                <p className='value'>{item.getRecordMoney} TRX</p>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                    }
                </Modal>
            </div>


        );
    }

}

export default App;
