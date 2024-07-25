"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api";
import { ApiContext } from "@/app/atendimento/ApiContext";
import moment from "moment";

interface DataType {
  key: string;
  nome: string;
  via: number;
  solicitante: string;
  createdAt: string;
}
function AtendidosHoje() {
  const [AtendidosHoje, setAtendidosHoje] = useState([]);
  const { refresh } = useContext(ApiContext);

  useEffect(() => {
    api
      .get("/atendimento/atendidosgeral", {
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
      const dtInicio = moment(inicio).format("DD/MM/YYYY hh:mm:ss");
      const dtFim = moment(fim).format("DD/MM/YYYY hh:mm:ss");
      const dtInicioM = moment(inicio).format("LTS");
      const dtFimM = moment(fim).format("LTS");

      const insercao = moment(requerente.createdAt).format(
        "DD/MM/YYYY hh:mm:ss"
      );

      const dtInsercaoM = moment(requerente.createdAt).format("LTS");
      return {
        key: id,
        nome: requerente.nome,
        via,
        insercao,
        atendente: usuario.nome,
        espera: `${moment
          .duration(moment(dtInicioM, "LTS").diff(moment(dtInsercaoM, "LTS")))
          .asHours()
          .toFixed()} hora(s)`,
        inicio: dtInicio,
        fim: dtFim,
        duracao: `${moment
          .duration(moment(dtFimM, "LTS").diff(moment(dtInicioM, "LTS")))
          .asMinutes()
          .toFixed()} minuto(s)`,
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
      title: "Inserção",
      dataIndex: "insercao",
      key: "insercao",
      sortOrder:"ascend"
    },
    {
      title: "Inicio de Atendimento",
      dataIndex: "inicio",
      key: "fim",
    },
    {
      title: "Fim de Atendimento",
      dataIndex: "fim",
      key: "fim",
    },
    {
      title: "Duração de Atendimento",
      dataIndex: "duracao",
      key: "duracao",
    },
    {
      title: "Tempo de Espera Total",
      dataIndex: "espera",
      key: "duracao",
    },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
    },
    {
      title: "Atendente",
      dataIndex: "atendente",
      key: "atendente",
    },
  ];
  return <Table columns={columns} dataSource={data} />;
}

export default AtendidosHoje;
