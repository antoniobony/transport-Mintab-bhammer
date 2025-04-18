"use client"

import { BarContext } from "@/app/(context)/barContext"
import { useContext, useState } from "react"
import { MyModal } from "../Modal/Modal";
import Field from "../Field/Field";
import ModalForm from "../Modal/ModalForm";
import { DataContext } from "@/app/(context)/dataContext";

export default function Bar() {
    const {title} = useContext(BarContext);
    const {type} = useContext(DataContext);
    
    return (
        <div className="sticky top-0 left-0 w-full z-10 bg-white">
            <div className="flex flex-row justify-between w-full border-b-[1px] border-gray-400 p-2 bg-white">
                <div className="bg-linear-to-r from-green-500 to-green-600 text-white py-1 px-3">
                    <p className="text-center">RECHERCHE</p>
                    <p>OPERATIONNELLE</p>
                </div>
                <h1 className="text-3xl font-semibold text-red-400 my-auto">{title}</h1>
                <ModalForm/>
            </div>
            <div className="justify-start p-2 m-2 bg-linear-to-r from-cyan-500 to-[#1063cf]">
                <p className="font-medium text-xl text-white">Méthode { title == "Solution optimale" ? type.toUpperCase()+" - Algorithme de Stepping Stone": type.toUpperCase()}</p>
            </div>
        </div>
    )
}