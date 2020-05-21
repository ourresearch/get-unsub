import axios from "axios";
import Vue from "vue"

import {api} from "../api"
import {buildScenarioFromApiResp, newScenario, newScenarioId} from "../shared/scenario";
import _ from "lodash";

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');




export const publisher = {
    state: {
        selected: null,

        isLoading: false,
        apcIsLoading: false,

        id: null,
        name: "",
        isDemo: false,
        scenarios: [],
        journalDetail: {},
        journalCounts: {
            analyzed: 0,
            missingPrices: 0,
            oa: 0,
            leftOrStopped: 0
        },
        dataFiles: [],
        bigDealCost: 0,

        // apc stuff
        apcHeaders: [],
        apcJournals: [],
        apcPapersCount: null,
        apcAuthorsFractionalCount: null,
        apcCost: null,


    },
    mutations: {
        clearPublisher(state){
            state.isLoading = false
            state.id = null
            state.name = ""
            state.isDemo = false
            state.scenarios = []
            state.journalDetail = {}
            state.journalCounts = {
                analyzed: 0,
                missingPrices: 0,
                oa: 0,
                leftOrStopped: 0
            }
            state.dataFiles = []
            state.bigDealCost = 0

            state.apcHeader = []
            state.apcJournals = []
            state.apcPapersCount = null
            state.apcAuthorsFractionalCount = null
            state.apcCost = null
        },
        setSelectedPublisher(state, apiPublisher) {
            state.selected = apiPublisher // legacy

            state.id = apiPublisher.id
            state.name = apiPublisher.name
            state.isDemo = apiPublisher.is_demo
            state.scenarios = apiPublisher.scenarios
            state.journalDetail = apiPublisher.journal_detail
            state.journalCounts = {
                analyzed: apiPublisher.journal_detail.counts.in_scenario,
                missingPrices: apiPublisher.journal_detail.diff_counts.diff_no_price,
                oa: apiPublisher.journal_detail.diff_counts.diff_open_access_journals,
                leftOrStopped: apiPublisher.journal_detail.diff_counts.diff_not_published_in_2019 + apiPublisher.journal_detail.diff_counts.diff_changed_publisher
            }
            state.dataFiles = apiPublisher.data_files
            state.bigDealCost = apiPublisher.cost_bigdeal
        },
        clearSelectedPublisher(state) {
            state.selected = null
        },
        startLoading(state) {
            state.isLoading = true
        },
        finishLoading(state) {
            state.isLoading = false
        },
        deleteScenario(state, scenarioIdToDelete) {
            state.scenarios = state.scenarios.filter(s=>{
                return s.id !== scenarioIdToDelete
            })
        },
        renameScenario(state, {id, newName}) {
            state.scenarios.find(s=>{
                return s.id === id
            }).saved.name = newName
        },
        setScenarioConfig(state, {scenarioId, key, value}) {
            const ret =  state.scenarios.find(s=>{
                return s.id === scenarioId
            })
            ret.saved.configs[key] = value
            return ret

        },
        copyScenario(state, {id, newName, newId}) {
            const scenarioToCopy = state.scenarios.find(s=>{
                return s.id === id
            })
            const clone = _.cloneDeep(scenarioToCopy)
            clone.saved.name = newName
            clone.id = newId
            state.scenarios.push(clone)
        },
        createScenario(state, {newName, newId}) {
            const myNewScenario = newScenario(newId)
            myNewScenario.saved.name = newName
            myNewScenario.isLoading = true
            state.scenarios.push(myNewScenario)
        },
    },
    actions: {
        async fetchPublisher({commit, dispatch, getters}, id) {
            if (id == getters.publisherId) return
            commit("startLoading")
            dispatch("fetchPublisherApcData", id),
            await dispatch("fetchPublisherMainData", id),
            commit("finishLoading")
            return
        },

        async fetchPublisherAsync({commit, dispatch, getters}, id) {
            if (id == getters.publisherId) return
            commit("startLoading")
            await Promise.all([
                dispatch("fetchPublisherApcData", id),
                dispatch("fetchPublisherMainData", id),
            ])
            commit("finishLoading")
            return
        },


        async fetchPublisherMainData({commit, dispatch, getters}, id) {
            const url = `publisher/${id}`
            const resp = await api.get(url)
            resp.data.scenarios = resp.data.scenarios.map(apiScenario => {
                const scenario = newScenario(apiScenario.id, apiScenario.name)
                scenario.isLoading = true
                return scenario
            });
            commit("setSelectedPublisher", resp.data)
            await dispatch("hydratePublisherScenarios")
            return resp
        },

        async fetchPublisherApcData({commit, state, dispatch, getters}, id) {
            state.apcIsLoading = true

            const url = `publisher/${id}/apc`

            let resp
            try {
                resp = await api.get(url)
            }
            catch (e) {
                console.log("error loading publisher APC", e.response)
                resp = null
            }
            finally {
                state.apcIsLoading = false
            }

            if (resp){
                state.apcPapersCount = resp.data.headers.find(h=>h.value==="num_apc_papers").raw
                state.apcAuthorsFractionalCount = resp.data.headers.find(h=>h.value==="fractional_authorship").raw
                state.apcCost = resp.data.headers.find(h=>h.value==="cost_apc").raw
                state.apcHeaders = resp.data.headers
                state.apcJournals = resp.data.journals
                return resp
            }
            return

        },

        async hydratePublisherScenarios({dispatch, getters}) {
            getters.getScenarios.forEach(s => {
                dispatch("hydratePublisherScenario", s.id)
            })
        },

        async hydratePublisherScenario({dispatch, getters}, scenarioId) {
            const path = `scenario/${scenarioId}/journals`
            const resp = await api.get(path)
            const hydratedScenario = buildScenarioFromApiResp(resp.data)

            const myScenario = getters.publisherScenario(scenarioId)
            console.log("gonna hydrate this scenario", scenarioId, myScenario)
            Object.keys(hydratedScenario).forEach(k => {
                if (k !== 'configs') {
                    myScenario[k] = hydratedScenario[k]
                }
            })
            myScenario.isLoading = false
        },


        async copyScenario({commit, getters}, {id, newName}) {
            let newId = newScenarioId(getters.isPublisherDemo)
            commit("copyScenario", {id, newName, newId})
            const data = {
                name: newName,
                id: newId,
            }
            const url = `package/${getters.publisherId}/scenario?copy=${id}`
            await api.post(url, data)
        },
        async renameScenario({commit, getters}, {id, newName}) {
            commit("renameScenario", {id, newName})
            const url = `scenario/${id}`
            await api.post(url, getters.publisherScenario(id).saved)
        },
        async setScenarioConfig({commit, getters, dispatch}, {scenarioId, key, value}) {
            // modify the scenario metadata in place...this doesn't actually recalculate anything.
            commit("setScenarioConfig", {scenarioId, key, value})

            // send the scenario obj, with its new config value, up to the server.
            // the server will save our new param value.
            const url = `scenario/${scenarioId}`
            await api.post(url, getters.publisherScenario(scenarioId).saved)

            // ask the server for the journals data for this scenario,
            // which will now be calculated using the new param we set a second ago.
            // overwrite the scenario data.
            await dispatch("hydratePublisherScenario", scenarioId)

        },
        async deleteScenario({commit, getters}, id) {
            commit("deleteScenario", id)
            await api.delete(`scenario/${id}`)
        },
        async createScenario({commit, dispatch, getters}) {
            const newId = newScenarioId(getters.isPublisherDemo)
            const newName = "New Scenario"
            commit("createScenario", {newName, newId})
            const data = {
                id: newId,
                name: newName,
            }
            const url = `package/${getters.publisherId}/scenario`
            await api.post(url, data)
            dispatch("hydratePublisherScenario", newId)

        },
    },
    getters: {
        selectedPublisher(state) {
            return state.selected
        },
        publisherName: (state) => {
            if (/Elsevier/.test(state.name)) return "Elsevier"
            if (!state.name) return "Elsevier"
            return state.name
        },
        publisherId: (state)  => state.id,
        publisherJournalCounts: (state)  => state.journalCounts,
        publisherScenariosCount: (state) => state.scenarios.length,
        publisherScenario: (state) => (id) =>{
            return state.scenarios.find(s => s.id === id)
        },
        publisherScenariosAreAllLoaded: (state) =>{
            return state.scenarios.filter(s => s.isLoading).length === 0
        },
        getScenarios: (state) => state.scenarios,
        publisherScenarios: (state) => state.scenarios,
        isPublisherDemo: (state) =>  state.isDemo,
        publisherBigDealCost: (state) =>  state.bigDealCost,
        publisherIsLoading: (state) =>  state.isLoading,
        publisherUploadsDict: (state) =>{
            const ret = {}
            state.dataFiles.forEach(f => {
                ret[f.name] = {
                    isUploaded: f.uploaded
                }
            })
            return ret
        },



        // apc stuff
        publisherApcIsLoading: (state) => state.apcIsLoading,
        publisherApcPapersCount: (state) => state.apcPapersCount,
        publisherApcAuthorsFractionalCount: (state) => state.apcAuthorsFractionalCount,
        publisherApcCost: (state) =>  state.apcCost,
        publisherApcJournals: (state) =>  state.apcJournals,
        publisherApcHeaders: (state) =>  state.apcHeaders,
    }
}