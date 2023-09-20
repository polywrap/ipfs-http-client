import { IpfsHttpClient } from "./wrap";
import { PolywrapClient, PolywrapClientConfigBuilder } from "@polywrap/client-js";

const ipfsProvider = "http://localhost:5001";

async function main() {
  const config = new PolywrapClientConfigBuilder()
    .addDefaults()
    .build();

  const client = new PolywrapClient(config);

  const fileName = "hello-world.txt";
  const fileData = "Hello World!!!";

  console.log("File Name: ", fileName);
  console.log("File Data: ", fileData);
  console.log("===========================");

  const ipfsClient =  new IpfsHttpClient();
  
  const addFileResult = await ipfsClient.addFile({
    data: {
      name: fileName,
      data: new TextEncoder().encode(fileData)
    },
    ipfsProvider
  }, client);

  if (!addFileResult.ok) throw addFileResult.error;

  const cid = addFileResult.value.hash;

  console.log("Successfully Added: ", cid);

  const catResult = await ipfsClient.cat({
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
