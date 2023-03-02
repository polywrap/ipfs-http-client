use polywrap_core::uri::{ Uri };
use polywrap_client::{
    polywrap_client::{ PolywrapClient }
};
use polywrap_client_builder::{
    types::{ BuilderConfig }
};
use std::env::{ current_dir };
use serde::Deserialize;

#[derive(Deserialize)]
struct AddFileResult {
    hash: String
}

#[tokio::main]
async fn main() {
    let ipfs_provider = "http://localhost:5001";
    let uri = Uri::try_from("ens/wraps.eth:ipfs-http-client@1.0.0").unwrap();
    let local_uri = Uri::try_from(format!(
        "fs/{}",
        current_dir().unwrap().as_path().join(
            "../../wrappers/ipfs-http-client/build"
        ).display(),
    )).unwrap();

    let mut builder = BuilderConfig::new(None);
    builder.add_redirect(uri, local_uri);
    let config = builder.build();

    let client = PolywrapClient::new(config);

    let file_name = "hello-world.txt";
    let file_data = "Hello World!!!";

    println!("File Name: {}", file_name);
    println!("File Data: {}", file_data);

    let add_file_resp = client.invoke::<AddFileResult>(
        uri,
        "addFile",
        Some(&msgpack!({
            name: file_name,
            data: file_data.as_bytes(),
            ipfsProvider: ipfs_provider
        }))
    ).await.unwrap();

    println!("Successfully Added: {}", add_file_resp.hash);

    let cat_resp = client.invoke::<Vec<u8>>(
        uri,
        "cat",
        Some(&msgpack!({
            cid: add_file_resp.hash,
            ipfsProvider: ipfs_provider
        }))
    ).await.unwrap();

    println!("Cat Result: {}", String::from_utf8(cat_resp));
}
