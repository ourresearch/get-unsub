import {api} from "../api";
import router from "../router"


export const user = {
    state: {
        id: "",
        name: "",
        email: "",
        isPasswordSet: "",
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
            state.isPasswordSet = ""
            state.institutions = []
            localStorage.removeItem("token")
        },
        setFromApiResp(state, apiResp){
            state.id = apiResp.id
            state.name = apiResp.name
            state.email = apiResp.email
            state.isPasswordSet = apiResp.is_password_set
            state.institutions = apiResp.user_permissions
        },
    },
    actions: {
        async login({commit, dispatch, getters}, {email, password}) {
            const resp = await api.post("user/login", {email, password})
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")
        },
        async createDemo({commit, dispatch, getters}, {email, password, name}) {
            const resp = await api.post("user/demo", {email, password, name})
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")
        },
        async fetchUser({commit, dispatch, getters}) {
            const resp = await api.get("user/me")
            commit("setFromApiResp", resp.data)
            if (getters.userInstitutions.length === 1) {
                const myOnlyInstitutionId = getters.userInstitutions[0].institution_id
                dispatch("fetchInstitution", myOnlyInstitutionId)
            }

        },
        async changeName({commit, state}, name){
            const resp = await api.post("user/me", {name})
            state.name = name
            return resp
        },
        async changeEmail({commit, state}, email){
            const resp = await api.post("user/me", {email})
            state.email = email
            return resp
        },
        async changePassword({commit, state}, password){
            const resp = await api.post("user/me", {password})
            state.isPasswordSet = true
            return resp
        },

    },
    getters: {
        userName: (state) => state.name,
        userId: (state) => state.id,
        userEmail: (state) => {
            if (/@/.test(state.email)) {
                return state.email
            }
        },
        userUsername: (state) => {
            if (!/@/.test(state.email)) {
                return state.email
            }
        },
        userPasswordIsSet: (state) => state.isPasswordSet,
        userInstitutions: (state) => state.institutions,
        isLoggedIn: (state) => !!state.email,
        token: () => localStorage.getItem("token"),
        isUserSubscribed(state){
            return state.password
        },
    }
}