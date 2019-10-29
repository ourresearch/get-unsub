import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const demoConfigs = {
    cost_alacart_increase: 8,
    cost_bigdeal: 2200000,
    cost_bigdeal_increase:5,
    cost_content_fee_percent: 5.7,
    cost_ill: 5,
    ill_request_percent_of_delayed: 10,
    include_bronze: true,
    include_submitted_version: true,
    package: "demo",
    social_networks_percent: 10,
    weight_authorship: 100,
    weight_citation: 10
}

const demoScenarios = [{
        id: "1",
        name: "My First Scenario",
        pkgId: "demo-pkg-123",
        summary: {},
        subrs: [],
        configs: {...demoConfigs}
    },
    {
        id: "2",
        name: "My Second Scenario",
        pkgId: "demo-pkg-123",
        summary: {},
        subrs: [],
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

export default new Vuex.Store({
    state: {
        user: null,

        authState: "ready",
        notSupportedMsgOpen: false,

        scenarios: [],
        selectedScenario: null,

        pkgs: [],
        selectedPkg: null
    },
    mutations: {
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
        }
    },
    modules: {},
    getters: {
        count: state => state.count,
        isLoggedIn: state => !!state.account,
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
        }

    }
})
