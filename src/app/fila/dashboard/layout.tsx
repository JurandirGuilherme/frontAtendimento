"use client";
import dayjs from "dayjs";
import React, { useState } from "react";
import { createContext } from "react";
import { DateContextC } from "./dateContext";

function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <DateContextC>{children}</DateContextC>
    </>
  );
}

export default Layout;
