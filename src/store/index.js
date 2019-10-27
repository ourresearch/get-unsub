import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const demoUser = {
    id: "demo1",
    urlName: "demo1",
    name: "Demo 1",
    selectedPkgId: 1,
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

        },
    },
    actions: {
        login({commit}, userCreds){
            return new Promise((resolve, reject) => {
                commit('authLoading')
                commit('authSuccess', demoUser)
                resolve()
            })
        },
    },
    modules: {},
    getters: {
        count: state => state.count,
        isLoggedIn: state => !!state.account,
        selectedPkg: state => {
            return state.account.packages.find(p=>p.id===state.account.selectedPkgId)
        }
    }
})
