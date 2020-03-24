import {api} from "../api";


export const user = {
    state: {
        id: "",
        name: "",
        email: "",
        password: "",
        permissions: [],
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
            state.permissions = []
            localStorage.removeItem("token")
        },
        setFromApiResp(state, apiResp){
            state.id = apiResp.id
            state.name = apiResp.name
            state.email = apiResp.email
            state.password = apiResp.password
            state.permissions = apiResp.permissions
        },
    },
    actions: {
        async login({commit, dispatch, getters}, {email, password}) {
            const resp = await  api.post("user/login", {email, password})
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")
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
        userPermissions: (state) => state.permissions,
        isLoggedIn: (state) => state.email,
        token: () => localStorage.getItem("token"),
        isUserSubscribed(state){
            return state.selected.password
        }
    }
}