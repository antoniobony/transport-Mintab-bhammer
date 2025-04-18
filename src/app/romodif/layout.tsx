
"use client"

import { useReducer } from "react"
import { BarContext, BarReducer } from "../(context)/barContext"
import Bar from "../(component)/Bar/Bar";
import { DataAction, DataContext, DataReducer, DataState } from "../(context)/dataContext";
import  {ToastNotification} from "../(component)/Toast/toast";
import { NotfiContext, NotifReducer } from "../(context)/notif";

const initialState: DataState = {
    data: [],
    result: [],
    available: [],
    type:"MinTab"
};

const initialNotifState = {
    title: "",
    message: ""
}

export default function Layout({children}:{children:React.ReactNode}){
    const [title,dispatch] = useReducer(BarReducer,"Solution de base");
    const [data,dispatchData] = useReducer(DataReducer,initialState)
    const [notif,dispatchNotif] = useReducer(NotifReducer,initialNotifState)
   
    return(
        <BarContext.Provider value={{title,dispatch}}>
            <DataContext.Provider value={{data:data.data,result:data.result,available:data.available,type:data.type,dispatch:dispatchData}}>
            <NotfiContext.Provider value={{notifTitle:notif.title,message:notif.message,dispatchNotif}}>
                <div className="min-h-screen border-1 border-gray-400">
                    <ToastNotification title={notif.title} message={notif.message} />
                    <Bar/>
                    {children}
                </div>
            </NotfiContext.Provider>
            </DataContext.Provider> 
        </BarContext.Provider>
        
    )
}