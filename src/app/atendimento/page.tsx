"use client";
import React, { useEffect, useState } from "react";

import Preferencial from "./components/Preferencial";
import EmAtendimento from "./components/EmAtendimento";
import Geral from "./components/Geral";
import AtendidosHoje from "./components/AtendidosHoje";
import { api } from "../api";


const Atendimento = () => {
  const [atendidosHoje, setAtendidosHoje] = useState([]);

  useEffect(() => {
    api
      .get("/atendimento/atendidos", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setAtendidosHoje(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    api
      .get("/atendimento/atendidos", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setAtendidosHoje(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
 
  return (
    <>
    <main className="flex flex-col w-full h-full justify-center items-center">
      <div className="flex space-x-7">
        <div>
          <h1 className="w-full text-center p-2">Geral</h1>
          <Geral/>
        </div>
        <div>
          <h1 className="w-full text-center p-2">Preferencial</h1>
          <Preferencial/>
        </div>
      </div>


      <div className="flex space-x-12" id="inferior">
        <div>
          <h1 className="w-full text-center p-2">Em Atendimento</h1>
          <EmAtendimento/>

        </div>
        <div>
          <h1 className="w-full text-center p-2">Atendidos Hoje</h1>
          <AtendidosHoje  />
        </div>
      </div>
      </main>
    </>
  );
};

export default Atendimento;
