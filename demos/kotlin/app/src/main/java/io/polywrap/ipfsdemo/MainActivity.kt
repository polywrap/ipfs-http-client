package io.polywrap.ipfsdemo

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.CardColors
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import io.polywrap.ipfsdemo.ui.theme.IpfsdemoTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            IpfsdemoTheme {
                // A surface container using the 'background' color from the theme
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    IpfsScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IpfsScreen(fileViewModel: IpfsViewModel = viewModel()) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(
            text = "IPFS File Uploader",
            style = MaterialTheme.typography.headlineSmall,
            color = MaterialTheme.colorScheme.secondary
        )
        OutlinedTextField(
            value = fileViewModel.fileName,
            onValueChange = { fileViewModel.fileName = it },
            label = { Text("File Name") },
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .height(56.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = fileViewModel.fileData,
            onValueChange = { fileViewModel.fileData = it },
            label = { Text("File Data") },
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .height(56.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
            onClick = { fileViewModel.addAndRetrieveFile() },
            modifier = Modifier
                .width(200.dp)
                .height(56.dp)
        ) {
            Text("Add and Cat File")
        }
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedCard(
            modifier = Modifier.fillMaxSize(),
        ) {
            Text(
                text = fileViewModel.output,
                modifier = Modifier.fillMaxSize(),
            )
        }
    }
}

@Preview(showBackground = true)
@Composable
fun IpfsScreenPreview() {
    IpfsScreen()
}

