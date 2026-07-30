import { requestUrl } from "obsidian";
import type { RuntimeBufferedRequestFn } from "./runtime-download";

export const obsidianBufferedRequest: RuntimeBufferedRequestFn = async ({
  url,
  headers
}) => {
  const response = await requestUrl({
    url,
    method: "GET",
    headers: { ...headers },
    throw: false
  });
  const normalizedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(response.headers || {})) {
    const rawValue: unknown = value;
    normalizedHeaders[key.toLowerCase()] = Array.isArray(rawValue)
      ? rawValue.join(", ")
      : String(rawValue ?? "");
  }
  return {
    status: response.status,
    headers: normalizedHeaders,
    body: response.arrayBuffer
  };
};
