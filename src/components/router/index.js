import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../Homepage/Homepage.vue'
import Purchase from '../../views/Purchase'
import PurchaseResult from '../../views/PurchaseResult'
import Login from '../../views/Login'
import Support from '../../views/Support'
import Publisher from "../../views/Publisher";
import User from "../../views/User"
import Institution from "../../views/Institution";
import RecoverPassword from "../../views/RecoverPassword";
import ResetPassword from "../../views/ResetPassword";
import RequestDemo from "../../views/RequestDemo";
import Team from "../../views/Team";
import Webinars from "../../views/Webinars";
import Press from "../../views/Press";
import CaseStudies from "../../views/CaseStudies.vue";
import Contact from "../../views/Contact";
import Privacy from "../../views/Privacy";
import PrivacyForm from "../../views/PrivacyForm";
import Admin from "../../views/Admin";


import Scenario from "../../views/Scenario"

import store from '../../store'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: Home},
    {path: '/purchase', component: Purchase},
    {path: '/team', component: Team},
    {path: '/webinars', component: Webinars},
    {path: '/press', component: Press},
    {path: '/case-studies', component: CaseStudies},
    {path: '/contact', component: Contact},
    {path: '/privacy', component: Privacy},
    {path: '/privacy-form', component: PrivacyForm},


    {
        path: '/admin', 
        component: Admin,
        name: "admin",
        meta: {requiresAuth: true, domain: "@ourresearch.org"},
    },
    {path: '/recover-password', component: RecoverPassword},
    {path: '/request-demo', component: RequestDemo},
    {path: '/reset-password', component: ResetPassword},
    {path: '/purchase/:result', component: PurchaseResult},
    {path: '/support', component: Support},
    {path: '/login', component: Login},
    {path: '/change-password', redirect: "/login"},
    {path: '/a', redirect: "/u"},
    {path: '/a/:publisherId', redirect: "/u"},

    {
        path: "/u",
        component: User,
        name: "user",
        meta: {requiresAuth: true},

    },

    {
        path: "/i/:institutionId",
        component: Institution,
        name: "institution",
        meta: {requiresAuth: true},
    },

    {
        path: "/i/:institutionId/p/:publisherId",
        component: Publisher,
        name: "publisher",
        meta: {requiresAuth: true},
    },


    {
        path: "/i/:institutionId/p/:publisherId/s/:scenarioId",
        component: Scenario,
        name: "scenario",
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
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {x: 0, y: 0}
        }
    }
})

router.beforeEach(async (to, from, next) => {
    if (localStorage.getItem("token")) {
        try {
            await store.dispatch("fetchUser")
        } catch (e) {
            store.commit("logout")
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        // this page requires authentication
        if (store.getters.isLoggedIn) {  // you're logged in great. proceed.
            // if route /admin
            if (to.matched.some(record => record.path === '/admin')) {
                // is logged in user email allowed to see /admin
                if (to.matched.some(record => store.getters.userEmail.endsWith(record.meta.domain))) {
                    // allowed to see admin dashboard
                    next()
                } else {
                    // not allowed, go back to user home page: /u
                    next("/u")
                }
            } else {
                // not /admin route
                next()
            }
        } else { // sorry, you can't view this page. go log in.
            next("/login")
        }
    } else { //  no auth required. proceed.
        next()
    }
})


export default router
