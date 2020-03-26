import {api} from "../api";
import router from "../router"


export const user = {
    state: {
        id: "",
        name: "",
        email: "",
        password: "",
        institutions: [],
    },
    mutations: {
        setToken(state, token){
            localStorage.setItem("token", token)
        },
        logout(state){
            state.id = ""
            state.name = ""
            state.email = ""
            state.password = ""
            state.institutions = []
            localStorage.removeItem("token")
        },
        setFromApiResp(state, apiResp){
            state.id = apiResp.id
            state.name = apiResp.name
            state.email = apiResp.email
            state.password = apiResp.password
            state.institutions = apiResp.user_permissions
        },
    },
    actions: {
        async login({commit, dispatch, getters}, {email, password}) {
            const resp = await api.post("user/login", {email, password})
            commit("setToken", resp.data.access_token)
            dispatch("fetchUser")
        },
        async createDemo({commit, dispatch, getters}, {email, password}) {
            const resp = await api.post("user/demo", {email, password})
            commit("setToken", resp.data.access_token)
            dispatch("fetchUser")
        },
        async fetchUser({commit, getters}) {
            const resp = await api.get("user/me")
            commit("setFromApiResp", resp.data)
        },
        async changeName({commit, state}, name){
            state.password = password
            const resp = await api.post("user/me", {name})
            return resp
        },
        async changeEmail({commit, state}, email){
            state.password = password
            const resp = await api.post("user/me", {email})
            return resp
        },
        async changePassword({commit, state}, password){
            state.password = password
            const resp = await api.post("user/me", {password})
            return resp
        },

    },
    getters: {
        userName: (state) => state.name,
        userEmail: (state) => state.email,
        userPassword: (state) => state.password,
        userInstitutions: (state) => state.institutions,
        isLoggedIn: (state) => !!state.email,
        token: () => localStorage.getItem("token"),
        isUserSubscribed(state){
            return state.password
        },
    }
}