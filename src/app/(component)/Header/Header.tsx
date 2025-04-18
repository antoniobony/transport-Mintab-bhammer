import React from "react";


interface HeaderProps{
    name?: string,
    isSmallText?: boolean,
    button?:any,
    buttonBoolean?:boolean
}

const Header:React.FC<HeaderProps> = ({name,isSmallText = false,button,buttonBoolean})=>{
    return(
                <div className="mb-5 flex w-full items-center justify-between">
                    <h1 className={`${isSmallText ? "text-lg": "text-2xl" } font-semibold dark:text-white `}>
                        {name}
                    </h1>    
                        {buttonBoolean ? "" : button}
                </div>
    )


}
export default Header;