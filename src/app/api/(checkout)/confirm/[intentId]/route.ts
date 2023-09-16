import prisma from "@/utils/connect";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async(req:NextRequest,{params}:{params:{intentId:string}}) =>{
    const {intentId} = params
    try {
        await prisma.order.update({
            where:{
                intent_id:intentId
            },
            data:{
                status:"Being Prepared"
            }
        })
        return new NextResponse(JSON.stringify({message:"Order has been placed"}),{status:200})
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({message:"Something went wrong!"}),{status:500})
    }
}