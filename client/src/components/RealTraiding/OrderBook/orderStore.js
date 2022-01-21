import { makeAutoObservable, runInAction } from "mobx"
import { tickers } from "../../../mocks/data";
import {ApiRoute, ApiLimit} from '../../../const';
import { getSordetOrders } from "../../../utils.js/getSortedOrders";
import {createAPI} from '../../../api/api'
import Binance from 'binance-api-node'

const DefaultTicker = {
    BTCUSDT: tickers[0],
  };

const acc = {
    eventTime: 1564745798939,
    transactionTime: 1564745798938,
    eventType: 'ACCOUNT_UPDATE',
    eventReasonType: 'ORDER',
    balances: [
      {
        asset:'USDT',
        walletBalance:'122624.12345678',
        crossWalletBalance:'100.12345678'
      },
      {
        asset:'BNB',           
        walletBalance:'1.00000000',
        crossWalletBalance:'0.00000000'         
      }
    ],
    positions: [
      {
        symbol:'BTCUSDT',
        positionAmount:'20',
        entryPrice:'6563.66500',
        accumulatedRealized:'0',
        unrealizedPnL:'2850.21200',
        marginType:'isolated',
        isolatedWallet:'13200.70726908',
        positionSide:'LONG'
      }
    ],
  }

class orderStore {

    ticker = DefaultTicker.BTCUSDT;
    tickers = tickers
    orderbook = {}
    isLoadOrderbook = false
    tick = 0
    book = {}
    account = {}

    constructor() {
        makeAutoObservable(this)
    }
    fetchOrderbook = () => {
        const api = createAPI()
        api.get(`${ApiRoute.DEPTH}?symbol=${this.ticker.symbol}`)
        .then(({data}) => {
         runInAction(()=>{
             this.orderbook = data
         })
        });
    };
    fetchTicker = () => {
        const client = Binance()
        client.ws.futuresTicker('BTCUSDT', ticker => {
            runInAction(()=>{
                this.tick = ticker.curDayClose
            })
        })
    }
    fetchDepth = () => {
        const client = Binance()
        client.ws.futuresDepth('BTCUSDT', dth => {
            runInAction(()=>{
                this.book = dth
            })
        })
    }
    fetchAccount = async () => {
        // const client = Binance()
        // await client.ws.futuresUser(msg => {
        //     runInAction(()=>{
        //         this.account = msg
        //     })
        //   })
        const p1 = new Promise((resolve)=>{
                setTimeout(()=>resolve(acc),2000)
            
        })
         const result = await p1
         runInAction(()=>{
             this.account = result
         })

    }

    changeTicker = (ticker) => {
        this.ticker= ticker
    };
    loadOrderbook = (orderbook) => {
        this.orderbook = orderbook
    };
    addOrderbook = (orderbook, orderbookWS) => {
        return  {
          asks: getSordetOrders(orderbook.asks, orderbookWS.asks, false),
          bids: getSordetOrders(orderbook.bids, orderbookWS.bids),
        }
    }
    changeLoadOrderbook = (isLoadOrderbook) => {
        this.isLoadOrderbook =isLoadOrderbook
    }



}
export default new orderStore()