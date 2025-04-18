    import React, { Dispatch } from "react";
    import { data } from "vis-network";

    export interface DataState {
        data: number[][];
        result: number[];
        available: number[];
        type:string;
        // Fixed typo 'avaible' -> 'available'
    }

    interface DataContextType {
        data: number[][],
        result: number[],
        available: number[],
        type:string,
        dispatch: Dispatch<DataAction>

    }


    export interface DataAction{
        payload: {
            data: number[][];
            result: number[];
            available: number[];
            type:string;
        };
    }

    export const DataReducer = (state:DataState,action:DataAction):DataState=>{
                return {
                    ...state,
                    data: action.payload.data,
                    result: action.payload.result,
                    available: action.payload.available,
                    type:action.payload.type
                }
        }


    export const  DataContext = React.createContext<DataContextType>({} as DataContextType)