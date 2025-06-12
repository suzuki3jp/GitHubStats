import { ApiClient } from "./api-client";

export async function Temp() {
  const client = new ApiClient();
  const res = await client.getHello();

  return <div>{res.data?.message}</div>;
}
