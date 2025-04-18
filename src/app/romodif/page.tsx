"use client"

import { useContext, useEffect, useState } from "react"
import DataTable from "../(component)/DataTable/datable"
import DataTableBhammer from "../(component)/DataTable/dataTableBhammer" 
import Network from "../(component)/Network/network"
import { DataContext } from "../(context)/dataContext"
import { BarContext } from "../(context)/barContext"
import { cleanRowCol, findBhammer, Min } from "../(bhammer)/bhammer"
import Image from "next/image"
import { TypewriterEffect } from "../(component)/ui/typeWiritterEffect"
import { Verification } from "next/dist/lib/metadata/types/metadata-types"
import { NotfiContext } from "../(context)/notif"



export type verify = {
    column:number,
    row:number,
    condition:string,
    value:number
}

type marginaux = {
    value:number,
    col:string,
    colIndex:string,
    row:string,
    rowIndex:string,
    marginauxString?:string,
    type?:"col"|"row"
}

export type DegenerateContext = {
    recursionCount: number;
    maxRecursion: number;
}

type sommet = {
    designation:string,
    value:number
}

export type arbre = {
    sommetDebut:sommet,
    sommetFin:sommet
    arc:number,
    isDegenerate?:boolean
}

export type gain = {
    data:marginaux,
    next: gain | null
}

export default function Ro(){
    const {data: dataTabContext,result:resultContext,available:dispoContext,dispatch} = useContext(DataContext)
    const {title, dispatch:dispatcH} = useContext(BarContext);
    const {type,dispatch:dispatchData} = useContext(DataContext);

    const {dispatchNotif} = useContext(NotfiContext);

    const [dataResultState1,setDataResultState1] = useState<string[][]>(Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill("")))
    const [dataResultState,setDataResultState] = useState<string[][]>(Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill("")))
    
    const [rsState,setRsState] = useState<number[][]> (Array.from({ length: resultContext.length+dispoContext.length -1}, () => Array(resultContext.length).fill("")))
    const [disState,setDisState]= useState<number[][]>(Array.from({ length: resultContext.length+dispoContext.length - 1}, () => Array(dispoContext.length).fill("")))  
    const [dtrsState,setDtrsState] = useState<string[][][]>(Array.from({ length: resultContext.length-1+dispoContext.length - 1},()=>Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill(""))))
    const [indexValue,setIndexValue] = useState<number>(0);
    
    const alphabet: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    const [Z,setZ] = useState<number>(0);
    const [showZ,setShowZ] = useState<String>("")
    const [arbreState,setArbreState] = useState<arbre[]>([]);
    const [oldArbreState,setOldArbreState] = useState<arbre[]>([]);
    const [verificationState,setVerificationState] = useState<verify[]>([]);
    const [marginauxState,setMarginauxState] = useState<marginaux[]>([]);
    const [gainState,setGainState] = useState<{gain:gain,cout:number,result:number}[]>();
    const [newGainState,setNewGainState] = useState<gain>();
    const [cleanRowColState,setCleanRowCol] = useState<cleanRowCol[]>([]);
    const [minRowColState,setMinRowCol] = useState<Min[][]>([]); 

    let verification:verify[] = []  
    let arbre:arbre[] = []
    let marginaux:marginaux[]= []
    let gainArray:{gain:gain,cout:number,result:number}[] =[]
    let cleanRowCol:cleanRowCol[] = []
    let minRowCol:Min[][] = []

    let rs:number[][] = Array.from({ length: resultContext.length+dispoContext.length -1}, () => Array(resultContext.length).fill(""))
    let dis:number[][] = Array.from({ length: resultContext.length+dispoContext.length - 1}, () => Array(dispoContext.length).fill(""))
    let dtrs:string[][][] =Array.from({ length: resultContext.length+dispoContext.length - 1},()=>Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill(""))) 
    
    let dataResult: string[][] = Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill(""));

    const updateDataTabResult = (
        indexX: number,
        indexY: number,
        minTab: number,
        valueDispo: number,
        valueResult: number,
        verification: verify[],
        dResult:string[][][],
        dataResult: string[][],
        count:number
    ): string[][] => {
        const newDataResult = dataResult.map(val => [...val]);
        
        let updatedResult = newDataResult.map((val0, Xindex) =>{
                const value = val0.map((val1, Yindex) => {
                    let newValue = val1;
                    let condition = "";
    
                    if (!verification.some((v) => v.row === Xindex && v.column === Yindex)) {
                        if (indexX === Xindex && indexY === Yindex) {
                            newValue = minTab.toString();
                            condition = "minTab";
                        } else if (
                            ((valueDispo === 0 && indexX === Xindex) ||
                            (valueResult === 0 && indexY === Yindex)) &&
                            !verification.some((v) => v.row === Xindex && v.column === Yindex)
                        ) {
                            newValue = "-";
                            condition = "valeur épuisé";
                        }
    
                        if (condition !== "") {
                            verification.push({
                                column: Yindex,
                                row: Xindex,
                                condition,
                                value: isNaN(parseInt(newValue)) ? -Infinity : parseInt(newValue),
                            });
                        }
                    }
                    
                    dResult[count][Xindex][Yindex] = newValue;
                    return newValue;
                });
            return value;
        });

        setVerificationState(verification);
    
        return updatedResult;
    };
        

    const  findMinTAB = (data: number[][],dispoData:number[],resultData:number[],verification:verify[],arbre:arbre[],dataResult:string[][],dispo:number[][],result:number[][],dResult:string[][][],count:number) => {
            if(verification.length < dispoContext.length  * resultContext.length){
                let min = Minimise(data,verification)  

                data.forEach((v,indexX)=>{
                    v.forEach((num,indexY)=>{
                        if(min == num){
                        const minTab = Math.min(dispoData[indexX],resultData[indexY])
                        let valueDispo = dispoData[indexX] - minTab
                        let valueResult =  resultData[indexY] - minTab
                    
                    
                        if(valueDispo >=0 && valueResult >= 0){
                            dataResult = updateDataTabResult(indexX,indexY,minTab,valueDispo,valueResult,verification,dResult,dataResult,count)
                        }
                        
                        resultData = resultData.map((val0, Yindex) => {
                            let value = val0;
                            if (Yindex === indexY ) {
                                value = valueResult;
                            }
                            result[count][Yindex] = value
                            return value; 
                        })
                    
                        dispoData = dispoData.map((val0, Xindex) => {
                                let value = val0;
                                if (Xindex === indexX ) {
                                    value = valueDispo;
                                }
                                
                                dispo[count][Xindex] = value
                                return value; 
                            })
                    }
                })
            });
            findMinTAB(data,dispoData,resultData,verification,arbre,dataResult,dispo,result,dResult,count+1)   
            }
            else if(arbre.length == 0){
                setDtrsState(dResult.filter(x=>x.filter(y=>y.every(d=>d.toString() !== ""))));
                setDataResultState(dataResult);
                setRsState(result.filter(x=>x.every(d=>d.toString() !== "")));
                setDisState(dispo.filter(x=> x.every(d=>d.toString() !== "")));
                let sum = 0;
                 sum = findMinTAB2(data,sum,verification);
                 setZ(sum);
                 findMinTAB3(verification,data,arbre);
                 const max = findDiffMax(arbre);
                 const sommetDebutDesignation:string[] = arbre.filter(v=>v.arc == max ).map((value)=>value.sommetDebut.designation);
                 degenerateCase(arbre,verification,dataResult,max,sommetDebutDesignation); 
                }
            
    };


    const findMinTAB2 = (daTa:number[][],sum:number,verify:verify[]):number=>{
        let totalSum=sum
        daTa.forEach((va1, x) => {
            va1.forEach((v2, y) => {
                const valueMinTab = verify
                .filter((v) => v.condition === "minTab")
                .find((d) => d.column === y && d.row === x)?.value ?? 0;
                totalSum += daTa[x][y] * valueMinTab;
            });
            });
           
            return totalSum;
    }

    const findMinTAB3 = (verification:verify[],daTa:number[][],arbre:arbre[])=>{
        daTa.forEach((value1,x)=>{
            value1.forEach((value2,y)=>{    
                if(verification.filter((v) => v.condition === "minTab")
                    .some(u=>u.column === y && u.row === x )){
                    arbre.push({
                        sommetDebut: { designation: alphabet[x],value:-Infinity},
                        sommetFin: { designation: (y + 1).toString(),value:-Infinity },
                        arc: daTa[x][y]
                    });
                }
            })
        })


    }

    const Minimise = (daTa:number[][],verify:verify[]):number=>{
        let minimum = Infinity;
            daTa.forEach((v2,i)=>{
                v2.forEach((v3,j)=>{
                    if( !verify.some((v) => v.row === i && v.column === j) ){
                        minimum = Math.min(minimum,v3)
                    }
                })
                })
            
        return minimum;
    }

    const findDiffMax = (arbre:arbre[]):number=>{
        const max = arbre
        .map(value => value.arc) 
        .filter(arc => arc !== undefined && arc !== null) 
        .reduce((a, b) => Math.max(a, b), -Infinity);

        return max;
    }


    const addSommetValue = (sommetDebutDesignation:string[],arbre:arbre[],max:number,verification:verify[],dataResult:string[][])=>{
        if (!arbre.every((sommet)=>(sommet.sommetFin.value !== -Infinity  && sommet.sommetDebut.value !== -Infinity ))){
            let sommetFinDesignation:string[] = [];
            let updateArbre = arbre.map(item => ({ ...item }));
            let maxDesignation = arbre.find(d=> d.arc == max)?.sommetDebut.designation;

            sommetDebutDesignation.forEach((sommet)=>{
                arbre.map((d,index) => {    
                    let newValue = d;
                    if (d.sommetDebut.designation === sommet) {
                        let valueDebut = d.sommetDebut.value
                        if(d.sommetFin.value < 0){
                            sommetFinDesignation.push(d.sommetFin.designation);
                            valueDebut = arbre.find(e=>e.sommetFin.value !== -Infinity  && e.sommetDebut.designation === d.sommetDebut.designation)?.sommetDebut.value ?? valueDebut ; 
                            newValue = {
                                arc:d.arc,
                                isDegenerate:d.isDegenerate,
                                sommetFin: {
                                    value: d.arc +(max == d.arc && maxDesignation == d.sommetDebut.designation ? 0 : valueDebut),
                                    designation: d.sommetFin.designation, 
                                },
                                sommetDebut: {
                                    value: max == d.arc && maxDesignation == d.sommetDebut.designation  ?  0: valueDebut,
                                    designation: d.sommetDebut.designation,
                                },                            
                                }
                        
                        }
                    updateArbre[index] = newValue;                            
                }
                });
            })
            console.log(updateArbre)
            subSommetValue(sommetFinDesignation,updateArbre,max,verification,dataResult);
        }
            else{
                setArbreState(arbre);
            }
        }   
        
    const subSommetValue =(sommetFinDesignation:string[],arbre:arbre[],max:number,verification:verify[],resultData:string[][])=>{
        if (!arbre.every((sommet)=>(sommet.sommetFin.value !== -Infinity  && sommet.sommetDebut.value !== -Infinity ))){
           
            let sommetDebutDesignation:string[] = [];
            let updateArbre = arbre.map(item => ({ ...item }));
            
            sommetFinDesignation.forEach((value)=>{   
            arbre.map((d,index) => {
            let newValue = d;
            if (d.sommetFin.designation === value ) {
                if(d.sommetDebut.value < 0){
                    sommetDebutDesignation.push(d.sommetDebut.designation );
                    let valueFin = arbre.find(e=>e.sommetDebut.value !== -Infinity && e.sommetFin.designation === d.sommetFin.designation)?.sommetFin.value ?? d.sommetFin.value
                    if(valueFin !== undefined){
                        newValue =  {
                            arc:d.arc,
                            isDegenerate:d.isDegenerate,
                            sommetDebut: {
                                value:valueFin - d.arc,
                                designation: d.sommetDebut.designation,
                                },
                            sommetFin:{
                                designation:d.sommetFin.designation,
                                value: valueFin 
                            }
                            };
                            
                    }
                }
                updateArbre[index] = newValue;
                }
                });
            })
            
                console.log(updateArbre)
                addSommetValue(sommetDebutDesignation,updateArbre,max,verification,resultData);
            }else{
                setArbreState(arbre);
            }
            
        }
        
        const degenerateCase = (
            updateArbre: arbre[],
            verification: verify[],
            dataResult: string[][],
            max: number,
            sommetDebutDesignation:string[]
        ): void => {
            try {
                // Check recursion limit
                let isDegenerate = false;
                const oldArbre = updateArbre 
                for(const q of oldArbre){
                    const degenerateSommet = q.sommetDebut.designation;
                    const degenerateSommetFin = q.sommetFin.designation;

                     isDegenerate = (
                        (updateArbre.filter(a => a.sommetDebut.designation === degenerateSommet).length <= 1 &&
                         !updateArbre.some(e => e.sommetDebut.designation !== degenerateSommet && 
                            e.sommetFin.designation === q.sommetFin.designation && 
                            e.sommetFin.value !== undefined)) ||
                        (updateArbre.filter(a => a.sommetFin.designation === q.sommetFin.designation).length <= 1 &&
                         !updateArbre.some(e => e.sommetFin.designation !== q.sommetFin.designation && 
                            e.sommetDebut.designation === degenerateSommet && 
                            e.sommetFin.value !== undefined))
                    );
        
                    if (isDegenerate) {
                        dispatcH({title:"Cas dégénérer"})
                        
                        for(let i=0; i<updateArbre.length; i++){
                            updateArbre[i] = {
                                arc: updateArbre[i].arc,
                                sommetDebut:{ designation: updateArbre[i].sommetDebut.designation, value: -Infinity },
                                sommetFin:{ designation: updateArbre[i].sommetFin.designation, value: -Infinity },
                            }
                        }
                            

                        let rowIndex = alphabet.findIndex(item => item === degenerateSommet);
                    
                        let col = parseInt(degenerateSommetFin);
        
                        if (col !== undefined) {
                            const colIndex = col - 1;
                             verification = newDataResult( rowIndex == resultContext.length - 1? rowIndex -1:rowIndex+1,colIndex,updateArbre,verification,dataResult);
                            
                            if(verification.filter(a=>a.condition === "minTab").length < resultContext.length+dispoContext.length-1){
                                const debutSommet = updateArbre.find(item=>item.arc == max)?.sommetDebut.designation;
                                let isDegenerateCase = true;
                                let col                         
                                const x = updateArbre.filter(item=>item.sommetDebut.designation === debutSommet);
                                
                                for( const i of x){
                                    isDegenerateCase =  updateArbre.some(e => e.sommetDebut.designation !== debutSommet && 
                                        e.sommetFin.designation === i.sommetFin.designation);
                                        
                                        if(!isDegenerateCase){
                                            break;
                                        }
                                }
                

                                if(!isDegenerateCase){
                                    col = updateArbre.find(item => item.sommetDebut.designation === alphabet[rowIndex+1])?.sommetFin.designation as string;
                                    rowIndex = alphabet.findIndex(item => item === debutSommet)
                                    const colIndex = parseInt(col)-1;
                                    verification = newDataResult(rowIndex,colIndex,updateArbre,verification,dataResult);                
                                }
                            }
                            
                            addSommetValue(sommetDebutDesignation,updateArbre,max,verification,dataResult);
                            break;
                        }
                    }
                }

                if(!isDegenerate){
                    addSommetValue(sommetDebutDesignation,updateArbre,max,verification,dataResult);
                }

            } catch (error) {
    
                if (error instanceof RangeError) {
                    console.error("Stack overflow prevented"); 
                    alert("ERROR")
                }
            }
        };

        const newDataResult = (rowIndex:number,colIndex:number,updateArbre:arbre[],verification:verify[],dataResult:string[][]):verify[]=>{
            const verifUpdate = verification.map(a => {
                let newValue = { ...a };
                dataResult.forEach((value, x) => {
                    value.forEach((value1, y) => {
                        if (x === rowIndex && y === colIndex && 
                            a.row === x && a.column === y) {
                            newValue = {
                                ...a,
                                value: Infinity,
                                condition: "minTab"
                            };
                            dataResult[x][y] = "ε";
                            updateArbre.push({
                                sommetDebut: { designation: alphabet[x], value: -Infinity },
                                sommetFin: { designation: (y + 1).toString(), value: -Infinity },
                                arc: dataTabContext[x][y],
                                isDegenerate:true
                            });
                        }
                    });
                });
                return newValue;
            });
            setVerificationState(verifUpdate);
            return verifUpdate;
        }

        const findOptimal = ()=>{
       
            setDataResultState1(dataResultState)
            setOldArbreState(arbreState)
            const optimal =  findOptimal1(verificationState,marginaux,arbreState,dataTabContext);
            
            if(optimal.marginaux.length !== 0){
                const {updateDataResult:resultData,verifUpdate} = findGain2(optimal.gainArray,dataResultState,verificationState);
                let arbre:arbre[] = [];
            console.log(verifUpdate)
            setVerificationState(verifUpdate);
            findMinTAB3(verifUpdate,dataTabContext,arbre);
            const max = findDiffMax(arbre);
            const sommetDebutDesignation:string[] = arbre.filter(v=>v.arc == max ).map((value)=>value.sommetDebut.designation);
            degenerateCase(arbre,verifUpdate,resultData,max,sommetDebutDesignation); 
            setDataResultState(resultData);
            dispatcH({title:"Solution optimale"})
            
            }else{
                dispatchNotif({
                    payload:{
                        title:"Solution optimale",
                        message:"Il n'y a plus de solution"
                    }
                });
            }
        } 

        const findOptimal1 = (verification:verify[],marginaux:marginaux[],arbre:arbre[],data:number[][]):{marginaux:marginaux[],gainArray:{gain:gain,cout:number,result:number}[]}=>{            
            const allMarginaux:marginaux[] = [];
            verification.map(x=>{
                if(x.condition === "valeur épuisé"){
                    const mX = alphabet[x.row]
                    const mY  = String(x.column+1) 
                    
                    const vx = arbre.find(value=> value.sommetDebut.designation === mX)?.sommetDebut.value
                    const cXY = data[x.row][x.column]
                    const vy = arbre.find(value =>value.sommetFin.designation === mY )?.sommetFin.value

                    if(vx!== undefined && vy !== undefined){
                    const marginauxValue = vx+cXY-vy    
                        if(marginauxValue < 0){
                            marginaux.push({
                                value:marginauxValue,
                                row:mX,
                                rowIndex:x.row.toString(),
                                col:mY,
                                colIndex:x.column.toString(),
                                marginauxString:`${vx}+${cXY}-${vy}`
                            })
                        }
                        
                        allMarginaux.push({
                            value:marginauxValue,
                            row:mX,
                            rowIndex:x.row.toString(),
                            col:mY,
                            colIndex:x.column.toString(),
                            marginauxString:`${vx}+${cXY}-${vy}`
                        })
                    }
                } 
            })
            
            setMarginauxState(allMarginaux);
        
            marginaux.forEach(x=>{
                const gain:gain ={
                    data:x,
                    next:null
                };
                
                let newGain = findGain(verification,"col",parseInt(x.colIndex),parseInt(x.rowIndex),gain,
                {col:parseInt(x.colIndex),row:parseInt(x.rowIndex)},[],[]);

                while(getLastGain(newGain.gain)?.data == x || getLastGain(newGain.gain)?.data.rowIndex !== x.rowIndex ){
                    let gainRemoved = newGain.gainRemoved as gain[];   
                    const lastGain = getLastGain(newGain.gain) as gain;
                    gainRemoved.push(lastGain);                
                    newGain = findGain(verification,"col",parseInt(x.colIndex),parseInt(x.rowIndex),gain,{col:parseInt(x.colIndex),row:parseInt(x.rowIndex)},[],gainRemoved);
                }

                gainArray.push({
                    gain:newGain.gain,
                    cout:newGain.cout,
                    result: Math.abs(newGain.cout) !== Infinity ? newGain.cout * -x.value : newGain.cout  
                });    
       
            })

            return {marginaux,gainArray};
            
        } 
      

        const findGain = (verify:verify[],tab:"row"|"col",col:number,row:number,gain:gain,valDepart:{col:number,row:number},gainCout:number[],gainRemoved:gain[]):{gain:gain,cout:number,gainRemoved?:gain[]}=>{
            if(tab === "col"){
               const filteredVerify = verify.filter(value=> value.condition === "minTab" && !gainRemoved.some(x => x.data.colIndex === value.column.toString() && x.data.rowIndex === value.row.toString()));
                for(const x of filteredVerify){
                const mX = alphabet[x.row]
                const mY  = String(x.column+1)
                    
                        if(x.column === col && x.row !== row ){
                            gainCout.push(gainCout.length < 0 ? x.value : gainCout[gainCout.length - 1] > 0 ? x.value:-x.value );
                            gain.next = {
                                data:{
                                    value: gain.data.value !== undefined ? gain.data.value > 0 ? -x.value :x.value:-x.value ,
                                    row:mX,
                                    rowIndex:x.row.toString(),
                                    col:mY,
                                    colIndex:x.column.toString(),
                                    type:"row"    
                                },
                                next:null
                            };
                            if(valDepart.row === x.row && x.column !== valDepart.col){
                                return {gain,cout:gainCout.length > 1 ? gainCout.reduce((a, b) => {
                                    if (a == b) {
                                      return a; 
                                    }
                                    return Math.max(a, b);
                                  }):gainCout[0]}; 

                            }
                                findGain(verify,"row",x.column,x.row,gain.next,valDepart,gainCout,gainRemoved);
                                break;
                        }
               }  
                   }
                    
             else if(tab === "row"){
                const filteredVerify = verify.filter(value=> value.condition === "minTab" && !gainRemoved.some(x => x.data.colIndex === value.column.toString() && x.data.rowIndex === value.row.toString()));
                for(const x of filteredVerify){
                    const mX = alphabet[x.row]
                    const mY  = String(x.column+1)
                   if(x.row === row && x.column !== col){
                        gain.next = {
                            data:{
                                value:gain.data.value !== undefined ? gain.data.value > 0 ? -x.value :x.value:x.value,
                                row:mX,
                                rowIndex:x.row.toString(),
                                col:mY,
                                colIndex:x.column.toString(),
                                type:"col"    
                            },
                            next:null
                        };
                        
                        findGain(verify,"col",x.column,x.row,gain.next,valDepart,gainCout,gainRemoved);
                        break;    
                    }
                }
                }
            
            return {gain,cout:gainCout.length > 1 ? gainCout.reduce((a, b) => {
                if (a == b) 
                  return a; 
                if(a == -Infinity || b == -Infinity)
                    return -Infinity;
                return Math.max(a, b);
              }):gainCout[0],gainRemoved:gainRemoved};
        }
        
        const getLastGain =(head: gain | null): gain | null =>{
            
            if (!head) return null;
            
            if (!head.next) return head;
            
            let current: gain | null = head;
            
            while (current.next) {
                current = current.next;
            }
            
            return current;
        }

        const  removeLastGain = (head: gain | null): gain | null =>{
            
            if (!head) return null;
        
            if (!head.next) return null;
        
            let current: gain = head;
            while (current.next && current.next.next) {
                current = current.next;
            }
        
            current.next = null;
            
            return head;
        }

        const hasElement = (head: gain | null, element: {rowIndex:string,colIndex:string}): boolean =>{
            
            if (!head || !head.data) return true; 
    
            let current: gain | null = head;
            while (current && current.data) { 
                if (current.data.colIndex === element.colIndex && 
                    current.data.rowIndex === element.rowIndex) {
                    return false; 
                }
                current = current.next;
            }
            
            return true;
        }

        const findGain2 = (gainArray:{gain:gain,cout:number,result:number}[],dataResult:string[][],verify:verify[]):{updateDataResult: string[][],verifUpdate:verify[]}=>{
                console.log(gainArray); 
                const newDataResults = dataResult.map(x=>[...x]); 
                 let optimalValue = gainArray.filter(d=>Math.abs(d.result) !== Infinity).map(x=>x.result).reduce((a,b)=>
                 {
                    return Math.min(a,b)
                 },Infinity);

                const opt =  gainArray.map(x=>x.result).reduce((a,b)=>
                    {
                       return Math.min(a,b)
                    },Infinity);

                 const newGainOptimal:{gain:gain,cout:number,result:number} =( gainArray.find(x=>x.result == optimalValue) !== undefined ? gainArray.find(x=>x.result == optimalValue)
                 : gainArray.find(x=>x.result == opt))as {gain:gain,cout:number,result:number};
                 
                 let currentNewGainOptimal:gain = newGainOptimal?.gain as gain;
                 let updateDataResult = dataResult.map(x=>[...x]);

                 optimalValue = optimalValue == Infinity ? 0 :optimalValue;

                 let verifUpdate = verify.map(x => ({ ...x }));

                 updateDataResult = newDataResults.map((value, x) => {
                    return value.map((value1, y) => {
                        let newValue1 = value1;
                        let tempGain = currentNewGainOptimal;
                 

                        while (tempGain) {
                            if (String(x) === tempGain.data.rowIndex && 
                                String(y) === tempGain.data.colIndex) {
           
                                newValue1 = String(Math.abs(tempGain.data.value + newGainOptimal?.cout)) === "0" || isNaN(Math.abs(tempGain.data.value + newGainOptimal?.cout)) 
                                    ? "-" 
                                    : (newGainOptimal?.result/newGainOptimal.cout)  == Math.abs(tempGain.data.value) && newValue1 == "-"
                                    ? String(Math.abs(newGainOptimal.cout))
                                    : Math.abs(newGainOptimal.cout) == Infinity && tempGain.data.value !== Infinity && tempGain.data.value !== currentNewGainOptimal.data.value  ?Math.abs(tempGain.data.value).toString() 
                                    : String(Math.abs(tempGain.data.value - Math.abs(newGainOptimal?.cout)));
                                
                                    verifUpdate = verifUpdate.map(val=>{
                                        let newValue = val;
                                        if(val.row === x && val.column === y){
                                            newValue = {
                                                ...val,
                                                value: Number(newValue1) == 0 || newValue1 == "-"  ? -Infinity : Number(newValue1),
                                                condition: Number(newValue1) !== 0 && newValue1 !== "-" ? "minTab" : "valeur épuisé"
                                            };
                                        }
                                        
                                        return newValue;
                                    })
                                    
                                newValue1 = Math.abs(Number(newValue1)) === Infinity ? "ε": newValue1;
                                break;
                            }
                            
                            tempGain = tempGain.next as gain;
                        }
                        
                        return newValue1;
                    });
                });

                setZ(z=>{
                    setShowZ(`${z}  - ${Math.abs(optimalValue)}`)
                   return z+optimalValue
                });

                setGainState(gainArray);
                setNewGainState(currentNewGainOptimal);
                console.log(verifUpdate)
                return {updateDataResult,verifUpdate};
        }

        useEffect(()=>{
            setZ(0);
            setShowZ("");
            setGainState([]);
            setNewGainState(undefined);
            dtrs = Array.from({ length: resultContext.length+dispoContext.length - 1},()=>Array.from({ length: dispoContext.length }, () => Array(resultContext.length).fill("")))
            if(type.toUpperCase() == "MINTAB")
                findMinTAB(dataTabContext,dispoContext,resultContext,verification,arbre,dataResult,dis,rs,dtrs,0)
            else{
                findBhammer(minRowCol,cleanRowCol,dataTabContext,dispoContext,resultContext,verification,arbre,dataResult,dis,rs,dtrs,0,
                    updateDataTabResult,setDtrsState,setDataResultState,setRsState,setDisState,setZ,findMinTAB3,addSommetValue,findMinTAB2,
                findDiffMax,setCleanRowCol,setMinRowCol,degenerateCase)        
                }
        },[dataTabContext])
 
        
      useEffect(() => {
            if(dtrsState.length !==0){
                const idInterval = setInterval(() => {
                    setIndexValue((prevIndex) => {
                      const newIndex = prevIndex + 1;
                      if (prevIndex == verificationState.filter(d=>d.condition === "minTab").length-1) {
                        clearInterval(idInterval);
                        return -1;
                      }
                      return newIndex;
                    });
                  }, 2000);
              
                  // Nettoyage de l'intervalle lorsque dtrsState change ou le composant est démonté
                  return () => {
                    clearInterval(idInterval);
                    setIndexValue(0);
                  };   
            }
             
          }, [dtrsState]); // Dépend uniquement de dtrsState
        
    return(
        < div className="relative ">
            {
                Z !== 0 &&(
                    <div className="flex flex-row  justify-around mx-auto">
                        <DataTable dataTab={dataTabContext} dispo={dispoContext} result={resultContext} alphabet={alphabet}/>
                    {
                        newGainState !== undefined && (
                            <DataTable dataResult={dataResultState1} gain={newGainState} alphabet={alphabet} dispo={dispoContext} result={resultContext}/>
                        )
                    }
                   
                    {
                        (indexValue < verificationState.filter(d=>d.condition === "minTab").length-1 && indexValue >= 0  && type.toUpperCase() !== "MINTAB") && (
                            <DataTableBhammer alphabet={alphabet} dispo={dispoContext} dataTab={dataTabContext} result={resultContext} 
                            cleanRowCol={cleanRowColState.length -1 <= indexValue ? cleanRowColState.filter((value,index) => index <= cleanRowColState.length -1) : cleanRowColState.filter((value,index) => index <= indexValue)} minRowCol={ minRowColState[indexValue]} nbr={indexValue}/> 
                        )
                    }   
                         
                        <DataTable dispo1={{index:indexValue < disState.length ? indexValue: dtrsState.length,data:disState}} dispo={dispoContext} result={resultContext} alphabet={alphabet} 
                        dataResult={indexValue < 0 || indexValue >= verificationState.filter(d=>d.condition === "minTab").length-1 || type.toUpperCase() == "MINTAB"  ? dataResultState: dtrsState[indexValue] } result1={{index:indexValue < rsState.length ? indexValue: dtrsState.length,data:rsState}} 
                        />
        
                    </div>
                )
            }
           
            
            {
               dataResultState !== undefined && dataTabContext.length  !== 0  && (indexValue < 0 || type.toUpperCase() == "MINTAB")  &&(
                    <div className="flex flex-row space-x-4 ">
                        <Network networkData={oldArbreState} />
                        <div className="flex flex-col">
                                    <div >
                                        {
                                            showZ !== "" && 
                                            (
                                                <p className="font-semibold text-2xl mb-5">Z={showZ.substring(0,showZ.indexOf("-")+1)}<span className="text-red-400">{showZ.substring(showZ.indexOf("-")+1) }</span></p>
                                            )
                                        }
                                    
                                        <p className="font-semibold text-2xl mb-5">Z={Z}</p>
                                              
                                    </div>
        
                            <div className="grid grid-cols-3">
                            
                            {
                                marginauxState.length !==0 &&(
                                    marginauxState.map((x,key)=>(
                                        <p key={key} className="text-lg">{`∂(${x.row},${x.col})`} = {x.marginauxString} = <span className={` ${x.value < 0 ? "text-red-500" :""}`}>{x.value > 0 ? "P": x.value }</span></p>    
                                    ))
                                )
                            }
                            </div>
                            <div className="mt-2 mb-2">
                            {
                                (gainState?.length !==0 && gainState?.length !== undefined && newGainState?.data !== undefined )&& (
                                    <p className="text-xl mb-2">Gains obtenus par l'utilisation des relations des coûts marginaux négatifs</p>
                                )  
                            }
                                
                            {
                                (gainState?.length !==0 && gainState?.length !== undefined && newGainState?.data !== undefined) &&(
                                    gainState.map((x,key)=>(
                                        <p className={`${newGainState == x.gain ? "text-red-500":""} text-lg` } key={key}>{`gain(${x.gain.data.row},${x.gain.data.col})`} = {`${x.gain.data.value } x ${Math.abs(x.cout) !== Infinity ? -x.cout :"ε"} = ${ Math.abs(x.cout) === Infinity ? "-ε": x.result}`}</p>   
                                ))
                            )}
                            </div>
                            {
                                Z !== 0 &&(
                                    <button className="mx-auto w-20 h-10 bg-blue-600 rounded-sm py-2 px-2 text-white font-semibold text-sm cursor-pointer transition-all ease-in hover:bg-blue-500 active:scale-90" onClick={()=>{findOptimal()}}>
                                        Optimal
                                    </button>
                                    
                                )
                            }
                            
                        </div>
                        
                    </div>
                )
            }

            {
                dataTabContext.length == 0 &&(
                    <div className="flex flex-col-reverse items-center mt-20 space-y-3 mx-auto my-auto">
                        
                        <TypewriterEffect
                        words={[
                            { text: "PROBLEME" },
                            { text: "DE" },
                            { text: "TRANSPORT" ,
                            className: "text-blue-400 dark:text-blue-500 ",
                            }
                        ]} />
                        <Image width={400}  height={400} src={"/assets/transport.gif"} alt="aa" priority/>
                        
                    </div>
                     
                )
            }
            
        </div>
    )
}//∂