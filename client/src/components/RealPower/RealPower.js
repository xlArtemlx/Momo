import React from 'react'
import RealPowerStore from './RealPowerStore'
import { observer } from 'mobx-react';
import './RealPower.scss'

export const RealPower = observer(() => {
    const {setBalanceOfPower,info,setToggle,count,countPercent,balance,currentBofP,MACD} = RealPowerStore
    return(
        <div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{marginBottom:'25px',marginRight:'15px'}}>
                    Депозит: {balance}
                </div>
                <div style={{marginBottom:'25px',marginRight:'15px'}}>
                    MACD: {MACD.histogram}
                </div>
            </div>  
            <div style={{marginBottom:'25px'}}>
                <span style={{marginRight:'25px'}} >
                   Точность: {count!==0?countPercent*100/count:0}
                </span>
            </div>
            <div >
                <button style={{marginRight:'25px'}} onClick={setBalanceOfPower}>
                    Start
                </button>
                <button onClick={setToggle}>
                    Stop
                </button>
            </div>
            <div className='info'>
               {info.length?
                info.map((el,idx)=>{
                    const color = el.toggle? el.position === 'SELL'? 'red':'green': 'yellow'
                    return(
                        <div key={`${el.high}${idx}`} className='info-block' style={{backgroundColor:color}}>
                            <span>Depo:   {el.balance}</span>
                            <span>TakeProfit:   {el.takeProfit}</span>
                            <span>StopLoss:   {el.stopLoss}</span>
                            <span>Цена входа {el.price}</span>
                            <span>Позиция в монетах {el.coin}</span>
                            <span>SlidePosition:   {el.slide}</span>
                            <span>Риск {el.risk}</span>
                            <span>Slide:   {el.slideMoney}</span>
                            <span>Комиссия {el.fee}</span>
                            <span>Рассчитаный профит {el.profit}</span>
                            <span>Маржа {el.marga}</span>
                            <span>MACD {el.MACD.toFixed(3)}</span>
                            <span>Histogram {el.histogram.toFixed(3)}</span>
                            <span>Signal {el.signal.toFixed(3)}</span>
                        </div>
                    )
                })
                :
                null
               }
           </div>
        </div>
    )
});