import axios from "axios";
import _ from 'lodash'
import {api} from "../api.js"

const scenarioUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/"


export const scenario = {
    state: {
        selected: null,
        digest: "",
        configsDigest: "",
    },
    mutations: {
        _setSelectedScenario(state, scenario) {
            state.selected = scenario
            state.digest = Object.values(state.selected.summary).join()
        },


        clearSelectedScenario(state) {
            state.selected = null
            state.digest = ""
        },
        addSubr(state, issnl) {
            if (!state.selected.subrs.includes(issnl)) {
                state.selected.subrs.push(issnl)
            }
        },
        setSubrs(state, subrIssnls) {
            state.selected.subrs = subrIssnls
        },
        removeSubr(state, issnl) {
            state.selected.subrs = state.selected.subrs.filter(j => j !== issnl)
        },


    },
    actions: {
        async fetchScenario({commit, getters}, id) {
            const resp = await api.get("scenario/" + id)
            commit("_setSelectedScenario", resp.data)

            return resp
        },

        async updateScenario({commit, state}) {
            const url = "scenario/" + state.selected.id;
            const resp = await api.post(url, state.selected)
            commit("_setSelectedScenario", resp.data)
            return resp.data
        },


        // this is an Action because we don't want to update the local model
        // optimistically, we want to do *nothing* until it's changed on the
        // server.
        async setConfig({commit, state}, config) {
            const clone = _.cloneDeep(state.selected)
            clone.configs[config.k] = config.v
            const url = "scenario/" + state.selected.id;

            const resp = await api.post(url, clone)
            commit("_setSelectedScenario", resp.data)
            state.configsDigest = Object.values(state.selected.configs).join()
            return resp.data
        },
    },
    getters: {
        selectedScenario(state) {
            return state.selected
        },
        scenarioDigest: (state) => state.digest,
        configsDigest: (state) => state.configsDigest,
        configs(state) {
            return state.selected.configs
        },
        config: (state) => (k) => {
            return state.selected.configs[k]
        },
    }
}