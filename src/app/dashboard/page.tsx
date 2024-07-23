'use client'
import React, { useEffect, useState } from 'react'
import {api} from '../api'
import { useRouter } from 'next/navigation';
import Formulario from '../components/Formulario';

function Page() {
  const [nome, setNome] = useState('');
  const router = useRouter()
  useEffect(()=>{
    const token = sessionStorage.getItem('token')
    api.get('/user/id', {headers: {Authorization: token}})
    .then(({data})=>{
      console.log(data.nome)
      setNome(data.nome)
    })
  },[])

  return (
    <>
    {/* <div>{nome}</div> */}
    <Formulario/>
    {/* <button className='bg-red-600 rounded-md px-2 text-white mt-2' onClick={()=>{sessionStorage.clear(), router.push('/login')}}>Sair</button> */}
    </>
  )
}

export default Page