'use client'
import { api } from '@/app/api'
import { Table, TableProps } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'vm'
import { DateContext } from '../dateContext'

function Fila() {
    const {startDate, endDate} = useContext(DateContext);
    const [data, setData] = useState({});
    useEffect(()=>{
        api.post('/requerente/dashboard',{
            'inicioDt': startDate,
            'fimDt': endDate
        }).then(({data})=>{
            setData(data)
        }).catch((error)=>{
            console.log(error)
        })
    },[endDate])
   

    const column: TableProps["columns"] = [
        {
            key:'preferencial',
            title:'Preferencial',
            dataIndex: 'preferencial'
        },
        {
            key:'geral',
            title:'Geral',
            dataIndex: 'geral'
        },
        {
            key:'total',
            title:'Total',
            dataIndex: 'total'
        }
    ]

  return (
    <>
    <Table columns={column} dataSource={[{key:1, ...data}]}></Table>
    </>
  )
}

export default Fila