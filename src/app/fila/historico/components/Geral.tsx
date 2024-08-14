"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { DatePicker, Input, Space, Table, Tag } from "antd";
import type { InputRef, TableColumnType, TableProps } from "antd";
import { api } from "@/app/api";
import moment from "moment";
import "moment/dist/locale/pt-br";
import { Button } from "antd";
import dayjs from "dayjs";
import { LoadingContext } from "@/app/LoadingContext";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { FilterDropdownProps } from "antd/es/table/interface";

interface DataType {
  key: number;
  numero: number;
  entrega: string;
  postoOrigem: string;
  solicitante: string;
  dtImpressao: string;
  dtImpressaoSort: string;
  createdAt: string;
  operador: string;
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

  type DataIndex = keyof DataType;

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
            operador,
            dtImpressao,
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
                  operador,
                  dtImpressao,
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
        .catch((error) => {
          console.log(error);
        })
    };

    api
      .post("/pedido/impressos", {
        inicioDt: startDate,
        fimDt: endDate,
      })
      .then(({ data }) => {
        setIsLoading(true)
        fetchData(data).finally(()=>{
          setIsLoading(false)
        });
      })
      .catch((error) => {
        console.log(error);
      })
  }, [refresh, endDate]);

  const data = pedido.map(
    ({
      numero,
      entrega,
      postoOrigem,
      createdAt,
      solicitante,
      postoDestino,
      atividadeAtual,
      operador,
      dtImpressao,
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
        operador: operador.nome,
        dtImpressao: moment(dtImpressao)
          .locale("pt-br")
          .format("DD/MM/YYYY hh:mm:ss A"),
        dtImpressaoSort: dtImpressao
      };
    }
  );

  // const [filteredInfo, setFilteredInfo] = useState<Filters>({});
  const columns: TableProps<DataType>["columns"] = [
    {
      title: "Pedido",
      dataIndex: "numero",
      key: "numero",
      ...getColumnSearchProps("numero"),
    },
    {
      title: "Posto Origem",
      dataIndex: "postoOrigem",
      key: "postoOrigem",
      ...getColumnSearchProps("postoOrigem"),
    },
    {
      title: "Posto Destino",
      dataIndex: "postoDestino",
      key: "postoDestino",
      ...getColumnSearchProps("postoDestino"),
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
      ...getColumnSearchProps("solicitante"),
    },
    {
      title: "Inserção",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a,b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),

    },
    {
      title: "Operador",
      dataIndex: "operador",
      key: "Operador",
      ...getColumnSearchProps("operador"),
    },
    {
      title: "Data de Finalização",
      dataIndex: "dtImpressao",
      key: "dtImpressao",
      sorter: (a,b) => moment(a.dtImpressaoSort).unix() - moment(b.dtImpressaoSort).unix(),
      defaultSortOrder: 'descend'

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
