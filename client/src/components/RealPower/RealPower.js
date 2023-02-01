import React from 'react'
import RealPowerStore from './RealPowerStore'
import { observer } from 'mobx-react';
import './RealPower.scss'

export const RealPower = observer(() => {
    const {startTraiding,info,count,countPercent,balance, setIsTraiding, isTraiding} = RealPowerStore
    return(
        <div>
            <div style={{display:'flex',justifyContent:'center'}}>
                <div style={{marginBottom:'25px',marginRight:'15px'}}>
                    Депозит: {balance}
                </div>
            </div>  
            <div style={{marginBottom:'25px'}}>
                <span style={{marginRight:'25px'}} >
                   Точность: {count!==0?countPercent*100/count:0}
                </span>
            </div>
            <div style={{marginBottom:'25px'}}>
                <span style={{marginRight:'25px'}} >
                   Traiding: {isTraiding ? "ON" : "OFF"}
                </span>
            </div>
            <div >
                <button style={{marginRight:'25px'}} onClick={startTraiding}>
                    Start
                </button>
                <button onClick={() => setIsTraiding(false)}>
                    Stop
                </button>
            </div>
            <div className='info'>
               {info.length?
                info.map((el,idx)=>{
                    const color = el.position === 'SELL'? 'red':'green'
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