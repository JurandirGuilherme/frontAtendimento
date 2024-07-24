"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api"
import { ApiContext } from "../ApiContext";
import moment from "moment";


interface DataType {
  key: string;
  nome: string;
  via: number;
  solicitante:string;
  createdAt:string;
}
function AtendidosHoje() {
  const [AtendidosHoje, setAtendidosHoje] = useState([]);
  const {refresh} = useContext(ApiContext)


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
  }, [refresh]);


  const data = AtendidosHoje.map(
    ({ id, requerente, via, inicio, fim, createdAt, usuario }) => {
      const dtInicio = moment(inicio).format('DD/MM/YYYY hh:mm:ss')
      const dtFim = moment(fim).format('DD/MM/YYYY hh:mm:ss')
      const dtInicioM = moment(inicio).format('LTS')
      const dtFimM = moment(fim).format('LTS')

      return {
        key: id,
        nome: requerente.nome,
        via,
        inicio: dtInicio,
        fim: dtFim,
        duracao:  `${moment.duration(moment(dtFimM, 'LTS').diff(moment(dtInicioM, 'LTS'))).asMinutes().toFixed()} minuto(s)`,
        createdAt,
        solicitante: usuario!.nome,
      };
    }
  );


  

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Inicio",
      dataIndex: "inicio",
      key: "fim",
    },
    {
      title: "Fim",
      dataIndex: "fim",
      key: "fim",
    },
    {
      title: "Duração",
      dataIndex: "duracao",
      key: "duracao",
    },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
    },
  
  ];
  return (
    <Table
    columns={columns}
    dataSource={data}
  />
  )
}

export default AtendidosHoje