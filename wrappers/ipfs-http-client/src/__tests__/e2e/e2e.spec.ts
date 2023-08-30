import {
  IWrapPackage,
  PolywrapClient,
  PolywrapClientConfigBuilder
} from "@polywrap/client-js";
import { httpPlugin } from "@polywrap/http-plugin-js";
import path from "path";
import fs from "fs";
import * as Ipfs from "./types";
import { TextEncoder } from "util";
import { ipfsProvider, initInfra, stopInfra } from "./utils/infra";

jest.setTimeout(360000);

describe("IPFS HTTP Client Wrapper", () => {
  const singleFileCid = "QmXjuLkuAKVtfg9ZxhWyLanMZasYwhza2EozCH7cg3VY31";
  const addFileCid = "QmWjGyqGNWMAH9pCXK1nJo2Do68EHLb7zUqt6fHuq5pRU4";
  const encoder = new TextEncoder();

  let client: PolywrapClient;
  let fsUri: string;

  beforeAll(async () => {
    await initInfra();

    const builder = new PolywrapClientConfigBuilder()
      .addDefaults()
      .setPackage(
        "wrapscan.io/polywrap/http@1.0",
        httpPlugin({ }) as IWrapPackage
      );

    client = new PolywrapClient(builder.build());

    const apiPath = path.resolve(path.join(__dirname, "/../../../"));
    fsUri = `wrap://fs/${apiPath}/build`;

    // upload test file
    const buffer: Buffer = fs.readFileSync(
      path.join(__dirname, "testData", "test.txt")
    );
    const bytes: Ipfs.Bytes = Uint8Array.from(buffer);

    const result = await client.invoke<Ipfs.Ipfs_AddResult>({
      uri: fsUri,
      method: "addFile",
      args: {
        data: {
          name: "test.txt",
          data: bytes,
        },
        ipfsProvider,
      },
    });

    if (!result.ok) {
      console.log("Error during upload of test file:", result.error);
    }
  });

  afterAll(async () => {
    await stopInfra();
  });

  it("addFile", async () => {
    const buffer: Buffer = fs.readFileSync(
      path.join(__dirname, "testData", "addTest.txt")
    );
    const bytes: Ipfs.Bytes = Uint8Array.from(buffer);

    const result = await client.invoke<Ipfs.Ipfs_AddResult>({
      uri: fsUri,
      method: "addFile",
      args: {
        data: {
          name: "addTest.txt",
          data: bytes,
        },
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.hash).toEqual(addFileCid);
  });

  it("addFile from buffer", async () => {
    const expectedContents = "A new sample file";
    const buffer = Buffer.from(expectedContents, "utf-8");
    const bytes: Ipfs.Bytes = Uint8Array.from(buffer);

    const result = await client.invoke<Ipfs.Ipfs_AddResult>({
      uri: fsUri,
      method: "addFile",
      args: {
        data: {
          name: "addTest.txt",
          data: bytes,
        },
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.hash).toEqual(
      "Qmawvzw32Jq7RbMw2K8axEbzfNK74NPynBoq4tJnWvkYqP"
    );
  });

  it("addFile with onlyHash option", async () => {
    const buffer: Buffer = fs.readFileSync(
      path.join(__dirname, "testData", "addTest.txt")
    );
    const bytes: Ipfs.Bytes = Uint8Array.from(buffer);

    const result = await client.invoke<Ipfs.Ipfs_AddResult>({
      uri: fsUri,
      method: "addFile",
      args: {
        data: {
          name: "addTest.txt",
          data: bytes,
        },
        ipfsProvider,
        timeout: 5000,
        options: {
          onlyHash: true,
        },
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.hash).toEqual(addFileCid);
  });

  it("resolve", async () => {
    const result = await client.invoke<Ipfs.Ipfs_ResolveResult>({
      uri: fsUri,
      method: "resolve",
      args: {
        cid: singleFileCid,
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.cid).toEqual("/ipfs/" + singleFileCid);
  });

  it("cat", async () => {
    const buffer: Buffer = fs.readFileSync(
      path.join(__dirname, "testData", "test.txt")
    );
    const bytes: Ipfs.Bytes = Uint8Array.from(buffer);

    const result = await client.invoke<Ipfs.Bytes>({
      uri: fsUri,
      method: "cat",
      args: {
        cid: singleFileCid,
        ipfsProvider,
        timeout: 10000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value).toEqual(bytes);
  });

  it("cat with offset and length", async () => {
    const expected = encoder.encode("From IPFS!");

    const result = await client.invoke<Ipfs.Bytes>({
      uri: fsUri,
      method: "cat",
      args: {
        cid: singleFileCid,
        ipfsProvider,
        timeout: 5000,
        catOptions: {
          offset: 6,
          length: 10,
        },
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value).toEqual(expected);
  });

  it("addDir - directory w/ single-file", async () => {
    const root: string = path.join(__dirname, "testData", "dirTest");

    const result = await client.invoke<Ipfs.Ipfs_AddResult[]>({
      uri: fsUri,
      method: "addDir",
      args: {
        data: {
          name: "dirTest",
          files: [
            {
              name: "file_0.txt",
              data: Uint8Array.from(
                fs.readFileSync(path.join(root, "file_0.txt"))
              ),
            },
          ],
        },
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.length).toEqual(2);
    expect(result.value).toEqual([
      {
        name: "dirTest/file_0.txt",
        hash: "QmV3uDt3KhEYchouUzEbfz7FBA2c2LvNo76dxLLwJW76b1",
        size: "14",
      },
      {
        name: "dirTest",
        hash: "QmQkRYKmLKCnCToehkLqNi6iJ4waLKxanXRBDqE7uTp1t5",
        size: "70",
      },
    ]);
  });

  it("addDir - complex", async () => {
    const root: string = path.join(__dirname, "testData", "dirTest");

    const result = await client.invoke<Ipfs.Ipfs_AddResult[]>({
      uri: fsUri,
      method: "addDir",
      args: {
        data: {
          name: "dirTest",
          directories: [
            {
              name: "directory_A",
              files: [
                {
                  name: "file_A_0.txt",
                  data: Uint8Array.from(
                    fs.readFileSync(
                      path.join(root, "directory_A", "file_A_0.txt")
                    )
                  ),
                },
                {
                  name: "file_A_1.txt",
                  data: Uint8Array.from(
                    fs.readFileSync(
                      path.join(root, "directory_A", "file_A_1.txt")
                    )
                  ),
                },
              ],
            },
            {
              name: "directory_B",
              directories: [
                {
                  name: "directory_B_A",
                  files: [
                    {
                      name: "file_B_A_0.txt",
                      data: Uint8Array.from(
                        fs.readFileSync(
                          path.join(
                            root,
                            "directory_B",
                            "directory_B_A",
                            "file_B_A_0.txt"
                          )
                        )
                      ),
                    },
                    {
                      name: "file_B_A_1.txt",
                      data: Uint8Array.from(
                        fs.readFileSync(
                          path.join(
                            root,
                            "directory_B",
                            "directory_B_A",
                            "file_B_A_1.txt"
                          )
                        )
                      ),
                    },
                  ],
                },
                {
                  name: "directory_B_B",
                  files: [
                    {
                      name: "file_B_B_0.txt",
                      data: Uint8Array.from(
                        fs.readFileSync(
                          path.join(
                            root,
                            "directory_B",
                            "directory_B_B",
                            "file_B_B_0.txt"
                          )
                        )
                      ),
                    },
                  ],
                },
              ],
            },
          ],
          files: [
            {
              name: "file_0.txt",
              data: Uint8Array.from(
                fs.readFileSync(path.join(root, "file_0.txt"))
              ),
            },
            {
              name: "file_1.txt",
              data: Uint8Array.from(
                fs.readFileSync(path.join(root, "file_1.txt"))
              ),
            },
          ],
        },
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.length).toEqual(12);
    expect(result.value).toEqual([
      {
        name: "dirTest/file_0.txt",
        hash: "QmV3uDt3KhEYchouUzEbfz7FBA2c2LvNo76dxLLwJW76b1",
        size: "14",
      },
      {
        name: "dirTest/file_1.txt",
        hash: "QmYwMByE4ibjuMu2nRYRfBweJGJErjmMXfZ92srKhYfq5f",
        size: "14",
      },
      {
        name: "dirTest/directory_A/file_A_0.txt",
        hash: "QmeYp73qnn8EdogE4d6BhQCHtep7dkRC8FgdE3Qbo4nY9c",
        size: "16",
      },
      {
        name: "dirTest/directory_A/file_A_1.txt",
        hash: "QmWetZjwHWuGsDyxX6ae5wGS68mFTXC5x61H1TUNxqBXzn",
        size: "16",
      },
      {
        name: "dirTest/directory_B/directory_B_A/file_B_A_0.txt",
        hash: "QmYqPV2Vj8va82VsgovQ6YRFZXapgCNdfJFVGXZtYWsfJb",
        size: "18",
      },
      {
        name: "dirTest/directory_B/directory_B_A/file_B_A_1.txt",
        hash: "QmYNaEyVmh1M5RP4cMNsbdVMQBzbTqLVSQDPDKJooXtKsH",
        size: "18",
      },
      {
        name: "dirTest/directory_B/directory_B_B/file_B_B_0.txt",
        hash: "QmTrSbNJS3c5bhdLZbs4ExCWecB9Uehzg8CJrUDT5tLGvZ",
        size: "18",
      },
      {
        name: "dirTest/directory_A",
        hash: "Qmb5XsySizDeTn1kvNbyiiNy9eyg3Lb6EwGjQt7iiKBxoL",
        size: "144",
      },
      {
        name: "dirTest/directory_B/directory_B_A",
        hash: "Qmd8MBCFKBK3uGQV9ALa89JFDt1Ln4fpdJnvm3vf9pj1qu",
        size: "152",
      },
      {
        name: "dirTest/directory_B/directory_B_B",
        hash: "QmNVcu9D3EFP4arKDWYsXTk5KmpRxX3SzekTuetgQtTsxR",
        size: "78",
      },
      {
        name: "dirTest/directory_B",
        hash: "QmZz4KxFqghhxxerQLbEokysnQmJfmFAEi2KFdixipa5D8",
        size: "345",
      },
      {
        name: "dirTest",
        hash: "QmQxoJH9WE1QdB8zSVjHPFF7MdAWnU9176js9gugTy7g1A",
        size: "733",
      },
    ]);
  });

  it("addBlob", async () => {
    const root: string = path.join(__dirname, "testData", "dirTest");

    const result = await client.invoke<Ipfs.Ipfs_AddResult[]>({
      uri: fsUri,
      method: "addBlob",
      args: {
        data: {
          directories: [
            {
              name: "directory_A",
              files: [
                {
                  name: "file_A_0.txt",
                  data: Uint8Array.from(
                    fs.readFileSync(
                      path.join(root, "directory_A", "file_A_0.txt")
                    )
                  ),
                },
                {
                  name: "file_A_1.txt",
                  data: Uint8Array.from(
                    fs.readFileSync(
                      path.join(root, "directory_A", "file_A_1.txt")
                    )
                  ),
                },
              ],
            },
          ],
          files: [
            {
              name: "file_0.txt",
              data: Uint8Array.from(
                fs.readFileSync(path.join(root, "file_0.txt"))
              ),
            },
            {
              name: "file_1.txt",
              data: Uint8Array.from(
                fs.readFileSync(path.join(root, "file_1.txt"))
              ),
            },
          ],
        },
        ipfsProvider,
        timeout: 5000,
      },
    });

    if (result.ok === false) fail(result.error);
    expect(result.value.length).toEqual(5);
    expect(result.value).toEqual([
      {
        name: "file_0.txt",
        hash: "QmV3uDt3KhEYchouUzEbfz7FBA2c2LvNo76dxLLwJW76b1",
        size: "14",
      },
      {
        name: "file_1.txt",
        hash: "QmYwMByE4ibjuMu2nRYRfBweJGJErjmMXfZ92srKhYfq5f",
        size: "14",
      },
      {
        name: "directory_A/file_A_0.txt",
        hash: "QmeYp73qnn8EdogE4d6BhQCHtep7dkRC8FgdE3Qbo4nY9c",
        size: "16",
      },
      {
        name: "directory_A/file_A_1.txt",
        hash: "QmWetZjwHWuGsDyxX6ae5wGS68mFTXC5x61H1TUNxqBXzn",
        size: "16",
      },
      {
        name: "directory_A",
        hash: "Qmb5XsySizDeTn1kvNbyiiNy9eyg3Lb6EwGjQt7iiKBxoL",
        size: "144",
      },
    ]);
  });
});
