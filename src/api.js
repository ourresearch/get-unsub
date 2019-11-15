import axios from 'axios'

const urlBase = "https://unpaywall-jump-api.herokuapp.com/"
import Vue from 'vue'

const getConfig = function () {
    const token = localStorage.getItem("token")
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
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
        get: async function (path) {
            this.numLoading += 1
            console.log("api GET:", path, this.numLoading)
            const url = urlBase + path
            let res
            try {
                res = await axios.get(url, getConfig())
                console.log(`api GET ${path} success:`, res.data)
            } catch (e) {
                console.log("api GET failure:", e)
            } finally {
                this.numLoading = Math.max(0, numLoading - 1)
            }
            return res
        },
        post: async function (path, data) {
            this.numLoading += 1
            console.log("api POST:", path, this.numLoading)
            const url = urlBase + path
            let res
            try {
                res = await axios.post(url, data, getConfig())
                console.log(`api POST ${path} success:`, res.data)
            } catch (e) {
                console.log("api POST failure:", e)
            } finally {
                this.numLoading = Math.max(0, numLoading - 1)
            }
            return res
        }



    }
})()


// export default ret()



// export const api = {
//         numLoading: 0,
//         get: async function (path) {
//             this.numLoading += 1
//             console.log("api GET:", path, this.numLoading)
//             const url = urlBase + path
//             let res
//             try {
//                 res = await axios.get(url, getConfig())
//                 console.log(`api GET ${path} success:`, res.data)
//             } catch (e) {
//                 console.log("api GET failure:", e)
//             } finally {
//                 this.numLoading = Math.max(0, numLoading - 1)
//             }
//             return res
//         },
//         post: async function (path, data) {
//             this.numLoading += 1
//             console.log("api POST:", path)
//             const url = urlBase + path
//             let res
//             try {
//                 res = await axios.post(url, data, getConfig())
//                 console.log(`api POST ${path} success:`, res.data)
//             } catch (e) {
//                 console.log("api POST failure:", e)
//             } finally {
//                 this.numLoading = Math.max(0, numLoading - 1)
//             }
//             return res
//         }
//     }