import axios from "axios";

import {api} from "../api"

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
            const url = `package/${id}`
            const resp = await api.get(url)
            commit("setSelectedPkg", resp.data)
            return resp.data
        },

    },
    getters: {
        selectedPkg(state){return state.selected},
    }
}