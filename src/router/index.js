import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Purchase from '../views/Purchase'
import Login from '../views/Login'
import Support from '../views/Support'
import Account from '../views/Account'

Vue.use(VueRouter)

const routes = [
    {path: '/', component: Home},
    {path: '/purchase', component: Purchase},
    {path: '/support', component: Support},
    {path: '/login', component: Login},

    {
        path: "/a/:accountName",
        component: Account

    },
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
