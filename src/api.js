import axios from 'axios'
import store from "./store"

const urlBase = "https://unpaywall-jump-api.herokuapp.com/"
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
            const url = urlBase + path + `?timestamp=${new Date().getTime()}`
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
                throw e.response.status
            } finally {
                store.state.loading =  store.state.loading - 1
            }
            return res
        },




    }
})()
