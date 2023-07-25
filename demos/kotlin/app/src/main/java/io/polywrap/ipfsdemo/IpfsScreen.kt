package io.polywrap.ipfsdemo

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun IpfsScreen(fileViewModel: IpfsViewModel = viewModel()) {
    Column(
        modifier = Modifier
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        Text(
            text = "IPFS File Uploader",
            style = MaterialTheme.typography.headlineMedium,
            color = MaterialTheme.colorScheme.primary,
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = fileViewModel.fileName,
            onValueChange = { fileViewModel.fileName = it },
            label = { Text("File Name", style = MaterialTheme.typography.labelSmall) },
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .height(60.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(
            value = fileViewModel.fileData,
            onValueChange = { fileViewModel.fileData = it },
            label = { Text("File Data", style = MaterialTheme.typography.labelSmall) },
            modifier = Modifier
                .fillMaxWidth(0.8f)
                .height(60.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Button(
            onClick = { fileViewModel.addAndRetrieveFile() },
            shape = MaterialTheme.shapes.extraSmall,
            colors = ButtonDefaults.buttonColors(
                containerColor = Color.Cyan,
                contentColor = MaterialTheme.colorScheme.background,
                disabledContentColor = Color.Gray,
                disabledContainerColor = Color.LightGray,
            ),
            modifier = Modifier
                .width(200.dp)
                .height(56.dp)
        ) {
            Text("Add and Cat", style = MaterialTheme.typography.labelMedium)
        }
        Spacer(modifier = Modifier.height(16.dp))
        OutlinedCard(
            modifier = Modifier.fillMaxSize(),
        ) {
            Text(
                text = fileViewModel.output,
                style = MaterialTheme.typography.bodyLarge,
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
