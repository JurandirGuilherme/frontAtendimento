import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import {api} from '../api';

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


  useEffect(() => {
    form.validateFields(['nome']);
  }, [preferencial, form]);

  const onCheckboxChange = (e: { target: { checked: boolean } }) => {
    setPreferencial(e.target.checked);
  };

  const onCheck = async () => {
    const token = sessionStorage.getItem('token')
    try {
      const values = await form.validateFields();
      console.log('Success:', values, preferencial);
      api.post('/requerente', {
        "nome":values.nome,
        preferencial,
        via:1
      }, {
        headers:{
            'Authorization': token
        }
      })
      .then((data)=>{
        console.log(data)
      })
      .catch((error)=>{
        console.log(error)
      })

    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  return (
    <div className='bg-white w-fit p-10 rounded-md'>
        <Form form={form} style={{display:'flex',  flexDirection:'column', alignItems:'center'}} name="dynamic_rule" >
        <Form.Item
            name="nome"
            label="Nome"
            rules={[{ required: true, message: 'Nome do requerente obrigatório.' }]}
        >
            <Input placeholder="Nome do requerente" />
        </Form.Item>

        <Form.Item
            name="via"
            initialValue={1}
            label="Via"
            rules={[{ required: true, message: 'Nome do requerente obrigatório.' }]}
        >
            <Input type='number' placeholder="Via do Requerente" />
        </Form.Item>
        <Form.Item>
            <Checkbox checked={preferencial} onChange={onCheckboxChange}>
            Preferencial
            </Checkbox>
        </Form.Item>
        <Form.Item 
        >
            <Button type="primary" onClick={onCheck}>
            Enviar
            </Button>
        </Form.Item>
        </Form>
    </div>
  );
};

export default Formulario;