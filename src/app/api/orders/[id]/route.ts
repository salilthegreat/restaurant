import prisma from "@/utils/connect"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params
    const body = await req.json()
    try {
        await prisma.order.update({
            where: {
                id: id
            },
            data: {
                status: body
            }
        })
        return new NextResponse(JSON.stringify({ message: "Order Updated Successfully" }), { status: 200 })
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify({ message: "An Error Occured!" }), { status: 500 })
    }
}