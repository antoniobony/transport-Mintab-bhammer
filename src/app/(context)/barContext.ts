import { title } from "process";
import React, { Dispatch } from "react";


interface BarContextType  {
    title:string;
    dispatch: Dispatch<BarAction>
}


interface BarAction{
    title:string
}

export const BarReducer = (state:string,action:BarAction):string=>{
    return action.title;
}


export const  BarContext = React.createContext<BarContextType>({} as BarContextType)