import {createBalanceOfPower,round} from '../RealTraiding/Account/create'

export function sliceArray(arr, startIndex, endIndex) {
    return arr.slice(startIndex, endIndex);
}

export const Bolindger = (data, period, startIndex, endIndex) => {
    const arr = sliceArray(data, startIndex, endIndex)
    
   // Define the parameters for the Bollinger Bands calculation
    const stdDevs = 2; // number of standard deviations for the upper and lower bands

    // Define variables to hold the moving average, upper band, and lower band
    let ma;
    let upper;
    let lower;

    // Create the Bollinger Bands calculation function
    function bollingerBands(data) {
        // Calculate the moving average and upper and lower bands
        ma = data.slice(-period).reduce((a, b) => a + b) / period;
        const stdDev = Math.sqrt(data.slice(-period).reduce((a, b) => a + Math.pow(b - ma, 2), 0) / period);
        upper = ma + stdDevs * stdDev;
        lower = ma - stdDevs * stdDev;

        return {upper, lower}
    }
    return bollingerBands(arr)
}

export const BolindgerPoint= (arrCandles,deposit,setDeposit,setInfo,setAll,setPlus) => {
    const arr = arrCandles.map((el) => Number(el.close))

    let toggle = true
    let position = ''
    let newDeposit = deposit
    const period = 10;

    let price = 0
    let marga = 0
    let coins = 0
    
    let risk = 0
    let profit = 0
    let slideRisk = 0
    let shoulder = 3
    let riskPercent = 2

    let takeProfit = 0
    let stopLoss= 0
    let newInfo = []
    let plus = 0
    let all = 0
    let fee = 0
    let slide = riskPercent
    const coef = 3.5

    
    for(let i = 0; i < arr.length; i++){
        // if(i === 20){
        //     const {upper, lower} = Bolindger(arr, period, (i - period), i)
        //     upperLevel = upper
        //     lowerLevel = lower
        // }
        if(toggle && i > period){
            const {upper: upperLevel , lower: lowerLevel} = Bolindger(arr, period, (i - period), i)
 
            if(arr[i-1] < lowerLevel){
                position = "BUY"
                toggle = false

                price = Number(arr[i])
                marga = +(newDeposit * shoulder)
                coins = round(marga / +(arr[i]),4)
                fee = (price * coins * 0.04)/100 * 2

                slideRisk = +(newDeposit * slide / 100)
                
                risk = +(newDeposit * riskPercent / 100) + fee
                profit = +(risk*coef)

                // console.log(+(newDeposit * riskPercent / 100) ,fee, 'BUY')
                const {tiksProfit,tiksRisk,tiksSlide} = createBalanceOfPower(position,price,coins,profit,risk,slide)
   
                takeProfit = tiksProfit
                stopLoss = tiksRisk
                
            } else if(arr[i-1] > upperLevel) {
                position = "SELL"
                toggle = false

                price = Number(arr[i])
                marga = +(newDeposit * shoulder)
                coins = round(marga / +(arr[i]),4)
                fee = ((price * coins) * 0.04)/100 * 2

                
                slideRisk = +(newDeposit * slide / 100)
                
                risk = +(newDeposit * riskPercent / 100) + fee
                profit = +(risk*coef)
                // console.log(+(newDeposit * riskPercent / 100) , fee, 'SELL')
                const {tiksProfit,tiksRisk,tiksSlide} = createBalanceOfPower(position,price,coins,profit,risk,slide)
                takeProfit = tiksProfit
                stopLoss = tiksRisk
                
            }

        } else {
            if(position === 'BUY'){ 
                if(Number(arr[i])<=stopLoss||Number(arr[i])<=stopLoss||Number(arr[i])<=stopLoss||Number(arr[i])<=stopLoss){
                    newDeposit=newDeposit - risk - fee
                    toggle = true
                    all=all+1
                    risk = 0
                    fee = 0
                    profit = 0
                }else if(Number(arr[i])>=takeProfit||Number(arr[i])>=takeProfit||Number(arr[i])>=takeProfit||Number(arr[i])>=takeProfit){
                    newDeposit=newDeposit + profit - fee
                    toggle = true
                    plus=plus+1
                    all=all+1
                    risk = 0
                    fee = 0
                    profit = 0
                } 

            } else if(position === 'SELL'){
                if(Number(arr[i])>=stopLoss||Number(arr[i])>=stopLoss||Number(arr[i])>=stopLoss||Number(arr[i])>=stopLoss){
                    newDeposit = newDeposit - risk - fee
                    toggle = true
                    all=all+1
                    risk = 0
                    fee = 0
                    profit = 0
                }
                if(Number(arr[i])<=takeProfit||Number(arr[i])<=takeProfit||Number(arr[i])<=takeProfit||Number(arr[i])<=takeProfit){
                    newDeposit = newDeposit + profit - fee
                    toggle = true
                    plus=plus+1
                    all=all+1
                    risk = 0
                    fee = 0
                    profit = 0
                } 

            }
        }

        newInfo.push({
            newDeposit:round(newDeposit,3),
            open:Number(arrCandles[i].open),
            close:Number(arrCandles[i].close),
            high:Number(arrCandles[i].high),
            low:Number(arrCandles[i].low),
            position,
            price,
            toggle,
            slideRisk,
            marga ,
            coins ,
            fee: fee.toFixed(2),
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
        setDeposit(400)
    },2000)
}
