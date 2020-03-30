import axios from "axios";
import Vue from "vue"
import router from "../router"

import {api} from "../api"
import {buildScenarioFromApiResp, newScenario, newScenarioId} from "../shared/scenario";
import _ from "lodash";

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');

export const publisher = {
    state: {
        selected: null,

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
    },
    mutations: {
        clearPublisher(state){
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
        },
        setSelectedPublisher(state, apiPublisher) {
            state.selected = apiPublisher // legacy

            state.id = apiPublisher.id
            state.name = apiPublisher.name
            state.isDemo = apiPublisher.is_demo
            state.scenarios = apiPublisher.scenarios
            state.journalDetail = apiPublisher.journal_detail
            state.journalCounts = {
                analyzed: 0,
                missingPrices: 0,
                oa: 0,
                leftOrStopped: 0
            }
            state.dataFiles = apiPublisher.data_files
        },
        clearSelectedPublisher(state) {
            state.selected = null
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
            state.scenarios.push(myNewScenario)
        },
    },
    actions: {
        async fetchPublisher({commit, dispatch, getters}, id) {
            if (getters.publisherName) return

            const url = `publisher/${id}`
            const resp = await api.get(url)
            resp.data.scenarios = resp.data.scenarios.map(apiScenario => {
                const scenario = newScenario(apiScenario.id, apiScenario.name)
                scenario.isLoading = true
                return scenario
            });
            commit("setSelectedPublisher", resp.data)
            dispatch("hydratePublisherScenarios")
            return resp
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
            Object.keys(hydratedScenario).forEach(k => {
                myScenario[k] = hydratedScenario[k]
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
        async deleteScenario({commit, getters}, id) {
            commit("deleteScenario", id)
            router.push(`/a/${getters.publisherId}`)
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
            console.log("POSTing this to create scenario", data)
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
            return state.name
        },
        publisherId: (state)  => state.id,
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
    }
}