export const getSordetOrders = (ordersDepth, ordersTrade, isBids = true) => {
    let right = ordersDepth.length;
    let left = 0;
    let index;
    let resultIndex;
  
    // разворачиваем массив с новой ценой
    // Или for let i = ordersTrade.length
    ordersTrade = ordersTrade.reverse();
    for (const order of ordersTrade) {
      const [price, amount] = order;
  
      while (left < right) {
        index = Math.floor((left + right) / 2);
        // сохранять дублирование цены ">=" else <="
        if (isBids && price > ordersDepth[index][0]) {
          resultIndex = index;
        } else if (!isBids && price < ordersDepth[index][0]) {
          resultIndex = index;
        }
  
        if (isBids && price < ordersDepth[index][0]) {
          left = index + 1;
        } else if (!isBids && price > ordersDepth[index][0]) {
          left = index + 1;
        } else {
          right = index;
        }
      }
  
      ordersDepth.splice(resultIndex, 0, [price, amount]);
    }
  
    ordersDepth = ordersDepth.slice(resultIndex);
    return ordersDepth;
  };