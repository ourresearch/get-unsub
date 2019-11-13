import axios from "axios";
const authUrl = "https://unpaywall-jump-api.herokuapp.com/login"
const accountUrl = "https://unpaywall-jump-api.herokuapp.com/account "


export const auth = {
    state: {
        error: null,
        userCreds: null,
        account: null,
        token: null,
    },
    mutations: {
        authError(state, error){state.error = error},
        account(state, account){state.account = account},
        userCreds(state, userCreds){state.userCreds = userCreds},
        setToken(state, token){
            state.token = token
            localStorage.setItem("token", token)
        },
        logout(state){
            state.error = null
            state.userCreds = null
            state.account = null
            state.token = null
            localStorage.removeItem("token")
        }
    },
    actions: {
        async fetchToken({commit, state, getters}) {
            commit("authError", null)
            commit("startLoading")

            if (getters.token){
                console.log("using saved token", getters.token)
                return Promise.resolve()
            }

            console.log("getting token from server")
            return axios.post(authUrl, state.userCreds)
                .then(resp => {
                    console.log("got fetchToken response", resp.data.access_token)
                    commit("setToken", resp.data.access_token)

                })
                // .catch(err => {
                //     console.log("got fetchToken error", err)
                //     commit("authError", "fetchToken error")
                //
                // })
                .finally(() => {
                    commit('finishLoading')
                })
        },

        async _fetchUser({commit, getters}) {
            commit("startLoading")

            console.log("looking for token in getters", getters.token)
            console.log("looking for token in localStorage", localStorage.getItem('token'))

            const headers = {
                Authorization: `Bearer ${getters.token}`
            }
            console.log("sending fetchUser request", headers)
            return axios.get(accountUrl, {headers: headers})
                .then(resp => {
                    console.log("got fetchUser response", resp)
                    commit("account", resp.data)

                })
                // .catch(err => {
                //     console.log("got fetchToken error", err)
                //     commit("authError", "fetchUser error")
                //
                // })
                .finally(() => {
                    commit('finishLoading')
                })

        },


        async login({commit, dispatch, getters}, userCreds){
            commit("logout")
            commit("userCreds", userCreds)
            await dispatch("fetchToken")
            await dispatch("_fetchUser")
            return true
        }

    },
    getters: {
        token(state){
            return state.token
        },
        account(state){return state.account},
        isLoggedIn(state){return state.account},
    }
}