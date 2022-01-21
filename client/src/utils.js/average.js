export const  average = (arr) => {
    return arr.map((el)=>{
        const vol = Number(el.open)+Number(el.close)
        return vol/2
        
    })
}