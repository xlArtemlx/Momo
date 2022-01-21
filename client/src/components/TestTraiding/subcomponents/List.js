import React,{useState,useEffect} from "react";
import './List.css'

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}
const emptyOptions = {statePrice:0,marga:0 ,coin:0 ,risk:0,profit:0,position:'BUY',takeProfit:0,stopLoss:0,}

export const List = ({price}) => {
    const [active,setActive] = useState(false)
    const [depo,setDepo] = useState(100)
    const [info,setInfo] = useState([])
    const [options,setOptions] = useState({
        statePrice:0,
        marga:0 ,
        coin:0 ,
        risk:0,
        profit:0,
        position:'BUY',
        takeProfit:0,
        stopLoss:0,
    })
    const [percent,setPercent] = useState({position:0,positive:0,negative:0})

    useEffect(()=>{
        if(!active)return
        check()
    },[price])

    const traiding = () => {
        setActive(true)
        const number = getRandom(1,10)
        const shoulder = 20
        let riskPercent = 1
        let marga = +(depo * shoulder).toFixed(2)
        let coin = +(marga / Number(price))
        
        let risk = +(depo * riskPercent / 100).toFixed(2)
        let profit = +(depo * (riskPercent*3.1) / 100).toFixed(2) 
        
        setOptions({
            statePrice:Number(price),
            marga:marga ,
            coin:coin,
            risk:risk,
            profit:profit,
            position:number<6?'BUY':'SELL',
            takeProfit:number<6?+((marga + profit) / coin).toFixed(2):+((marga - profit) / coin).toFixed(2),
            stopLoss:number<6?+((marga - risk) / coin).toFixed(2):+((marga + risk) / coin).toFixed(2),
        })
    }

    const check = () => {
        if(!active)return
        if(options.position==='BUY'){
            if(options.takeProfit<price){
                setDepo(+(depo+options.profit).toFixed(2))
                setInfo([...info,options])
                setOptions({...emptyOptions})
                setPercent({...percent,position:percent.position+1,positive:percent.positive+1})
                setActive(false)
                setTimeout(()=>traiding(),2000)
            }else if(options.stopLoss>price){
                setDepo(+(depo-options.risk).toFixed(2))
                setInfo([...info,options])
                setOptions({...emptyOptions})
                setPercent({...percent,position:percent.position+1,negative:percent.negative+1})
                setActive(false)
                setTimeout(()=>traiding(),2000)
            }

        }else if(options.position==='SELL'){
            if(options.takeProfit>price){
                setDepo(+(depo+options.profit).toFixed(2))
                setInfo([...info,options])
                setOptions({...emptyOptions})
                setPercent({...percent,position:percent.position+1,positive:percent.positive+1})
                setActive(false)
                setTimeout(()=>traiding(),2000)
            }else if(options.stopLoss<price){
                setDepo(+(depo-options.risk).toFixed(2))
                setInfo([...info,options])
                setOptions({...emptyOptions})
                setPercent({...percent,position:percent.position+1,negative:percent.negative+1})
                setActive(false)
                setTimeout(()=>traiding(),2000)
            }
        }
    }

    return(
        <div>
            <button onClick={()=>{traiding()}}>
                traiding
            </button>
            <span>
                {depo}
                Позиций:{percent.position}
                Положительные:{percent.positive}
                Негативные:{percent.negative}
                {percent.position === 0 ? null:<span>Процент:{+(100*percent.positive/percent.position).toFixed(2)}</span>}
            </span>
            <div className='info-block'>
                <span>Цена Входа:   {options.statePrice}</span>
                <span>Позиция:   {options.position}</span>
                <span>TakeProfit:   {options.takeProfit}</span>
                <span>StopLoss:   {options.stopLoss}</span>
                <span>Позиция в монетах {Math.round(options.coin*100)/100}</span>
                <span>Риск {options.risk}</span>
                <span>Рассчитаный профит {options.profit}</span>
                <span>Маржа {options.marga}</span>
            </div>
            <div className='info'>
               {info.length?
                info.map((el)=>{
                    return(
                        <div className='info-block'>
                            <span>Цена Входа:   {el.statePrice}</span>
                            <span>Позиция:   {el.position}</span>
                            <span>TakeProfit:   {el.takeProfit}</span>
                            <span>StopLoss:   {el.stopLoss}</span>
                            <span>Позиция в монетах {Math.round(el.coin*100)/100}</span>
                            <span>Риск {el.risk}</span>
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
}