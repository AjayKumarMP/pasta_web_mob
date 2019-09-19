import axios from 'axios'
import React from 'react'
import { Redirect } from 'react-router-dom'


const httpClient = axios.create({
    headers: {
        "Content-type": "application/json"
    },
    baseURL :"http://3.212.194.151/web/api/v1/"
    // baseURL :"https://siteworx.tk/pasta/api/v1/"
})

const CancelToken = axios.CancelToken

httpClient.interceptors.request.use(function(config) {
    // Do something before request is sent
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
httpClient.interceptors.response.use(function(response) {
    // Do something with response data
    return response.data;
}, function(error) { // TODO: handle global server errors
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('user')
        Promise.reject(error);
        return <Redirect to = "/login" / >
    }
    // Do something with response error
    return Promise.reject(error);
});

export default {
    ApiCall: async(method, url, data = undefined, cancelToken = undefined) => {
        return await httpClient({
            method,
            url,
            data,
            cancelToken
        });
    },
    setDefaultHeader: (header, value) => {
        httpClient.defaults.headers.common[header] = value
    },
    getSource: () => {
        return CancelToken.source()
    }
}