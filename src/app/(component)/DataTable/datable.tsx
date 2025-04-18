import { gain } from "@/app/romodif/page";
import { dataTableType } from "./dataTableType";

export default function DataTable({
    result,
    alphabet,
    dispo,
    dataTab,
    result1,
    dispo1,
    dataResult,
    gain
}:dataTableType){
    return(
            <div className="flex p-2 text-xl">
            <div className="flex flex-row ">
                <table className=" border-collapse border-b-0 border-gray-300 ">
                    <tbody>
                        <tr>
                            <td ></td>
                        {
                            result?.map((val,index)=>(
                                <td key={index} className="p-2 min-w-[39.25px] min-h-[45px] text-center">{index+1}</td>
                            ))
                        }
                        </tr>
                        {
                           (dataTab !== undefined && alphabet !== undefined && dispo != undefined) ? dataTab.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    <td key= {rowIndex+'alphabet'} className="p-2 min-w-[39.25px] min-h-[45px] text-center">{alphabet[rowIndex]}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border border-b-stone-900 p-2 min-w-[39.25px] min-h-[45px] text-center">{cell}</td>
                                    ))}
                                    <td key= {rowIndex} className="text-red-400 p-2 min-w-[39.25px] min-h-[45px] text-center">{dispo[rowIndex]}</td>
                                </tr>        
                            ))
                            : (dataResult !== undefined && alphabet !== undefined && dispo != undefined) ? dataResult.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50">
                                    <td key= {rowIndex+'alphabet'} className="p-2 min-w-[39.25px] min-h-[45px] text-center">{alphabet[rowIndex]}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className="border border-b-stone-900 p-2 min-w-[39.25px] min-h-[45px] text-center relative">
                                            <p className="relative inline-block"> 
                                                <span className={`${gain !== undefined && (()=>{
                                                let currentData = gain;
                                                    while(currentData){
                                                        if(currentData.data.colIndex === String(cellIndex) && currentData.data.rowIndex == String(rowIndex)){
                                                            const className = currentData.data.value < 0 ? " before:content-['+'] " :" before:content-['-'] "
                                                            return "before:w-[15px] before:h-[15px] before:rounded-full before:absolute before:bg-amber-300 before:text-black  before:text-[13px] before:border before:-left-3  before:-translate-y-1/2 before:flex before:items-center before:justify-center"+className;
                                                        } 
                                                        currentData = currentData.next as gain   
                                                    }
                                                    
                                                    return ""
                                                })()}`}/>{(cell === "-" && gain !=undefined) ? "" :cell}
                                            </p>
                                        </td>
                                    ))}
                                    <td key= {rowIndex} className="text-red-400 p-2 min-w-[39.25px] min-h-[45px] text-center">{dispo[rowIndex]}</td>
                                </tr>
                            ))
                            : ""
                            
                        }
                        <tr>
                            <td></td>
                        {   
                             result?.map((val,index)=>(
                            <td key={index} className=" p-2 min-w-[39.25px] min-h-[45px] text-center text-red-400">{val}</td>
                            ))
                        }
                        </tr>
                    </tbody>
                </table>
                {/*
                    dispo1 !== undefined &&(
                        (() => {
                            const index = dispo1.index >= dispo1.data.length ? dispo1.data.length -1 : dispo1.index;
                            return dispo1.data.filter((val, x) => x <= index).map((va, x) => (
                                <div key={x} className="flex flex-col">
                                    {
                                       (()=>{
                                        return va.map((value, y) => (
                                            <h1 key={`${x} ${y}`} className="text-gray-500 py-2">{ value}</h1>
                                        ))

                                       })() 
                                    }
                                </div>
                            ));
                        })()
                    )   
                */}

            </div>
            <div>
                {/*
                    result1 !== undefined && (
                        (() => {
                            const index= result1.index >= result1.data.length ? result1.data.length -1 : result1.index;
                            return result1.data.filter((val, x) => x <= index).map((va, x) => (
                                <div key={x} className="flex flex-row space-x-4 mx-9">
                                    {
                                        va.map((value, y) => (
                                            <h1 key={`${x} ${y}`} className="text-gray-500 py-2">{value}</h1>
                                        ))
                                    }
                                </div>
                            ));
                        })()
                    )
                */}
            </div>
        </div>
    )
}