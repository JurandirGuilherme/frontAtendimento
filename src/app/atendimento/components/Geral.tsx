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
  }
 

function Geral() {
    const {refresh, setRefresh} = useContext(ApiContext)

    
    const [geral, setGeral] = useState([]);
    useEffect(() => {
        api
          .get("/requerente/geral")
          .then(({ data }) => {
            setGeral(data);
          })
          .catch((error) => {
            console.log(error);
          });
        },[refresh])
        const handleAtender = (id: string) => {
            setRefresh(!refresh)
            api
              .post(
                "/atendimento",
                {
                  requerenteId: id,
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

        const data = geral.map(({ id, nome, via, createdAt, usuario }) => {
            return {
              key: id,
              nome,
              via,
              createdAt: moment(createdAt).format('DD/MM/YYYY hh:mm:ss'),
              solicitante: usuario!.nome,
            };
          });
        

        const columns: TableProps<DataType>["columns"] = [
            {
              title: "Nome",
              dataIndex: "nome",
              key: "nome",
              render: (text) => <a>{text}</a>,
            },
            {
              title: "Via",
              dataIndex: "via",
              key: "Via",
            },
            {
              title: "Inserido",
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
                      handleAtender(record.key);
                    }}
                    className="bg-red-700 text-white p-1 rounded-md shadow shadow-md"
                  >
                    Atender
                  </button>
                </Space>
              ),
            },
          ];

  return (
    <div>        
    <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Geral