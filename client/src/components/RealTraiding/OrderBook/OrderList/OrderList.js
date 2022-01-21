import React from 'react';
import {Orderitem} from './OrderItem/OrderItem';
import './OrderList.scss'



export const Orderlist = ({ticker, orders, isBids, isAsks, isOrdersLoad}) => {
  const {symbols} = ticker;

  return (
    <div className="orderlist">
      <ul className="orderlist-header">
        <li className="orderlist-header__item">
          <p className="orderlist-header__title">Количество({symbols[0]})</p>
        </li>
        <li className="orderlist-header__item">
          <p className="orderlist-header__title">Цена({symbols[1]})</p>
        </li>
        <li className="orderlist-header__item">
          <p className="orderlist-header__title">Сумма({symbols[1]})</p>
        </li>
      </ul>
      <div className="orderlist__container">

        {<Orderitem orders={orders} isBids={isBids} isAsks={isAsks} />}

      </div>
    </div>
  );
};
