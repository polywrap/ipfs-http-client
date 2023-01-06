import {
  convertDirectoryToFormData
} from "../../utils";
import { encode } from "as-base64";

function encode64(str: string): string {
  return encode(Uint8Array.wrap(String.UTF8.encode(str)));
}

describe('Convert functions tests', () => {

  test("convertDirectoryToFormData", () => {
    const r = convertDirectoryToFormData({
      name: "rootDir",
      directories: [
        {
          name: "dirA",
          files: [],
          directories: [
            {
              name: "dirAA",
              directories: [
                {
                  name: "dirAAA",
                  directories: [
                    {
                      name: "dirAAAA",
                      directories: [],
                      files: [
                        {
                          data: String.UTF8.encode("file_AAAA_0_data"),
                          name: "file_AAAA_0"
                        },
                      ]
                    }
                  ],
                  files: []
                }
              ],
              files: [
                {
                  data: String.UTF8.encode("file_AA_0_data"),
                  name: "file_AA_0"
                }
              ]
            },
            {
              name: "dirAB",
              directories: [
                {
                  name: "dirABA",
                  directories: [],
                  files: [
                    {
                      data: String.UTF8.encode("file_ABA_0_data"),
                      name: "file_ABA_0"
                    },
                    {
                      data: String.UTF8.encode("file_ABA_1_data"),
                      name: "file_ABA_1"
                    }
                  ]
                }
              ],
              files: [
                {
                  data: String.UTF8.encode("file_AB_0_data"),
                  name: "file_AB_0"
                }
              ]
            }
          ]
        }],
      files: [
        {
          data: String.UTF8.encode("file_0_data"),
          name: "file_0"
        },
        {
          data: String.UTF8.encode("file_1_data"),
          name: "file_1"
        }
      ]
    })

    expect(r).toStrictEqual([
      {
        name: "rootDir",
        value: null,
        fileName: "rootDir",
        _type: "application/x-directory"
      },
        {
          name: "rootDir/file_0",
          value: encode64("file_0_data"),
          fileName: "rootDir%2Ffile_0",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/file_1",
          value: encode64("file_1_data"),
          fileName: "rootDir%2Ffile_1",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/dirA",
          value: null,
          fileName: "rootDir%2FdirA",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAA",
          value: null,
          fileName: "rootDir%2FdirA%2FdirAA",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAA/file_AA_0",
          value: encode64("file_AA_0_data"),
          fileName: "rootDir%2FdirA%2FdirAA%2Ffile_AA_0",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/dirA/dirAA/dirAAA",
          value: null,
          fileName: "rootDir%2FdirA%2FdirAA%2FdirAAA",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAA/dirAAA/dirAAAA",
          value: null,
          fileName: "rootDir%2FdirA%2FdirAA%2FdirAAA%2FdirAAAA",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAA/dirAAA/dirAAAA/file_AAAA_0",
          value: encode64("file_AAAA_0_data"),
          fileName: "rootDir%2FdirA%2FdirAA%2FdirAAA%2FdirAAAA%2Ffile_AAAA_0",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/dirA/dirAB",
          value: null,
          fileName: "rootDir%2FdirA%2FdirAB",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAB/file_AB_0",
          value: encode64("file_AB_0_data"),
          fileName: "rootDir%2FdirA%2FdirAB%2Ffile_AB_0",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/dirA/dirAB/dirABA",
          value: null,
          fileName: "rootDir%2FdirA%2FdirAB%2FdirABA",
          _type: "application/x-directory"
        },
        {
          name: "rootDir/dirA/dirAB/dirABA/file_ABA_0",
          value: encode64("file_ABA_0_data"),
          fileName: "rootDir%2FdirA%2FdirAB%2FdirABA%2Ffile_ABA_0",
          _type: "application/octet-stream"
        },
        {
          name: "rootDir/dirA/dirAB/dirABA/file_ABA_1",
          value: encode64("file_ABA_1_data"),
          fileName: "rootDir%2FdirA%2FdirAB%2FdirABA%2Ffile_ABA_1",
          _type: "application/octet-stream"
        }
      ]
    );
  });
});