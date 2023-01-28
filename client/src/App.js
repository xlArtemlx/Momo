import './App.css';
// import {Test} from './components/test'
import {TestRandom} from './components/testrandom'
// import {TreidingTest} from './components/TestTraiding/TreidingTest'
// import {OrderBook} from '../src/components/RealTraiding/OrderBook/OrderBook'
// import {Ticker} from '../src/components/RealTraiding/Ticker/Ticker'
// import {Apps} from '../src/components/RealTraiding/App/App'
// import {Account} from './components/RealTraiding/Account/Account'
// import {StartButtom} from './components/RealTraiding/StartButtom/StartButtom'
// import {Ticker} from './components/RealTraiding/Ticker/Ticker'
import{BalanceOfPower}from'./components/BalanceOfPower/BalanceOfPower'
import {RealPower}from './components/RealPower/RealPower'

function App() {
  return (
    <div className="App">
      {/* <Ticker/>
      <Account />
      <StartButtom/> */}
      {/* <TestRandom/> */}
      {/* <BalanceOfPower/> */}
      <RealPower/>
    </div>
  );
}

export default App;
