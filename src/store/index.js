import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const demoScenarios = [{
        id: "1",
        name: "My First Scenario",
        pkg: "1",
        cost: 142936,
        percentInstantAccess: 71,
        subrs: [],
        configs: {}
    },
    {
        id: "2",
        name: "My Second Scenario",
        pkg: "1",
        cost: 142936,
        percentInstantAccess: 71,
        subrs: [],
        configs: {}
    },
]

const demoPkgs = [
    {
        id: "1",
        name: "my Elsevier Freedom Package",
        hasCounterData: true,
        numJournals: 1800,
        numPerpAccessJournals: 1800,
    }
]

const demoUser = {
    id: "demo1",
    name: "Demo 1",
    selectedPkgId: null,
    selectedScenarioId: null,
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
            state.account.pkgs = demoPkgs

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
        selectPkg(state, id) {
            state.selectedPkg = state.pkgs.find(p => {
                return p.id === id
            })
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
            const myPkg = state.selectedPkg
            console.log("selecting pkg", myPkg)
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
