"use client";
import { api } from "@/app/api";
import { Table, TableProps } from "antd";
import React, { useEffect, useState } from "react";

function Fila() {
  const [preferencial, setPreferencial] = useState();
  const [geral, setGeral] = useState();
  const [total, setTotal] = useState();

  useEffect(() => {
    api
      .get("/requerente/dashboard")
      .then(({ data }) => {
        console.log(data);
        setPreferencial(data.preferencial);
        setGeral(data.geral);
        setTotal(data.total);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const data = [{
      key: total,
      preferencial,
      geral,
      total,
    }];

  interface DataType {
    nome: string;
    total: number;
    preferencial: number;
    geral: number;
  }

  const columns: TableProps<DataType>["columns"]  = [
   
      {
        key: "preferencial",
        title: "Preferencial",
        dataIndex: "preferencial",
      },
    {
      key: "geral",
      title: "Geral",
      dataIndex: "geral",
    },
    {
      key: "total",
      title: "Total",
      dataIndex: "total",
    },
  ];

  return <Table  style={{textAlign: "center", justifyContent: "center"}} pagination={false} columns={columns}  dataSource={data}>Fila</Table>;
}

export default Fila;
