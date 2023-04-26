use polywrap_client::{
    builder::types::{BuilderConfig, ClientConfigHandler},
    client::PolywrapClient,
    core::uri::Uri,
    msgpack::msgpack,
};
use polywrap_client_default_config;
use serde::Deserialize;

#[derive(Deserialize)]
struct AddFileResult {
    hash: String,
}

fn main() {
    let ipfs_provider = "http://localhost:5001";
    let uri = Uri::try_from("ens/wraps.eth:ipfs-http-client@1.0.0").unwrap();
    let default_config = polywrap_client_default_config::build();
    let builder = BuilderConfig::new(Some(default_config));
    let config = builder.build();

    let client = PolywrapClient::new(config);

    let file_name = "hello-world.txt";
    let file_data = "Hello World!!!";

    println!("File Name: {}", file_name);
    println!("File Data: {}", file_data);

    let add_file_resp = client
        .invoke::<AddFileResult>(
            &uri.clone(),
            "addFile",
            Some(&msgpack!({
                "name": file_name,
                "data": file_data.as_bytes().to_vec(),
                "ipfsProvider": ipfs_provider
            })),
            None,
            None,
        )
        .unwrap();

    println!("Successfully Added: {}", add_file_resp.hash);

    let cat_resp = client
        .invoke::<Vec<u8>>(
            &uri,
            "cat",
            Some(&msgpack!({
                "cid": add_file_resp.hash,
                "ipfsProvider": ipfs_provider
            })),
            None,
            None,
        )
        .unwrap();

    println!("Cat Result: {}", String::from_utf8(cat_resp).unwrap());
}
