import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { api } from "@/app/api";
import { LoadingContext } from "@/app/LoadingContext";
import { Modal, Tag } from "antd";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 },
};

const Formulario: React.FC = () => {
  const [form] = Form.useForm();
  const { setIsLoading, messageApi } = useContext(LoadingContext);
  const [entrega, setEntrega] = useState<number>(1);

  useEffect(() => {
    const cargoss = sessionStorage.getItem("cargo");
  }, []);

  const onCheck = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      setIsLoading(true);
      api
        .post(
          "/pedido",
          {
            pedido: values.pedido,
            entrega: entrega,
            observacao: values.observacao
          },
          {
            headers: {
              Authorization: token,
            },
          }
        )
        .then((data) => {
          messageApi.success("Requerente enviado para fila.");
          form.resetFields();
          console.log(data);
        })
        .catch(({ response }) => {
          console.log(response);
          const idNet = response.data
          Modal.error({
            title: <h1 className="text-xl"> {idNet.msg}.</h1>,
            width:600,
            content: (
              <>
                <div className="text-lg space-y-0.5 flex flex-col">
                  <div className="flex space-x-2">
                    <p>Requerente:</p>{" "}
                    <h3>{idNet.nome}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <p>Atividade do Pedido:</p>{" "}
                    <Tag color="processing"><h3 className="text-sm" >{String(idNet.atividadeAtual).toUpperCase()}</h3></Tag>
                  </div>
                  <div className="flex space-x-2">
                    <p>Posto Origem:</p>{" "}
                    <h3>{idNet.nomePostoOrigem}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <p>Posto Destino:</p>{" "}
                    <h3>{idNet.nomePostoDestino}</h3>
                  </div>
                  {!idNet.inPago && idNet.inPagtoTaxa ? 
                  <>
                  <div className="flex space-x-2">
                    <p>DAE:</p>{" "}
                    <Tag color="volcano"> <h1 className="text-sm">NÃO PAGO</h1></Tag>
                  </div>
                  </> 
                  : 
                  idNet.inPago ? 
                  <>
                  <div className="flex space-x-2">
                    <p>DAE:</p>{" "}
                    <Tag color="green"><h1 className="text-sm">PAGO</h1></Tag>
                  </div>
                  </>
                  :
                  <div className="flex space-x-2">
                  <p>DAE:</p>{" "}
                  <Tag color="geekblue"><h1 className="text-sm">ISENTO</h1></Tag>
                </div>
                  }

                </div>
              </>
            ),
          });
          // messageApi.error(error.response.data.msg)
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      messageApi.error("Erro Inesperado.");
    }
  };

  return (
    <div className="bg-white  w-[38em]  rounded-md">
      <Form
        form={form}
        // style={{
        //   display: "flex",
        //   flexDirection: "column",
        //   alignItems: "center",
        // }}
        layout="horizontal"
        labelCol={{ span: 5 }}
        // wrapperCol={{ span: 30 }}
        className=" p-10 bg-white rounded-md"
        name="dynamic_rule"
      >
        <Form.Item
          name="pedido"
          label="Pedido"
          rules={[{ required: true, message: "Nº do Pedido obrigatório." }]}
        >
          <Input placeholder="Nº do Pedido" type="number" />
        </Form.Item>

        <Form.Item name="entrega" label="Entrega" rules={[{required:true, message: "Destino de Entrega Obrigatório."}]}>
          <Select
            // defaultValue={entrega}
            onChange={(value) => {
              setEntrega(value);
            }}
            placeholder='Selecione o destino'
            options={[
              { value: 1, label: "Posto Destino" },
              { value: 2, label: "Permanência" },
              { value: 3, label: "Gabinete" },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="observacao"
          label="Observação"
          rules={[{ required: false}]}
        >
          <Input.TextArea className="w-74" placeholder="Observação ou justificativa do pedido." />
        </Form.Item>
        <Form.Item className=" w-full flex justify-center p-2">
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(127 29 29 / var(--tw-bg-opacity))" }}
            onClick={onCheck}
          >
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Formulario;
