import { useState } from "react"

import"./Select.css"

export function Select({name,onClick}:{name:string[],onClick:(name:string)=>void}){
    const [nameState,setName] = useState<string>(name[0]);
    const [show,setShow] = useState<boolean>(false);
    
    return(
        <div className="relative flex flex-row justify-center mt-5">
        <button 
          type="submit" 
          className="bg-gradient-to-r from-green-500 to-green-600 p-2 text-white font-bold rounded-l-sm border-r-0 w-[128px] cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 ease-in-out"
          onClick={() => onClick(nameState)}
        >
          {nameState}
        </button>
        <div 
          onClick={() => setShow(!show)} 
          className="bg-green-600 rounded-r-sm text-white p-2 cursor-pointer flex items-center justify-center hover:bg-green-700 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {
          show && (
            <div className="absolute top-10 fadeIn rounded-sm shadow-lg space-y-1 p-1 bg-white border border-green-200 w-[153px] text-green-800 mt-1">
              {
                name.map(x => (
                  <div 
                    key={x} 
                    onClick={() => {setShow(false); setName(x)}} 
                    className={`${nameState === x ? "bg-green-100" : ""} p-2 hover:bg-green-100 rounded-sm cursor-pointer transition-colors duration-200`}
                  >
                    {x}
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
    )
}