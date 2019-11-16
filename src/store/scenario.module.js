import axios from "axios";
import {api} from "../api.js"
const scenarioUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/"


export const scenario = {
    state: {
        selected: null,
    },
    mutations: {
        setSelectedScenario(state, scenario){state.selected = scenario},
        clearSelectedScenario(state){
            state.selected = null
        },
        addSubr(state, issnl){
            if (!state.selected.subrs.includes(issnl)) {
                state.selected.subrs.push(issnl)
            }
        },
        removeSubr(state, issnl) {
            state.selected.subrs = state.selected.subrs.filter(j => j !== issnl)
        },
    },
    actions: {
        async fetchScenario({commit, getters}, id) {
            const resp = await api.get("scenario/"+id)
            commit("setSelectedScenario", resp.data)
            return resp
        },

        async updateScenario({commit, state}){
            const url = "scenario/" + state.selected.id;
            const resp = await api.post(url, state.selected)
            commit("setSelectedScenario", resp.data)
            return resp.data
        }
    },
    getters: {
        selectedScenario(state){return state.selected},
    }
}