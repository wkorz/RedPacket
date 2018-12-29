import React, {Component} from 'react';
import './App.css';
import * as artifact from './contracts/RedPacket'


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
            
        }
    }

    async componentDidMount() {

        let tronWeb = window.tronWeb;
        console.log('address', tronWeb.defaultAddress.base58)
        this.setState({address: tronWeb.defaultAddress.base58});
        let address = tronWeb.address.fromHex(artifact.networks['*'].address);
        console.log(artifact.abi, artifact.networks['*'].address, address)
        this.contract = tronWeb.contract(artifact.abi, address);
        console.log(this.contract);
    }

    //获取未领取的红包列表

    //我的记录
    getUser = async () => {
        let result_0 = await this.contract.getUser().call()
        console.log(result_0)
        let usercreate = result_0[1].length
        let listcreate = []
        for(let i = 0; i < usercreate; i++) {
            listcreate.push(JSON.parse(result_0[1][i]))
        }
        let userget = result_0[2].length
        let listget = []
        for(let i = 0; i < userget; i++) {
            listget.push(JSON.parse(result_0[2][i]))
        }
        this.setState({getUserKey:JSON.parse(result_0[0])})
        this.setState({getUserCreate:listcreate.join(",")})
        this.setState({getUserGet:listget.join(",")})
    };


    //创建红包
    createPacket = async () => {
        /*
        console.log("---------------------")
        //41593c502856c44854d7a5876f0985188d5aebf6fd 为合约地址，需要替换，新地址在RedPacket.Json 的最后
        let contractInstance = await tronWeb.contract().at("41c1d236d79c56f666c843bd2d08f0c38e0adccc68");
        console.log(contractInstance)
        contractInstance["createPacketSucess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('UserAddress:',res["result"][""]);
        });
        */
        console.log("---------------------")
        let tron = 10*1000000; 
        let result_0 = await this.contract.createPacket(10, 2, true,false,"","hello").send({
            feeLimit:1000000000,
            callValue:tron,
            shouldPollResponse:true
        })
        console.log(result_0)
        this.setState({createPacket:JSON.stringify(result_0)})
    };

    //抢红包
    getPacket = async () => {
        /*
        console.log("---------------------")
        let contractInstance = await tronWeb.contract().at("41593c502856c44854d7a5876f0985188d5aebf6fd");
        console.log(contractInstance)
        contractInstance["getPacketSucess"]().watch(function(err, res) {
            console.log("error " + err);
            console.log('eventResult:',res);
            console.log("---------------------")
            console.log('UserAddress:',res["result"][""]);
        });
        */
        console.log("---------------------")
        let result_0 = await this.contract.getPacket(12,"").send()
        console.log(result_0)
        this.setState({getPacket:JSON.stringify(result_0)})
    };

    //获取红包信息

    getPacketstruct = async () => {
        let tron = 1000000
        let result_0 = await this.contract.getPacketstruct(14).call()
        console.log(result_0)
        this.setState({getPacketstructAddress:result_0[1]})
        this.setState({getPacketstructTime:JSON.parse(result_0[2])})
        this.setState({getPacketstructMoney:JSON.parse(result_0[3]) / tron})
        this.setState({getPacketstructAllcount:JSON.parse(result_0[4])})
        this.setState({getPacketstructCount:JSON.parse(result_0[5])})
        this.setState({getPacketstructAve:String(result_0[6])})
        this.setState({getPacketstructCrypto:String(result_0[7])})
        this.setState({getPacketstructFinish:String(result_0[8])})
        //this.setState({getPacketstructRecords:JSON.parse(result_0[9])})
        this.setState({getPacketstructBalance:JSON.parse(result_0[10]) / tron})
        this.setState({getPacketstructContent:result_0[11]})
    };

    //获取记录信息
    getRecord = async () => {
        let tron = 1000000
        let result_0 = await this.contract.getRecord(1).call()
        console.log(result_0)
        this.setState({getRecordId:JSON.parse(result_0[0])})
        this.setState({getRecordOwner:result_0[1]})
        this.setState({getRecordTime:JSON.parse(result_0[2])})
        this.setState({getRecordMoney:(JSON.parse(result_0[3]) / tron)})
    };

    //获取所有红包key
    getPacketkey = async () => {
        let result_0 = await this.contract.getPacketkey().call()
        console.log(result_0)
        this.setState({getPacketkey:JSON.parse(result_0)})
    };


    //获取已抢光的红包key
    getFinishkey = async () => {
        let result_0 = await this.contract.getFinishkey().call()
        console.log(result_0)
        let finishpacket = [];
        for(let i = 1; i< result_0;i++){
            let packet = JSON.parse(await this.contract.getFinishpacket(i).call())
            finishpacket.push(packet)
        }
        this.setState({getFinishkey:JSON.parse(result_0)})
    };

    //获取有效的红包key
    getAllpacket = async () => {
        let result_0 = JSON.parse(await this.contract.getPacketkey().call())
        console.log(result_0)
        let packet = [];
        for(let i = 1; i< result_0;i++){
            packet.push(i);
        }
        let result_1 = JSON.parse(await this.contract.getFinishkey().call())
        console.log(result_1)
        for(let i = 1; i< result_1;i++){
            let j = JSON.parse(await this.contract.getFinishpacket(i).call())
            packet[j-1] = -1;
        }
        this.setState({getAllpacket:packet.join(",")})
    };


    render() {
        return (
            <div className="App">
                <div>
                    <p>current address</p>
                    <p>{this.state.address}</p>
                    <hr></hr>
                </div>

                <div>
                    <p>getPacketkey</p>
                    <p>{this.state.getPacketkey}</p>
                    <button onClick={this.getPacketkey}>getPacketkey</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getFinishkey</p>
                    <p>{this.state.getFinishkey}</p>
                    <button onClick={this.getFinishkey}>getFinishkey</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getAllpacket</p>
                    <p>{this.state.getAllpacket}</p>
                    <button onClick={this.getAllpacket}>getAllpacket</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getUser</p>
                    <p>{this.state.getUserKey}</p>
                    <p>已发的红包：{this.state.getUserCreate}</p>
                    <p>已领取的红包：{this.state.getUserGet}</p>
                    <button onClick={this.getUser}>getUser</button>
                    <hr></hr>
                </div>

                <div>
                    <p>createPacket</p>
                    <p>{this.state.createPacket}</p>
                    <button onClick={this.createPacket}>createPacket</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getPacket</p>
                    <p>{this.state.getPacket}</p>
                    <button onClick={this.getPacket}>getPacket</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getPacketstruct</p>
                    <p>{this.state.getPacketstructAddress} 发送的红包</p>
                    <p>红包祝福：{this.state.getPacketstructContent}</p>
                    <p>创建时间 {this.state.getPacketstructTime}</p>
                    <p>剩余金额 {this.state.getPacketstructBalance} / 总金额 {this.state.getPacketstructMoney}</p>
                    <p>已经领取的份数 {this.state.getPacketstructCount} / 总份数{this.state.getPacketstructAllcount}</p>
                    <p>普通红包/手气红包{this.state.getPacketstructAve}</p>
                    <p>是否需要口令{this.state.getPacketstructCrypto}</p>
                    <p>是否抢光{this.state.getPacketstructFinish}</p>
                    <p>红包记录{this.state.getPacketstructRecords}</p>
                    <button onClick={this.getPacketstruct}>getPacketstruct</button>
                    <hr></hr>
                </div>

                <div>
                    <p>getRecord</p>
                    <p>第{this.state.getRecordId}个领取</p>
                    <p>领取者：{this.state.getRecordOwner}</p>
                    <p>领取时间：{this.state.getRecordTime}</p>
                    <p>领取金额：{this.state.getRecordMoney}</p>
                    <button onClick={this.getRecord}>getRecord</button>
                    <hr></hr>
                </div>


            </div>
        );
    }
}

export default App;
