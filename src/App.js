import React, { Component } from 'react';
import './App.css';
import './reset.css';
import * as artifact from './contracts/RedPacket'

import 'antd/dist/antd.css'
import { Modal, Button, Layout, Input, InputNumber } from 'antd'
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
            getAllpacket: [1, 2],
            sendModal: false,
            sendStep: 0,
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

    getPacketstruct = async () => {
        let tron = 1000000
        let result_0 = await this.contract.getPacketstruct(1).call()
        console.log(result_0)
        this.setState({ getPacketstructAddress: result_0[1] })
        this.setState({ getPacketstructTime: JSON.parse(result_0[2]) })
        this.setState({ getPacketstructMoney: JSON.parse(result_0[3]) / tron })
        this.setState({ getPacketstructAllcount: JSON.parse(result_0[4]) })
        this.setState({ getPacketstructCount: JSON.parse(result_0[5]) })
        this.setState({ getPacketstructAve: String(result_0[6]) })
        this.setState({ getPacketstructCrypto: String(result_0[7]) })
        this.setState({ getPacketstructFinish: String(result_0[8]) })
        // this.setState({getPacketstructRecords:JSON.parse(result_0[9])})
        this.setState({ getPacketstructBalance: JSON.parse(result_0[10]) / tron })
        this.setState({ getPacketstructContent: result_0[11] })
    };

    //获取记录信息
    getRecord = async () => {
        let tron = 1000000
        let result_0 = await this.contract.getRecord(1).call()
        console.log(result_0)
        this.setState({ getRecordId: JSON.parse(result_0[0]) })
        this.setState({ getRecordOwner: result_0[1] })
        this.setState({ getRecordTime: JSON.parse(result_0[2]) })
        this.setState({ getRecordMoney: (JSON.parse(result_0[3]) / tron) })
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
        this.setState({ getAllpacket: packet })
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
        // this.getAllpacket()
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
                                <li>
                                    <div className='p-img'></div>
                                    <p></p>
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
                                <p className='send-btn' onClick={this.sendStep2}>塞钱进红包!</p>
                            </div>
                    }
                </Modal>
            </div>


        );
    }

}

export default App;
