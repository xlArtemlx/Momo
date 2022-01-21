import React, {useEffect, useState} from 'react';
import orderStore from './orderStore'

import {Orderlist} from './OrderList/OrderList';
import {useWSDepth} from '../../../hooks/use-ws-depth';
import './OrderBook.scss'
import { observer } from 'mobx-react';
import {toJS} from 'mobx'


export const OrderBook = observer(() => {
  const {ticker, orderbook, isLoadOrderbook, onAddOrderbook,fetchOrderbook,fetchDepth,book} = orderStore
  const {symbol} = ticker;

  const {
    orderbookWS,
    isWSDepthLoad,
    connectWSDepth,
    disconnectWSDepth,
  } = useWSDepth();

  const [isOrdersLoad, setOrdersLoadStatus] = useState(false);

  useEffect(()=>{
    fetchDepth()
  },[])

  // useEffect(() => {
  //   if (!isLoadOrderbook && !isWSDepthLoad) {
  //     fetchOrderbook(symbol);
  //     connectWSDepth(ticker);
  //   } else if (!isLoadOrderbook && isWSDepthLoad) {
  //     setOrdersLoadStatus(false);
  //     disconnectWSDepth();
  //     fetchOrderbook(symbol);
  //   } else if (isLoadOrderbook && isWSDepthLoad) {
  //     setOrdersLoadStatus(true);
  //   }
  // }, [isLoadOrderbook, isWSDepthLoad]);

  // useEffect(() => {
  //   if (isLoadOrderbook && isWSDepthLoad) {
  //     onAddOrderbook(orderbook, orderbookWS);
  //   }
  // }, [orderbookWS]);

  const {askDepth,bidDepth} = book
  const getData = (data) => {
  return data.map((el)=>{
    return Object.values(el)
  })  
  }
  return (
    <main className="main container">
      <h1 className="visually-hidden">Торги пары {symbol}</h1>
      <section className="orderbook">

        {bidDepth&&<Orderlist ticker={ticker} orders={getData(bidDepth)} isBids isOrdersLoad={isOrdersLoad} />}
        {askDepth&&<Orderlist ticker={ticker} orders={getData(askDepth)} isAsks isOrdersLoad={isOrdersLoad} /> }

      </section>
    </main>

  );
});