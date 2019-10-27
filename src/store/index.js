import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const demoUser = {
    name: "Demo 1",
    id: "demo1",
    selectedPackageId: 1,
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
        isLoggedIn: state => !!state.account
    }
})
