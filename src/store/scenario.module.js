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
        }
    },
    actions: {
        async fetchScenario({commit, getters}, id) {
            const resp = await api.get("scenario/"+id)
            commit("setSelectedScenario", resp.data)
            return resp
        },

        async updateScenario({commit, dispatch, state}){
            const url = "scenario/" + state.selected.id;
            await api.post(url, state.selected)
            await dispatch("fetchScenario", state.selected.id)
            return true
        }
    },
    getters: {
        selectedScenario(state){return state.selected},
    }
}