import React from "react";

type Props= {
    type:string,
    className?:string,
    name:string,
    placeholder?:string,
    onChange?:(e:any)=>void,
    defaultValue?:any,
    hidden?:boolean,
    max?:number,
    accept?:string,
    required?:true,
    value?:string,
    min?:number,
}

type Ref = HTMLInputElement;

const Field = React.forwardRef<Ref, Props>(({name,max,onChange,type,defaultValue,required,hidden,value,placeholder,className,min}:Props,ref)=>(
    
    <input
        className={className}
        hidden={hidden}
        max={max}
        placeholder={placeholder}        
        value={value}
        onChange={onChange}
        name={name}
        type={type}
        required={required}
        ref={ref}
        defaultValue={defaultValue}
        min={min}
      />
)
)

export default Field;