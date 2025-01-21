"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { DatePicker, Input, Modal, Space, Table, Tag } from "antd";
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
    const fetchData = async (data: any) => {
      await Promise.all(
        data.map(
          async ({
            numero,
            entrega,
            postoOrigem,
            createdAt,
            solicitante,
            postoDestino,
            observacao
          }) =>
            await api
              .get(
                `https://idnet.pe.gov.br/Montreal.IdNet.Comunicacao.WebApi/atendimento/consultar/${numero}`
              )
              .then(({ data }) => {
                return {
                  numero: data.numeroPedido,
                  entrega,
                  postoOrigem,
                  createdAt,
                  solicitante,
                  postoDestino,
                  atividadeAtual: data.atividadeAtual,
                  observacao
                };
              })
              .catch((error) => {
                console.log(error);
              })
        )
      )
        .then((idNet) => {
          setPedido(idNet);
        })
        .catch(() => {
          console.log("deu error");
        })
    };
    api
      .post("/pedido/andamento", {
        inicioDt: startDate,
        fimDt: endDate,
      })
      .then(({ data }) => {
        setIsLoading(true);
        fetchData(data)
        .finally(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }, [endDate, refresh]);

  const data = pedido.map(
    ({
      numero,
      entrega,
      postoOrigem,
      createdAt,
      solicitante,
      postoDestino,
      atividadeAtual,
      observacao
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
        createdAtSort: createdAt,
        observacao
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
      sorter: (a,b) => moment(a.createdAtSort).unix() - moment(b.createdAtSort).unix(),
      defaultSortOrder: "descend"
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
    {
      title: "Ação",
      key: "action",
      render: (_, record) => {
        return (
          <Space size="middle">
            <button
              onClick={() => {
                handleConsultarIdNet(record.numero)
                console.log(record)
                setPedidoAtual(record)
              }}
              className="bg-orange-400 text-white p-1 rounded-md shadow shadow-md"
            >
              Ver Detalhes
            </button>
          </Space>
        );
      },
    },
  ];


      const [isModalOpen, setIsModalOpen] = useState(false);
  
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    
    const [pedidoAtual, setPedidoAtual] = useState({});
    const [idNet, setIdNet] = useState({});
  
  
    const handleConsultarIdNet = (pedido: number) => {
        setIsLoading(true);
        api
          .get(
            `https://idnet.pe.gov.br/Montreal.IdNet.Comunicacao.WebApi/atendimento/consultar/${pedido}`
          )
          .then(({ data }) => {
            showModal();
            setIdNet(data);
          })
          .catch((error) => {
            console.log(error);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };
    

  return (
    <>
     <Modal
        title={"Status do Pedido: " + idNet.numeroPedido}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="flex flex-col space-y-0.5 py-3 text-sm">
          <span className="flex space-x-2">
            <p className="font-bold">Atividade Atual: </p>{" "}
            <a> {idNet.atividadeAtual}</a>
          </span>
          <span className="flex space-x-2">
            <p className="font-bold">Nome: </p> <a> {idNet.nome}</a>
          </span>
          <span className="flex space-x-2">
            <p className="font-bold">Posto Origem: </p>{" "}
            <a> {idNet.nomePostoOrigem}</a>
          </span>
          <span className="flex space-x-2">
            <p className="font-bold">Posto Destino: </p>{" "}
            <a> {idNet.nomePostoDestino}</a>
          </span>
          {
            pedidoAtual.observacao && 
            <>
              <span className="flex space-x-2">
              <p className="font-bold">Observação: </p>{" "}
              <Input.TextArea disabled value={pedidoAtual.observacao}/>
              </span>
            </>
          }
           
        </div>
      </Modal>
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
    </>
  );
}

export default Geral;
