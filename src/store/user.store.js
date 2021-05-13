import {api} from "../api";
import {sleep} from "../shared/util";
import router from "../components/router"


export const user = {
    state: {
        id: "",
        name: "",
        email: "",
        isPasswordSet: "",
        institutions: [],
        consortia: [],
        tabShowing: 0,
    },
    mutations: {
        setToken(state, token) {
            localStorage.setItem("token", token)
        },
        setUserTabShowing(state, index) {
            state.tabShowing = index
        },
        logout(state) {
            state.id = ""
            state.name = ""
            state.email = ""
            state.isPasswordSet = ""
            state.institutions = []
            state.consortia = []
            state.tabShowing = 0
            localStorage.removeItem("token")
            this._vm.$intercom.shutdown()
        },
        setFromApiResp(state, apiResp) {
            state.id = apiResp.id
            state.name = apiResp.name
            state.email = apiResp.email
            state.isPasswordSet = apiResp.is_password_set
            state.institutions = apiResp.institutions
            state.consortia = apiResp.consortia

            // hack to fix API bug that exists in demo profiles
            if (!state.institutions.length && !state.consortia.length && apiResp.user_permissions.length) {
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

            const data = {
                user_id: getters.userId,
                name: getters.userName,
                email: getters.userEmail,
                primary_organization: getters.userPrimaryOrganizationName,
                is_in_consortium: getters.userIsInConsortium,
            }
            console.log("user.store fetchUser() sending this to Intercom:", data)
            this._vm.$intercom.boot(data)
        },
        async changeName({commit, state}, name) {
            const resp = await api.post("user/me", {name})
            state.name = name
            return resp
        },
        async changeEmail({commit, state}, email) {
            const resp = await api.post("user/me", {email})
            state.email = email
            return resp
        },
        async changePassword({commit, state}, password) {
            const resp = await api.post("user/me", {password})
            state.isPasswordSet = true
            return resp
        },

    },
    getters: {
        userName: (state) => state.name,
        userId: (state) => state.id,
        userEmail: (state) => state.email,
        userPasswordIsSet: (state) => state.isPasswordSet,
        userInstitutions: (state) => state.institutions,
        userConsortia: (state) => state.consortia,
        userTabShowing: (state) => state.tabShowing,
        userIsDemo: (state) => {
            return false
            return state.institutions.length === 1 && /\bDemo\b/.test(state.institutions[0].institution_name)
        },
        gravatarStr: (state) => {
            if (state.email) return state.email
            else return "placeholder@example.com"
        },
        isLoggedIn: (state) => !!state.id,
        userPrimaryInstitutionName: (state) => {
            if (!state.institutions.length) return
            return state.institutions[0].institution_name // first one is probably your "main" one.
        },
        userPrimaryOrganizationName: (state) => {
            // if you're a collab or admin of a consortium, that's your primary
            const firstConsortiumUserCanModify = state.consortia.find(c => {
                return c.permissions.includes("modify")
            })
            if (firstConsortiumUserCanModify) return firstConsortiumUserCanModify.institution_name

            // if you're not a consortium bigwig, your primary org is your first first real institution.
            const firstNonDemoInstitution = state.institutions.find(i => {
                return !/\bDemo\b/.test(i.institution_name) // "Demo" is NOT in the name
            })
            if (firstNonDemoInstitution) return firstNonDemoInstitution.institution_name

            if (state.institutions.length > 0) return state.institutions[0].institution_name
            return null

        },
        userIsInConsortium: (state) => {
            return state.consortia.length > 0
        },
    }
}