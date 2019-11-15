import axios from "axios";
const pkgUrl = "https://unpaywall-jump-api.herokuapp.com/package/"


export const pkg = {
    state: {
        selected: null,
    },
    mutations: {
        setSelectedPkg(state, myPkg){state.selected = myPkg},
        clearSelectedPkg(state){
            state.selected = null
        },
    },
    actions: {
        async fetchPkg({commit, getters}, id) {
            commit("startLoading")
            const token =  localStorage.getItem("token")
            const headers = {
                Authorization: `Bearer ${token}`
            }
            console.log("sending fetchPkg request", headers)
            const url = pkgUrl + id
            return axios.get(url, {headers: headers})
                .then(resp => {
                    console.log("got fetchPkg response", resp)
                    commit("setSelectedPkg", resp.data)

                })
                .finally(() => {
                    commit('finishLoading')
                })
        },

    },
    getters: {
        selectedPkg(state){return state.selected},
    }
}