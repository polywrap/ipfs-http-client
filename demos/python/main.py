from pathlib import Path
from typing import cast

from polywrap_client import PolywrapClient, PolywrapClientConfig
from polywrap_uri_resolvers import FsUriResolver,SimpleFileReader, StaticResolver, RecursiveResolver
from polywrap_uri_resolvers.uri_resolver_aggregator import UriResolverAggregator
from polywrap_core import IUriResolver, InvokerOptions, Uri
from polywrap_http_plugin import http_plugin


async def main():
    resolver = RecursiveResolver(
        UriResolverAggregator(
            [
                cast(IUriResolver, FsUriResolver(file_reader=SimpleFileReader())),
                cast(IUriResolver, StaticResolver({Uri("wrap://ens/wraps.eth:http@1.1.0"): http_plugin()})),
            ]
        )
    )

    config = PolywrapClientConfig(resolver=resolver)
    client = PolywrapClient(config)

    ipfs_wrapper_path = Path(__file__).parent.parent.parent.joinpath("wrappers", "ipfs-http-client", "build")
    ipfs_wrapper_uri = Uri(f"fs/{ipfs_wrapper_path}")

    result = await client.invoke(
        InvokerOptions(
            uri=ipfs_wrapper_uri,
            method="cat",
            args={
                "cid": "QmZ4d7KWCtH3xfWFwcdRXEkjZJdYNwonrCwUckGF1gRAH9",
                "ipfsProvider": "https://ipfs.io",
            },
        )
    )

    assert result.is_err() == False
    assert result.unwrap().startswith(b"<svg")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
