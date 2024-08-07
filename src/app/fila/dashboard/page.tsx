"use client";
import React, { useContext, useEffect, useState } from "react";
import Atendentes from "./components/Atendentes";
import Solicitantes from "./components/Solicitantes";
import Fila from "./components/Fila";
import { DatePicker } from "antd";
// import dayjs from "dayjs";
import { DateContext } from "./dateContext";
import dayjs from "dayjs";

function Dashboard() {
  const { startDate, setStartDate, endDate, setEndDate } =
    useContext(DateContext);

  return (
    <>
      <main className="flex flex-col space-y-7">
        <div className=" flex  flex-col justify-center items-center space-y-2">
          <DatePicker.RangePicker
            key={1}
            format={'DD/MM/YYYY'}
            onChange={(e) => {
              let data = new Date(e?.[1])
              let dia = data.getDate()
              dia = data.setDate(dia+1)
              setStartDate(e?.[0])
              setEndDate(new Date(dia))
            }}
            defaultValue={[dayjs(startDate), dayjs(new Date())]}
            allowEmpty={false}
          />
          <h1>Fila</h1>
          <Fila />
        </div>
        <div className="flex space-x-7 ">
          <div className=" flex  flex-col justify-center items-center space-y-2">
            <h1>Atendimento</h1>
            <Atendentes />
          </div>
          <div className=" flex  flex-col justify-center items-center space-y-2">
            <h1>Solicitantes</h1>
            <Solicitantes />
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;
