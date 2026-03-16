'use client'
import { useRouter } from 'next/navigation'

type SideBarButtonInput = {
    name : string;
    href : string;
};

export default function SideBarButton(input : SideBarButtonInput){

    const router = useRouter()

    return <div className="text-lg font-bold p-3 pl-4 cursor-pointer hover:bg-white/5 w-full text-center" onClick={() => {router.push(input.href)}}>
        <h1>{input.name}</h1>
    </div>

}