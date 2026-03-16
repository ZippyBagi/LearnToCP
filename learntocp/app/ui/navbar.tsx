import SignInButton from "@/app/ui/signInButton"


export default function Navbar(){
    return <nav className="flex items-center w-full bg-black/50 justify-between border-b-4 border-blue-500/50">

        <div className="text-lg font-bold p-3 pl-4">
            LearnToCP
        </div>

        <SignInButton></SignInButton>
         


    </nav>
}