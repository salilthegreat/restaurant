"use client";
import React, { useEffect, useState } from "react";

type Props = {
  price: number;
  id: number;
  options?: { title: string; additionalPrice: number }[];
};

const Price = ({ price, id, options }: Props) => {
  const [total, setTotal] = useState(price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setTotal(
      quantity * (options ? price + options[selected].additionalPrice : price)
    );
  }, [quantity, selected, options, price]);
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">{total}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {options?.map((item, index) => (
          <button
            className="min-w-[5rem] p-2 ring-1 ring-red-400 rounded-md"
            key={item.title}
            style={{
              background: selected === index ? "rgb(248 113 113)" : "white",
              color: selected === index ? "white" : "red",
            }}
            onClick={() => setSelected(index)}
          >
            {item.title}
          </button>
        ))}
      </div>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          {/* QUANTITY */}
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button className="uppercase w-56 p-3  bg-red-500 text-white ring-1 ring-red-500">
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default Price;
