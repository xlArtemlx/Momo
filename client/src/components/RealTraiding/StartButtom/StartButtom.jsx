import React,{useEffect} from 'react'
import orderStore from '../OrderBook/orderStore'
import { observer } from 'mobx-react';
import TestnetService from '../../../Service/TestnetService'
import axios from 'axios';

//{symbol: "BTCUSDT",side:'BUY',type:'LIMIT',quantity:0.001,price:57000,timeInForce: 'GTC'}
//{ symbol : "BTCUSDT",side : 'SELL', positionSide : 'LONG', type : 'STOP_MARKET',timeInForce : 'GTC',quantity : 0.001,stopPrice : 560000}
//{symbol : "BTCUSDT",leverage:20}

export const StartButtom  = observer(() => {


    const {account,fetchAccount} = orderStore
    useEffect(()=>{
        fetchAccount()
    },[])
    const {balances,positions}= account

    const set = async () => {
        try {
            TestnetService.order({symbol: "BTCUSDT",side:'BUY',type:'LIMIT',quantity:0.001,price:57000,timeInForce: 'GTC'})
        
           
        } catch(e){
            console.log(e)
        }
    } 
    return(
        <>
        {/* <button onClick={set}>
            Knopka
        </button> */}
        </>
    )
});