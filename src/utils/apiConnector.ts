import axios, { AxiosResponse } from "axios";
import { ApiResponse } from "./types";
import { env } from "@/env";

export type Response<T = never> = ApiResponse & {
  data?: T;
};

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiRequestConfig<TParams = Record<string, unknown>> {
  url: string;
  method: HttpMethod;
  data?: unknown;
  headers?: Record<string, string>;
  params?: TParams;
}

const axiosInstance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * A function that handles the response from the API
 * @param url the URL of the API endpoint
 * @param method the HTTP method to use
 * @param data the data to send in the request body
 * @param headers the headers to send with the request
 * @param params the query parameters to send with the request
 * @returns the response from the API
 */

export async function apiConnector<
  TData = never,
  TParams = Record<string, unknown>,
>({
  url,
  method,
  data,
  headers,
  params,
}: ApiRequestConfig<TParams>): Promise<Response<TData>> {
  try {
    const res: AxiosResponse<Response<TData>> = await axiosInstance({
      url,
      method,
      data,
      headers,
      params,
    });

    return res.data;
  } catch (err: any) {
    console.error("[API AXIOS-ERROR]", err.message);
    if (axios.isAxiosError(err)) {
      if (err.response) {
        return {
          success: false,
          message: err.response?.data?.message ?? "Something went wrong",
        };
      }

      // Network error
      return {
        success: false,
        message: "Network Error!",
      };
    }

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}
