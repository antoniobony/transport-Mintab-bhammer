import { FormEvent, useContext, useEffect, useState } from "react";
import { MyModal } from "./Modal";
import Field from "../Field/Field";
import { DataContext, DataState } from "@/app/(context)/dataContext";
import { Select } from "../Select/Select";
import { NotfiContext } from "@/app/(context)/notif";



export default function ModalForm(){
    const [open,setOpen] = useState<boolean>(false);
    const [name,setName] = useState<string>("Mintab");
    const [quantite,setQuantite] = useState({
        dispo:5,
        result:5
    })
    const [numberInput,setNumberInput] = useState<number>((quantite.dispo*quantite.result)+quantite.dispo);

    const [dataTab,setDataTab] = useState<DataState>({
        data: [],
        result: [],
        available: [],
        type:""
    })

    const {dispatch} = useContext(DataContext);
    const {dispatchNotif} = useContext(NotfiContext);

    
    const handleSetQuantite = (e:React.ChangeEvent<HTMLInputElement>)=>{
        e.preventDefault();

        const { name, value } = e.target;
        const numValue = Number(value);

        setQuantite({
            dispo:name ==="dispo" ? numValue: quantite.dispo,
            result:name === "result" ? numValue: quantite.result 
        })
        

    }
    
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = Number(value);
      
        if (name.startsWith("field-result-")) {
          const index = parseInt(name.split("-")[2]);
          setDataTab((prev) => ({
            ...prev,
            result: prev.result.map((val, i) => (i === index ? numValue : val)).slice(0, quantite.result),
          }));
        } else if (name.startsWith("field-dispo-")) {
          const index = parseInt(name.split("-")[2]);
          console.log("dispo", dataTab.available.length, "result", dataTab.result.length);
          setDataTab((prev) => ({
            ...prev,
            available: prev.available
              .map((val, i) => (i === index ? numValue : val))
              .slice(0, quantite.dispo),
          }));
        } else {
          const index = parseInt(name.replace("field", ""));
          const row = Math.floor(index / quantite.result); 
          const col = index % quantite.result; 
          console.log( row, col);
          setDataTab((prev) => ({
            ...prev,
            data: prev.data.map((rowArr, i) =>
              i === row ? rowArr.map((val, j) => (j === col ? numValue : val)) : rowArr
            ),
          }));
        }
      };


    const handleSubmit = (e: FormEvent) => {
        console.log(dataTab.data)
        e.preventDefault();

        const sommeAvailable:number = dataTab.available.reduce((a,b)=>a+b,0);
        const sommeResult:number = dataTab.result.reduce((a,b)=> a+b,0);
        console.log(sommeAvailable,sommeResult)

        if(sommeResult == sommeAvailable && sommeResult !== 0){
            dispatch({
                payload: {
                    data: dataTab.data,
                    result: dataTab.result,
                    available: dataTab.available,
                    type: name
                }
            });
            setDataTab({
                data: Array.from({length:quantite.dispo},()=>Array(quantite.result).fill(0)),
                result: Array(quantite.result).fill(0),
                available: Array(quantite.dispo).fill(0),
                type:name
            });
        
            setOpen(false); 
        }
        else{
        
            dispatchNotif({
                payload: {
                    title: "Erreur",
                    message: "La somme des quantités demandes devrais etre égal à la somme des quantités disponible"
                }
            });
        }
 
    }



    useEffect(() => {
        setDataTab({
            data: Array.from({length:quantite.dispo},()=>Array(quantite.result).fill(0)),
            result: Array(quantite.result).fill(0),
            available: Array(quantite.dispo).fill(0),
            type:name
        });
    }, [quantite]);

    return (
        <>
            <MyModal name="MINTAB BHAMMER" isOpen={open} onClose={()=>setOpen(false)} handleOpen={()=>setOpen(true)}>

                        <form action="" onSubmit={handleSubmit}>
                            <div className="flex flex-row">
                            <ul className="mt-8 ">
                                <li className="space-x-4">
                                <label className="font-bold">Quantité démandé:</label>
                                    <Field 
                                        key="quantiteDemande"
                                        onChange={handleSetQuantite}
                                        className={`w-[70px]  rounded border border-[#1063cf] p-2 m-2* shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none`}
                                        name="result"
                                        required
                                        type="number"
                                        min={2}
                                        defaultValue={quantite.result}
                                    />
                                </li>
                                <li className="mt-2">
                                    <label className="font-bold">Quantité disponible:</label>
                                        <Field 
                                            key="quantiteDispo"
                                            onChange={handleSetQuantite}
                                            className={`w-[70px]  rounded border border-[#1063cf] p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none`}
                                            name="dispo"
                                            required
                                            type="number"
                                            min={2}
                                            defaultValue={quantite.dispo}
                                        />
                                </li>
                            </ul>
                            <div className="max-w-[462px] max-h-[372px] overflow-auto">
                           
                            <table className="overflow-y-auto  custom-scrollbar border-collapse border-b-0 border-gray-300">
                                <tbody>
                                    <tr>
                                    {
                                    (()=>{
                                        let number = []
                                        for(let i=0;i+1 <= quantite.result+1; i++ ){
                                            number.push(<td key={i+1}><h1 key={i+1} className="px-7">{i+1 <  quantite.result+1 ? i+1 : ""}</h1></td>);
                                        }
                                        return number;
                                    })()
                                    }        
                                    </tr>
                                    
                                    {
                                    Array.from({ length: quantite.dispo }).map((_, i) => (
                                        <tr key={i}>
                                        {
                                            Array.from({ length: quantite.result }).map((_, j) => (
                                            <td key={`${i}-${j}`}>
                                                <Field 
                                                onChange={handleChange}
                                                className={`w-[50px] rounded border border-[#1063cf] p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none`}
                                                name={`field${i * quantite.result + j}`}
                                                required
                                                type="number"
                                                min={1}
                                                />          
                                            </td>  
                                            ))
                                        }
                                        <td>
                                            <Field 
                                                key={i}
                                                onChange={handleChange}
                                                className={`w-[50px] rounded border border-red-400  p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none`}
                                                name={`field-dispo-${i}`}
                                                required
                                                type="number"
                                                min={1}
                                            />
                                        </td>
                                        
                                        </tr>
                                    ))
                                    }
                                    <tr>
                                    {
                                    (() => {
                                        let elements = [];
                                        for(let i =0;i < quantite.result;i++) {
                                            elements.push(
                                            <td key={i}>
                                                <Field key={i} 
                                                onChange={handleChange} 
                                                className={`" w-[50px] rounded border border-red-400 p-2 m-2 shadow-sm dark:border-dark-tertiary dark:text-white dark:focus:outline-none" `}
                                                name={"field-result-"+i} type="number" 
                                                required
                                                min={1}
                                            />
                                            </td>
                                            );
                                        }
                                        return elements;
                                    })()
                                }        
                                    </tr>   
                                </tbody>
                            </table>
                            </div>
                            </div>
                            
                            <Select  name={["Mintab","Bhammer"]} onClick={(name)=>{setName(name)}}/>
                    </form>             
            </MyModal>
        </>
    )
}