import React,{useEffect,useRef} from 'react'
import AccountStore from '../Account/AccountStore';
import {observer} from 'mobx-react'

export const Ticker = observer(() => {
    const {fetchTicker,ask,bid} = AccountStore
    const ws = useRef(null);
    useEffect(()=>{
        fetchTicker(ws)
    },[])

    return(
        <div>
            <span>
                 Предложение {ask}
            </span>
            <span>
                Покупка {bid}
            </span>
        </div>
    )
});