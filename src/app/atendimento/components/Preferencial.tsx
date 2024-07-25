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
  
  function Preferencial() {
    const {refresh, setRefresh} = useContext(ApiContext)
    const [preferencial, setPreferencial] = useState([]);

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
    
    useEffect(() => {
        api
          .get("/requerente/preferencial")
          .then(({ data }) => {
            setPreferencial(data);
          })
          .catch((error) => {
            console.log(error);
          });
        },[refresh])

        const data = preferencial.map(({ id, nome, via, createdAt, usuario }) => {
            return {
              key: id,
              nome,
              via,
              createdAt: moment(createdAt).format('DD/MM/YYYY hh:mm:ss A'),
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
              render: (_, record) => {
                if(data[0] != record) return(<></>)
                return (
                <Space size="middle">
                  <button
                    onClick={() => {
                      handleAtender(record.key);
                    }}
                    className="bg-red-700 text-white p-1 rounded-md shadow-md"
                  >
                    Atender
                  </button>
                </Space>
              )},
            },
          ];

  return (
    <div>        
    <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default Preferencial