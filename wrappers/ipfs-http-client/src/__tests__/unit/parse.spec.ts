import {
  parseAddDirectoryResponse,
  parseAddResponse
} from "../../utils";

describe('Parse functions tests', () => {

  test("parseAddResponse", () => {
    const r = parseAddResponse('{"Name":"file0.txt","Hash":"","Size":"16"}')

    expect(r).toStrictEqual(
        {
            name: "file0.txt",
            hash: "",
            size: "16"
        }
    )
  });

  test("parseAddDirectoryResponse", () => {
    const r = parseAddDirectoryResponse(
        '{"Name":"file0.txt","Hash":"","Size":"16"}\n' +
        '{"Name":"file1.txt","Hash":"","Size":"32"}\n'
    )

    expect(r).toStrictEqual([
        {
            name: "file0.txt",
            hash: "",
            size: "16"
        },
        {
            name: "file1.txt",
            hash: "",
            size: "32"
        }
    ]);
  });
});