<template>
    <v-app>


        <v-app-bar elevate-on-scroll app clipped-right>
            <v-toolbar-title class="headline">
                <router-link to="/">
                    <img class="mt-3" style="height:35px;" src="./assets/logo.png" alt="">
                </router-link>
            </v-toolbar-title>
            <div class="logged-in pl-7" v-if="$store.getters.isLoggedIn">
                <breadcrumbs></breadcrumbs>
            </div>
            <v-spacer></v-spacer>

            <div class="not-logged-in pl-2" v-if="!$store.getters.isLoggedIn">
                <v-btn text to="support">Support</v-btn>
                <v-btn text to="purchase">Purchase</v-btn>
                <v-btn text to="login">Log in</v-btn>
            </div>

            <div class="logged-in title" v-if="$store.getters.isLoggedIn && summary">
                <span class="px-2">
                    <v-icon small>mdi-book-open-variant</v-icon>
                    <span class="val">{{summary.use_subscription_percent | round()}}%</span>
                </span>
                <span class="px-2">
                    <v-icon small>mdi-book-open-variant</v-icon>
                    <span class="val">{{summary.use_free_instant_percent | round()}}%</span>
                </span>

                <span class="px-2">
                    <v-icon small>mdi-cash-multiple</v-icon>
                    <span class="val">{{summary.cost_percent | round()}}%</span>
                </span>

                <span class="px-2">
                    <v-icon small>mdi-cart</v-icon>
                    <span class="val">{{summary.num_journals_subscribed | round()}}</span>
                </span>
            </div>

            <div class="logged-in" v-if="$store.getters.isLoggedIn">
                <v-btn text @click="$store.commit('setScenarioTab', 'slider')">Overview</v-btn>
                <v-btn text @click="$store.commit('setScenarioTab', 'journals')">Journals</v-btn>
            </div>

            <div class="logged-in" v-if="$store.getters.isLoggedIn">
                <v-btn text icon>
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn text icon>
                    <v-icon>mdi-share</v-icon>
                </v-btn>
                <v-btn text icon @click="drawerRight = !drawerRight">
                    <v-icon>mdi-settings</v-icon>
                </v-btn>
            </div>
        </v-app-bar>

        <v-navigation-drawer v-model="drawerRight" app right clipped>
            <configs></configs>


        </v-navigation-drawer>

        <v-content>

            <router-view></router-view>
        </v-content>

        <v-snackbar
                top
                v-model="$store.state.notSupportedMsgOpen">
            Sorry, that's not supported on the demo account.
            <v-btn text @click="$store.commit('closeNotSupportedMsg')">close</v-btn>
        </v-snackbar>

    </v-app>
</template>

<script>
    import Breadcrumbs from "./components/Breadcrumbs"
    import Configs from "./components/Configs"

    export default {
        name: 'App',
        components: {Breadcrumbs, Configs},
        data: () => ({
            drawerRight: false,
        }),
        computed: {
            summary() {
                return this.$store.getters.summary
            }
        }
    };
</script>
