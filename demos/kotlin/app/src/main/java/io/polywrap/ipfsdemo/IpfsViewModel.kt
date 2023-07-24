package io.polywrap.ipfsdemo

import android.util.Log
import androidx.compose.runtime.*
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import io.polywrap.configBuilder.polywrapClient
import kotlinx.coroutines.launch

class IpfsViewModel: ViewModel() {

    private val client = polywrapClient { addDefaults() }

    var fileName by mutableStateOf("hello-world.txt")
    var fileData by mutableStateOf("Hello World!!!")
    var output by mutableStateOf("")

    fun addAndRetrieveFile() = viewModelScope.launch {
        output = "File Name: $fileName\nFile Data: $fileData\n===========================\n"

        val addFileResult = client.addFile(fileName = fileName, fileData = fileData)

        if (addFileResult.isFailure) {
            output += "Failed to add file: ${addFileResult.exceptionOrNull()!!}\n"
            Log.e("IpfsViewModel", "Failed to add file", addFileResult.exceptionOrNull()!!)
        } else {
            val cid = addFileResult.getOrThrow().hash
            output += "Successfully Added: $cid\n"
            val catResult = client.cat(cid).getOrThrow()
            val text = catResult.decodeToString()
            output += "Cat Result: $text\n"
        }
    }

    override fun onCleared() {
        super.onCleared()
        client.close()
    }
}


