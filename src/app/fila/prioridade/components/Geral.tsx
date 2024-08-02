"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api";
import moment from "moment";
import "moment/dist/locale/pt-br";
import {Button} from 'antd';

interface DataType {
  key:number
  numero: number;
  entrega: string;
  postoOrigem: string;
  solicitante: string;
}

function Geral() {
  const [refresh, setRefresh] = useState<boolean>(false)



  const [pedido, setPedido] = useState([]);
  useEffect(() => {
    setTimeout((()=>{setRefresh(!refresh)}), 60000)

    api
      .get("/pedido/emfila")
      .then(({ data }) => {
        setPedido(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);


  const handleFinalizar = (numero: number) => {
    api
      .put(
        "/pedido/impresso",
        {
          pedido: numero,
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
      }).finally(()=>{
        setRefresh(!refresh);
      });
  };

  const data = pedido.map(
    ({
      numero,
      entrega,
      postoOrigem,
      createdAt,
      solicitante,
      postoDestino,
      atividadeAtual,
    }) => {
      return {
        key:numero,
        numero,
        postoOrigem,
        entrega: entrega.nome!,
        createdAt: moment(createdAt)
          .locale("pt-br")
          .format("DD/MM/YYYY hh:mm:ss A"),
        solicitante: solicitante!.nome,
        postoDestino,
        atividadeAtual,
      };
    }
  );

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Pedido",
      dataIndex: "numero",
      key: "numero",
    },
    {
      title: "Posto Origem",
      dataIndex: "postoOrigem",
      key: "postoOrigem",
    },
    {
      title: "Posto Destino",
      dataIndex: "postoDestino",
      key: "postoDestino",
    },
    {
      title: "Entrega",
      dataIndex: "entrega",
      key: "entrega",
    },
    {
      title: "Atividade Atual",
      dataIndex: "atividadeAtual",
      key: "atividadeAtual",
    },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
    },
    {
      title: "Inserção",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ação",
      key: "action",
      render: (_, record) => {
        // if (data[0] != record) return <></>;
        return (
          <Space size="middle">
            <button
              onClick={() => {
                handleFinalizar(record.numero);
              }}
              className="bg-red-700 text-white p-1 rounded-md shadow shadow-md"
            >
              Finalizar
            </button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <Button onClick={()=>{setRefresh(!refresh)}}>Atualizar</Button>
      <Table columns={columns} dataSource={data} />
    </div>
    );
}

export default Geral;
