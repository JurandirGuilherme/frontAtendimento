"use client";
import React, { useEffect, useState } from "react";
import Atendimento from "@/app/atendimento/page";
import { api } from "@/app/api";
import { Table, TableProps } from "antd";

interface DataType {
  nome: string;
  atendidos: number
  preferencial: number
  geral: number
}

const columns: TableProps<DataType>["columns"] = [
  {
    key: "nome",
    title: "Atendente",
    dataIndex: "nome",
  },
  {
    key: "geral",
    title: "Geral",
    dataIndex: "geral",
    sorter: (a, b) => a.geral - b.geral,
    
  },
  {
    key: "preferencial",
    title: "Preferencial",
    dataIndex: "preferencial",
    sorter: (a, b) => a.preferencial - b.preferencial,
    
  },
  {
    key: "atendidos",
    title: "Total",
    dataIndex: "atendidos",
    sorter: (a, b) => a.atendidos - b.atendidos,
    defaultSortOrder:'descend'
  }
];

function Atendentes() {
  const [dataApi, setDataApi] = useState([]);

  useEffect(() => {
    api
      .get("/user/atendimentos")
      .then(({ data }) => {
        setDataApi(data);
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = dataApi.map(({ nome, atendidos, preferencial, geral }) => {
    return {
      key: nome,
      nome,
      preferencial,
      geral,
      atendidos,
    };
  });

  return (
    <>
      <Table columns={columns}  pagination={{position: ["bottomCenter"]}} dataSource={data}></Table>
    </>
  );
}

export default Atendentes;
