import { ActionTypes, CartType } from "@/types/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const InitialState = {
    products: [],
    totalItems: 0,
    totalPrice: 0
}

export const useCartStore = create(persist<CartType & ActionTypes>((set, get) => ({
    products: InitialState.products,
    totalItems: InitialState.totalItems,
    totalPrice: InitialState.totalPrice,
    addToCart(item) {
        const products = get().products;
        const isAlreadyAdded = products.find((product) => product.id === item.id)
        if (isAlreadyAdded) {
            // set((state)=>({
                
            // }))
        const updatedProducts =     products.map((product)=>(
                product.id === isAlreadyAdded.id ? {
                    ...item,
                    quantity:product.quantity + item.quantity,
                    price:product.price + item.price         
                } : item
            ))
            set((state)=>({
                products:updatedProducts,
                totalItems:state.totalItems + item.quantity,
                totalPrice:state.totalPrice + item.price
            }))
        } else {
            set((state) => ({
                products: [...state.products, item],
                totalItems: state.totalItems + item.quantity,
                totalPrice: state.totalPrice + item.price
            }))
        }
    },
    removeFromCart(item) {
        set((state) => ({
            products: state.products.filter((product) => (
                product.id !== item.id
            )),
            totalItems: state.totalItems - item.quantity,
            totalPrice: state.totalPrice - item.price
        }))
    },

}), { name: "Cart", skipHydration: true }))