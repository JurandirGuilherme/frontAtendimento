"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { DatePicker, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Button } from "antd";
import dayjs from "dayjs";
import { LoadingContext } from "@/app/LoadingContext";

interface DataType {
  key: number;
  numero: number;
  entrega: string;
  postoOrigem: string;
  solicitante: string;
}

function Geral() {
  let date = new Date();
  let dia = date.getDate();
  dia = date.setDate(dia + 1);

  const [startDate, setStartDate] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(moment(dia).format("YYYY-MM-DD"));

  const [refresh, setRefresh] = useState<boolean>(false);
  const [pedido, setPedido] = useState([]);
  const { setIsLoading, messageApi } = useContext(LoadingContext);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async (data: any) => {
      let idNet = await Promise.all(
        data.map(
          async ({
            numero,
            entrega,
            postoOrigem,
            createdAt,
            solicitante,
            postoDestino,
          }) =>
            await api
              .get(
                `https://idnet.pe.gov.br/Montreal.IdNet.Comunicacao.WebApi/atendimento/consultar/${numero}`
              )
              .then(({ data }) => {
                return { numero: data.numeroPedido, entrega, postoOrigem, createdAt, solicitante, postoDestino, atividadeAtual: data.atividadeAtual };
              })
              .catch((error) => {
                console.log(error);
              }).finally(()=>{
                setIsLoading(false)
              })
        )
      );
      setPedido(idNet)
    };
    api
      .post("/pedido/andamento", {
        inicioDt: startDate,
        fimDt: endDate,
      })
      .then(({ data }) => {
        fetchData(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
        key: numero,
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
      title: "Atividade Atual",
      dataIndex: "atividadeAtual",
      key: "atividadeAtual",
      render: (_, { atividadeAtual }) => {
        let color = "geekblue";

        switch (atividadeAtual) {
          case "Geração de carteira de identidade":
            color = "orange";
            break;
          case "Entrega de Carteira":
            color = "green";
            break;
        }
        return (
          <>
            <Tag color={color}>{atividadeAtual}</Tag>
          </>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
      <div className=" flex  justify-between">
        <DatePicker.RangePicker
          key={1}
          format={"DD/MM/YYYY"}
          onChange={(e) => {
            let data = new Date(e?.[1]);
            let dia = data.getDate();
            dia = data.setDate(dia + 1);
            setStartDate(e?.[0]);
            setEndDate(new Date(dia));
          }}
          defaultValue={[dayjs(startDate), dayjs(new Date())]}
          allowEmpty={false}
        />

        <Button
          onClick={() => {
            setRefresh(!refresh);
          }}
        >
          Atualizar
        </Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Geral;
