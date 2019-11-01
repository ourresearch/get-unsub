import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

// https://www.npmjs.com/package/short-uuid
const short = require('short-uuid');


const demoConfigs = {
    cost_alacart_increase: 8,
    cost_bigdeal: 2200000,
    cost_bigdeal_increase: 5,
    cost_content_fee_percent: 5.7,
    cost_ill: 5,
    ill_request_percent_of_delayed: 10,
    include_bronze: true,
    include_submitted_version: true,
    include_backfile: true,
    include_social_networks: true,
    package: "demo",
    weight_authorship: 100,
    weight_citation: 10,
}

const journalViews = [
    {value: "overview", displayName: "Overview", icon: "mdi-person"},
    {value: "fulfillment", displayName: "Fulfillment", icon: "mdi-person"},
    {value: "oa", displayName: "Open Access", icon: "mdi-person"},
    {value: "impact", displayName: "Impact", icon: "mdi-person"},
    {value: "costs", displayName: "Read cost", icon: "mdi-person"},
    {value: "apc", displayName: "APC cost", icon: "mdi-person"},
]


const demoScenarios = [{
    id: "1",
    name: "My First Scenario",
    pkgId: "demo-pkg-123",
    summary: {
        cost_percent: 0,
        use_instant_percent: 0,
        num_journals_subscribed: 0,
    },
    subrs: [],
    customSubrs: [],
    configs: {...demoConfigs}
},
    {
        id: "2",
        name: "My Second Scenario",
        pkgId: "demo-pkg-123",
        summary: {
            cost_percent: 0,
            use_instant_percent: 0,
            num_journals_subscribed: 0,
        },
        subrs: [],
        customSubrs: [],
        configs: {...demoConfigs}
    },
]

const demoPkgs = [
    {
        id: "demo-pkg-123",
        name: "my Elsevier Freedom Package",
        hasCounterData: true,
        numJournals: 1800,
        numPerpAccessJournals: 1800,
    }
]

const demoUser = {
    id: "demo-user",
    name: "Demo 1",
    selectedPkgId: null,
    selectedScenarioId: null,
}


// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

const summaryUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/summary?package=demo"
const tabDataBaseUrl = "https://unpaywall-jump-api.herokuapp.com/scenario/{key}?package=demo"

export default new Vuex.Store({
    state: {
        user: null,

        summaryLoading: false,
        tabDataLoading: false,

        authState: "ready",
        notSupportedMsgOpen: false,

        scenarios: [],
        selectedScenario: null,
        scenarioTab: "slider",

        pkgs: [],
        selectedPkg: null,

        tabData: null,
        tabDataEndpointName: "slider",


    },
    mutations: {
        // stuff stuff
        summaryLoading(state) {
            state.summaryLoading = true
        },
        summaryDoneLoading(state) {
            state.summaryLoading = false
        },
        tabDataLoading(state) {
            state.tabDataLoading = true
        },
        tabDataDoneLoading(state) {
            state.tabDataLoading = false
        },


        // auth stuff
        authLoading(state) {
            state.authState = "loading"
        },
        authSuccess(state, account) {
            state.authState = "success"
            // state.account = account
            // state.account.pkgs = demoPkgs
            //
            // state.scenarios = demoScenarios
            // state.pkgs = demoPkgs
        },
        setUser(state, user) {
            state.user = user
        },


        // UI stuff
        closeNotSupportedMsg(state) {
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state) {
            state.notSupportedMsgOpen = true
        },


        // pkg stuff
        selectPkg(state, id) {
            state.selectedPkg = state.pkgs.find(p => {
                return p.id === id
            })
        },
        setPkgs(state, pkgs) {
            state.pkgs = pkgs
        },
        clearPkg(state) {
            state.selectedPkg = null
        },


        // config stuff
        setConfig(state, config) {
            state.selectedScenario.configs[config.k] = config.v

            state.obj = {
                ...state.selectedScenario.configs,
                [config.k]: config.v
            }


            console.log("saved config", config, state.selectedScenario.configs)
        },


        // scenario stuff
        selectScenario(state, id) {
            state.selectedScenario = state.scenarios.find(s => {
                return s.id === id
            })
        },
        setScenarios(state, scenarios) {
            state.scenarios = scenarios
        },
        clearScenario(state) {
            state.selectedScenario = null
        },
        saveScenario(state) {
            // fake saving this to the server
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    resolve()
                }, 500)
            })
        },
        setSubrs(state, subrIssnls) {
            state.selectedScenario.subrs = subrIssnls
        },
        addSubr(state, issnl) {
            if (!state.selectedScenario.subrs.includes(issnl)) {
                state.selectedScenario.subrs.push(issnl)
            }
        },
        removeSubr(state, issnl) {
            this.state.selectedScenario.subrs = this.state.selectedScenario.subrs.filter(j => j !== issnl)
        },
        setSummary(state, summary) {
            state.selectedScenario.summary = summary
        },

        setTabData(state, newTabData) {
            state.tabData = newTabData
        },


        // scenario UI stuff
        setScenarioTab(state, name) {
            state.scenarioTab = name
        },
        setTabDataEndPointName(state, name) {
            state.tabDataEndpointName = name
        }


    },
    actions: {
        login({commit}, userCreds) {
            // implement later
        },
        loginDemo({commit}) {
            const dummyPkgs = demoPkgs.map(p => {
                return {...p}
            })
            const dummyScenarios = demoScenarios.map(s => {
                return {...s}
            })
            const dummyUser = {...demoUser}

            return new Promise((resolve, reject) => {
                commit('authLoading')
                commit('authSuccess', demoUser)

                commit('setUser', dummyUser)
                commit('setPkgs', dummyPkgs)
                commit('setScenarios', dummyScenarios)


                resolve()
            })
        },
        async updateTabData({commit, state}) {
            commit("tabDataLoading")
            const url = tabDataBaseUrl.replace("{key}", state.tabDataEndpointName)
            axios.post(url, state.selectedScenario)
                .then(resp => {
                    commit("setTabData", resp.data)
                    console.log("got tab data", resp.data)
                })
                .catch(err => {
                    console.log("got error from updateTabData()", url, err)
                })
                .finally(() => commit("tabDataDoneLoading"))
        },
        async updateSummary({commit, state}) {
            commit("summaryLoading")
            return axios.post(summaryUrl, state.selectedScenario)
                .then(r => {
                    commit("setSummary", r.data._summary)
                })
                .finally(() => commit("summaryDoneLoading"))
        },


        async setSubrs({commit, dispatch}, subrIssnls) {
            commit("setSubrs", subrIssnls)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            return true
        },
        async addSubr({commit, dispatch}, issnl) {
            commit("addSubr", issnl)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            return true
        },
        async removeSubr({commit, dispatch}, issnl) {
            commit("removeSubr", issnl)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            return true
        },
        async setConfig({commit, dispatch}, config) {
            commit("setConfig", config)
            dispatch("updateSummary")
            await dispatch("updateTabData")
            return true
        },

        async setTabData({commit, dispatch}, endpointName) {
            commit("setTabDataEndPointName", endpointName)
            await dispatch("updateTabData")
            return true
        }


    },
    modules: {},
    getters: {
        count: state => state.count,
        isLoggedIn: state => !!state.user,
        selectedPkg: state => {
            const myPkg = state.selectedPkg
            if (!myPkg) return null

            myPkg.scenarios = state.scenarios.filter(s => {
                return s.pkgId === myPkg.id
            })
            return myPkg

        },
        selectedScenario(state) {
            return state.selectedScenario
        },
        summary(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.summary
            }
        },
        subrs(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.subrs
            } else {
                return []
            }
        },
        configs(state) {
            if (state.selectedScenario) {
                return state.selectedScenario.configs
            }
        },
        config: (state) => (k) => {
            if (state.selectedScenario) {
                return state.selectedScenario.configs[k]
            }
        },
        journalViews(state) {
            return journalViews
        },

        currentScenarioPage(state) {
            const journalEndpoints = journalViews.map(v=>v.value)

            if (['slider'].includes(state.tabDataEndpointName)) {
                return "slider"
            } else if (['share'].includes(state.tabDataEndpointName)) {
                return 'share'
            } else if (journalEndpoints.includes(state.tabDataEndpointName)) {
                return 'journals'
            }
        }


    }
})




































