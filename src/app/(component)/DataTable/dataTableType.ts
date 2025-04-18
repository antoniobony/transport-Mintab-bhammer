import { gain } from "@/app/romodif/page"

export type dataTableType={
    result?:number[],
    alphabet?:string[],
    dispo?:number[],
    dataTab?:number[][],
    result1?:{
        index:number,
        data:number[][]
    },
    dispo1?:{
        index:number,
        data:number[][]
    },
    dataResult?:string[][],
    gain?:gain
}
