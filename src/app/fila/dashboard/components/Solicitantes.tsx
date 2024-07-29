"use client";
import React, { useEffect, useState } from "react";
import Atendimento from "@/app/atendimento/page";
import { api } from "@/app/api";
import { Table, TableProps } from "antd";

interface DataType {
  nome: string;
  total: number
  preferencial: number
  geral: number
}

const columns: TableProps<DataType>["columns"] = [
  {
    key: "nome",
    title: "Solicitante",
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
    key: "total",
    title: "Total",
    dataIndex: "total",
    sorter: (a, b) => a.total - b.total,
    defaultSortOrder:'descend'
  }
];

function Solicitantes() {
  const [dataApi, setDataApi] = useState([]);

  useEffect(() => {
    api
      .get("/user/solicitantes")
      .then(({ data }) => {
        setDataApi(data);
        console.log(data)
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = dataApi.map(({ nome, total, preferencial, geral }) => {
    return {
      key: nome,
      nome,
      preferencial,
      geral,
      total,
    };
  });

  return (
    <>
      <Table columns={columns} pagination={{position: ["bottomCenter"]}} dataSource={data}></Table>
    </>
  );
}

export default Solicitantes;
