import {api} from "../api"

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
            const resp = await  api.post("login", userCreds)
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")

        },

        async fetchUser({commit, getters}) {
            const resp = await api.get("account")
            commit("setSelected", resp.data)
        },

        async changePassword({commit}, creds){
            const resp = await api.changePassword(creds)
            commit("logout")
            return resp
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
        },
        isCustomerAccount(state){
            if (!state.selected) return false
            return !state.selected.is_demo_account
        }
    }
}