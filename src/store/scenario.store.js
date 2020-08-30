import _ from 'lodash'

import {api, apiPostUnbounced} from "../api.js"
import appConfigs from "../appConfigs"
import {buildScenarioFromApiResp, newScenario} from "../shared/scenario";


function hashCode(str) {
  return Math.abs(str.split('').reduce((prevHash, currVal) =>
    (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0));
}


function journalsAreSubscribedInCpuOrder(journals) {
        let lastSubscribedIndex = 0
        for (let i = 0; i < journals.length; i++) {
            if (journals[i].subscribed){
                if (i - lastSubscribedIndex > 1) return false
                lastSubscribedIndex = i
            }
        }
        return true
    }


export const scenario = {
    state: {
        selected: newScenario(),
        isLoading: false,

        zoomedJournal: {},

        menuSettings: {
             view: {
                 showCostBar: true,
                 showUsageBar: true,
                 displayJournalsAsOptions: [
                     {name: "table", icon: "mdi-table-large"},
                     {name: "histogram", icon: "mdi-poll-box"},
                 ],
                 displayJournalsAsSelected: "histogram",
             },
            histogram: {
                 showFullHistogram: false
            }
        },
        tableColsToShow: [
            "usage",
            "cost_subscription",
            "ncppu",
        ],
        snackbars: {
            customSubrSuccess: false,
            customUnsubrSuccess: false,
        },
        allowAutoSubscribe: true,

    },
    mutations: {
        setScenarioFromObject(state, scenarioObject) {
            console.log("setScenarioFromObject", scenarioObject)
            state.selected = scenarioObject

        },
        clearSelectedScenario(state) {
            state.selected = newScenario()
            state.allowAutoSubscribe = true
        },
        setAllowAutoSubscribe(state, val) {
            state.allowAutoSubscribe = !!val
        },
        setAllowAutoSubscribeFromCurrentJournalSubrs(state) {
            state.allowAutoSubscribe = journalsAreSubscribedInCpuOrder(state.selected.journals)
        },
        initSelectedScenario(state, id) {
            state.selected = newScenario(id)
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
            state.allowAutoSubscribe = false
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
            state.zoomedJournal = state.selected.journals.find(j => {
                return j.issn_l === issnl
            })
        },
        closeZoom: (state) => {
            state.zoomedJournal = {}
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

        async subscribeCustom({commit, dispatch, state}, issnl) {
            commit("subscribeCustom", issnl)
            const ret = await dispatch("updateScenarioSavedSubrs")
            return ret
        },
        async unsubscribeCustom({commit, dispatch, state}, issnl) {
            commit("unsubscribeCustom", issnl)
            const ret = await dispatch("updateScenarioSavedSubrs")
            return ret
        },




        // config stuff

        // async resetAllConfigs({dispatch, state, getters}) {
        //     const postData = {...state.selected.saved}
        //     Object.keys(state.selected.saved.configs).map(k=>{
        //         postData.configs[k] = appConfigs.scenarioConfigs[k].default
        //     })
        //     const url = "scenario/" + getters.scenarioId;
        //     await api.post(url, postData)
        //     await dispatch("refreshScenario")
        //     return true
        // },






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
        menuSettingsDisplayJournalsAsSelected(state){
            return state.menuSettings.view.displayJournalsAsSelected
        },


        summary: (state) => state.selected.summary,
        zoomIssnl: (state) => state.zoomedJournal && state.zoomedJournal.issn_l,
        configs(state) {
            return state.selected.saved.configs
        },
        costBigdealProjected(state) {
            return state.selected.costBigdealProjected
        },
        config: (state) => (k) => {
            return state.selected.saved.configs[k]
        },
        citationWeight: (state) => state.selected.saved.configs.weight_citation,
        authorshipWeight: (state) => state.selected.saved.configs.weight_authorship,
        isSubscribed: (state) => (issnl) => {
            return state.selected.saved.subrs.indexOf(issnl) > -1
        },
        subrIssnls: (state) => state.selected.saved.subrs,
        customSubrs: (state) => state.selected.saved.customSubrs,
        journals: (state) => state.selected.journals,

        scenarioJournals: (state) => state.selected.journals,
        scenarioJournalsAnySubr: (state) => state.selected.journals.filter(j=>j.subscribed || j.customSubscribed),

        scenarioId(state){
            if (state.selected) return state.selected.id
        },
        scenarioMemberInstitutions(state){
            if (state.selected) return state.selected.memberInstitutions
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
        scenarioIdHash: (state) => state.selected.idHash,
        scenarioZoomedJournal: (state) => state.zoomedJournal,
        scenarioSnackbars: (state) => state.snackbars,
        scenarioAllowAutosubscribe: (state) => state.allowAutoSubscribe,
        scenarioIsLockedPendingUpdate: (state) => state.selected.isLockedPendingUpdate,
        scenarioUpdatePercentComplete: (state) => state.selected.updatePercentComplete,

        bundleSize: (state) => state.selected.saved.bundle_size,

    }
}