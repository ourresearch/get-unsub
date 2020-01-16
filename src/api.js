import axios from 'axios'
import store from "./store"

let urlBase = "https://unpaywall-jump-api.herokuapp.com/" // @todo
// let urlBase = "https://api.unpaywalljournals.org/cache/"

const serverFlags = []
if (location.href.indexOf("fast-mock-account") > -1) serverFlags.push("fast-mock-account=1")
if (location.href.indexOf("fast-mock-package") > -1) serverFlags.push("fast-mock-package=1")
if (location.href.indexOf("fast-mock-scenario") > -1) serverFlags.push("fast-mock-scenario=1")
if (location.href.indexOf("fast-mock-slider") > -1) serverFlags.push("fast-mock-slider=1")

// this lets you develop against a local API endpoint
// to set the port, when you start your dev server, use: npm run serve -- --port <my port num>
// example:
// npm run serve -- --port 8081
if (window.location.port && parseInt(window.location.port) > 8080) {
    urlBase = "http://localhost:5004/"  // your locally-hosted API
    console.log("Setting API base URL to local machine (dev use only): " + urlBase)
}
import Vue from 'vue'

const getConfig = function () {
    const token = localStorage.getItem("token")
    const headers = {}
    if (token){
        headers.Authorization = `Bearer ${token}`
    }

    return {
        headers: headers
    }
}


let numLoading = 0
const finishLoading = function () {
    numLoading = Math.min(0, numLoading - 1)
    Vue.set()
}
const startLoading = function () {
    numLoading += 1

    console.log("adding to numLoading", state.numLoading)
}


export const api = (function () {
    return {
        numLoading: 0,
        state: {
            numLoading: 0,

        },
        get: async function (path) {
            store.state.loading += 1
            console.log("api GET:", path, store.state.loading)
            const myServerFlags = [
                ...serverFlags,
                `timestamp=${new Date().getTime()}`
            ]
            const url = urlBase + path + "?" + myServerFlags.join("&")
            let res
            try {
                res = await axios.get(url, getConfig())
                console.log(`api GET ${path} success:`, res.data)
            } catch (e) {
                // how to handle axios errors:
                // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
                console.log("api GET failure:", e.response)
                throw e.response.status
            } finally {
                store.state.loading = store.state.loading - 1
            }
            return res
        },
        post: async function (path, data) {
            store.state.loading += 1
            console.log("api POST:", path, store.state.loading)
            const url = urlBase + path
            let res
            try {
                res = await axios.post(url, data, getConfig())
                console.log(`api POST ${path} success:`, res.data)
            } catch (e) {
                // how to handle axios errors:
                // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
                console.log("api POST failure:", e.response)
                alert("We're really sorry, but we've just encountered a bug. If you can send us an email at team@ourresearch.org we'll look at it right away!")
                throw e.response.status
            } finally {
                store.state.loading =  store.state.loading - 1
            }
            return res
        },
        changePassword: async function(creds){
            store.state.loading += 1
            const queryStr = `username=${creds.username}&old-password=${creds.oldPassword}&new-password=${creds.newPassword}`
            const url = urlBase + "admin/change-password?" + queryStr
            console.log("api CHANGE PASSWORD:", creds, url, store.state.loading)
            let res
            try {
                res = await axios.get(url)
                console.log(`api CHANGE PASSWORD success:`, res.data)
            } catch (e) {
                // how to handle axios errors:
                // https://gist.github.com/fgilio/230ccd514e9381fafa51608fcf137253
                console.log("api CHANGE PASSWORD failure:", e.response)
                throw e.response.status
            } finally {
                store.state.loading = store.state.loading - 1
            }
            return res
        }




    }
})()
