"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

const AddPage = () => {

    type Input = {
        title: string,
        desc: string,
        price: number,
        catSlug: string
    }

    type Option = {
        title: string,
        additionalPrice: number
    }

    const { data: session, status } = useSession()
    const router = useRouter()

    const [inputs, setInputs] = useState<Input>({
        title: "",
        desc: "",
        price: 0,
        catSlug: ""
    })

    const [option, setOption] = useState<Option>({
        title: "",
        additionalPrice: 0
    })

    const [options, setOptions] = useState<Option[]>([])

    const [file,setFile] = useState<File>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs((prev) => (
            { ...prev, [e.target.name]: e.target.value }
        ))
    }

    const changeOption = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOption((prev) => (
            { ...prev, [e.target.name]: e.target.value }
        ))
    }
    // console.log(option, inputs)

    const handleChangeImg = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const target = e.target as HTMLInputElement;
        const item = (target.files as FileList)[0];
        setFile(item)
    }

    const upload = async() =>{
        const data = new FormData();
        data.append('file',file!)
        data.append('upload_preset','restaurant')
        const res = await fetch("https://api.cloudinary.com/v1_1/dibkpvhku/image/upload",{
            method:"POST",
            body:data
        })
        const resData = await res.json()
        return resData.url
    }


    if (status === "loading") {
        return <p>Loading</p>
    }

    if (status === "unauthenticated" || !session?.user.isAdmin) {
        router.push("/")
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            const url = await upload();
            const res = await fetch("http://localhost:3000/api/products",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({
                    img:url,
                    ...inputs,
                    options
                })
            })
            const data = await res.json()
            router.push(`/product/${data.id}`)
            // console.log(url)
        } catch (error) {
            console.log(error)
        }
    }
    // console.log(file)

    return (
        <div>
            <form className="shadow-lg flex flex-wrap gap-4 p-8" onSubmit={handleSubmit}>
                <h1>Add Products</h1>
                <div className="w-full flex flex-col gap-2">
                    <label>Title</label>
                    <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="title" />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label>Desc</label>
                    <textarea onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" name="desc" />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label>Image</label>
                    <input className="ring-1 ring-red-200 p-2 rounded-sm" type="file" onChange={handleChangeImg}/>
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label>Price</label>
                    <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" name="price" />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label>Category</label>
                    <input onChange={handleChange} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" name="catSlug" />
                </div>
                <div className="w-full flex flex-col gap-2">
                    <label>Options</label>
                    <div>
                        <input onChange={changeOption} className="ring-1 ring-red-200 p-2 rounded-sm" type="text" placeholder="Title" name="title" />
                        <input onChange={changeOption} className="ring-1 ring-red-200 p-2 rounded-sm" type="number" placeholder="Additional Price" name="additionalPrice" />
                    </div>
                    <div className="w-52 bg-red-500 text-white p-2" onClick={() => setOptions((prev) => [...prev, option])}>Add Options</div>
                </div>
                <div>
                    {options.map((item) => (
                        <div className="ring-1 ring-red-500 p-2 cursor-pointer" key={item.title} onClick={() => setOptions(options.filter((opt) => (opt.title !== item.title)))}>
                            <span>{item.title}</span>
                            <span>{item.additionalPrice}</span>
                        </div>
                    ))}
                </div>
                <button type="submit" className="p-2 w-full bg-red-500 text-white">Submit</button>
            </form>
        </div>
    )
}

export default AddPage