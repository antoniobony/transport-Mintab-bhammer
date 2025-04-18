import { SetStateAction } from "react";
import { arbre, DegenerateContext, verify } from "../romodif/page";

export type Min={
    row?:number,
    col?:number,
    value: number,
}

export type cleanRowCol = {
    type:"col"|"row",
    index:number,
    max:number,
    minBhammer:{
        val:number,
        x:number,
        y:number
    }
    verify:verify[]
}


const diffRowCol = (data:number [][],verification:verify[]):Min[] =>{
    const min:Min[] = [];

    
    data.forEach((value, x) => {
        let firstMin = Infinity;
        let secondMin = Infinity;

        for(let y = 0; y < data[x].length; y++) {
            if(!verification.some(v => v.column === y && v.row === x)) {
                 firstMin = Math.min(firstMin, data[x][y]);
            }
        }
      
   
        const indexFirstMin = value.findIndex(val => 
            val === firstMin && 
            !verification.some(v => v.column === value.indexOf(val) && v.row === x)
        );
    
        
        for(let y = 0; y < data[x].length; y++) {
            if(!verification.some(v => v.column === y && v.row === x) && y !== indexFirstMin ) {
                 secondMin = Math.min(secondMin, data[x][y]);
            }
        }

     
    
        const valueMin =  Math.abs(firstMin - secondMin); 
        min.push({
            row: x,
            value: isNaN(valueMin) ? -Infinity : valueMin == Infinity ? firstMin :valueMin,
        });
    });

    for(let i = 0; i < data[0].length; i++) {
        let iMin = Infinity;
        let iMinIndex = {
            x: 0,
            y: 0
        };
        let jMin = Infinity;
    
        for(let j = 0; j < data.length; j++) {
            if(!verification.some(v => v.column === i && v.row === j)) {
                if(data[j][i] < iMin) {  
                    iMin = data[j][i];
                    iMinIndex.x = j;
                    iMinIndex.y = i;
                }
            }
        }
    
        for(let j = 0; j < data.length; j++) {
            if(!verification.some(v => v.column === i && v.row === j)) {
                if(j !== iMinIndex.x) {  
                    jMin = Math.min(jMin, data[j][i]);
                }
            }
        }
        
        const value =  Math.abs(iMin - jMin);
        min.push({
            col: i,
            value:  isNaN(value) ? -Infinity : value == Infinity ? iMin : value 
        });
    }
    console.log(min)
    return min;
}

const findMaxCout = (min:Min[],data:number[][],verification:verify[]):{max:Min,minCout:{val:number,x:number,y:number}} =>{
    let minCout = {
        val:Infinity,
        x: Infinity,
        y: Infinity
    };

    const max = min.reduce((a,b)=>{
        if(a.value > b.value)
            return a;
        
        else if(a.value == b.value)
            return a;
        
        return b;
    });

    if(max.row !== undefined ){    
        minCout.x = max.row;
        data.filter((val,x)=> x === max.row).forEach((value,x)=>{
            minCout.val = value.filter((va,y) => !verification.some(v => v.column === y && v.row === x)).reduce((a,b) =>{
            if(a == b)
                return a;
           return Math.min(a,b)
        },Infinity);

        if(minCout.val == Infinity)
            minCout.val = max.value;
        
        minCout.y = value.findIndex(value => value == minCout.val);    
        });
        
    }else{
        for(let i=0 ; i<data[0].length; i++){
            if(i == max.col){
                minCout.y = i;
                for(let j=0;j<data.length;j++){  
                    if(minCout.val > data[j][i] && !verification.some(v => v.column === i && v.row === j)){
                        minCout.x = j;
                    }
                    minCout.val = Math.min(minCout.val,data[j][i]);
                } 
            }
        }
    }


    return {max,minCout}
}

export const  findBhammer = (
    minRowCol:Min[][],
    clean:cleanRowCol[],
    data: number[][],
    dispoData:number[],
    resultData:number[],
    verification:verify[],
    arbre:arbre[],
    dataResult:string[][],
    dispo:number[][],
    result:number[][],
    dResult:string[][][],
    count:number,
    updateDataTabResult:(indexX: number,
        indexY: number,
        minTab: number,
        valueDispo: number,
        valueResult: number,
        verification: verify[],
        dResult:string[][][],
        dataResult: string[][],
        count:number,
        )=>string[][],
        setDtrsState: (value: SetStateAction<string[][][]>) => void,
        setDataResultState: (value: SetStateAction<string[][]>) => void,
        setRsState: (value: SetStateAction<number[][]>) => void,
        setDisState: (value: SetStateAction<number[][]>) => void,
        setZ: (value: SetStateAction<number>) => void,
        findMinTAB3: (verification: verify[], daTa: number[][], arbre: arbre[]) => void,
        addSommetValue: (sommetDebutDesignation: string[], arbre: arbre[], max: number, verification: verify[], dataResult: string[][], context?: DegenerateContext) => void,
        findMinTAB2: (daTa: number[][], sum: number, verify: verify[]) => number,
        findDiffMax: (arbre: arbre[]) => number, 
        setCleanRowCol:(value: SetStateAction<cleanRowCol[]>) => void,
        setMinRowCol:(value: SetStateAction<Min[][]>) => void,
        degenerateCase : (
            updateArbre: arbre[],
            verification: verify[],
            dataResult: string[][],
            max: number,
            sommetDebutDesignation:string[]
        )=> void
        ) => {
            if(verification.length < dispo[0].length  * result[0].length){
                const prevVerify = verification.map(x=> ({...x}));
                console.log(verification,verification.length, dispo[0].length  * result[0].length)
                const diff = diffRowCol(data,verification);
                minRowCol.push(diff);
                let min = findMaxCout(diff,data,verification);  

                data.forEach((v,indexX)=>{
                    v.forEach((num,indexY)=>{
                        if(min.minCout.x == indexX && min.minCout.y == indexY){
                        const minTab = Math.min(dispoData[indexX],resultData[indexY])
                        let valueDispo = dispoData[indexX] - minTab
                        let valueResult =  resultData[indexY] - minTab
                    
                    
                        if(valueDispo >=0 && valueResult >= 0){
                            dataResult = updateDataTabResult(indexX,indexY,minTab,valueDispo,valueResult,verification,dResult,dataResult,count)
                            
                            const lastMinTab = verification.findLast(val => val.condition === "minTab");
                            const diffVerify = verification.length - prevVerify.length - 1;
                            const currentVerification = verification.length - prevVerify.length
                            let isRow = false;
                            let rowColEpuise:verify[] = [];
                            let x = 0;
                            let y = 0;

                            if(lastMinTab !== undefined){
                                if(diffVerify >= 1) {
                                    rowColEpuise = verification.filter(va=>  va.condition === "valeur épuisé").slice(-diffVerify);
                            
                                    if(diffVerify == 1){
                                        rowColEpuise.push(lastMinTab);
                                    }
                                        
                                    isRow = rowColEpuise.every(val => val.row == rowColEpuise[0].row);
                                    x = rowColEpuise[0].row;
                                    y = rowColEpuise[0].column;

                                }else{
                                    isRow = verification.filter(val => val.row == lastMinTab.row).length == result[0].length;
                                    x = lastMinTab.row;
                                    y = lastMinTab.column;
                                }
                                
                            }
                            

                            clean.push({
                                max: min.max.value,
                                minBhammer: min.minCout,
                                index: isRow ? x  : y ,
                                type: isRow ? "row" : "col",
                                verify:currentVerification !== 0 ? verification.slice(-currentVerification) : []
                            })             
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

            findBhammer(
                minRowCol,
                clean,
                data,
                dispoData,
                resultData,
                verification,
                arbre,
                dataResult,
                dispo,
                result,
                dResult
                ,count+1,
                updateDataTabResult,
                setDtrsState,
                setDataResultState,
                setRsState,
                setDisState,
                setZ,
                findMinTAB3,
                addSommetValue,
                findMinTAB2,
                findDiffMax,
                setCleanRowCol,
                setMinRowCol,
                degenerateCase
            )  
            }
            else if (arbre.length == 0) {        
                if (setDataResultState !== undefined && setDisState !== undefined && setDtrsState !== undefined 
                    && setRsState !== undefined && setCleanRowCol !== undefined && setMinRowCol !== undefined) {
                    
                    setCleanRowCol(clean);
                    setMinRowCol(minRowCol);
                    console.log(minRowCol,clean);
                    setDtrsState(dResult.filter(x => x.filter(y => y.every(d => d.toString() !== ""))));
                    setDataResultState(dataResult);
                    setRsState(result.filter(x => x.every(d => d.toString() !== "")));
                    setDisState(dispo.filter(x => x.every(d => d.toString() !== "")));
                    
                    let sum = 0;
                    sum = findMinTAB2(data, sum, verification);
                    setZ(sum);
                    findMinTAB3(verification, data, arbre);
                    const max = findDiffMax(arbre);
                    const sommetDebutDesignation: string[] = arbre.filter(v => v.arc == max).map((value) => value.sommetDebut.designation);
                    degenerateCase(arbre,verification,dataResult,max,sommetDebutDesignation);
                    addSommetValue(sommetDebutDesignation, arbre, max, verification, dataResult);
                    
                }
            } 
    };

