import React,{ useState, useEffect} from 'react'
import { observer } from 'mobx-react';
import TestnetService from '../../../Service/TestnetService'
import AccountStore from './AccountStore'
import {info} from './info'
import {toJS} from 'mobx'

export const Account = observer(() => {
    const {check,createOrder,account,order} = AccountStore
    const [work,setWork]=useState(false)

    const start = () => {
      if(work)return
      setWork(true)
      createOrder()
    }

    return (
      <div className="container">
        <button onClick={start}>
          Start Traiding
        </button>
        <button onClick={()=>setWork(false)}>
          Stop
        </button>
        <button onClick={()=>TestnetService.listenkeyUpdate()}>
          All orders
        </button>
      </div>
    );
});

