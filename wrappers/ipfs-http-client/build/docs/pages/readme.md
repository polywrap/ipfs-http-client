# The IPFS HTTP Client Wrap

The IPFS HTTP Client wrap allows for basic interaction with IPFS endpoints, such as `ipfs.wrappers.io` which serves Polywrap wraps.

## Integrate

### Step 1: Polywrap Client

The Polywrap client comes with the IPFS HTTP Client wrap pre-bundled. Currently Polywrap has clients available in:
- JavaScript / TypeScript
- Python
- Rust
- Swift

### Step 2: Run!

With your client successfully configured, you can now run any function on the The IPFS HTTP Client wrap wrap with ease.

You can execute functions in TypeScript with the `client.invoke(...)` syntax like so:
```typescript
await client.invoke({
  uri: "wrap://ens/wraps.eth:ipfs-http-client@1.0.0",
  method: "cat",
  args: {...}
});
```

Or you can keep it type-safe by using Polywrap's `codegen` like so:
```typescript
await Ipfs.cat({...});
```

If you'd like to generate typings for the The IPFS HTTP Client wrap wrap, you can see an example of this in [Polywrap's Quick Start guide](https://docs.polywrap.io/quick-start#generating-types-codegen).

## Support

For any questions or problems related to the The IPFS HTTP Client wrap wrap or Polywrap at large, please visit our [Discord](https://discord.polywrap.io).
