import React from "react";
import Atendentes from "./components/Atendentes";
import Solicitantes from "./components/Solicitantes";
import Fila from "./components/Fila";

function page() {
  return (
    <>
      <main className="flex flex-col space-y-7">
        <div className=" flex  flex-col justify-center items-center space-y-2">
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

export default page;
