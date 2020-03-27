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
        setSelectedPublisher(state, pkg) {
            console.log("setting selected pkg", pkg)
            state.selected = pkg
        },
        clearSelectedPublisher(state) {
            state.selected = null
        },
        deleteScenario(state, scenarioIdToDelete) {
            state.selected.scenarios = state.selected.scenarios.filter(s=>{
                return s.id !== scenarioIdToDelete
            })
        },
        renameScenario(state, {id, newName}) {
            state.selected.scenarios.find(s=>{
                return s.id === id
            }).saved.name = newName
        },
        copyScenario(state, {id, newName, newId}) {
            const scenarioToCopy = state.selected.scenarios.find(s=>{
                return s.id === id
            })
            const clone = _.cloneDeep(scenarioToCopy)
            clone.saved.name = newName
            clone.id = newId
            clone.meta.scenario_id = newId // should get rid of this in due time
            state.selected.scenarios.push(clone)
        },
        createScenario(state, {newName, newId}) {
            const myNewScenario = newScenario(newId)
            myNewScenario.saved.name = newName
            state.selected.scenarios.push(myNewScenario)
        },
    },
    actions: {
        async fetchPublisher({commit, dispatch, getters}, id) {
            if (getters.publisherName) return

            const url = `publisher/${id}`
            const resp = await api.get(url)
            resp.data.scenarios = resp.data.scenarios.map(apiScenario => {
                const scenario = newScenario(apiScenario.id)
                scenario.isLoading = true
                return scenario
            });
            commit("setSelectedPublisher", resp.data)
            dispatch("hydratePublisherScenarios")
            console.log("returning now...")
            return resp
        },

        async hydratePublisherScenarios({dispatch, getters}) {
            getters.getScenarios.forEach(s => {
                dispatch("hydratePublisherScenario", s.id)
            })
        },

        async hydratePublisherScenario({dispatch, getters}, scenarioId) {
            const path = `scenario/${scenarioId}/journals`
            const myScenario = getters.getScenario(scenarioId)

            const resp = await api.get(path)
            const hydratedScenario = buildScenarioFromApiResp(resp.data)
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
            console.log("POSTing this copy scenario", data)
            const url = `package/${getters.publisherId}/scenario?copy=${id}`
            await api.post(url, data)
        },
        async renameScenario({commit, getters}, {id, newName}) {
            commit("renameScenario", {id, newName})
            const url = `scenario/${id}`
            await api.post(url, getters.getScenario(id).saved)
        },
        async deleteScenario({commit, getters}, id) {
            if (getters.publisherScenariosCount < 2) return // temp
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
        publisherName(state) {
            if (state.selected) {
                return state.selected.name
            }
        },
        publisherId(state) {
            if (state.selected) return state.selected.id
        },
        publisherScenariosCount(state) {
            if (state.selected) return state.selected.scenarios.length
            return 0
        },
        getScenario: (state) => (id) =>{
            console.log("looking to get a scenario", id, state.selected.scenarios)
            return state.selected.scenarios.find(s => s.id === id)
        },
        getScenarios: (state) => state.selected.scenarios,
        isPublisherDemo: (state) =>  /^demo-package-/.test(state.selected.id),
    }
}