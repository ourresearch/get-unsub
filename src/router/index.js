import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Purchase from '../views/Purchase'
import PurchaseResult from '../views/PurchaseResult'
import Login from '../views/Login'
import ChangePassword from "../views/ChangePassword"
import Support from '../views/Support'
import Account from '../views/Account'
import Pkg from '../views/Pkg'
import User from "../views/User"
import Institution from "../views/Institution";


import Scenario from "../views/Scenario"
import PublisherApcs from "../views/PublisherApcs";

import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: Home},
    {path: '/purchase', component: Purchase},
    {path: '/purchase/:result', component: PurchaseResult},
    {path: '/support', component: Support},
    {path: '/login', component: Login},
    {path: '/change-password', component: ChangePassword},

    {
        path: "/u",
        component: User,
        meta: {requiresAuth: true},

    },

    {
        path: "/i/:institutionId",
        component: Institution,
        meta: {requiresAuth: true},
    },





    {
        path: "/a",
        component: Account,
        meta: {requiresAuth: true},

    },
    {
        path: "/a/:publisherId",
        component: Pkg,
        meta: {requiresAuth: true},

    },

    // this has to come before the scenario route, or else the
    // scenario route greedily steals it with scenario="apc"
    {
        path: "/a/:publisherId/apc",
        component: PublisherApcs,
        name: "publisherApc",
        meta: {requiresAuth: true},
    },

    {
        path: "/a/:publisherId/:scenarioId",
        component: Scenario,
        name: "publisherScenario",
        meta: {requiresAuth: true},
    },

    {
        path: "/a/:publisherId/:scenarioId/overview",
        // https://router.vuejs.org/guide/essentials/redirect-and-alias.html#redirect
        redirect: to => {
            // https://router.vuejs.org/api/#the-route-object
            return to.path.replace("/overview", "")
        },
    },

    {
        path: "*",
        redirect: "/"
    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this page requires authentication
        if (store.getters.isLoggedIn)  {
            // you're logged in great. proceed.
            next()
        }
        else {
            // you are supposed to be logged in for this, so
            // let's try to log you in using your saved token.
            store.dispatch("fetchUser")
                .then(resp=>{
                    // we logged you in, great. proceed.
                    next()
                })
                .catch(err=>{
                    // you don't have a token, or it's bogus. you'll need to log in.
                    next("/login")
                })
        }
    }
    else { // easy, no auth required. proceed.
        next()
    }
})


export default router
