import React from 'react'
import { OrderBook } from '../OrderBook/OrderBook'
import { Ticker } from '../Ticker/Ticker'

export const Apps = () => {
    return (
        <>
        <Ticker/>
        <OrderBook/>
        </>
    )
}