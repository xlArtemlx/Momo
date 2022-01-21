import { makeAutoObservable, runInAction,autorun} from "mobx"
import {info} from './info'
import TestnetService from "../../../Service/TestnetService";
import {toJS} from 'mobx'
import {create} from './create'
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
function getDepoUSDT(res){
    let depo = 0;
    res.forEach(el => {
        if(el.asset === "USDT"){
            depo = el.balance
        }
    });
    return depo
}

function round (num,i) {
    const string = `${num}`
    const index = string.indexOf('.')
    if(index>0){
        return Number(string.slice(0,index+i))
    } else {
        return Number(num)
    }
}

function reMatchDepo (price,coin,shoulder) {
    return price*coin/shoulder
}
let keyInterval;
let reSendInterval;

class AccountStore {
    account = null
    order = null
    status = info.empty
    ask = 0
    bid = 0
    shoulder = 20    
    riskPercent = 1
    slide = 2
    position = {}
    limitOrder = null
    symbol = 'BTCUSDT'
    constructor() {
        makeAutoObservable(this)
        // autorun(()=>this.fetchAccount())
    }

    fetchAccount = async () => {
        const key = await TestnetService.listenkey()
        const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${key.listenKey}`);
        keyInterval = setInterval(()=>{
            TestnetService.listenkeyUpdate()
        },1800000)
        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if(data.e === info.orderTradeUpdate){
                this.check(data)
                this.setOrder(data)
            }
            if(data.e === info.accountUpdate){
                this.setAccount(data)
            }
          
        };
    }
    
    fetchTicker = async (ws) => {
        const symbol = this.symbol.toLowerCase()
        ws.current = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol}@bookTicker`)
            ws.current.onmessage = (e) => {
                let data = JSON.parse(e.data)
                runInAction(()=>{
                    this.ask = data.a
                    this.bid = data.b
                })
            };
    }

    createOrder = async () => {
        if(this.status === info.openLimit)return
        this.setStatus(info.openLimit)

        const number = getRandom(1,10)
        const balance = getDepoUSDT(await TestnetService.balance())
        const oldDepo = +(balance/1000).toFixed(2)
        const price = number<6? Number(this.ask): Number(this.bid)
        let oldMarga = +(oldDepo * this.shoulder).toFixed(2)
        let coin = round((oldMarga / price),4)
        const fee = ((price * coin) * 0.04)/100 * 2
        const depo = +((price*coin)/this.shoulder).toFixed(2)
        let marga = +(depo * this.shoulder).toFixed(2)
        let risk = round((depo * this.riskPercent / 100),3)
        let slide = round((depo * this.slide / 100),3)
        let profit = round((depo * (this.slide*3.1) / 100 + fee),3)
        
        // const tpB = round((marga + profit) / coin,3)
        // const stlB = round((marga - profit) / coin,3) //TUT
        // const tpS = round((marga - risk) / coin,3) //TUT
        // const stlS = round((marga + risk) / coin,3)
        const points = create(number,price,coin,profit,risk,slide)
        this.setPosition({
            balance:balance,
            fee:fee,
            deposit:depo,
            price:price,
            marga:marga ,
            coin:coin,
            risk:risk,
            slideMoney:slide,
            profit:profit,
            side:number<6?'BUY':'SELL',
            takeProfit:points.tiksProfit,
            stopLoss:points.tiksRisk,
            slide:points.tiksSlide
        })
        console.log(toJS(this.position))
        
        const order = {
            symbol: this.symbol,
            side: number<6?'BUY':'SELL',
            type:'LIMIT',
            quantity:coin,
            price:price,
            timeInForce: 'GTC'
        }
        await TestnetService.order(order) // ORDER OFF =====================
        
        
        // reSendInterval = setInterval(()=>{
        //     this.reStart()
        // },30000)
        
    }

    createProfitOrders = async () => {
        clearInterval(reSendInterval)
        const orders = await TestnetService.allOrders()
        if(orders.length > 1)return
        const mySide = this.position.side === 'BUY'
        const orderProfit = {
            symbol : this.symbol,
            side : mySide?'SELL':'BUY', 
            type : 'TAKE_PROFIT',
            timeInForce : 'GTC',
            quantity : this.position.coin,
            stopPrice : this.position.takeProfit,
            price:this.position.takeProfit,
        }
        const orderStop = {
            symbol : this.symbol,
            side : mySide?'SELL':'BUY', 
            type : 'STOP',
            timeInForce : 'GTC',
            quantity : this.position.coin,
            stopPrice : this.position.stopLoss,
            price:this.position.slide, 
        }
        TestnetService.order(orderProfit)
        TestnetService.order(orderStop)
        this.setStatus(info.openPosition)
    }

    reStart = async () => {
        clearInterval(reSendInterval)
        const status = await TestnetService.deleteOrders({symbol:this.symbol})
        if(status.code === 200){
            this.createOrder()
        }
    }

    check = (data) => {
        if(this.status === info.openLimit){
            if(data.o.X === 'FILLED'){
                this.createProfitOrders()
            }
        }
        if(this.status === info.openPosition){
            if(data.o.X === 'FILLED'){
                this.reStart()
            }
        }
    }

    setPosition = (position) => {
        this.position = position
    }
    setStatus = (status) => {
        this.status = status
    }
    setAccount = (account) => {
        this.account = account
    }
    setOrder = (order) => {
        this.order = order
    }



}
export default new AccountStore()

 