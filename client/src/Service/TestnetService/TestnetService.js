import axios from 'axios'
import {routes} from '../routes'
const queryString = require('query-string');
const crypto = require('crypto');

const apiKey = '48cb94dd268d49066808f2e636afd8370a6fcf747a8cdd6322cece860676a02e';
const apiSecret = '396026d41a2c4bcce32857388a7fa5218e9a1ad02da5427dd1a5cb93657a1983';
const apiUrl = "https://testnet.binancefuture.com";

function privateCall(path, data = {}) {
    if (!apiKey || !apiSecret)
        throw new Error('Preencha corretamente sua API KEY e SECRET KEY');
 
    const timestamp = Date.now();

    const newData = {timestamp,...data,recvWindow:5000};
    
    const qs = `${queryString.stringify(newData)}`;

    const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(qs)
    .digest('hex');
    return  `${apiUrl}${path}?${qs}&signature=${signature}`

}

class TestnetService {

    account = async () => {
        const key = privateCall('/fapi/v2/account')
        try {
            const result = await axios({
                method:'POST',
                url:routes.account,
                data:JSON.stringify({key:key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }

    balance = async () => {
        const key = privateCall('/fapi/v2/balance')
        try {
            const result = await axios({
                method:'POST',
                url:routes.balance,
                data:JSON.stringify({key:key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }
    
    order = async (data) => {
        const key = privateCall('/fapi/v1/order',data)
        try {
            const result = await axios({
                method:'POST',
                url:routes.order,
                data:JSON.stringify({data,key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }

    leverage = async (data) => {
        const key = privateCall('/fapi/v1/leverage',data)
        try {
            const result = await axios({
                method:'POST',
                url:routes.leverage,
                data:JSON.stringify({data,key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }
    listenkey = async (data) => {
        const key = privateCall('/fapi/v1/listenKey',data)
        try {
            const result = await axios({
                method:'POST',
                url:routes.listenkey,
                data:JSON.stringify({data,key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }
    listenkeyUpdate = async (data) => {
        const key = privateCall('/fapi/v1/listenKey',data)
        try {
            const result = await axios({
                method:'PUT',
                url:routes.listenkeyupdate,
                data:JSON.stringify({data,key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }
    deleteOrders = async (data) => {
        const key = privateCall('/fapi/v1/allOpenOrders',data)
        try {
            const result = await axios({
                method:'POST',
                data:JSON.stringify({data,key,apiKey}),
                url:routes.deleteOrders,
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }

    allOrders = async () => {
        const key = privateCall('/fapi/v1/openOrders')
        try {
            const result = await axios({
                method:'POST',
                url:routes.allOrders,
                data:JSON.stringify({key,apiKey}),
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }
    getAllCandles = async (data) => {
        const key = privateCall('/fapi/v1/klines',data)
        try {
            const result = await axios({
                method:'GET',
                url:key,
                headers:  {
                    'Content-Type':'application/json',
                }
                
            });
            return result.data;
        } catch (e) {
            console.log(e);
        }
    }

}
export default new TestnetService()
