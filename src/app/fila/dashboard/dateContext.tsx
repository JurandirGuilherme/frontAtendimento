import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { SetStateAction } from "react";
import React, { createContext, useState } from "react";
import moment from "moment";


interface IDate {
    startDate: Dayjs | undefined | null;
    endDate: Dayjs | undefined | null;
    setStartDate?: React.Dispatch<SetStateAction<Dayjs>> | null | undefined;
    setEndDate?: React.Dispatch<SetStateAction<Dayjs>> | null |undefined;
}
// const iDate:IDate =  {
//     startDate: null,
//     endDate: null,
//     setStartDate: ()=>{},
//     setEndDate: ()=>{}
// }


const DateContext = createContext<IDate>();

function DateContextC({ children }: Readonly<{children: React.ReactNode}>) 
{
    let data = new Date()
    let dia = data.getDate()
    dia = data.setDate(dia+1)

  const [startDate, setStartDate] = useState(moment(new Date()).format('YYYY-MM-DD'));
  const [endDate, setEndDate] = useState(moment(dia).format('YYYY-MM-DD'));

  return (
    <DateContext.Provider
      value={{startDate, setStartDate, endDate, setEndDate}}
    >
      {children}
    </DateContext.Provider>
  );
}

export { DateContextC, DateContext };
