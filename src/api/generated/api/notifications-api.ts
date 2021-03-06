/* tslint:disable */
/* eslint-disable */
/**
 * Jellyfin API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import globalAxios, { AxiosPromise, AxiosInstance } from 'axios';
import { Configuration } from '../configuration';
// Some imports not used depending on template conditions
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, RequestArgs, BaseAPI, RequiredError } from '../base';
// @ts-ignore
import { NameIdPair } from '../models';
// @ts-ignore
import { NotificationLevel } from '../models';
// @ts-ignore
import { NotificationResultDto } from '../models';
// @ts-ignore
import { NotificationTypeInfo } from '../models';
// @ts-ignore
import { NotificationsSummaryDto } from '../models';
/**
 * NotificationsApi - axios parameter creator
 * @export
 */
export const NotificationsApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Sends a notification to all admins.
         * @param {string} [url] The URL of the notification.
         * @param {NotificationLevel} [level] The level of the notification.
         * @param {string} [name] The name of the notification.
         * @param {string} [description] The description of the notification.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createAdminNotification: async (url?: string, level?: NotificationLevel, name?: string, description?: string, options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notifications/Admin`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }

            if (url !== undefined) {
                localVarQueryParameter['url'] = url;
            }

            if (level !== undefined) {
                localVarQueryParameter['level'] = level;
            }

            if (name !== undefined) {
                localVarQueryParameter['name'] = name;
            }

            if (description !== undefined) {
                localVarQueryParameter['description'] = description;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Gets notification services.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationServices: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notifications/Services`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Gets notification types.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationTypes: async (options: any = {}): Promise<RequestArgs> => {
            const localVarPath = `/Notifications/Types`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Gets a user\'s notifications.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotifications: async (userId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling getNotifications.');
            }
            const localVarPath = `/Notifications/{userId}`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Gets a user\'s notification summary.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsSummary: async (userId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling getNotificationsSummary.');
            }
            const localVarPath = `/Notifications/{userId}/Summary`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Sets notifications as read.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setRead: async (userId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling setRead.');
            }
            const localVarPath = `/Notifications/{userId}/Read`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Sets notifications as unread.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setUnread: async (userId: string, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'userId' is not null or undefined
            if (userId === null || userId === undefined) {
                throw new RequiredError('userId','Required parameter userId was null or undefined when calling setUnread.');
            }
            const localVarPath = `/Notifications/{userId}/Unread`
                .replace(`{${"userId"}}`, encodeURIComponent(String(userId)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, 'https://example.com');
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }
            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            // authentication CustomAuthentication required
            if (configuration && configuration.apiKey) {
                const localVarApiKeyValue = typeof configuration.apiKey === 'function'
                    ? await configuration.apiKey("X-Emby-Authorization")
                    : await configuration.apiKey;
                localVarHeaderParameter["X-Emby-Authorization"] = localVarApiKeyValue;
            }


    
            const query = new URLSearchParams(localVarUrlObj.search);
            for (const key in localVarQueryParameter) {
                query.set(key, localVarQueryParameter[key]);
            }
            for (const key in options.query) {
                query.set(key, options.query[key]);
            }
            localVarUrlObj.search = (new URLSearchParams(query)).toString();
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: localVarUrlObj.pathname + localVarUrlObj.search + localVarUrlObj.hash,
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * NotificationsApi - functional programming interface
 * @export
 */
export const NotificationsApiFp = function(configuration?: Configuration) {
    return {
        /**
         * 
         * @summary Sends a notification to all admins.
         * @param {string} [url] The URL of the notification.
         * @param {NotificationLevel} [level] The level of the notification.
         * @param {string} [name] The name of the notification.
         * @param {string} [description] The description of the notification.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async createAdminNotification(url?: string, level?: NotificationLevel, name?: string, description?: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).createAdminNotification(url, level, name, description, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Gets notification services.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationServices(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NameIdPair>>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).getNotificationServices(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Gets notification types.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationTypes(options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<NotificationTypeInfo>>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).getNotificationTypes(options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Gets a user\'s notifications.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotifications(userId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NotificationResultDto>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).getNotifications(userId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Gets a user\'s notification summary.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getNotificationsSummary(userId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<NotificationsSummaryDto>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).getNotificationsSummary(userId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Sets notifications as read.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setRead(userId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).setRead(userId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
        /**
         * 
         * @summary Sets notifications as unread.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async setUnread(userId: string, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await NotificationsApiAxiosParamCreator(configuration).setUnread(userId, options);
            return (axios: AxiosInstance = globalAxios, basePath: string = BASE_PATH) => {
                const axiosRequestArgs = {...localVarAxiosArgs.options, url: basePath + localVarAxiosArgs.url};
                return axios.request(axiosRequestArgs);
            };
        },
    }
};

/**
 * NotificationsApi - factory interface
 * @export
 */
export const NotificationsApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    return {
        /**
         * 
         * @summary Sends a notification to all admins.
         * @param {string} [url] The URL of the notification.
         * @param {NotificationLevel} [level] The level of the notification.
         * @param {string} [name] The name of the notification.
         * @param {string} [description] The description of the notification.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        createAdminNotification(url?: string, level?: NotificationLevel, name?: string, description?: string, options?: any): AxiosPromise<void> {
            return NotificationsApiFp(configuration).createAdminNotification(url, level, name, description, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Gets notification services.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationServices(options?: any): AxiosPromise<Array<NameIdPair>> {
            return NotificationsApiFp(configuration).getNotificationServices(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Gets notification types.
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationTypes(options?: any): AxiosPromise<Array<NotificationTypeInfo>> {
            return NotificationsApiFp(configuration).getNotificationTypes(options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Gets a user\'s notifications.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotifications(userId: string, options?: any): AxiosPromise<NotificationResultDto> {
            return NotificationsApiFp(configuration).getNotifications(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Gets a user\'s notification summary.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getNotificationsSummary(userId: string, options?: any): AxiosPromise<NotificationsSummaryDto> {
            return NotificationsApiFp(configuration).getNotificationsSummary(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Sets notifications as read.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setRead(userId: string, options?: any): AxiosPromise<void> {
            return NotificationsApiFp(configuration).setRead(userId, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Sets notifications as unread.
         * @param {string} userId 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        setUnread(userId: string, options?: any): AxiosPromise<void> {
            return NotificationsApiFp(configuration).setUnread(userId, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * Request parameters for createAdminNotification operation in NotificationsApi.
 * @export
 * @interface NotificationsApiCreateAdminNotificationRequest
 */
export interface NotificationsApiCreateAdminNotificationRequest {
    /**
     * The URL of the notification.
     * @type {string}
     * @memberof NotificationsApiCreateAdminNotification
     */
    readonly url?: string

    /**
     * The level of the notification.
     * @type {NotificationLevel}
     * @memberof NotificationsApiCreateAdminNotification
     */
    readonly level?: NotificationLevel

    /**
     * The name of the notification.
     * @type {string}
     * @memberof NotificationsApiCreateAdminNotification
     */
    readonly name?: string

    /**
     * The description of the notification.
     * @type {string}
     * @memberof NotificationsApiCreateAdminNotification
     */
    readonly description?: string
}

/**
 * Request parameters for getNotifications operation in NotificationsApi.
 * @export
 * @interface NotificationsApiGetNotificationsRequest
 */
export interface NotificationsApiGetNotificationsRequest {
    /**
     * 
     * @type {string}
     * @memberof NotificationsApiGetNotifications
     */
    readonly userId: string
}

/**
 * Request parameters for getNotificationsSummary operation in NotificationsApi.
 * @export
 * @interface NotificationsApiGetNotificationsSummaryRequest
 */
export interface NotificationsApiGetNotificationsSummaryRequest {
    /**
     * 
     * @type {string}
     * @memberof NotificationsApiGetNotificationsSummary
     */
    readonly userId: string
}

/**
 * Request parameters for setRead operation in NotificationsApi.
 * @export
 * @interface NotificationsApiSetReadRequest
 */
export interface NotificationsApiSetReadRequest {
    /**
     * 
     * @type {string}
     * @memberof NotificationsApiSetRead
     */
    readonly userId: string
}

/**
 * Request parameters for setUnread operation in NotificationsApi.
 * @export
 * @interface NotificationsApiSetUnreadRequest
 */
export interface NotificationsApiSetUnreadRequest {
    /**
     * 
     * @type {string}
     * @memberof NotificationsApiSetUnread
     */
    readonly userId: string
}

/**
 * NotificationsApi - object-oriented interface
 * @export
 * @class NotificationsApi
 * @extends {BaseAPI}
 */
export class NotificationsApi extends BaseAPI {
    /**
     * 
     * @summary Sends a notification to all admins.
     * @param {NotificationsApiCreateAdminNotificationRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public createAdminNotification(requestParameters: NotificationsApiCreateAdminNotificationRequest = {}, options?: any) {
        return NotificationsApiFp(this.configuration).createAdminNotification(requestParameters.url, requestParameters.level, requestParameters.name, requestParameters.description, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Gets notification services.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public getNotificationServices(options?: any) {
        return NotificationsApiFp(this.configuration).getNotificationServices(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Gets notification types.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public getNotificationTypes(options?: any) {
        return NotificationsApiFp(this.configuration).getNotificationTypes(options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Gets a user\'s notifications.
     * @param {NotificationsApiGetNotificationsRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public getNotifications(requestParameters: NotificationsApiGetNotificationsRequest, options?: any) {
        return NotificationsApiFp(this.configuration).getNotifications(requestParameters.userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Gets a user\'s notification summary.
     * @param {NotificationsApiGetNotificationsSummaryRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public getNotificationsSummary(requestParameters: NotificationsApiGetNotificationsSummaryRequest, options?: any) {
        return NotificationsApiFp(this.configuration).getNotificationsSummary(requestParameters.userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Sets notifications as read.
     * @param {NotificationsApiSetReadRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public setRead(requestParameters: NotificationsApiSetReadRequest, options?: any) {
        return NotificationsApiFp(this.configuration).setRead(requestParameters.userId, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Sets notifications as unread.
     * @param {NotificationsApiSetUnreadRequest} requestParameters Request parameters.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof NotificationsApi
     */
    public setUnread(requestParameters: NotificationsApiSetUnreadRequest, options?: any) {
        return NotificationsApiFp(this.configuration).setUnread(requestParameters.userId, options).then((request) => request(this.axios, this.basePath));
    }
}
