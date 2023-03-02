import {
  AddOptions,
  AddResult,
  Args_addFile,
  Args_addDir,
  Args_cat,
  Args_resolve,
  CatOptions,
  ResolveOptions,
  Http_FormDataEntry,
  Http_Module,
  Http_Request,
  Http_Response,
  Http_ResponseType, ResolveResult, Args_addBlob
} from "./wrap";
import {
  convertBlobToFormData,
  ipfsError,
  parseAddDirectoryResponse,
  parseAddResponse, parseResolveResponse
} from "./utils";

import { decode, encode } from "as-base64";
import { Box, Result } from "@polywrap/wasm-as";

export function cat(args: Args_cat): ArrayBuffer {
  const request = createCatRequest(
    args.cid,
    Http_ResponseType.BINARY,
    args.timeout,
    args.catOptions
  );
  const result = executeGetOperation(
    args.ipfsProvider,
    request,
    "cat",
    "/api/v0/cat"
  );
  return decode(result).buffer;
}

export function resolve(args: Args_resolve): ResolveResult {
  const request = createResolveRequest(
    args.cid,
    Http_ResponseType.TEXT,
    args.timeout,
    args.resolveOptions
  );
  const resolveResponse = executeGetOperation(
    args.ipfsProvider,
    request,
    "resolve",
    "/api/v0/resolve"
  );
  return {
    cid: parseResolveResponse(resolveResponse),
    provider: args.ipfsProvider,
  };
}

export function addFile(args: Args_addFile): AddResult {
  const request = createAddRequest([{
      name: args.data.name,
      value: encode(Uint8Array.wrap(args.data.data)),
      fileName: args.data.name,
      _type: "application/octet-stream"
    }],
    Http_ResponseType.TEXT,
    args.timeout,
    args.addOptions
  );
  const addResponse = executePostOperation(
    args.ipfsProvider,
    request,
    "add",
    "/api/v0/add"
  );
  return parseAddResponse(addResponse);
}

export function addDir(args: Args_addDir): AddResult[] {
  const request = createAddRequest(
    convertBlobToFormData({ directories: [args.data] }),
    Http_ResponseType.TEXT,
    args.timeout,
    args.addOptions
  );
  const addDirectoryResponse = executePostOperation(
    args.ipfsProvider,
    request,
    "addDir",
    "/api/v0/add"
  );
  return parseAddDirectoryResponse(addDirectoryResponse);
}

export function addBlob(args: Args_addBlob): AddResult[] {
  const request = createAddRequest(
    convertBlobToFormData(args.data),
    Http_ResponseType.TEXT,
    args.timeout,
    args.addOptions
  );
  const addDirectoryResponse = executePostOperation(
    args.ipfsProvider,
    request,
    "addBlob",
    "/api/v0/add"
  );
  return parseAddDirectoryResponse(addDirectoryResponse);
}

function createCatRequest(cid: string, responseType: Http_ResponseType, timeout: Box<u32> | null, options: CatOptions | null = null): Http_Request {
  const urlParams: Map<string, string> = new Map<string, string>();

  urlParams.set("arg", cid);

  if (options !== null) {
    if (options.length !== null) {
      urlParams.set("length", options.length!.unwrap().toString());
    }
    if (options.offset !== null) {
      urlParams.set("offset", options.offset!.unwrap().toString());
    }
  }

  return { urlParams, responseType, timeout };
}

function createResolveRequest(cid: string, responseType: Http_ResponseType, timeout: Box<u32> | null, options: ResolveOptions | null = null): Http_Request {
  const urlParams: Map<string, string> = new Map<string, string>();

  urlParams.set("arg", cid);

  if (options !== null) {
    if (options.recursive !== null) {
      urlParams.set("recursive", options.recursive!.unwrap().toString());
    }
    if (options.dhtRecordCount !== null) {
      urlParams.set("dht-record-count", options.dhtRecordCount!.unwrap().toString());
    }
    if (options.dhtTimeout !== null) {
      urlParams.set("dht-timeout", options.dhtTimeout!);
    }
  }

  return { urlParams, responseType, timeout };
}

function createAddRequest(formData: Http_FormDataEntry[], responseType: Http_ResponseType, timeout: Box<u32> | null, options: AddOptions | null = null): Http_Request {
  const headers: Map<string, string> = new Map<string, string>();
  headers.set("Content-Type", "multipart/form-data");

  let urlParams: Map<string, string> | null = null;

  if (options !== null) {
    urlParams = new Map<string, string>();
    if (options.onlyHash) {
      urlParams.set("only-hash", options.onlyHash!.unwrap().toString())
    }
    if (options.pin) {
      urlParams.set("pin", options.pin!.unwrap().toString())
    }
    if (options.wrapWithDirectory) {
      urlParams.set("wrap-with-directory", options.wrapWithDirectory!.unwrap().toString())
    }
  }

  return { headers, urlParams, responseType, formData, timeout };
}

function executeGetOperation(
  provider: string,
  request: Http_Request,
  operation: string,
  operationUrl: string
): string {
  const url = provider + operationUrl;
  const httpResult = Http_Module.get({ url, request });
  return unwrapHttpResult(operation, httpResult);
}

function executePostOperation(
  provider: string,
  request: Http_Request,
  operation: string,
  operationUrl: string
): string {
  const url = provider + operationUrl;
  const httpResult = Http_Module.post({ url, request });
  return unwrapHttpResult(operation, httpResult);
}

function unwrapHttpResult(operation: string, httpResult: Result<Http_Response | null, string>): string {
  if (httpResult.isErr) {
    throw new Error(ipfsError(operation, httpResult.unwrapErr()));
  }

  const response: Http_Response | null = httpResult.unwrap();

  if (response === null) {
    throw new Error(ipfsError(operation, "Http Response is null"));
  }

  if (response.status !== 200) {
    throw new Error(ipfsError(operation, "Http error", new Box(response.status), response.statusText));
  }

  if (response.body === null) {
    throw new Error(ipfsError(operation, "Http Response body is null"));
  }

  return response.body!;
}
