import axios from 'axios'
import store from "./store"
import _ from "lodash"
import AwesomeDebouncePromise from 'awesome-debounce-promise';


let urlBase = "https://unpaywall-jump-api.herokuapp.com/"
// let urlBase = "https://unpaywall-jump-api-dev.herokuapp.com/"


// this lets you develop against a local API endpoint
// to set the port, when you start your dev server, use: npm run serve -- --port <my port num>
// example:
// npm run serve -- --port 8081
if (window.location.port && parseInt(window.location.port) === 8081) {
    urlBase = "http://localhost:5004/"  // your locally-hosted API
    console.log("Setting API base URL to local machine (dev use only): " + urlBase)
}
else if (window.location.port && parseInt(window.location.port) === 8082) {
    urlBase = "https://staging-jump-api.herokuapp.com/"  // staging heroku url
    console.log("Setting API base URL to staging heroku (dev use only): " + urlBase)
}

import Vue from 'vue'

const getConfig = function () {
    const token = localStorage.getItem("token")
    const headers = {}
    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
    return {
        headers: headers
    }
}


const api = (function () {
    return {
        get: async function (path) {
            console.log("api GET:", path)
            let url = urlBase + path
            let res
            try {
                res = await axios.get(url, getConfig())
                console.log(`api GET ${path} success:`, res.data)
            } catch (e) {
                // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
                console.log("api GET failure:", e.response)
                throw e
            }
            return res
        },
        post: async function (path, data) {
            console.log("api POST:", path)
            const url = urlBase + path
            let res
            try {
                res = await axios.post(url, data, getConfig())
                console.log(`api POST ${path} success:`, res.data)
            } catch (e) {
                console.log("api POST failure:", e.response)
                throw e
            }
            return res
        },
        postFile: async function (path, file) {
            console.log(`api POST FILE!`)
            const url = urlBase + path
            let res
            try {
                res = await axios.post(url, file, getConfig())
                console.log(`api POST FILE ${path} success:`, res.data)
            } catch (e) {
                console.log("api POST FILE failure:", e.response)
                throw e
            }
            return res
        },

        delete: async function (path) {
            console.log("api DELETE:", path)
            const url = urlBase + path
            let res
            try {
                res = await axios.delete(url, getConfig())
                console.log(`api DELETE ${path} success:`, res.data)
            } catch (e) {
                console.log("api DELETE failure:", e.response)
                throw e
            }
            return res
        },


    }
})()

const apiPostUnbounced = AwesomeDebouncePromise(
    api.post,
    1000,
)

const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export {
    urlBase,
    api,
    apiPostUnbounced,
    toBase64,
}