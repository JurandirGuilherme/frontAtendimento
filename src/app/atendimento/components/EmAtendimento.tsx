"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api";
import { ApiContext } from "../ApiContext";
import { LoadingContext } from "@/app/LoadingContext";
import moment from "moment";

interface DataType {
  key: string;
  nome: string;
  via: number;
  solicitante: string;
  createdAt: string;
}
function EmAtendimento() {
  const [emAtendimento, setEmAtendimento] = useState([]);
  const { refresh, setRefresh } = useContext(ApiContext);
  const { setIsLoading } = useContext(LoadingContext);

  useEffect(() => {
    setRefresh(true);
    setIsLoading(true);
    api
      .get("/atendimento/user", {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      })
      .then(({ data }) => {
        setEmAtendimento(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refresh]);

  const data = emAtendimento.map(
    ({ id, requerente, via, createdAt, usuario }) => {
      return {
        key: id,
        nome: requerente.nome,
        via,
        createdAt: moment(createdAt).format('DD/MM/YYYY hh:mm:ss'),
        solicitante: usuario!.nome,
      };
    }
  );

  const handleEmAtendimento = (id: string) => {
    setRefresh(!refresh);
    api
      .put(
        "/atendimento",
        {
          atendimentoId: id,
        },
        {
          headers: {
            Authorization: sessionStorage.getItem("token"),
          },
        }
      )
      .then(({ data }) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Nome",
      dataIndex: "nome",
      key: "nome",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Inicio",
      dataIndex: "createdAt",
      key: "inserido",
    },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
    },
    {
      title: "Ação",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <button
            onClick={() => {
              handleEmAtendimento(record.key);
            }}
            className="bg-red-700 text-white p-1 rounded-md shadow shadow-md"
          >
            Finalizar
          </button>
        </Space>
      ),
    },
  ];
  return <Table columns={columns} dataSource={data} />;
}

export default EmAtendimento;
