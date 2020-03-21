import axios from "axios";
import Vue from "vue"
import router from "../router"

import {api} from "../api"
import {buildScenarioFromApiResp} from "../shared/scenario";
import _ from "lodash";

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');

export const pkg = {
    state: {
        selected: null,
    },
    mutations: {
        setSelectedPkg(state, pkgApiResp) {
            const ret = {...pkgApiResp}
            ret.scenarios = []
            pkgApiResp.scenarios.forEach(apiScenario => {
                ret.scenarios.push({
                    id: apiScenario.id,
                    isLoading: true,
                    meta: {},
                    journals: [],
                    saved: {
                        subrs: [],
                        name: "",
                        configs: {}
                    },
                })
            });

            ret.scenarios.forEach(s => {
                let path = `scenario/${s.id}`
                // let path = `scenario/demo-scenario-ap9sJbqN`
                path += "/journals" // required hack! endopint is misnamed for legacy reasons.
                api.get(path)
                    .then(function(resp){
                        // const hydratedScenario = {id: 22, foo: {a: 2, b: 4}, bar: {a:33, b:55}}
                        const hydratedScenario = buildScenarioFromApiResp(resp.data)
                        console.log("made hydrated scenario from resp:", hydratedScenario)
                        Object.keys(hydratedScenario).forEach(k => {
                            s[k] = hydratedScenario[k]
                        })
                        s.isLoading = false
                    })
            })
            state.selected = ret
        },
        clearSelectedPkg(state) {
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
    },
    actions: {
        async fetchPkg({commit, getters}, id) {
            if (getters.pkgName) return
            const url = `package/${id}`
            const resp = await api.get(url)
            commit("setSelectedPkg", resp.data)
            return resp.data
        },
        async refreshPkg({dispatch, getters}) {
            return await dispatch("fetchPkg", getters.pkgId)
        },
        async copyScenario({commit, getters}, {id, newName}) {
            let newId = getters.newScenarioIdPrefix + short.generate().slice(0, 8)
            commit("copyScenario", {id, newName, newId})
            const data = {
                name: newName,
                id: newId
            }
            console.log("POSTing this copy scenario", data)
            const url = `package/${getters.pkgId}/scenario?copy=${id}`
            await api.post(url, data)
        },
        async renameScenario({commit, getters}, {id, newName}) {
            commit("renameScenario", {id, newName})
            const url = `scenario/${id}`
            await api.post(url, getters.getScenario(id).saved)
        },
        async deleteScenario({commit, getters}, id) {
            if (getters.pkgScenariosCount < 2) return // temp
            commit("deleteScenario", id)
            router.push(`/a/${getters.pkgId}`)
            await api.delete(`scenario/${id}`)
        },
    },
    getters: {
        selectedPkg(state) {
            return state.selected
        },
        pkgName(state) {
            if (state.selected) {
                return state.selected.name
            }
        },
        pkgId(state) {
            if (state.selected) return state.selected.id
        },
        pkgScenariosCount(state) {
            if (state.selected) return state.selected.scenarios.length
            return 0
        },
        getScenario: (state) => (id) =>{
            return state.selected.scenarios.find(s => s.id === id)
        },
        newScenarioIdPrefix(state) {
            return (/^demo-package-/.test(state.selected.name)) ?
                "" :
                "demo-scenario-"
        }
    }
}