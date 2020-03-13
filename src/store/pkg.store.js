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
        pkgName(state){
            if (state.selected) {
                console.log("state.selected.name", state.selected.name)
                return state.selected.name.replace("my Elsevier Freedom Package", "Elsevier")
            }
        },
        pkgId(state){
            if (state.selected) return state.selected.id
        },
    }
}