
import {useState} from "react";
import {FixedPrice, TickerPrice, WSRoute, WSUrl} from "../const";

let wsTrade; // for close Web Socket
export const useWSTrade = () => {
  const [tickerPrice, setTickerPrice] = useState(TickerPrice.DEFAULT);
  const [isWSTradeLoad, setWSTradeStatus] = useState(false);

  const connectWSTrade = ({symbol}) => {
    symbol = symbol.toLowerCase();
    wsTrade = new WebSocket(`${WSUrl.STREAM}${symbol}${WSRoute.TRADE}`);

    wsTrade.onmessage = ({data}) => {
      const price = Number(JSON.parse(data).p);
      const priceFixed = Math.floor(price) === 0 ? price.toFixed(FixedPrice.CRYPTO) :
        price.toFixed(FixedPrice.MONEY);

      setTickerPrice(priceFixed);
      setWSTradeStatus(true);
    };
  };

  const disconnectWSTrade = () => {
    wsTrade.close();
    setWSTradeStatus(false);
  };

  return {
    tickerPrice,
    setTickerPrice,
    isWSTradeLoad,
    connectWSTrade,
    disconnectWSTrade,
  };
};
