"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { Input, Modal, Space, Table, Tag } from "antd";
import type { InputRef, TableColumnType, TableProps } from "antd";
import { api } from "@/app/api";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Button } from "antd";
import { LoadingContext } from "@/app/LoadingContext";
import clsx from "clsx";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

interface DataType {
  key: number;
  numero: number;
  cin:boolean;
  entrega: string;
  postoOrigem: string;
  solicitante: string;
  createdAt:string;
  createdAtSort:string;
}

function Geral() {
  const [refresh, setRefresh] = useState<boolean>(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

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
          cin,
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
                cin,
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
      });
  };
  useEffect(() => {
    // setTimeout((()=>{setRefresh(!refresh)}), 60000)

    api
      .get("/pedido/emfila")
      .then(({ data }) => {
        setIsLoading(true);
        fetchData(data).finally(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh]);

  const handleFinalizar = async (numero: number) => {
    setIsLoading(true);
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
        setIsLoading(true);
        fetchData(data).finally(() => {
          setIsLoading(false);
        });
      })
      .catch((error) => {
        messageApi.error(error.response.data.msg);
        // messageApi(error.response.msg)
      })
      .finally(() => {
        setIsLoading(false);
        setSelectedRowKeys([]);
      });
  };

  const [idNet, setIdNet] = useState({});
  const [pedidoAtual, setPedidoAtual] = useState({});

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

  const data = pedido && pedido.map(
    ({
      numero,
      entrega,
      postoOrigem,
      createdAt,
      solicitante,
      postoDestino,
      atividadeAtual,
      cin,
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
        createdAtSort: createdAt,
        solicitante: solicitante!.nome,
        postoDestino,
        atividadeAtual,
        cin,
        observacao
      };
    }
  );

  
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);


  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps["confirm"],
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<DataType> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        className="flex flex-col w-56 p-3"
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Pesquisar ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "flex" }}
        />
        <div className=" flex justify-between">
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Pedido",
      dataIndex: "numero",
      key: "numero",
      ...getColumnSearchProps("numero")
    },
    {
      title: "Posto Origem",
      dataIndex: "postoOrigem",
      key: "postoOrigem",
      ...getColumnSearchProps("postoOrigem")

    },
    {
      title: "Posto Destino",
      dataIndex: "postoDestino",
      key: "postoDestino",
      ...getColumnSearchProps("postoDestino")
    },
    {
      title: "Entrega",
      dataIndex: "entrega",
      key: "entrega",
      filters: [
        {
          text: "Posto Destino",
          value: "Posto Destino",
        },
        {
          text: "Gabinete",
          value: "Gabinete",
        },
        {
          text: "Permanência",
          value: "Permanência",
        },
      ],
      onFilter: (value, record) =>
        record.entrega.indexOf(value as string) === 0,
    },

    {
      title: "Solicitante",
      dataIndex: "solicitante",
      key: "solicitante",
      ...getColumnSearchProps("solicitante")

    },
    {
      title: "Inserção",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => moment(a.createdAtSort).unix() - moment(b.createdAtSort).unix(),
      defaultSortOrder: "ascend",
    },
    {
      title: "CIN",
      dataIndex: "cin",
      key: "cin",
      render: (_, { cin }) => {
        if (cin) {
          return (
            <>
              <Tag color="green">CIN</Tag>
            </>
          );
        }
        return <></>;
      },
      filters: [
        {
          text: "CIN",
          value: true,
        },
        {
          text: "Estadual",
          value: false,
        },
      ],
      onFilter: (value, record) =>
      {
        if(value)
          return record.cin.valueOf(value) === true
        return record.cin.valueOf(value) === false
      }

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
                handleFinalizar(record.numero);
              }}
              className="bg-red-700 text-white p-1 rounded-md shadow shadow-md"
            >
              Finalizar
            </button>
            <button
              onClick={() => {
                handleConsultarIdNet(record.numero)
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
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    // newSelectedRowKeys.map((data)=>{
    //   console.log(data)
    // })
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const handleFinalizarSelect = async () => {
    setIsLoading(true);
    await Promise.all(
      selectedRowKeys.map(async (numero) => {
        await api
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
          .catch((error) => {
            messageApi.error(`Não foi possível finalizar o pedido: ${numero}, tente novamente. ` + error.response.data.msg )
          });
      })
    ).finally(() => {
      setSelectedRowKeys([]);
      setRefresh(!refresh);
      setIsLoading(false);
    });
  };
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
      <div className="flex justify-between">
        <div className="flex items-center space-x-3 ">
          <Button
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            Atualizar
          </Button>
          {selectedRowKeys.length > 0 && (
            <p>Pedidos selecionados: {selectedRowKeys.length}</p>
          )}
        </div>
        <Button
          disabled={selectedRowKeys.length == 0 ? true : false}
          onClick={handleFinalizarSelect}
        >
          Finalizar
        </Button>
      </div>
      <Table columns={columns} rowSelection={rowSelection} dataSource={data} />
    </div>
  );
}

export default Geral;
