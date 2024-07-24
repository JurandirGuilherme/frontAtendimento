'use client'
import React, { createContext, useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from "antd";
const LoadingContext = createContext<boolean>(false || true)

function LoadingContextC({children}: React.PropsWithChildren) {
    const [isLoading, setIsLoading] = useState(false)
  return (
    <LoadingContext.Provider value={{isLoading, setIsLoading}}>
      <Modal open={isLoading}><div className='w-full h-full flex items-center justify-center'><Spin indicator={<LoadingOutlined style={{ fontSize: 48, color:'black' }} spin />}/></div></Modal>
        {children}
    </LoadingContext.Provider>
  )
}

export {LoadingContextC, LoadingContext}