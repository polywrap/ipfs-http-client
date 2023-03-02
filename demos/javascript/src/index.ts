import { IpfsHttpClient_Module } from "./wrap";

import { PolywrapClient, ClientConfigBuilder } from "@polywrap/client-js";
import path from "path";

const ipfsProvider = "http://localhost:5001";
const uri = "ens/wraps.eth:ipfs-http-client@1.0.0";
const localUri = `file/${path.join(__dirname, "../../../wrappers/ipfs-http-client/build")}`

async function main() {

  const config = new ClientConfigBuilder()
    .addDefaults()
    .addRedirect(uri, localUri)
    .build();

  const client = new PolywrapClient(config);

  const fileName = "hello-world.txt";
  const fileData = "Hello World!!!";

  console.log("File Name: ", fileName);
  console.log("File Data: ", fileData);
  console.log("===========================");

  const addFileResult = await IpfsHttpClient_Module.addFile({
    data: {
      name: fileName,
      data: new TextEncoder().encode(fileData)
    },
    ipfsProvider
  }, client);

  if (!addFileResult.ok) throw addFileResult.error;

  const cid = addFileResult.value.hash;

  console.log("Successfully Added: ", cid);

  const catResult = await IpfsHttpClient_Module.cat({
    cid,
    ipfsProvider
  }, client);

  if (!catResult.ok) throw catResult.error;

  const text = new TextDecoder().decode(catResult.value);
  console.log("Cat Result: ", text);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
