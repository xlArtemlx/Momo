export const gap = (arr,ind,intrvl) => {
    const newArr = []
    for(let i = ind-intrvl;i<=ind;i++){
        newArr.push(Number(arr[i].close))
    }
    return newArr
}
export const gapMACD = (arr,ind,intrvl) => {
    const newArr = []
    for(let i = ind-intrvl;i<=ind;i++){
        newArr.push(Number(arr[i]))
    }
    return newArr
}
const getEMA = (a,r) => a.reduce((p,n,i) => i ? p.concat(2*n/(r+1) + p[p.length-1]*(r-1)/(r+1)) : p, [a[0]])
const getMACD = (arrSlow,arrFast,fast,slow,signal)=> {
  const a = gapMACD(arrSlow,slow,signal)
  const b = gapMACD(arrFast,fast,signal)
  const newArr = []
  a.forEach((el,idx)=>{
      newArr.push(b[idx]-el)
  })
  
  return newArr
}

export const macd = (arr,ind) => {
    if(ind<=35)return null
    const slow = 26
    const fast = 12
    const signal = 9

    const arrSlow = gap(arr,ind,slow)
    const arrFast = gap(arr,ind,fast)
    const arrSignal = gap(arr,ind,signal)

    const signalEMA = getEMA(arrSignal,ind,signal)
    const slowEMA = getEMA(arrSlow,slow)
    const fastEMA = getEMA(arrFast,fast)

    const MACD = getMACD(slowEMA,fastEMA,fast,slow,signal)
    const a = getEMA (MACD,signal)
    return MACD[signal]-a[signal]
}