import { makeAutoObservable } from "mobx"

class Store {
    deposit = 100
    fastMA = 10
    slowMA = 15
    riskPercent = 1
    timeFrame = '1m'
    startTime = 1629098438

    constructor() {
        makeAutoObservable(this)
    }

    setDeposit = (depo) => {
        this.deposit = depo
    }
    setFastMA = (ma) => {
        this.fastMA = Number(ma)
    }
    setSlowMA = (ma) => {
        this.slowMA = Number(ma)
    }
    setRisk = (risk) => {
        this.riskPercent = Number(risk)
    }
    setPrice = (price) => {
        this.price = price
    }
    setTimeFrame = (timeFrame) => {
        this.timeFrame = timeFrame
    }
    setStartTime = (time) => {
        this.startTime = Number(time)
    }


}
export default new Store()


