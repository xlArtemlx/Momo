import { makeAutoObservable ,autorun,runInAction} from "mobx"
import TestnetService from '../../Service/TestnetService'
import {createBalanceOfPower,round} from '../RealTraiding/Account/create'
import {toJS} from 'mobx'
import {info} from './info'
import {bolindger} from './bolindger';

import {checkTime} from './utils'

function getDepoUSDT(res){
    let depo = 0;
    res.forEach(el => {
        if(el.asset === "USDT"){
            depo = el.balance
        }
    });
    return depo
}

function calc(oldB,newB) {
    if(oldB > newB){
        return 0
    } else {
        return 1
    }

}
function newClose(arr){
    if(!arr||!arr.length) return []
    const newArr = []
    arr.forEach((el)=>{
        newArr.push(Number(el[4]))
    })
    return newArr
}

//balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
let keyInterval ;
let checkInterval ;
class RealPowerStore {
    ask = 0
    bid = 0
    symbol = 'BTCUSDT'
    interval = '30m'
    period = 10
    allCandles = []
    status = ''
    info = []
    isTraiding = false
    balance = 0
    count = 0
    countPercent = 0
    currentBofP = 0
    candle = {open:0,close:0,high:0,low:0,}
    position = {balance:0,fee:0,deposit:0,price:0,marga:0,coin:0,risk:0,slideMoney:0,profit:0,side:'',takeProfit:0,stopLoss:0,slide:0}
    balanceOfPower = 0
    toggle = false
    shoulder = 3
    riskPercent = 2
    slide = 2
    coef = 3.5

    constructor() {
        makeAutoObservable(this)
        autorun(()=>{this.fetchAccount();this.socketCandle();this.socketTicker()})
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
                if(data.o.X === 'FILLED'){
                    if(this.status === info.openLimit){
                        this.createProfitOrders()
                    }else if(this.status === info.openPosition){
                        this.restart()
                    }
                }
            }
            if(data.e === info.accountUpdate){
                
            }
          
        };
    }
    
    socketTicker = async () => {
        const symbol = this.symbol.toLowerCase()
        const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol}@bookTicker`)
            ws.onmessage = (e) => {
                let data = JSON.parse(e.data)
                runInAction(()=>{
                    this.ask = data.a
                    this.bid = data.b
                })
            };
    }

    socketCandle = async () => {
        const symbol = this.symbol.toLowerCase()
        const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol}@kline_${this.interval}`)
            ws.onmessage = (e) => {
                const data = JSON.parse(e.data)
                this.setCandle(data)
                this.check()
            };
    }
    fetchAllCandles = async () => {
        const data = {symbol: this.symbol, interval: this.interval, limit: this.period + 1}
        const candles = await TestnetService.getAllCandles(data)
        return newClose(candles)
    }
    createOrder = async (side) => {
       setTimeout(async () => { // setTimeout need becouse status fails to change
        this.setStatus(info.openLimit)
        const balance = Number(getDepoUSDT(await TestnetService.balance()))
        const oldDepo = +(balance/10).toFixed(2)
        const price = side === 'BUY'? Number(this.ask): Number(this.bid)
        let oldMarga = +(oldDepo * this.shoulder).toFixed(2)
        let coin = round((oldMarga / price),4)
        const fee = ((price * coin) * 0.04)/100 * 2
        const depo = +((price*coin)/this.shoulder).toFixed(2)
        let marga = +(depo * this.shoulder).toFixed(2)
        let risk = round(((depo * this.riskPercent / 100)+fee),3)
        let slide = round((depo * this.slide / 100),3)
        let profit = round((risk*this.coef),3)
        
        const points = createBalanceOfPower(side,price,coin,profit,risk,slide)
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
            side:side,
            takeProfit:points.tiksProfit,
            stopLoss:points.tiksRisk,
            slide:points.tiksSlide
        })
        this.setInfo([...this.info,this.position])
        console.log(toJS(this.position))
        
        const order = {
            symbol: this.symbol,
            side: side,
            type: 'LIMIT',
            quantity: coin,
            price: price,
            timeInForce: 'GTC'
        }

        await TestnetService.order(order)
        
       }, 1000)
    }

    createProfitOrders = async () => {
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
            price: this.position.stopLoss, 
        }
        this.setStatus(info.openPosition)

        TestnetService.order(orderProfit)
        TestnetService.order(orderStop)
    }

    check = async () => {
        if(!checkTime()) return
        if(!this.isTraiding) return

        if(this.status === info.openLimit||this.status === info.openPosition) return
        const candles = await this.fetchAllCandles()
        if(!candles.length)return
        candles.pop()
        const {upper, lower} = bolindger(candles, this.period)
        console.log(upper, lower, candles[candles.length-1])
        if(candles[candles.length-1] < lower){
            this.createOrder('BUY')
        }else if(candles[candles.length-1] > upper){
            this.createOrder('SELL')
        }

    }

    restart = async () => {
        await TestnetService.deleteOrders({symbol:this.symbol})
        this.setStatus(info.empty)
        const balance = Number(getDepoUSDT(await TestnetService.balance()))
        this.setCountPercent(this.countPercent+calc(this.balance,balance))
        this.setCount(this.count+1)
        this.setBalance(Number(balance))
    }
    setCandle = (data) => {
        this.candle = {
            open:Number(data.k.o),
            close:Number(data.k.c),
            high:Number(data.k.h),
            low:Number(data.k.l),
        }
    }
    startTraiding = async () => {
        try {
            const balance = Number(getDepoUSDT(await TestnetService.balance()))
            this.setBalance(balance)
            this.setIsTraiding(true)
        } catch(e){
            console.log(e)
        }
    }

    checkOrders =  async () => {
        const orders = await TestnetService.allOrders()
        if(orders.length !== 2){
            await TestnetService.deleteOrders({symbol:this.symbol})
            this.createProfitOrders()
        }
    }
    setIsTraiding = (isTraiding) => {
        this.isTraiding = isTraiding
    }
    stopTraiding = () => {
        clearInterval(checkInterval)
    }
    setPosition = (position) => {
        this.position = position
    }
    setStatus = (status) => {
        this.status = status
    }
    setInfo = (info) =>{
        this.info = info
    }
    setToggle = () => {
        this.toggle = false
    }
    setBalance = (balance) => {
        this.balance = balance
    }
    setCount = (count) => {
        this.count = count
    }
    setCountPercent = (percent) => {
        this.countPercent = Number(percent)
    }
    setCurrentBofP = (BofP) => {
        this.currentBofP = BofP
    }

}
export default new RealPowerStore()