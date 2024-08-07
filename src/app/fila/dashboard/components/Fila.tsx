'use client'
import { api } from '@/app/api'
import { Table, TableProps } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { DateContext } from '../dateContext'
import { LoadingContext } from '@/app/LoadingContext'

function Fila() {
    const {startDate, endDate} = useContext(DateContext);
    const { setIsLoading, messageApi } = useContext(LoadingContext);

    const [data, setData] = useState({});
    useEffect(()=>{
        setIsLoading(true)
        api.post('/requerente/dashboard',{
            'inicioDt': startDate,
            'fimDt': endDate
        }).then(({data})=>{
            setData(data)
        }).catch((error)=>{
            console.log(error)
        }).finally(()=>{
            setIsLoading(false)
        })
    },[endDate])
   

    const column: TableProps["columns"] = [
        {
            key:'geral',
            title:'Geral',
            dataIndex: 'geral'
        },
        {
            key:'preferencial',
            title:'Preferencial',
            dataIndex: 'preferencial'
        },
        {
            key:'prioridade',
            title:'Prioridade',
            dataIndex: 'prioridade'
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