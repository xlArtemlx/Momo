import {round,createBalanceOfPower} from '../components/RealTraiding/Account/create'
import macd from 'macd'
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

const newClose = (arr) => {
    const newArr = []
    arr.forEach((el)=>{
        newArr.push(Number(el.close))
    })
    return newArr
}
const getEMA = (a,r) => a.reduce((p,n,i) => i ? p.concat(2*n/(r+1) + p[p.length-1]*(r-1)/(r+1)) : p, [a[0]])

export const point= (arr,deposit,setDeposit,setInfo,setAll,setPlus) => {
    let toggle = false
    let position = 'BUY'
    let newDeposit = deposit

    let price = 0
    let marga = 0
    let coins = 0
    const close = newClose(arr)
    let macdArr = macd(close,121,70,50)
    
    let risk = 0
    let profit = 0
    let shoulder = 20
    let riskPercent = 1

    let takeProfit = 0
    let stopLoss= 0
    let newInfo = []
    let plus = 0
    let all = 0
    let fee = 0
    let slide = riskPercent
    const coef = 3
    let newPoint = 0

    for(let i = 0; i < arr.length; i++){
        if(i===121){newPoint = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}}
        if(i>121){
            const indicator = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}
            if(!toggle){
                if(newPoint.histogram<0&&indicator.histogram>0&&indicator.MACD>indicator.signal){
                    console.log(newPoint,indicator,'BUY')
                    position = "BUY"
                    toggle = true

                    price = Number(arr[i].close)
                    marga = +(newDeposit * shoulder)
                    coins = round(marga / +(arr[i].close),4)
                    fee = (price * coins * 0.04)/100 * 2

                    risk = +(newDeposit * riskPercent / 100)-fee
                    profit = +(risk*coef)
                    
                    const {tiksProfit,tiksRisk} = createBalanceOfPower('BUY',price,coins,profit,risk,slide)
    
                    takeProfit = tiksProfit
                    stopLoss = tiksRisk
                    
                } else if(newPoint.histogram>0&&indicator.histogram<0&&indicator.MACD<indicator.signal){
                    console.log(newPoint,indicator,'SELL')
                    position = "SELL"
                    toggle = true

                    price = Number(arr[i].close)
                    marga = +(newDeposit * shoulder)
                    coins = round(marga / +(arr[i].close),4)
                    fee = ((price * coins) * 0.04)/100 * 2

                    risk = +(newDeposit * riskPercent / 100)-fee
                    profit = +(risk*coef)

                    const {tiksProfit,tiksRisk} = createBalanceOfPower('SELL',price,coins,profit,risk,slide)
                    takeProfit = tiksProfit
                    stopLoss = tiksRisk
                    
                }

            } else {
                if(position === 'BUY'){ 
                    if(Number(arr[i].open)<=stopLoss||Number(arr[i].high)<=stopLoss||Number(arr[i].low)<=stopLoss||Number(arr[i].close)<=stopLoss){
                        newDeposit=newDeposit-risk-fee
                        toggle = false
                        all=all+1
                        newPoint = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}
                    }else if(Number(arr[i].open)>=takeProfit||Number(arr[i].high)>=takeProfit||Number(arr[i].low)>=takeProfit||Number(arr[i].close)>=takeProfit){
                        newDeposit=newDeposit+profit-fee
                        toggle = false
                        plus=plus+1
                        all=all+1
                        newPoint = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}
                    } 

                } else if(position === 'SELL'){
                    if(Number(arr[i].open)>=stopLoss||Number(arr[i].high)>=stopLoss||Number(arr[i].low)>=stopLoss||Number(arr[i].close)>=stopLoss){
                        newDeposit = newDeposit-risk-fee
                        toggle = false
                        all=all+1
                        newPoint = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}
                    }
                    if(Number(arr[i].open)<=takeProfit||Number(arr[i].high)<=takeProfit||Number(arr[i].low)<=takeProfit||Number(arr[i].close)<=takeProfit){
                        newDeposit = newDeposit+profit-fee
                        toggle = false
                        plus=plus+1
                        all=all+1
                        newPoint = {MACD:macdArr.MACD[i],histogram:macdArr.histogram[i],signal:macdArr.signal[i]}
                    } 

                }
            }
        }

        newInfo.push({
            newDeposit:round(newDeposit,3),
            open:Number(arr[i].open),
            close:Number(arr[i].close),
            high:Number(arr[i].high),
            low:Number(arr[i].low),
            position,
            price,
            toggle,
            marga ,
            coins ,
            fee,
            risk:risk.toFixed(2),
            profit:profit.toFixed(2),
            takeProfit ,
            stopLoss,
        }) 
    }
    
    setInfo(newInfo)
    setDeposit(newDeposit)
    setAll(all)
    setPlus(plus)
    setTimeout(()=>{
        setDeposit(100)
    },2000)
}

// function getCookie(key) {
//     const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
//     return b ? b.pop() : "";
// }

// export async function testSplunk (body) {
//     const fetchURL = `http://52.243.97.180:8000/en-US/splunkd/__raw/servicesNS/nobody/search/api/search`;
//     const query={};
//     query['query']= body;
    
//     const  XSplunkFormKey = getCookie("token_key");

//     const response = await axios(fetchURL,{
//         method: 'POST',
//         credentials: "include",
//         data: JSON.stringify(query), // string or object .. HEAD or GET cant have a body
//         headers: {
//             'Content-Type': 'application/json',
//             // 'X-Requested-With': 'XMLHttpRequest',
//             // 'X-Splunk-Form-Key': XSplunkFormKey,
//             // 'Authorization': XSplunkFormKey
//         }
//     })

//     console.log(response)
// }

// http.interceptors.request.use(
//     async (config) => {
//       const  XSplunkFormKey = getCookie("token_key");
//       // config.headers.Authorization = `Basic ${Buffer.from('15888434288613330241','utf8').toString('base64')}`;
//       config.headers['Cookie'] = "splunkd_8000=E1CDAF35-2764-4CF9-90A3-EC9498BB9F1B;splunkweb_csrf_token_8000=15888434288613330241"
//       config.headers['Content-type'] = 'application/json'
//       config.headers['X-Requested-With'] = 'XMLHttpRequest'
//       config.headers['X-Splunk-Form-Key'] = '15888434288613330241'
      
//       return config;
//     },
//     (error) => Promise.reject(error)
//   );


// async function testSplunkQuery(){
//     console.log("testSplunkQuery(): start");
//     var splunkQuery=document.getElementById("splunkQuery");
//     console.log("testSplunkQuery(): splunkQuery.value=" + splunkQuery.value);
//     var query={};
//     query['query']=splunkQuery.value;
//     console.log("testSplunkQuery(): query=" + JSON.stringify(query));
//     var url = window.location.href;
//     var urlProtocol = url.split("/")[0].split(":")[0];
//     var urlHostname = url.split("/")[2].split(":")[0];
//     var urlPort = url.split("/")[2].split(":")[1];
//     var XSplunkFormKey=getCookie("token_key");
//     var myBody=query;
//     var fetchURL=urlProtocol + '://' + urlHostname + ':' + urlPort + '/en-US/splunkd/__raw/servicesNS/nobody/apmTest2/api/search';
//     console.log("importBackup(): about to fetch fetchURL=" + fetchURL);
//     const response = await fetch(fetchURL, {
//         method: 'POST',
//         //method: 'PUT',
//         //credentials: "same-origin",
//         credentials: "include",
//         body: JSON.stringify(myBody), // string or object .. HEAD or GET cant have a body
//         headers: {
//             'Content-Type': 'application/json',
//             'X-Requested-With': 'XMLHttpRequest',
//             'X-Splunk-Form-Key': XSplunkFormKey
//         }
//     });
//     console.log("testSplunkQuery(): end");
// }