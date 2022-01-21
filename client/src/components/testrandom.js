import React,{useState} from 'react'
import Binance from 'binance-api-node'
import Store from './store'
import {observer}from 'mobx-react'
import {point} from './point'
import {BalanceOfPowerPoint} from '../components/BalanceOfPower/BalanceOfPowerPoint'
import TestnetService from '../Service/TestnetService'
import './test.scss'
import moment from 'moment'

export  const TestRandom = observer(() => {
    const client = Binance()
    const {deposit,setDeposit} = Store
    const [candles,setCandels] = useState([])
    const [info,setInfo] =useState([])
    const [plus,setPlus]=useState(0)
    const [all,setAll]=useState(0)

    const createArr = async (period) => {
        let newArr = []
        const unix = moment().unix()

        for(let i = period;i >= 0;i--){
            console.log('work')
            const a = i * 1000 * 60
            const unixms = (unix - a) * 1000
            const res = await client.futuresCandles({ symbol: 'BTCUSDT',interval:'1m',limit:1000, startTime:unixms, })
            newArr = [...newArr,...res]
        }

        return newArr
    }

    const test = async () => {
        try{
            if(!candles.length){
                const res = await createArr(10)
                BalanceOfPowerPoint(res,deposit,setDeposit,setInfo,setAll,setPlus)
                setCandels(res)
            } else {
                BalanceOfPowerPoint(candles,deposit,setDeposit,setInfo,setAll,setPlus)
            }
            

        } catch(e){
            console.log(e)
        }

    }
    return (
    <div>
        <button onClick={()=>test()}>
            Test
        </button>
        <button onClick={()=>TestnetService.getAllCandles()}>
            Candles
        </button>
        <span>
            Депозит: {+(deposit).toFixed(2)},
            Процент: {+((plus*100)/all).toFixed(2)||0}
        </span>
        <div className='info'>
               {info.length?
                info.map((el,idx)=>{
                    const color = el.toggle? el.position === 'SELL'? 'red':'green': 'yellow'
                    return(
                        <div key={`${el.high}${idx}`} className='info-block' style={{backgroundColor:color}}>
                            <span>Depo:   {el.newDeposit}</span>
                            <span>Открытие:   {el.open}</span>
                            <span>Закрытие:   {el.close}</span>
                            <span>High:   {el.high}</span>
                            <span>Low:   {el.low}</span>
                            <span>Направление:   {el.position}</span>
                            <span>TakeProfit:   {el.takeProfit}</span>
                            <span>StopLoss:   {el.stopLoss}</span>
                            <span>Цена входа {el.price}</span>
                            <span>Переключатель {el.toggle?"ВКЛ":"ВЫКЛ"}</span>
                            <span>Позиция в монетах {el.coins}</span>
                            <span>Риск {el.risk}</span>
                            <span>Комиссия {el.fee}</span>
                            <span>Рассчитаный профит {el.profit}</span>
                            <span>Маржа {el.marga}</span>
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