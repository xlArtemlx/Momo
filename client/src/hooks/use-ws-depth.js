import {useState} from "react";
import {WSRoute, WSTime, WSUrl} from "../const";

const DEPTH_AMOUNT = 5;

let wsDepth; // for close Web Socket
export const useWSDepth = () => {
  const [orderbookWS, setOrderbookWS] = useState();
  const [isWSDepthLoad, setWSDepthStatus] = useState(false);

  const connectWSDepth = ({symbol}) => {
    symbol = symbol.toLowerCase();
    const link = 'wss://stream.binance.com:9443/ws/btcusdt@depth5@1000ms'
    const newLink = "wss://dex.binance.org/api/ws/BNB_BTCB-1DE@marketDiff"
    wsDepth = new WebSocket(`${WSUrl.STREAM}${symbol}${WSRoute.DEPTH}${DEPTH_AMOUNT}${WSTime.MIN}`);

    wsDepth.onmessage = ({data}) => {
      const orderbookData = JSON.parse(data);

      setOrderbookWS(orderbookData);
      setWSDepthStatus(true);
    };
  };

  const disconnectWSDepth = () => {
    wsDepth.close();
    setWSDepthStatus(false);
  };

  return {
    orderbookWS,
    isWSDepthLoad,
    connectWSDepth,
    disconnectWSDepth,
  };
};
