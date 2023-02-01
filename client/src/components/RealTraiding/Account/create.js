export function round (num,i) {
    const string = `${num}`
    const index = string.indexOf('.')
    if(index>0){
        return Number(string.slice(0,index+i))
    } else {
        return Number(num)
    }
}
export const create = (number,price,coin,profit,risk,slide) => {

    const costOfTick = coin * 0.01
    const tiksProfit = number < 51 ? (profit / costOfTick /100) + +(price): +(price) - (profit / costOfTick /100)  
    const tiksRisk = number < 51 ? +(price) - (risk / costOfTick  / 100):+(price) + (risk / costOfTick  / 100)
    const tiksSlide = number < 51 ? +(price) - (slide / costOfTick  / 100) : +(price) + (slide / costOfTick  / 100)

    return {
        tiksProfit:round(tiksProfit,3),
        tiksRisk:round(tiksRisk,3),
        tiksSlide:round(tiksSlide,3)
    }
}

export const createBalanceOfPower = (position,price,coin,profit,risk,slide) => {
    const costOfTick = coin * 0.01
    const tiksProfit = position === 'BUY' ? (profit / costOfTick /100) + price : price - (profit / costOfTick /100)  
    const tiksRisk = position === 'BUY' ? price - (risk / costOfTick  / 100) : price + (risk / costOfTick  / 100)
    const tiksSlide = position === 'BUY' ? price - (slide / costOfTick  / 100) : price + (slide / costOfTick  / 100)

    return {
        tiksProfit:round(tiksProfit,2),
        tiksRisk:round(tiksRisk,2),
        tiksSlide:round(tiksSlide,2)
    }
}