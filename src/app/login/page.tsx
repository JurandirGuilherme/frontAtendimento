"use client";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { api } from "../api";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { LoadingContext } from "../LoadingContext";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const { setIsLoading, messageApi } = useContext(LoadingContext);

  const handleSubmit = (e: FormEvent) => {
    setIsLoading(true);
    e.preventDefault();
    api
      .post("/user/login", { usuario, senha })
      .then(({ data }) => {
        sessionStorage.clear();
        sessionStorage.setItem("token", data.token);
        sessionStorage.setItem("nome", data.nome);
        sessionStorage.setItem("cargo", data.cargos[0].id )
        switch(data.cargos[0].id){
          case 1 || 2:
            router.push("/fila");
            break;
          case 3:
            router.push('/atendimento')
        }
      })
      .catch((error: unknown) => {
        messageApi.error(error!.response.data)
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <main className="h-[100vh] w-full flex">
      <div className="flex items-center lg:w-[50%] w-full h-full justify-center">
        <form
          action="#"
          method="POST"
          className="space-y-6 border lg:p-24  p-20 rounded-md shadow-m"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="w-full flex justify-center">
            <h1 className="text-3xl font-extralight">Atendimento E-18</h1>
          </div>
          <div>
            <div className="mt-2">
              <input
                id="usuario"
                name="usuario"
                placeholder="Usuario"
                onChange={(e) => {
                  setUsuario(e.target.value);
                }}
                type="text"
                required
                className="block p-5  w-full rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between"></div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Senha"
                onChange={(e) => {
                  setSenha(e.target.value);
                }}
                required
                autoComplete="current-password"
                className="block w-full p-5 rounded-md border-0 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-red-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
      <div
        className={`hidden lg:block bg-gray-300 h-[100vh] w-[50%] rounded-md bg- ${styles.bg}`}
      ></div>
    </main>
  );
}

export default Login;
