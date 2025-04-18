import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header/Header";


type Props = {
    children:React.ReactNode;
    isOpen:boolean;
    onClose:()=>void
    name:string;
}

 export const Modal = ({children,isOpen,onClose,name}:Props)=>{
    if(!isOpen) return null;
    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center transition duration-150 ease-in delay-150 overflow-y-auto bg-opacity-50 p-40">
            <div className=" shadow-2xl border-2 border-blue-primary border-transparent rounded-3xl bg-white p-4 ">
                <Header name={name} isSmallText button={
                <button className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary  hover:bg-blue-600"
                 onClick={onClose}
                >
                    X                
                </button>    
                 } />
                    {children}
            </div>    
        </div>,
        document.body,
    )
}

type PropsMy = {
    children:React.ReactNode,
    isOpen:boolean,
    onClose:()=>void,
    name:string,
    handleOpen:()=>void,
}

export const MyModal=({children,isOpen,onClose,name,handleOpen}:PropsMy)=>{
    
    return(
        <>
            {<button className="bg-linear-to-r from-cyan-500 to-[#1063cf] rounded-md py-2 px-4 text-white font-semibold text-sm cursor-pointer transition-all ease-in hover:bg-blue-500" onClick={()=>handleOpen()}>
                    Nouveau Tableau   
            </button>  }
            <Modal isOpen={isOpen} onClose={onClose} name={name}>
                {children}
            </Modal>
        </>
    )
}
