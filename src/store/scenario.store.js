import _ from 'lodash'

import {api, apiPostUnbounced} from "../api.js"
import appConfigs from "../appConfigs"
import {buildScenarioFromApiResp} from "../shared/scenario";


export const scenario = {
    state: {
        selected: null,
        isLoading: false,

        zoomIssnl: null,
        zoomOpen: false,

        menuSettings: {
             view: {
                 showCostBar: true,
                 showUsageBar: true,
                 displayJournalsAsOptions: ["histogram", "table"],
                 displayJournalsAsSelected: "histogram",
             },
            histogram: {
                 showFullHistogram: false
            }
        },
        tableColsToShow: [
            "usage",
            "subscription_cost",
            "ncppu",
        ],

    },
    mutations: {
        _setScenario(state, scenarioApiResp) {
            state.selected = buildScenarioFromApiResp(scenarioApiResp)

        },
        subscribeUpToIndex(state, index){

            console.log("subscribeUpToIndex in store.js", index)

            // save it here for the server
            state.selected.saved.subrs = state.selected.journals
                .map(j => j.issn_l)
                .slice(0, index)

            // save it here for the UI
            for (let i = 0; i < state.selected.journals.length; i++) {
                const myIssnl = state.selected.journals[i].issn_l

                if (state.selected.saved.subrs.includes(myIssnl)) {
                    state.selected.journals[i].subscribed = true
                } else {
                    state.selected.journals[i].subscribed = false
                }
            }
        },

        subscribeCustom(state, issnl){
            state.selected.saved.subrs.push(issnl)
            state.selected.journals
                .find(j=>j.issn_l === issnl)
                .subscribed = true
        },
        unsubscribeCustom(state, issnl){
            state.selected.saved.subrs = state.selected.saved.subrs.filter(myIssnl => {
                return myIssnl !== issnl
            })
            state.selected.journals
                .find(j=>j.issn_l === issnl)
                .subscribed = false
        },

        // note you can and often do add a negative number
        subrIndexAdd(state, amountToAdd) {
            console.log("subrIndexAdd", amountToAdd)
            let startingSubrIndex = state.selected.saved.subrs.length
            let subrIndex = startingSubrIndex + amountToAdd

            const maxIndex = state.selected.journals.length -1
            if (subrIndex < 0) subrIndex = 0
            if (subrIndex > maxIndex) subrIndex = maxIndex

            // save it here for the server
            state.selected.saved.subrs = state.selected.journals
                .map(j => j.issn_l)
                .slice(0, subrIndex)

            // save it here for the UI
            for (let i = 0; i < state.selected.journals.length; i++) {
                const myIssnl = state.selected.journals[i].issn_l
                if (state.selected.saved.subrs.includes(myIssnl)) {
                    state.selected.journals[i].subscribed = true
                } else {
                    state.selected.journals[i].subscribed = false
                }
            }

        },


        setZoomIssnl: (state, issnl) => {
            state.zoomIssnl = issnl
            state.zoomOpen = true
        },
        closeZoom: (state) => {
            state.zoomIssnl = null
            state.zoomOpen = false
        },


        setIsLoading: (state, isLoading) => {
            state.isLoading = isLoading
        },








        // menu stuff
        menuViewToggleShowCostBar(state){
            state.menuSettings.view.showCostBar = !state.menuSettings.view.showCostBar
        },
        menuViewToggleShowUsageBar(state){
            state.menuSettings.view.showUsageBar = !state.menuSettings.view.showUsageBar
        },
        menuViewSetDisplayJournalsAs(state, displayAs){
            state.menuSettings.view.displayJournalsAsSelected = displayAs
        },

        clearSelectedScenario(state) {
            state.selected = null
        },
        hideTableCol(state, colName) {
            state.tableColsToShow = state.tableColsToShow.filter(c => c !== colName)
        },
        toggleTableCol(state, colName) {
            if (state.tableColsToShow.includes(colName)) {
                // hide it if it's showing
                state.tableColsToShow = state.tableColsToShow.filter(c => c !== colName)
            } else {
                state.tableColsToShow.push(colName)
            }
        },
    },
    actions: {

        // scenario stuff

        async fetchScenario({commit, dispatch, getters}, id) {
            const path = `scenario/${id}/journals`
            const resp = await api.get(path)
            commit("_setScenario", resp.data)
            return true
        },

        async refreshScenario({commit, dispatch, getters}) {
            return await dispatch("fetchScenario", getters.scenarioId)
        },


        // subscription stuff
        async updateScenarioSavedSubrs({getters}) {
            const url = `scenario/${getters.scenarioId}/subscriptions`
            const ret = await apiPostUnbounced( url, getters.scenarioSaved )
            console.log("finished updating scenario subscriptions")
            return ret
        },

        async clearAllSubrs({commit, dispatch}) {
            commit("subscribeUpToIndex", 0)
            commit("clearCustomSubrs")
            return await dispatch("updateScenarioSavedSubrs")
        },

        async subrIndexAdd({commit, dispatch}, amountToAdd) {
            commit("subrIndexAdd", amountToAdd)
            return await dispatch("updateScenarioSavedSubrs")
        },
        async subscribeUpToIndex({commit, dispatch}, index) {
            commit("subscribeUpToIndex", index)
            return await dispatch("updateScenarioSavedSubrs")
        },

        async subscribeCustom({commit, dispatch}, issnl) {
            commit("subscribeCustom", issnl)
            return await dispatch("updateScenarioSavedSubrs")
        },
        async unsubscribeCustom({commit, dispatch}, issnl) {
            commit("unsubscribeCustom", issnl)
            return await dispatch("updateScenarioSavedSubrs")
        },




        // config stuff

        async setConfig({dispatch, state, getters}, keyValuePair) {
            const scenarioSavedCopy = _.cloneDeep(state.selected.saved)
            const configName = keyValuePair[0]
            const configValue = keyValuePair[1]
            scenarioSavedCopy.configs[configName] = configValue

            const url = "scenario/" + getters.scenarioId;
            await api.post(url, scenarioSavedCopy)
            await dispatch("refreshScenario")
            return true
        },

        async resetAllConfigs({dispatch, state, getters}) {
            const postData = {...state.selected.saved}
            Object.keys(state.selected.saved.configs).map(k=>{
                postData.configs[k] = appConfigs.scenarioConfigs[k].default
            })
            const url = "scenario/" + getters.scenarioId;
            await api.post(url, postData)
            await dispatch("refreshScenario")
            return true
        },






    },
    getters: {
        selectedScenario(state) {
            return state.selected
        },

        menuSettings: (state) => state.menuSettings,
        menuSettingsView: (state) => state.menuSettings.view,
        menuSettingsShowAsTable(state){
            return state.menuSettings.view.displayJournalsAsSelected === "table"
        },


        summary: (state) => state.selected.summary,
        zoomIssnl: (state) => state.zoomIssnl,
        configs(state) {
            return state.selected.saved.configs
        },
        costBigdealProjected(state) {
            return state.selected.costBigdealProjected
        },
        config: (state) => (k) => {
            return state.selected.saved.configs[k]
        },
        isSubscribed: (state) => (issnl) => {
            return state.selected.saved.subrs.indexOf(issnl) > -1
        },
        subrIssnls: (state) => state.selected.saved.subrs,
        customSubrs: (state) => state.selected.saved.customSubrs,
        journals: (state) => state.selected.journals,

        scenarioJournals: (state) => state.selected.journals,
        scenarioJournalsAnySubr: (state) => state.selected.journals.filter(j=>j.subscribed || j.customSubscribed),

        scenarioMeta:  (state) => state.selected.meta,
        scenarioId(state){
            if (state.selected.meta) return state.selected.meta.scenario_id
        },
        scenarioName(state){
            if (state.selected && state.selected.saved) return state.selected.saved.name
        },
        scenarioSaved:  (state) => {
            if (state.selected && state.selected.saved) return state.selected.saved
        },
        selectedScenarioIsLoading: (state) => {
            if (!state.selected) return true
            if (state.isLoading) return true
            if (!state.selected.saved.name) return true
            if (!state.selected.journals.length) return true
            return false
        },


        subrJournalsCount: (state) => state.selected.saved.subrs.length,
        illJournalsCount: (state) => state.selected.journals.length - state.selected.saved.subrs.length,
        tableColsToShow: (state) => state.tableColsToShow,


    }
}