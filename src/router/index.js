import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Purchase from '../views/Purchase'
import PurchaseResult from '../views/PurchaseResult'
import Login from '../views/Login'
import Support from '../views/Support'
import Account from '../views/Account'
import Pkg from '../views/Pkg'

import Scenario from '../views/Scenario'
import OverviewTab from "../views/ScenarioTabsNew/OverviewTab"
import JournalsTab from "../views/ScenarioTabsNew/JournalsTab"
import ApcTab from "../views/ScenarioTabsNew/ApcTab"
import ExportTab from "../views/ScenarioTabsNew/ExportTab";

import store from '../store/index.js'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: Home},
    {path: '/purchase', component: Purchase},
    {path: '/purchase/:result', component: PurchaseResult},
    {path: '/support', component: Support},
    {path: '/login', component: Login},

    {
        path: "/a",
        component: Account,
        meta: {requiresAuth: true},

    },
    {
        path: "/a/:pkgId",
        component: Pkg,
        meta: {requiresAuth: true},

    },
    {
        path: "/a/:pkgId/:scenarioId",
        // https://router.vuejs.org/guide/essentials/redirect-and-alias.html#redirect
        redirect: to => {
            // https://router.vuejs.org/api/#the-route-object
            return to.path + "/overview"
        },
    },
    {
        path: "/a/:pkgId/:scenarioId/overview",
        component: OverviewTab,
        meta: {requiresAuth: true},
    },
    {
        path: "/a/:pkgId/:scenarioId/journals",
        component: JournalsTab,
        meta: {requiresAuth: true},
    },
    {
        path: "/a/:pkgId/:scenarioId/apc",
        component: ApcTab,
        meta: {requiresAuth: true},
    },
    {
        path: "/a/:pkgId/:scenarioId/export",
        component: ExportTab,
        meta: {requiresAuth: true},
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
        if (!store.getters.isLoggedIn)  next('/')
        else next()
    }
    else { // no auth required
        next()
    }
})


export default router
