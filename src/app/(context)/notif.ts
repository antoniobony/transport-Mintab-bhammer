import React, { Dispatch } from "react";

interface NotifContextType  {
    notifTitle:string;
    message:string;
    dispatchNotif: Dispatch<NotifAction>
}

export interface NotifState {
    title: string,
    message:string;
}

interface NotifAction{
    payload: {
        title:string,
        message:string
    };
}

export const NotifReducer = (state:NotifState,action:NotifAction):NotifState=>{
    return{
        ...state,
        title: action.payload.title,
        message: action.payload.message

    };
}


export const  NotfiContext = React.createContext<NotifContextType>({} as NotifContextType)