import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const demoScenarios = [{
        id: 1,
        urlName: "my-first-scenario",
        name: "My First Scenario",
        pkg: 1,
        cost: 142936,
        percentInstantAccess: 71,
        subrs: [],
        configs: {}
    },
    {
        id: 2,
        urlName: "my-second-scenario",
        name: "My Second Scenario",
        pkg: 1,
        cost: 142936,
        percentInstantAccess: 71,
        subrs: [],
        configs: {}
    },
]

const demoPkgs = [
    {
        id: 1,
        urlName: "els-fre",
        name: "my Elsevier Freedom Package",
        hasCounterData: true,
        numJournals: 1800,
        numPerpAccessJournals: 1800,
    }
]

const demoUser = {
    id: "demo1",
    urlName: "demo1",
    name: "Demo 1",
    selectedPkgId: null,
    selectedScenarioId: null,
    packages: [
        {
            id: 1,
            urlName: "els-fre",
            name: "my Elsevier Freedom Package",
            hasCounterData: true,
            numJournals: 1800,
            numPerpAccessJournals: 1800,
        }
    ]
}


// looks useful: https://scotch.io/tutorials/handling-authentication-in-vue-using-vuex

export default new Vuex.Store({
    state: {
        count: 0,
        account: null,
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
            state.account = account
            state.scenarios = demoScenarios
            state.pkgs = demoPkgs
        },


        // UI stuff
        closeNotSupportedMsg(state) {
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state) {
            state.notSupportedMsgOpen = true
        },


        // pkg stuff
        selectPkg(state, urlName) {
            state.selectedPkg = state.pkgs.find(p => {
                return p.urlName === urlName
            })
        },
        clearPkg(state) {
            state.selectedPkg = null
        },


        // scenario stuff
        selectScenario(state, urlName) {
            state.selectedScenario = state.scenarios.find(s => {
                return s.urlName === urlName
            })
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
            return new Promise((resolve, reject) => {
                commit('authLoading')
                commit('authSuccess', demoUser)
                resolve()
            })
        }
    },
    modules: {},
    getters: {
        count: state => state.count,
        isLoggedIn: state => !!state.account,
        selectedPkg: state => {
            // if (!state.account) return null
            // const myPkg = state.account.packages.find(p => p.id === state.account.selectedPkgId)

            const myPkg = state.selectedPkg
            if (!myPkg) return null
            myPkg.scenarios = state.scenarios.filter(s => {
                return s.pkg === myPkg.id
            })
            return myPkg

        },
        selectedScenario(state) {
            return state.selectedScenario
        }

    }
})
