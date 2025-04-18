
"use client"

import { cleanRowCol, Min } from "@/app/(bhammer)/bhammer";
import { useEffect, useState } from "react";

export default function DataTableBhammer({
    alphabet,
    dispo,
    dataTab,
    result,
    cleanRowCol,
    minRowCol,
    nbr
}:{
    alphabet:string[],
    dispo:number[],
    result:number[],
    cleanRowCol:cleanRowCol[],
    minRowCol:Min[],
    dataTab:number[][],
    nbr:number
}){
    

    return(
            <div className=" flex p-2 text-xl">
            <div className="flex flex-row space-x-3">
                <table className=" border-collapse border-b-0 border-gray-300">
                    <tbody >
                        <tr>
                            <td></td>
                        {
                            result?.map((val,index)=>(
                                <td key={index} className="p-2  text-center">
                                    { cleanRowCol.findLast(d=> d)?.index == index && cleanRowCol.findLast(d=> d)?.type == "col" ? index+1 : cleanRowCol.find(d=>(d.index == index && d.type == "col")) ? "" :index+1 }
                                </td>
                            ))
                        }
                        </tr>
                        {
                           (dataTab !== undefined && alphabet !== undefined && dispo != undefined) && dataTab.map((row, rowIndex) => (
                                <tr key={rowIndex} className="hover:bg-gray-50 min-h-[45px]">
                                    <td key= {rowIndex+'alphabet'} className={`p-2 min-w-[39.25px] min-h-[45px] text-center ${( cleanRowCol.findLast(d=> d.type == "row")?.index == rowIndex ? "text-black": cleanRowCol.find(d=>(d.index == rowIndex && d.type == "row")) ? "text-white" : "text-black") }`}>  
                                         {alphabet[rowIndex]}        
                                    </td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex} className={` border border-b-stone-900 p-2 min-w-[39.25px] min-h-[45px] text-center transition-all ease-out duration-150
                                             ${ (cleanRowCol.findLast(d=>d)?.minBhammer.x == rowIndex && cleanRowCol.findLast(d=>d )?.minBhammer.y === cellIndex  ) && " bg-red-400  text-white "} `}>
                                                {
                                                    cleanRowCol.findLast(d=>d )?.minBhammer.x == rowIndex && cleanRowCol.findLast(d=>d )?.minBhammer.y === cellIndex || 
                                                    cleanRowCol.findLast(d=> d)?.verify.some(verify=> verify.row == rowIndex && verify.column == cellIndex) 
                                                    ? cell : cleanRowCol.find(d=> d.verify.some(verify=> verify.row == rowIndex && verify.column == cellIndex)) ? "" :cell
                                                }
                                             </td>
                                    ))}
                                    
                                    <td key= {rowIndex} className={` p-2 min-w-[39.25px] min-h-[45px] text-center transition-all ease-out duration-150 ${ cleanRowCol.findLast(d=>d )?.max === minRowCol[rowIndex].value && cleanRowCol.findLast(d=>d )?.minBhammer.x === rowIndex  ? "text-red-400 ":"text-blue-400 "}`}>
                                        { ( (cleanRowCol.findLast(d=>( d.type == "row"))?.index == rowIndex ||  minRowCol[rowIndex].row !== undefined) && minRowCol[rowIndex].value !== -Infinity ? minRowCol[rowIndex].value : minRowCol[rowIndex].row !== undefined && minRowCol[rowIndex].value !== -Infinity && !cleanRowCol.find(d=>(d.index == rowIndex && d.type == "row"))  ? minRowCol[rowIndex].value :  "" ) }  
                                        </td>
                                </tr>        
                            ))
                            
                        }
                        <tr>
                        <td></td>
                        {   
                            minRowCol.filter(va => va.col !== undefined).map((val,index)=>(
                            <td key={index} className={` p-2 min-w-[39.25px] min-h-[45px] text-center ${cleanRowCol.findLast(d=>d)?.max ==val.value && cleanRowCol.findLast(d=>d)?.minBhammer.y === index ? "text-red-400 ":"text-blue-400 "}`}>
                                {( (cleanRowCol.findLast(d=> d.type == "col")?.index == index || val.value !== undefined)&& val.value !== -Infinity ? val.value : "")}
                            </td>
                            ))
                        }
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    )
}