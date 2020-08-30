import {api} from "../api";
import {sleep} from "../shared/util";
import router from "../components/router"


export const user = {
    state: {
        id: "",
        name: "",
        username: "",
        email: "",
        isPasswordSet: "",
        institutions: [],
        consortia: [],
    },
    mutations: {
        setToken(state, token){
            localStorage.setItem("token", token)
        },
        logout(state){
            state.id = ""
            state.name = ""
            state.email = ""
            state.username = ""
            state.isPasswordSet = ""
            state.institutions = []
            state.consortia = []
            localStorage.removeItem("token")
        },
        setFromApiResp(state, apiResp){
            state.id = apiResp.id
            state.name = apiResp.name
            state.email = apiResp.email
            state.username = apiResp.username
            state.isPasswordSet = apiResp.is_password_set
            state.institutions = apiResp.institutions
            state.consortia = apiResp.consortia

            // hack to fix API bug that exists in demo profiles
            if (!state.institutions.length && !state.consortia.length && apiResp.user_permissions.length){
                state.institutions = apiResp.user_permissions
            }
        },
    },
    actions: {
        async loginFromCreds({commit, dispatch, getters}, creds) {
            const resp = await api.post("user/login", creds)
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")
            await router.push("a")

            // await dispatch("fetchInstitution", getters.userPrimaryInstitutionId)
            // await router.push(`i/${getters.userPrimaryInstitutionId}`)
        },
        async createDemo({commit, dispatch, getters}, {email, password, name}) {
            const resp = await api.post("user/demo", {email, password, name})
            commit("setToken", resp.data.access_token)
            await dispatch("fetchUser")
            await router.push(`a`)
        },
        async fetchUser({commit, dispatch, getters}) {
            if (getters.userInstitutions.length) return
            const resp = await api.get("user/me")
            commit("setFromApiResp", resp.data)
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
        userEmail: (state) => state.email,
        userUsername: (state) => {
            return state.username
        },
        userPasswordIsSet: (state) => state.isPasswordSet,
        userInstitutions: (state) => state.institutions,
        userConsortia: (state) => state.consortia,
        userIsDemo: (state) => {
            return state.institutions.length === 1 &&  /\bDemo\b/.test(state.institutions[0].institution_name)
        },
        gravatarStr: (state) => {
            if (state.email) return state.email
            else return "placeholder@example.com"
        },
        isLoggedIn: (state) => !!state.id,
        isUserSubscribed(state){
            return state.password
        },
        userPrimaryInstitutionId: (state) => {
            if (!state.institutions.length) return
            return state.institutions[0].institution_id // temp hack way of doing it for now.
        },
    }
}