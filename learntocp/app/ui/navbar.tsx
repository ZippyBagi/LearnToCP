import SignInButton from "@/app/ui/signInButton"
import LanguageSelector from "@/app/ui/languageSelect"

export default function Navbar(){
    return <nav className="flex items-center w-full bg-black/50 justify-between border-b-4 border-blue-500/50">

        <div className="text-lg font-bold p-3 pl-4">
            LearnToCP
        </div>
        
        <div className="flex items-center pr-4">
            <LanguageSelector></LanguageSelector>
            <div className="m-4"></div>
            <SignInButton></SignInButton>
        </div>
        
        

        

    </nav>
}