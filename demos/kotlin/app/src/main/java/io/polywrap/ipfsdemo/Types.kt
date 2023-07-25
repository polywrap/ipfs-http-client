package io.polywrap.ipfsdemo

import kotlinx.serialization.Serializable

@Serializable
data class IpfsHttpClient_CatOptions(
    val offset: Int? = null,
    val length: Int? = null
)

@Serializable
data class IpfsHttpClient_ArgsCat(
    val cid: String,
    val ipfsProvider: String,
    val timeout: UInt? = null,
    val catOptions: IpfsHttpClient_CatOptions? = null
)

@Serializable
data class IpfsHttpClient_AddOptions(
    val pin: Boolean? = null,
    val onlyHash: Boolean? = null,
    val wrapWithDirectory: Boolean? = null
)

@Serializable
data class IpfsHttpClient_AddResult(
    val name: String,
    val hash: String,
    val size: String
)

@Serializable
class IpfsHttpClient_FileEntry(
    val name: String,
    val data: ByteArray
)

@Serializable
data class IpfsHttpClient_ArgsAddFile(
    val data: IpfsHttpClient_FileEntry,
    val ipfsProvider: String,
    val timeout: UInt? = null,
    val addOptions: IpfsHttpClient_AddOptions? = null
)
