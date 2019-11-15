import axios from "axios";
const authUrl = "https://unpaywall-jump-api.herokuapp.com/login"
const accountUrl = "https://unpaywall-jump-api.herokuapp.com/account "


export const account = {
    state: {
        selected: null,
    },
    mutations: {
        setSelected(state, myAccount){state.selected = myAccount},
        setToken(state, token){
            localStorage.setItem("token", token)
        },
        logout(state){
            state.selected = null
            localStorage.removeItem("token")
        },
    },
    actions: {
        async login({commit, dispatch, getters}, userCreds) {
            commit("startLoading")
            console.log("getting token from server")
            const resp = await  axios.post(authUrl, userCreds)
            console.log("got fetchToken response", resp.data.access_token)
            commit("setToken", resp.data.access_token)
            return await dispatch("fetchUser")
        },

        async fetchUser({commit, getters}) {
            commit("startLoading")
            const token =  localStorage.getItem("token")
            console.log("token in localstorate", token)
            const headers = {
                Authorization: `Bearer ${token}`
            }
            console.log("sending fetchUser request", headers)
            return axios.get(accountUrl, {headers: headers})
                .then(resp => {
                    console.log("got fetchUser response", resp)
                    commit("setSelected", resp.data)

                })
                .finally(() => {
                    commit('finishLoading')
                })
        },

        async loginDemo({dispatch}){
            const userCreds = {
                username: "demo",
                password: "demo"
            }
            return await dispatch("login", userCreds)
        },




    },
    getters: {
        token(state){
            return localStorage.getItem("token")
        },
        selectedAccount(state){return state.selected},
        isLoggedIn(state){return state.selected },
        authHeaders(state){
            const token =  localStorage.getItem("token")
            return {
                Authorization: `Bearer ${token}`
            }
        }
    }
}