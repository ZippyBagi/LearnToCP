import Link from "next/link"

type SideBarButtonInput = {
    name : string;
    href : string;
};

export default function SideBarButton(input : SideBarButtonInput){

    return (
        <Link
            href={input.href}
            className="block text-lg font-bold p-3 pl-4 hover:bg-white/5 w-full text-center select-none"
        >
            <span>{input.name}</span>
        </Link>
    )

}