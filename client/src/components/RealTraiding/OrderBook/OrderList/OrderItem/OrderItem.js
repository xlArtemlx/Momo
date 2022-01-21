import React from 'react';
import {FixedPrice} from './../../../../../const';

export const Orderitem = ({orders, isBids, isAsks}) => {
  const isBuy = isAsks ? `orderlist___value--red` : ``;
  const isSale = isBids ? `orderlist___value--green` : ``;

  const getOrderitemJsx = () => {
    return orders.map((order, index) => {
      let price = Number(order[0]);
      price = Math.floor(price) === 0 ? price.toFixed(FixedPrice.CRYPTO) :
        price.toFixed(FixedPrice.MONEY);

      const amount = Number(order[1]).toFixed(FixedPrice.AMOUNT);
      const total = (price * amount).toFixed(FixedPrice.TOTAL);

      const keyID = `${total}${price}${amount}${index}`.replace(/[^0-9]/g, ``);
      return (
        <ul key={keyID} className="orderlist__row">
          <li className="orderlist___item">
            <p className="orderlist___value">{amount}</p>
          </li>
          <li className="orderlist___item">
            <p className={`orderlist___value ${isBuy || isSale}`}>{price}</p>
          </li>
          <li className="orderlist___item">
            <p className="orderlist___value">{total}</p>
          </li>
        </ul>
      );
    });
  };

  return getOrderitemJsx();
};