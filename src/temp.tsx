"use client";
import { useEffect, useState } from "react";
import { ApiClient } from "./api-client";

export function Temp() {
  const [data, setData] = useState("loading");

  async function f() {
    const client = new ApiClient();
    const res = await client.getHello();
    setData(res.data?.message || "No message");
  }

  useEffect(() => {
    f();
  });

  return <div>{data}</div>;
}
