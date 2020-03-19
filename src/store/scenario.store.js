import _ from 'lodash'

import {api, apiPostUnbounced} from "../api.js"
import appConfigs from "../appConfigs"
import {buildScenarioFromApiResp} from "../shared/scenario";


export const scenario = {
    state: {
        scenarioMeta: null,
        scenarioJournals: null,
        scenarioSaved: null,

        selected: null,
        subrIndex: null,
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
            // this is the new way to do it
            state.scenarioSaved = scenarioApiResp.saved
            state.scenarioSaved.id = scenarioApiResp.meta.scenario_id
            state.subrIndex = state.scenarioSaved.subrs.length

            const journals = scenarioApiResp.journals
            journals.forEach((myJournal, myIndex)=>{
                myJournal.cpuIndex = myIndex
                myJournal.subscribed = state.scenarioSaved.subrs.includes(myJournal.issn_l)
            })
            state.scenarioJournals = journals
            state.scenarioMeta = scenarioApiResp.meta

            // this is for legacy uses
            state.selected = scenarioApiResp.saved
        },
        subscribeUpToIndex(state, index){

            console.log("subscribeUpToIndex in store.js", index)

            // save it here for the server
            state.scenarioSaved.subrs = state.scenarioJournals
                .map(j => j.issn_l)
                .slice(0, index)

            // save it here for the UI
            for (let i = 0; i < state.scenarioJournals.length; i++) {
                const myIssnl = state.scenarioJournals[i].issn_l

                if (state.scenarioSaved.subrs.includes(myIssnl)) {
                    state.scenarioJournals[i].subscribed = true
                } else {
                    state.scenarioJournals[i].subscribed = false
                }
            }
        },

        subscribeCustom(state, issnl){
            state.scenarioSaved.subrs.push(issnl)
            state.scenarioJournals
                .find(j=>j.issn_l === issnl)
                .subscribed = true
        },
        unsubscribeCustom(state, issnl){
            state.scenarioSaved.subrs = state.scenarioSaved.subrs.filter(myIssnl => {
                return myIssnl !== issnl
            })
            state.scenarioJournals
                .find(j=>j.issn_l === issnl)
                .subscribed = false
        },

        // note you can and often do add a negative number
        subrIndexAdd(state, amountToAdd) {
            console.log("subrIndexAdd", amountToAdd)
            let startingSubrIndex = state.scenarioSaved.subrs.length
            let subrIndex = startingSubrIndex + amountToAdd

            const maxIndex = state.scenarioJournals.length -1
            if (subrIndex < 0) subrIndex = 0
            if (subrIndex > maxIndex) subrIndex = maxIndex

            // save it here for the server
            state.scenarioSaved.subrs = state.scenarioJournals
                .map(j => j.issn_l)
                .slice(0, subrIndex)

            // save it here for the UI
            for (let i = 0; i < state.scenarioJournals.length; i++) {
                const myIssnl = state.scenarioJournals[i].issn_l
                if (state.scenarioSaved.subrs.includes(myIssnl)) {
                    state.scenarioJournals[i].subscribed = true
                } else {
                    state.scenarioJournals[i].subscribed = false
                }
            }

        },

        setScenarioName: (state, newName) => {
            state.scenarioSaved.name = newName
        },

        setZoomIssnl: (state, issnl) => {
            state.zoomIssnl = issnl
            state.zoomOpen = true
        },
        closeZoom: (state) => {
            state.zoomIssnl = null
            state.zoomOpen = false
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
            state.scenarioJournals = []
            state.selected.meta = null
            state.scenarioSaved = null
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
            const scenarioSavedCopy = _.cloneDeep(state.scenarioSaved)
            const configName = keyValuePair[0]
            const configValue = keyValuePair[1]
            scenarioSavedCopy.configs[configName] = configValue

            const url = "scenario/" + getters.scenarioId;
            await api.post(url, scenarioSavedCopy)
            await dispatch("refreshScenario")
            return true
        },

        async resetAllConfigs({dispatch, state, getters}) {
            const postData = {...state.scenarioSaved}
            Object.keys(state.scenarioSaved.configs).map(k=>{
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
            return state.selected.configs
        },
        costBigdealProjected(state) {
            let totalCost = 0
            let numYears = 5
            let costThisYear = state.selected.configs.cost_bigdeal
            let yearlyIncrease = state.selected.configs.cost_bigdeal_increase * 0.01
            for (let i = 1; i <= numYears; i++) {
                totalCost += costThisYear
                costThisYear = costThisYear * (1 + yearlyIncrease)
            }
            return totalCost / numYears

        },
        config: (state) => (k) => {
            return state.scenarioSaved.configs[k]
        },
        isSubscribed: (state) => (issnl) => {
            return state.scenarioSaved.subrs.indexOf(issnl) > -1
        },
        subrIssnls: (state) => state.scenarioSaved.subrs,
        customSubrs: (state) => state.scenarioSaved.customSubrs,
        subrsAreContiguous: (state) =>{

        },
        subrIndex: (state) => state.subrIndex,
        journals: (state) => state.scenarioJournals,

        scenarioJournals: (state) => state.scenarioJournals,
        scenarioJournalsIndexSubr: (state) => state.scenarioJournals.filter(j=>j.subscribed),
        scenarioJournalsCustomSubr: (state) => state.scenarioJournals.filter(j=>j.customSubscribed),
        scenarioJournalsAnySubr: (state) => state.scenarioJournals.filter(j=>j.subscribed || j.customSubscribed),

        scenarioMeta:  (state) => state.selected.meta,
        scenarioId(state){
            if (state.selected.meta) return state.selected.meta.scenario_id
        },
        scenarioName(state){
            if (state.scenarioSaved) return state.scenarioSaved.name
        },
        scenarioSaved:  (state) => {
            if (state.scenarioSaved) return state.scenarioSaved
        },


        subrJournalsCount: (state) => state.scenarioSaved.subrs.length,
        illJournalsCount: (state) => state.scenarioJournals.length - state.scenarioSaved.subrs.length,
        tableColsToShow: (state) => state.tableColsToShow,


    }
}