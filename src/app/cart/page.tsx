"use client";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const CartPage = () => {
  const { products, totalItems, totalPrice, removeFromCart } = useCartStore();
  useEffect(()=>{
    useCartStore.persist.rehydrate()
  },[])

  const {data:session} = useSession()
  const router = useRouter()

  const handleCheckout = async () => {
    if(!session){
      router.push("/login")
    }else{
      try {     
        const res = await fetch("http://localhost:3000/api/orders",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            price:totalPrice,
            products,
            status:"Not Paid",
            userEmail:session?.user.email
          })
        })
        const data = await res.json()
        router.push(`/pay/${data.id}`)
      } catch (error) {
        console.log(error)
      }
    }

  }
  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh - 9rem)] flex flex-col text-red-500 lg:flex-row ">
      {/* PRODUCT CONTAINER */}
      <div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:w-2/3 lg:h-full 2xl:w-1/2 lg:px-20 xl:px-40">
        {/* SINGLEITEM CONTAINER */}
        {products.map((item) => (
          <div className="flex items-center justify-between mb-4 " key={item.id}>
            { item.img && <Image src={item.img} alt="" width={100} height={100} />}
            <div className="">
              <h1 className="uppercase text-xl font-bold">{item.title} X {item.quantity}</h1>
              <span>{item.optionTitle}</span>
            </div>
            <h2 className="font-bold">₹{item.price}</h2>
            <span className="cursor-pointer" onClick={()=>removeFromCart(item)}>X</span>
          </div>
        ))}
      </div>
      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:w-1/3 lg:h-full 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
        <div className="flex justify-between">
          <span className="">Subtotal({totalItems} item)</span>
          <span className="">₹{totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="">Service Cost</span>
          <span className="">₹0</span>
        </div>
        <div className="flex justify-between">
          <span className="">Delivery Cost</span>
          <span className="text-green-500">FREE!</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span className="">Total(INC. VAT)</span>
          <span className="font-bold">₹{totalPrice}</span>
        </div>
        <button className="bg-red-500 text-white p-3 rounded-md self-end" onClick={handleCheckout}>
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default CartPage;
