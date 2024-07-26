"use client";
import React, { useEffect, useState } from "react";
import { BarChartOutlined, IdcardOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Layout, Menu, Space, theme } from "antd";
import Image from "next/image";
import "./layout.module.css";
import logo from "../../../public/logo_idnet_white.svg";
import { redirect, usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

const App = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [collapsed, setCollapsed] = useState(false);
  const [nome, setNome] = useState("");
  const [menuSelect, setMenuSelect] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const username = sessionStorage.getItem("nome");
    setNome(username!);
  });

  useEffect(() => {
    items.map((data) => {
      if (data!.label!.props.href == pathname) {
        setMenuSelect(`${data!.key}`);
      }
    });
  }, [pathname]);

  const items: MenuItem[] = [
    {
      key: "1",
      label: <Link href={"/fila"}>Cadastro</Link>,
      icon: <IdcardOutlined />,
    },
    {
      key: "2",
      label: <Link href={"/fila/atendidos"}>Atendidos</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: <Link href={"/fila/dashboard"}>Dashboard</Link>,
      icon: <BarChartOutlined />,
    },
  ];



  const profileItems = [
    {
      key: "1",
      danger: true,
      label: (
        <a
          onClick={() => {
            sessionStorage.clear(), router.push("/login");
          }}
        >
          Sair
        </a>
      ),
    },
  ];

  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ padding: 0 }}>
        {" "}
        <div className="w-full h-full bg-red-900 shadow-md text-slate-200 font-thin text-lg text-center items-center px-8 flex justify-between ">
          {" "}
          <div className="w-36">
            <Image style={{ width: "100%" }} src={logo} alt="logo"></Image>
          </div>
          <Dropdown menu={{ items: profileItems }}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>{nome}</Space>
            </a>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ backgroundColor: "#450a0a", color: "white" }}
        >
          <Menu
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
            items={items}
            selectedKeys={[menuSelect]}
            style={{
              flex: 1,
              minWidth: 0,
              paddingTop: "10px",
              backgroundColor: "#450a0a ",
            }}
          />
        </Sider>
        <Content style={{ margin: "0 16px" }}>
          <div className="mt-12 ml-2 flex justify-center">{children}</div>
        </Content>
      </Layout>
      <Footer
        style={{
          textAlign: "center",
          justifyContent: "center",
          height: "10px",
          zIndex: "0",
        }}
      >
        AtendimentoIITB ©{new Date().getFullYear()} desenvolvido por Montreal
        Informática
      </Footer>
    </Layout>
  );
};

export default App;
