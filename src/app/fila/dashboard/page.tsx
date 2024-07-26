"use client";
import React, { useEffect, useState } from "react";
import Atendimento from "@/app/atendimento/page";
import { api } from "@/app/api";
import { Table, TableProps } from "antd";

interface DataType {
  nome: string;
  atendidos: number
}

const columns: TableProps<DataType>["columns"] = [
  {
    key: "nome",
    title: "Operador",
    dataIndex: "nome",
  },
  {
    key: "atendidos",
    title: "Atendimentos",
    dataIndex: "atendidos",
    sorter: (a, b) => a.atendidos - b.atendidos,
    defaultSortOrder:'descend'
  },
];

function Dashboard() {
  const [dataApi, setDataApi] = useState([]);

  useEffect(() => {
    api
      .get("/user/atendimentos")
      .then(({ data }) => {
        setDataApi(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = dataApi.map(({ nome, atendidos }) => {
    return {
      key: nome,
      nome,
      atendidos,
    };
  });

  return (
    <>
      <Table columns={columns} dataSource={data}></Table>
    </>
  );
}

export default Dashboard;
