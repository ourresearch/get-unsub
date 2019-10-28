import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
            scenarios: [
                {
                    id: 1,
                    urlName: "my-first-scenario",
                    name: "My First Scenario",
                    cost: 142936,
                    percentInstantAccess: 71,
                    subrs: [],
                    configs: {}
                }
            ]
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
    },
    mutations: {
        authLoading(state){
            state.authState = "loading"
        },
        authSuccess(state, account){
            state.authState = "success"
            state.account = account
        },
        increment(state) {
            state.count += 1
        },
        closeNotSupportedMsg(state){
            state.notSupportedMsgOpen = false
        },
        openNotSupportedMsg(state){
            state.notSupportedMsgOpen = true
        },
        selectPkg(state, urlName){
            // fake this for now
            state.account.selectedPkgId = 1
        },
        clearPkg(state){
            state.account.selectedPkgId = null
        },
        selectScenario(state, urlName){
            // fake this for now
            state.account.selectedScenarioId = 1
        },
        clearScenario(state){
            state.account.selectedScenarioId = null
        },
    },
    actions: {
        login({commit}, userCreds){
            // implement later
        },
        loginDemo({commit}){
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
            if (!state.account) return null
            return state.account.packages.find(p=>p.id===state.account.selectedPkgId)
        },
        selectedScenario(state){
            if (!state.account) return null
            const pkg = state.account.packages.find(p=>p.id===state.account.selectedPkgId)

            if (!pkg) return null
            return pkg.scenarios.find(s => {
                return s.id === state.account.selectedScenarioId
            })
        }

    }
})
