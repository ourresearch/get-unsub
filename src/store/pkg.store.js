import axios from "axios";
import Vue from "vue"

import {api} from "../api"
import {buildScenarioFromApiResp} from "../shared/scenario";

export const pkg = {
    state: {
        selected: null,
    },
    mutations: {
        setSelectedPkg(state, pkgApiResp) {
            const ret = {...pkgApiResp}

            ret.scenarios = []
            // pkgApiResp.scenarios.forEach(s => {
            //     ret.scenarios.push({id: 22, foo: {a: 1, b: 2}})
            // })


            // ret.scenarios.forEach(s => {
            //     setTimeout(function(){
            //         const update = {id: 22, foo: {a: 2, b: 4}}
            //         Object.keys(update).forEach(k => {
            //             s[k] = update[k]
            //         })
            //         // s.foo = "changed!"
            //         // s.bar = "added!"
            //         console.log("timout done")
            //     }, 2000)
            //
            // })

            pkgApiResp.scenarios.forEach(apiScenario => {
                // ret.scenarios.push({id: 22, foo: {a: 1, b: 2}})


                ret.scenarios.push({
                    id: apiScenario.id,
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
                    })
            })
            state.selected = ret
        },
        clearSelectedPkg(state) {
            state.selected = null
        },
    },
    actions: {
        async fetchPkg({commit, getters}, id) {
            const url = `package/${id}`
            const resp = await api.get(url)
            commit("setSelectedPkg", resp.data)
            return resp.data
        },
        async refreshPkg({dispatch, getters}) {
            return await dispatch("fetchPkg", getters.pkgId)
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
        getScenario(state){
            return state.selected.scenarios[0]
        }
    }
}