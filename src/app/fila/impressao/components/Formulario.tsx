import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Form, Input, Select } from "antd";
import { api } from "@/app/api";
import { LoadingContext } from "@/app/LoadingContext";

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
  const { messageApi } = useContext(LoadingContext);
  const [entrega, setEntrega] = useState<number>(1);


  useEffect(() => {
    const cargoss = sessionStorage.getItem("cargo");
  }, []);


  const onCheck = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      api
        .post(
          "/pedido",
          {
            pedido: values.pedido,
            entrega: entrega
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
        .catch((error) => {
          console.log(error);
          messageApi.error(error.response.data.msg)
        });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
      messageApi.error("Erro Inesperado.");
    }
  };

  return (
    <div className="bg-white w-fit p-10 rounded-md">
      <Form
        form={form}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        name="dynamic_rule"
      >
        <Form.Item
          name="pedido"
          label="Pedido"
          rules={[
            { required: true, message: "Nº do Pedido obrigatório." },
          ]}
        >
          <Input placeholder="Nº do Pedido"  type="number" />
        </Form.Item>

   
        <Form.Item name="entrega" label="Entrega" >
          <Select
            defaultValue={entrega}
            onChange={(value)=>{setEntrega(value)}}
            options={[
              { value: 1, label: "Posto Destino" },
              { value: 2, label: "Permanência" },
              { value: 3, label: "Gabinete" },
            ]}
          />
        </Form.Item>

        <Form.Item>
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
