import _ from 'lodash'
import {api} from "../api.js"


export const scenario = {
    state: {
        selected: null,
        digest: "",
        configsDigest: "",
        zoomIssnl: null,
        zoomOpen: false,
        tableColsToShow: [
            "usage",
            "free_instant_usage_percent",
            "subscription_cost",
            "ncppu",
        ],

    },
    mutations: {
        _setSelectedScenario(state, scenario) {
            state.selected = scenario
            state.digest = Object.values(state.selected.summary).join()
        },

        setZoomIssnl: (state, issnl) => {
            state.zoomIssnl = issnl
            state.zoomOpen = true
        },
        closeZoom: (state) => {
            state.zoomIssnl = null
            state.zoomOpen = false
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
        showTableCol(state, colName) {
            if (!state.tableColsToShow.includes(colName)) {
                state.tableColsToShow.push(colName)
            }
        },
        hideTableCol(state, colName){
            state.tableColsToShow = state.tableColsToShow.filter(c=>c !== colName)
        },
        toggleTableCol(state, colName){
            if (state.tableColsToShow.includes(colName)) {
                // hide it if it's showing
                state.tableColsToShow = state.tableColsToShow.filter(c=>c !== colName)
            }
            else {
                state.tableColsToShow.push(colName)
            }
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

        async addSubr({commit, dispatch}, issnl){
            commit("addSubr", issnl)
            return await dispatch("updateScenario")
        },

        async removeSubr({commit, dispatch}, issnl){
            commit("removeSubr", issnl)
            return await dispatch("updateScenario")
        },


    },
    getters: {
        selectedScenario(state) {
            return state.selected
        },
        scenarioDigest: (state) => state.digest,
        summary: (state) => state.selected.summary,
        configsDigest: (state) => state.configsDigest,
        zoomIssnl: (state) => state.zoomIssnl,
        configs(state) {
            return state.selected.configs
        },
        config: (state) => (k) => {
            return state.selected.configs[k]
        },
        tableColsToShow: (state) => state.tableColsToShow,
    }
}