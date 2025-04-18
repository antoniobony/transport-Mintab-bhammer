import { FormEvent, useContext, useEffect, useState } from "react";
import { MyModal } from "./Modal";
import Field from "../Field/Field";
import { DataContext, DataState } from "@/app/(context)/dataContext";
import { Select } from "../Select/Select";
import { NotfiContext } from "@/app/(context)/notif";


export default function ModalForm(){
    const [open,setOpen] = useState<boolean>(false);
    const [numberInput,setNumberInput] = useState<number>(28);
    const [name,setName] = useState<string>("Mintab");

    const [dataTab,setDataTab] = useState<DataState>({
        data: [],
        result: [],
        available: [],
        type:""
    })

    const {data,result,available,dispatch} = useContext(DataContext);
    const {notifTitle,message,dispatchNotif} = useContext(NotfiContext);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);

        if (name.startsWith("field-result-")) {
            const index = parseInt(name.split("-")[2]);
            setDataTab(prev => ({
                ...prev,
                result: prev.result.map((val, i) => 
                    i === index ? numValue : val
                ).slice(0, (numberInput-4)/4)
            }));
    
        } else if (name.startsWith("field-dispo-")) {
            
            const index = parseInt(name.split("-")[2]);
            setDataTab(prev => ({
                ...prev,
                available: prev.available.map((val, i) => 
                    i === index ? numValue : val
                ).slice(0, (numberInput-4)/4)
            }));
        } else {
            const index = parseInt(name.replace("field", ""));
            const row = Math.floor(index / (numberInput/4));
            const col = index % (numberInput/4);
            
            setDataTab(prev => ({
                ...prev,
                data: prev.data.map((rowArr, i) => 
                    i === row 
                        ? rowArr.map((val, j) => j === col ? numValue : val)
                        : rowArr
                )
            }));
        }
    };

    const handleSubmit = (e: FormEvent) => {

        e.preventDefault();

        const sommeAvailable:number = dataTab.available.reduce((a,b)=>a+b,0);
        const sommeResult:number = dataTab.result.reduce((a,b)=> a+b,0);
        
        if(sommeResult == sommeAvailable){
            dispatch({
                payload: {
                    data: dataTab.data,
                    result: dataTab.result,
                    available: dataTab.available,
                    type: name
                }
            });
            setDataTab({
                data: initializeData(),
                result: Array((numberInput-4)/4).fill(0),
                available: Array(4).fill(0),
                type:name
            });
        
            setOpen(false); 
        }
        else{
            dispatchNotif({
                payload: {
                    title: "Erreur",
                    message: "La somme des quantité demandes devrais etre égal à la somme des quantité disponible"
                }
            });
        }
 
    }

    const initializeData = () => {
        const rows = 4;
        const cols = (numberInput / 4)-1;
        return Array.from({length:rows},()=>Array(cols).fill(0));
    };

    useEffect(() => {
        setDataTab({
            data: initializeData(),
            result: Array((numberInput-4)/4).fill(0),
            available: Array(4).fill(0),
            type:name
        });
    }, [numberInput]);

    return (
        <>
            <MyModal name="MINTAB BHAMMER" isOpen={open} onClose={()=>setOpen(false)} handleOpen={()=>setOpen(true)}>
                    <div className="flex flex-row justify-center mt-3 mb-5">
                            <button className={`" relative ${numberInput == 28 ?"bg-[#043679] " :"bg-[#1063cf]"}   cursor-pointer text-white p-1 rounded-l-md w-20 "`} onClick={()=>setNumberInput(28)}>
                                <p>4x6</p>
                                <div className={`" ${numberInput == 28 ?"bg-amber-200 w-[5px] h-[5px] " :"w-0 h-0"} absolute top-1 left-1 transition-all duration-150 ease-in-out  rounded-full mx-auto "`}/>
                            </button>
                            <button className={`" relative ${numberInput == 24 ?"bg-[#043679] " :"bg-[#1063cf]"}   cursor-pointer text-white p-1 rounded-r-md w-20 "`} onClick={()=>setNumberInput(24)}>
                                <p>4x5</p>
                                <div className={`" ${numberInput == 24 ?"bg-amber-200 w-[5px] h-[5px] " :"w-0 h-0"} absolute top-1 right-1 transition-all duration-150 ease-in-out  rounded-full mx-auto "`}/>
                            </button>
                    </div>
                    <form action="" onSubmit={handleSubmit}>
                        <div className ={`${numberInput == 24 ? "grid grid-cols-6":"grid grid-cols-7"} " space-x-2 "`}>
                            {
                                (()=>{
                                    let number = []
                                    for(let i=0;i+1 <= numberInput/4; i++ ){
                                        number.push(<h1 key={i+1} className="mx-auto ">{i+1 <  numberInput/4 ? i+1 : ""}</h1>);
                                    }
                                    return number;
                                })()
                            }
                            {
                                (() => {
                                    let elements = [];
                                    let indexDispo = 0;
                                    for(let i =0;i < numberInput;i++) {
                                        elements.push(
                                        <Field 
                                            key={i}
                                            onChange={handleChange}
                                            className={`w-[50px] rounded border ${(i + 1) % (numberInput / 4) === 0 ? "border-red-400" : "border-[#1063cf]"} p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none`}
                                            name={`${(i + 1) % (numberInput / 4) === 0 ? `field-dispo-${Math.floor(i / (numberInput / 4))}` : `field${i}`}`}
                                            required
                                            type="number"
                                        />);
                                        
                                        if((i+1)%(numberInput/4) == 0){
                                            indexDispo++;
                                        }
                                    }
                                    return elements;
                                })()
                            }
                            {
                                (() => {
                                    let elements = [];
                                    for(let i =0;i < (numberInput-4)/4;i++) {
                                        elements.push(
                                        <Field key={i} 
                                        onChange={handleChange} 
                                        className={`" w-[50px] rounded border border-red-400 p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none" `}
                                        name={"field-result-"+i} type="number" 
                                        required
                                        />);
                                    }
                                    return elements;
                                })()
                            }
                        </div>
                        <Select name={["Mintab","Bhammer"]} onClick={(name)=>{setName(name)}}/>
                    </form>
                                 
            </MyModal>
        </>
    )
}