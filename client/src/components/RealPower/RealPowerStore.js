import { makeAutoObservable ,autorun,runInAction} from "mobx"
import TestnetService from '../../Service/TestnetService'
import {createBalanceOfPower,round} from '../RealTraiding/Account/create'
import {toJS} from 'mobx'
import {info} from './info'
import macd from 'macd'

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
    interval = '1m'
    MACD = {MACD:0,histogram:0,signal:0}
    allCandles = []
    status = ''
    info = []
    balance = 0
    count = 0
    countPercent = 0
    currentBofP = 0
    candle = {open:0,close:0,high:0,low:0,}
    position = {balance:0,fee:0,deposit:0,price:0,marga:0,coin:0,risk:0,slideMoney:0,profit:0,side:'',takeProfit:0,stopLoss:0,slide:0}
    balanceOfPower = 0
    toggle = false
    shoulder = 15
    riskPercent = 3.5
    slide = 2
    coef = 3.2
    constructor() {
        makeAutoObservable(this)
        autorun(()=>{this.fetchAccount();this.fetchCandle();this.fetchTicker()})
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
    
    fetchTicker = async () => {
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

    fetchCandle = async () => {
        const symbol = this.symbol.toLowerCase()
        const ws = new WebSocket(`wss://stream.binancefuture.com/ws/${symbol}@kline_${this.interval}`)
            ws.onmessage = (e) => {
                const data = JSON.parse(e.data)
                this.setCandle(data)
            };
    }
    fetchAllCandles = async () => {
        const data = { symbol: this.symbol,interval:this.interval,limit:150 }
        const candles = await TestnetService.getAllCandles(data)
        return newClose(candles)
    }
    createOrder = async (side,indicator) => {
        this.setStatus(info.openLimit)
        const balance = Number(getDepoUSDT(await TestnetService.balance()))
        const oldDepo = +(balance/100).toFixed(2)
        const price = side === 'BUY'? Number(this.ask): Number(this.bid)
        let oldMarga = +(oldDepo * this.shoulder).toFixed(2)
        let coin = round((oldMarga / price),4)
        const fee = ((price * coin) * 0.04)/100 * 2
        const depo = +((price*coin)/this.shoulder).toFixed(2)
        let marga = +(depo * this.shoulder).toFixed(2)
        let risk = round(((depo * this.riskPercent / 100)-fee),3)
        let slide = round((depo * this.slide / 100),3)
        let profit = round((risk*this.coef),3)
        
        // const tpB = round((marga + profit) / coin,3)
        // const stlB = round((marga - profit) / coin,3) //TUT
        // const tpS = round((marga - risk) / coin,3) //TUT
        // const stlS = round((marga + risk) / coin,3)
        const points = createBalanceOfPower(side,price,coin,profit,risk,slide)
        this.setPosition({
            balance:balance,
            fee:fee,
            deposit:depo,
            price:price,
            marga:marga ,
            coin:coin,
            risk:risk,
            MACD:indicator.MACD[149],
            signal:indicator.signal[149],
            histogram:indicator.histogram[149],
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
            type:'LIMIT',
            quantity:coin,
            price:price,
            timeInForce: 'GTC'
        }
        await TestnetService.order(order) // ORDER OFF =====================
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
            price:this.position.stopLoss, 
        }
        this.setStatus(info.openPosition)
        TestnetService.order(orderProfit)
        await TestnetService.order(orderStop)
    }

    check = async () => {
        if(!this.toggle)return
        if(this.status === info.openLimit||this.status === info.openPosition)return 
        const candles = await this.fetchAllCandles()
        if(!candles.length)return
        const indicator = macd(candles,121,71,50)
       
        if(this.MACD.histogram<0&&indicator.histogram[149]>0&&indicator.MACD[149]>indicator.signal[149]){
            this.createOrder('BUY',indicator)
        }else if(this.MACD.histogram>0&&indicator.histogram[149]<0&&indicator.MACD[149]<indicator.signal[149]){
            this.createOrder('SELL',indicator)
        }
    }

    restart = async () => {
        await TestnetService.deleteOrders({symbol:this.symbol})
        this.setStatus(info.empty)
        const balance = Number(getDepoUSDT(await TestnetService.balance()))
        this.setCountPercent(this.countPercent+calc(this.balance,balance))

        const candles = await this.fetchAllCandles()
        if(!candles.length)return
        const macdArr = macd(candles,121,71,50)
        this.setMACD({MACD:macdArr.MACD[149],histogram:macdArr.histogram[149],signal:macdArr.signal[149]})

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
    setBalanceOfPower = async () => {
        const candles = await this.fetchAllCandles()
        if(!candles.length)return
        const macdArr = macd(candles,121,71,50)

        const balance = Number(getDepoUSDT(await TestnetService.balance()))
        this.setBalance(balance)
        this.setMACD({MACD:macdArr.MACD[149],histogram:macdArr.histogram[149],signal:macdArr.signal[149]})
        
        runInAction(()=>{
            this.toggle = true
        })
        checkInterval = setInterval(()=>{
            this.check()
        },60000) //300000
    }

    checkOrders =  async () => {
        const orders = await TestnetService.allOrders()
        if(orders.length !== 2){
            await TestnetService.deleteOrders({symbol:this.symbol})
            this.createProfitOrders()
        }
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
    setMACD = (macd) => {
        this.MACD = macd
    }



}
export default new RealPowerStore()