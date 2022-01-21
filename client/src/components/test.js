import React,{useState} from 'react'
import Binance from 'binance-api-node'
import Store from './store'
import {average}from '../utils.js/average'
import {observer}from 'mobx-react'
import {SMA,DEMA} from 'trading-signals';
import Big from 'big.js';
import moment from 'moment'
import './test.scss'

export const Test = observer(() => {
    const {deposit,setDeposit,fastMA,slowMA,riskPercent,timeFrame,setSlowMA,setFastMA,setRisk,setTimeFrame,setStartTime,startTime} = Store
    const [result,setResult] =useState({
        buy:0,
        sell:0,
        good:0,
        bad:0
    })
    const [info,setInfo] =useState([])
    const client = Binance()
   
    const getEMA = (a,r) => a.reduce((p,n,i) => i ? p.concat(2*n/(r+1) + p[p.length-1]*(r-1)/(r+1)) : p, [a[0]])
    const getDEMA = (arr,r) => {
        const dema = new DEMA(r);
        return arr.map((el,ind)=>{
        dema.update(new Big(el));
        if(ind < r){
            return el
        }
        return Number(dema.getResult().valueOf())

    })}
    const getSMA = (arr,r) => {
        const sma = new SMA(r);
        return arr.map((el,ind)=>{
        sma.update(new Big(el));
        if(ind < r){
            return el
        }
        return Number(sma.getResult().valueOf())

    })}
    

    const findPoint = (arr,start) => { 
        const averageArr = average(arr)
        const five = getSMA(averageArr,fastMA) //getEMA(averageArr,5)
        const ten = getSMA(averageArr,slowMA)//getEMA(averageArr,10)
        const shoulder = 10
        const now = moment().unix()
     

        let newDeposit = deposit
        let diff = 0
        let toggle = false
        let price = 0
        let risk = 0
        let profit = 0
        
        let marga = 0                   
        let coin = 0 

        let position = 'BUY'
        let resultBuy = 0
        let resultSell = 0
        let resultGood = 0
        let resultBad = 0
        let newInfo = []
    
        for(let i = 0; i < arr.length;i++){
            if(i>=10){
                if(!toggle){
                    if(i === 10){diff = five[i] - ten[i]}
                    if(diff >= 0){
                        if(five[i] - ten[i]<-1){
                            toggle = true
                            position = 'BUY'
                            price = arr[i].open
                            marga = newDeposit * shoulder
                            coin = marga / arr[i].open 
                            
                            risk = newDeposit * riskPercent / 100
                            profit = newDeposit * (riskPercent*3) / 100

                            resultBuy = resultBuy+1
                        }
                    }else if(diff < 0) {
                        if(five[i] - ten[i]>1){
                            toggle = true
                            position = 'SELL'
                            price = arr[i].open
                            marga = newDeposit * shoulder
                            coin = marga / arr[i].open 
                            
                            risk = newDeposit * riskPercent / 100
                            profit = newDeposit * (riskPercent*3) / 100

                            resultSell = resultSell+1
                        }
                    }
                }else if(toggle){
                    // const res = await client.prices({ symbol: 'BTCUSDT'})
                    // const price = Number(res.BTCUSDT)
                   
                    if(position === 'BUY'){
                        const takeProfit = (marga + profit) / coin
                        const stopLoss = (marga - risk) / coin
                        if(Number(arr[i].open)>=takeProfit||Number(arr[i].high)>=takeProfit||Number(arr[i].low)>=takeProfit||Number(arr[i].close)>=takeProfit){
                            newDeposit=newDeposit+profit
                            toggle = false
                            diff = five[i] - ten[i]
                            resultGood = resultGood+1
                            newInfo.push({
                                    open:Number(arr[i].open),
                                    close:Number(arr[i].close),
                                    high:Number(arr[i].high),
                                    low:Number(arr[i].low),
                                    state:'TakeProfit',
                                    way:'BUY',
                                    takeProfit:takeProfit,
                                    stopLoss:stopLoss,
                                    price:price
                                }) 
                        } else if(Number(arr[i].open)<=stopLoss||Number(arr[i].high)<=stopLoss||Number(arr[i].low)<=stopLoss||Number(arr[i].close)<=stopLoss){
                            newDeposit=newDeposit-risk
                            toggle = false
                            diff = five[i] - ten[i]
                            resultBad = resultBad+1
                            newInfo.push({
                                open:Number(arr[i].open),
                                close:Number(arr[i].close),
                                high:Number(arr[i].high),
                                low:Number(arr[i].low),
                                state:'StopLoss',
                                way:'BUY',
                                takeProfit:takeProfit,
                                stopLoss:stopLoss,
                                price:price
                            }) 
                        }

                    } else if(position === 'SELL'){
                        const takeProfit = (marga - profit) / coin
                        const stopLoss = (marga + risk) / coin
                        if(Number(arr[i].open)<=takeProfit||Number(arr[i].high)<=takeProfit||Number(arr[i].low)<=takeProfit||Number(arr[i].close)<=takeProfit){
                            newDeposit = newDeposit+profit
                            toggle = false
                            diff = five[i] - ten[i]
                            resultGood = resultGood+1
                            newInfo.push({
                                open:Number(arr[i].open),
                                close:Number(arr[i].close),
                                high:Number(arr[i].high),
                                low:Number(arr[i].low),
                                state:'TakeProfit',
                                way:'SELL',
                                takeProfit:takeProfit,
                                stopLoss:stopLoss,
                                price:price
                            }) 
                        } else if(Number(arr[i].open)>=stopLoss||Number(arr[i].high)>=stopLoss||Number(arr[i].low)>=stopLoss||Number(arr[i].close)>=stopLoss){
                            newDeposit = newDeposit-risk
                            toggle = false
                            diff = five[i] - ten[i]
                            resultBad = resultBad+1
                            newInfo.push({
                                open:Number(arr[i].open),
                                close:Number(arr[i].close),
                                high:Number(arr[i].high),
                                low:Number(arr[i].low),
                                state:'StopLoss',
                                way:'SELL',
                                takeProfit:takeProfit,
                                stopLoss:stopLoss,
                                price:price
                            }) 
                        }

                    }
                    
                    
                }

            }

        }
        // if(now > selectUnix(start)){
        // setDeposit(newDeposit)
        // setTimeout(()=>{
        //     miniTest(selectUnix(start))
        // },5000)
        // } else {
        setDeposit(newDeposit)
        setResult({
            buy:resultBuy,
            sell:resultSell,
            good:resultGood,
            bad:resultBad
        })
        setInfo([
            ...newInfo,
        ])
        // }
        

    }

    const handleChange = (event,type)=> {
        
        switch(type){
            case 'depo':{
                setDeposit(event.target.value)
                break;
            }
            case'risk':{
                setRisk(event.target.value)
                break;
            }
            case'fastMA':{
                setFastMA(event.target.value)
                break;
            }
            case'slowMA':{
                setSlowMA(event.target.value)
                break;
            }
            case'timeFrame':{
                setTimeFrame(event.target.value)
                break;
            }
            case'time':{
                setStartTime(event.target.value)
                break;
            }
        }
    }

    const miniTest = async (time) => {
        const start = time ? time : startTime
        try{
            const res = await client.candles({ symbol: 'BTCUSDT',interval:timeFrame,limit:1000 ,startTime:start})//limit:1000
            console.log(res)
            findPoint(res,start)

        } catch(e){
            console.log(e)
        }
    }
    const selectUnix = (start) => {
        let range = start||startTime
        let time = 0
        if(timeFrame === "1m"){
            time = range + (1000 * 60) 
        } 
        else if(timeFrame === "5m"){
            time = range + (1000 * (5*60))
        } else if(timeFrame === "30m"){
            time = range + (1000 * (30*60))
        }else if(timeFrame === "1h"){
            time = range + (1000 * (60*60))
        }
        return time
    }

    return(
        <div>
            <div>
                <button onClick={()=>miniTest()}>
                    Test
                </button>
            </div>
           <div style={{justifyContent:'center',alignItems:'center',display:'flex'}}>
            <div style={{width:400,display:'flex',flexDirection:'column'}}>
            <span>Депозит = {deposit}</span>
                <span>Число покупок = {result.buy}</span>
                <span>Число продаж = {result.sell}</span>
                <span>Число сделок закрытых по Тейк профиту = {result.good}</span>
                <span>Число сделок закрытых по Стоп Лоссу = {result.bad}</span>
            </div>
            <div className='input'>
                <div className="input-block">
                    <span>Депозит</span>
                    <input value={deposit} onChange={(e)=>handleChange(e,'depo')}/>
                </div>
                <div className="input-block">
                    <span>Риск в процентах</span>
                    <input value={riskPercent} onChange={(e)=>handleChange(e,'risk')}/>
                </div>
                <div className="input-block">
                    <span>Быстрая скользащая</span>
                    <input value={fastMA} onChange={(e)=>handleChange(e,'fastMA')}/>
                </div>
                <div className="input-block">
                    <span>Медленная скользащая</span>
                    <input value={slowMA} onChange={(e)=>handleChange(e,'slowMA')}/>
                </div>
                <div className="input-block">
                    <span>Время старта в Unix</span>
                    <input value={startTime} onChange={(e)=>handleChange(e,'time')}/>
                </div>
                <label  className="input-block">
                    Выберите Таймфрейм:
                    <select value={timeFrame} onChange={(e)=>handleChange(e,'timeFrame')}>
                        <option value="1m">1M</option>
                        <option value="5m">5M</option>
                        <option value="30m">30M</option>
                        <option value="1h">1H</option>
                    </select>
                </label>
            </div>
           </div>
           <div className='info'>
               {info.length?
                info.map((el,idx)=>{
                    return(
                        <div key={`${el.high}${idx}`} className='info-block'>
                            <span>Открытие:   {el.open}</span>
                            <span>Закрытие:   {el.close}</span>
                            <span>High:   {el.high}</span>
                            <span>Low:   {el.low}</span>
                            <span>Состояние:   {el.state}</span>
                            <span>Направление:   {el.way}</span>
                            <span>TakeProfit:   {el.takeProfit}</span>
                            <span>StopLoss:   {el.stopLoss}</span>
                            <span>Цена входа {el.price}</span>
                        </div>
                    )
                })
                :
                null
               }
           </div>
        </div>
    )
})