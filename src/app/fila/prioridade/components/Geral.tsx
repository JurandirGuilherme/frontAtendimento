"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { Modal, Space, Table, Tag } from "antd";
import type { TableProps } from "antd";
import { api } from "@/app/api";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Button } from "antd";
import { LoadingContext } from "@/app/LoadingContext";

interface DataType {
  key: number;
  numero: number;
  entrega: string;
  postoOrigem: string;
  solicitante: string;
}

function Geral() {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [refreshH, setRefreshH] = useState<boolean>(false);

  const { setIsLoading, messageApi } = useContext(LoadingContext);
  const [pedido, setPedido] = useState([]);

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

  useEffect(() => {
    // setTimeout((()=>{setRefresh(!refresh)}), 60000)
    setIsLoading(true);
    api
      .get("/pedido/emfila")
      .then(({ data }) => {
        setPedido(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [refresh]);

  const handleFinalizar = async (numero: number) => {
    setIsLoading(true)
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
      .then(({data})=>{
        setPedido(data)
      })
      .catch((error) => {
        console.log(error);
      }).finally(async ()=>{
        setIsLoading(false)
      })
  };


  const [idNet, setIdNet] = useState({});

  const handleConsultarIdNet = (pedido: number) => {
    setIsLoading(true);
    api
      .post("/pedido/consultar", {
        pedido: pedido,
      })
      .then(({ data }) => {
        showModal();
        console.log(data);
        setIdNet(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
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
      cin
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
        cin
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
    // {
    //   title: "Atividade Atual",
    //   dataIndex: "atividadeAtual",
    //   key: "atividadeAtual",
    // },
    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
    },
    {
      title: "Inserção",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a,b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
      defaultSortOrder:"ascend",
    },
    {
      title: "CIN",
      dataIndex: "cin",
      key: "cin",
      render: (_, {cin}) =>{
        if (cin){ 
          return (<>
          <Tag color="green">
          CIN
          </Tag>
          </>)
        }
        return(
        <>
        </>
        )
      }
    },
    {
      title: "Ação",
      key: "action",
      render: (_, record) => {
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
            <button
              onClick={() => {
                handleConsultarIdNet(record.numero);
              }}
              className="bg-orange-400 text-white p-1 rounded-md shadow shadow-md"
            >
              Ver Status
            </button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="space-y-3">
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
        </div>
      </Modal>
      <Button
        onClick={() => {
          setRefresh(!refresh);
        }}
      >
        Atualizar
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}

export default Geral;
