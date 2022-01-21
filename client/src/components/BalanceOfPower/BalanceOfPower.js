import React,{useState} from 'react'
import Binance from 'binance-api-node'
import BalanceOfPowerStore from './BalanceOfPowerStore'
import {observer}from 'mobx-react'
import {BalanceOfPowerPoint} from './BalanceOfPowerPoint'
import './BalanceOfPower.scss'
import TestnetService from '../../Service/TestnetService'

export  const BalanceOfPower = observer(() => {
    const client = Binance()
    const {deposit,setDeposit} = BalanceOfPowerStore
    const [candles,setCandels] = useState([])
    const [info,setInfo] =useState([])
    const [plus,setPlus]=useState(0)
    const [all,setAll]=useState(0)

    const test = async () => {
        try{
            if(!candles.length){
                const res = await client.candles({ symbol: 'BTCUSDT',interval:'5m',limit:1000 })//limit:1000
                BalanceOfPowerPoint(res,deposit,setDeposit,setInfo,setAll,setPlus)
                setCandels(res)
                TestnetService.balance()
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
                            <span>Сглаживание {el.slideRisk.toFixed(4)}</span>
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