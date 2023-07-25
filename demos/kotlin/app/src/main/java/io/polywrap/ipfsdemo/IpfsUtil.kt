package io.polywrap.ipfsdemo

import io.polywrap.client.PolywrapClient
import io.polywrap.core.resolution.Uri

val uri = Uri("ens/wraps.eth:ipfs-http-client@1.0.0")
const val ipfsProvider = "http://10.0.2.2:5001"

fun PolywrapClient.addFile(
    fileName: String,
    fileData: String
): Result<IpfsHttpClient_AddResult> = this.invoke(
    uri = uri,
    method = "addFile",
    args = IpfsHttpClient_ArgsAddFile(
        data = IpfsHttpClient_FileEntry(
            name = fileName,
            data = fileData.encodeToByteArray()
        ),
        ipfsProvider = ipfsProvider
    )
)

fun PolywrapClient.cat(cid: String): Result<ByteArray> = this.invoke(
    uri = uri,
    method = "cat",
    args = IpfsHttpClient_ArgsCat(
        cid = cid,
        ipfsProvider = ipfsProvider
    )
)
