// custom-instance.ts

import Axios, { AxiosRequestConfig } from "axios";
import axiosConfig from ".";

// add a second `options` argument here if you want to pass extra options to each generated query
export const customInstance = <T>(
	config: AxiosRequestConfig,
	options?: AxiosRequestConfig,
): Promise<T> => {
	const source = Axios.CancelToken.source();
	const promise = axiosConfig({
		...config,
		...options,
		cancelToken: source.token,
	}).then((data) => {
		return data;
	}) as Promise<T>;

	// @ts-expect-error test
	promise.cancel = () => {
		source.cancel("Query was cancelled");
	};

	return promise;
};
