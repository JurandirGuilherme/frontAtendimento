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
  const [preferencial, setPreferencial] = useState(false);
  const [prioridadelei, setPrioridadelei] = useState(false);

  const [novaCin, setNovaCin] = useState(false);
  const [cargo, setCargo] = useState(0);

  useEffect(() => {
    const cargoss = sessionStorage.getItem("cargo");
    setCargo(Number(cargoss));
  }, []);

  const onCheckboxChange = (e: { target: { checked: boolean } }) => {
    setPreferencial(e.target.checked);
    setPrioridadelei(false);
  };

  const onCheckboxCin = (e: { target: { checked: boolean } }) => {
    setNovaCin(e.target.checked);
  };

  const { messageApi } = useContext(LoadingContext);
  const onCheck = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const values = await form.validateFields();
      console.log("Success:", values, preferencial);
      api
        .post(
          "/requerente",
          {
            nome: values.nome,
            preferencial,
            via: values.via,
            cin: novaCin,
            prioridadelei,
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
          setPreferencial(false);
          setPrioridadelei(false);
          setNovaCin(false);
          console.log(data);
        })
        .catch((error) => {
          console.log(error);
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
            defaultValue={1}
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
