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
        deleteScenario(state, scenarioIdToDelete) {
            state.selected.scenarios = state.selected.scenarios.filter(myScenario => {
                return myScenario.id !== scenarioIdToDelete
            })
        }
    },
    actions: {
        async fetchPkg({commit, getters}, id) {
            const url = `package/${id}`
            const resp = await api.get(url)
            commit("setSelectedPkg", resp.data)
            return resp.data
        },
        async refreshPkg({dispatch, getters}) {
            return await dispatch("fetchPkg", getters.pkgId)
        },
    },
    getters: {
        selectedPkg(state){return state.selected},
        pkgName(state){
            if (state.selected) {
                return state.selected.name
            }
        },
        pkgId(state){
            if (state.selected) return state.selected.id
        },
        scenarioSavedFromId: (state) => (scenarioId) => {
            if (!state.selected) return
            return state.selected.find(s => s.id === scenarioId)
        }
    }
}