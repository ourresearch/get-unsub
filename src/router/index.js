import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Purchase from '../views/Purchase'
import PurchaseResult from '../views/PurchaseResult'
import Login from '../views/Login'
import Support from '../views/Support'
import Publisher from "../views/Publisher";
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
    {path: '/change-password', redirect: "/login"},
    {path: '/a', redirect: "/u"},
    {path: '/a/:publisherId', redirect: "/u"},

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
        path: "/i/:institutionId/p/:publisherId",
        component: Publisher,
        meta: {requiresAuth: true},
    },

    {
        path: "/i/:institutionId/p/:publisherId/apc",
        component: PublisherApcs,
        meta: {requiresAuth: true},
    },

    {
        path: "/i/:institutionId/p/:publisherId/s/:scenarioId",
        component: Scenario,
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

router.beforeEach(async (to, from, next) => {
    if (localStorage.getItem("token")) {
        await store.dispatch("fetchUser")
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this page requires authentication
        if (store.getters.isLoggedIn)  {  // you're logged in great. proceed.
            next()
        }
        else { // sorry, you can't view this page. go log in.
            next("/login")
        }
    }
    else { //  no auth required. proceed.
        next()
    }
})


export default router
