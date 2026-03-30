import SignInButton from "@/app/ui/utils/signInButton"
import LanguageSelector from "@/app/ui/utils/languageSelect"
import { FaBars } from "react-icons/fa";

export default function Navbar({ setSideBarActiveFunction }: { setSideBarActiveFunction: () => void }){
    return <nav className="flex items-center w-full bg-bg-navbar justify-between border-b-4 border-border-blue">
        
        <div className="flex items-center">
            <button onClick={setSideBarActiveFunction} className="cursor-pointer px-3">
                <FaBars></FaBars>
            </button>

            <div className="text-lg font-bold p-3 pl-4">
                LearnToCP
            </div>

        </div>
        
        <div className="flex items-center pr-4">
            <LanguageSelector></LanguageSelector>
            <div className="m-4"></div>
            <SignInButton></SignInButton>
        </div>
        
    </nav>
}