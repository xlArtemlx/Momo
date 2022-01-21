import {createBalanceOfPower,round} from '../RealTraiding/Account/create'
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

export const BalanceOfPowerPoint= (arr,deposit,setDeposit,setInfo,setAll,setPlus) => {
    
    let toggle = false
    let position = ''
    let newDeposit = deposit

    let price = 0
    let marga = 0
    let coins = 0
    
    let risk = 0
    let profit = 0
    let slideRisk = 0
    let shoulder = 10
    let riskPercent = 1

    let takeProfit = 0
    let stopLoss= 0
    let newInfo = []
    let plus = 0
    let all = 0
    let fee = 0
    let slide = riskPercent
    let balanceOfPower = 0
    const coef = 3.2

    

    for(let i = 0; i < arr.length; i++){

        if(i === 0){
            balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
        }
        if(!toggle){
           const newBalanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
            if(balanceOfPower<0 && newBalanceOfPower>=0){
                position = "BUY"
                toggle = true

                price = Number(arr[i].close)
                marga = +(newDeposit * shoulder)
                coins = round(marga / +(arr[i].close),4)
                fee = (price * coins * 0.04)/100 * 2

                slideRisk = +(newDeposit * slide / 100)
                
                risk = +(newDeposit * riskPercent / 100)-fee
                profit = +(risk*coef)
                
                const {tiksProfit,tiksRisk,tiksSlide} = createBalanceOfPower(position,price,coins,profit,risk,slide)
   
                takeProfit = tiksProfit
                stopLoss = tiksRisk
                
            } else if(balanceOfPower>=0 && newBalanceOfPower<0) {
                position = "SELL"
                toggle = true

                price = Number(arr[i].close)
                marga = +(newDeposit * shoulder)
                coins = round(marga / +(arr[i].close),4)
                fee = ((price * coins) * 0.04)/100 * 2

                
                slideRisk = +(newDeposit * slide / 100)
                
                risk = +(newDeposit * riskPercent / 100)-fee
                profit = +(risk*coef)

                const {tiksProfit,tiksRisk,tiksSlide} = createBalanceOfPower(position,price,coins,profit,risk,slide)
                takeProfit = tiksProfit
                stopLoss = tiksRisk
                
            }

        } else {
            if(position === 'BUY'){ 
                if(Number(arr[i].open)<=stopLoss||Number(arr[i].high)<=stopLoss||Number(arr[i].low)<=stopLoss||Number(arr[i].close)<=stopLoss){
                    newDeposit=newDeposit-risk-fee
                    toggle = false
                    all=all+1 
                    balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
                }else if(Number(arr[i].open)>=takeProfit||Number(arr[i].high)>=takeProfit||Number(arr[i].low)>=takeProfit||Number(arr[i].close)>=takeProfit){
                    newDeposit=newDeposit+profit-fee
                    toggle = false
                    plus=plus+1
                    all=all+1
                    balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
                } 

            } else if(position === 'SELL'){
                if(Number(arr[i].open)>=stopLoss||Number(arr[i].high)>=stopLoss||Number(arr[i].low)>=stopLoss||Number(arr[i].close)>=stopLoss){
                    newDeposit = newDeposit-risk-fee
                    toggle = false
                    all=all+1
                    balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
                }
                if(Number(arr[i].open)<=takeProfit||Number(arr[i].high)<=takeProfit||Number(arr[i].low)<=takeProfit||Number(arr[i].close)<=takeProfit){
                    newDeposit = newDeposit+profit-fee
                    toggle = false
                    plus=plus+1
                    all=all+1
                    balanceOfPower = (arr[i].close - arr[i].open) / (arr[i].high - arr[i].low)
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
            slideRisk,
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