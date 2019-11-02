<template>
    <v-app>


        <v-app-bar  app>
            <v-toolbar-title class="headline">
                <router-link to="/">
                    <img class="mt-3" style="height:35px;" src="./assets/logo.png" alt="">
                </router-link>
            </v-toolbar-title>


            <v-progress-linear
                    :active="loading"
                    :indeterminate="loading"
                    absolute
                    bottom
                    color="green"
            ></v-progress-linear>


            <v-divider
                    class="ml-8"
                    inset
                    vertical
                     v-if="$store.getters.isLoggedIn"
            ></v-divider>
            <div class="logged-in pl-7" v-if="$store.getters.isLoggedIn">
                <breadcrumbs></breadcrumbs>
            </div>
            <v-spacer></v-spacer>

            <div class="not-logged-in pl-2" v-if="!$store.getters.isLoggedIn">
                <v-btn text to="support">Support</v-btn>
                <v-btn text to="purchase">Purchase</v-btn>
                <v-btn text to="login">Log in</v-btn>
            </div>


            <div class="logged-in" v-if="$store.getters.isLoggedIn">
                <v-btn text @click="$store.dispatch('setScenarioPage', 'slider')">Slider</v-btn>
                <v-btn text @click="$store.dispatch('setScenarioPage', 'journals')">Journals</v-btn>
            </div>


            <v-divider
                    class="mx-4"
                    inset
                    vertical
                     v-if="$store.getters.isLoggedIn"
            ></v-divider>

            <div class="logged-in" v-if="$store.getters.isLoggedIn">
                <v-btn text icon>
                    <v-icon>mdi-content-save</v-icon>
                </v-btn>
                <v-btn text icon>
                    <v-icon>mdi-export-variant</v-icon>
                </v-btn>
                <v-btn text icon @click="drawerRight = !drawerRight">
                    <v-icon>mdi-settings</v-icon>
                </v-btn>
            </div>

            <v-divider
                    class="mx-4"
                    inset
                    vertical
            ></v-divider>

            <div class="logged-in title" v-if="$store.getters.isLoggedIn && summary">
                <span class="px-2 toolbar-summary">
                    <v-icon small>mdi-cart</v-icon>
                    <div class="val headline pr-2">{{summary.num_journals_subscribed | round()}}</div>
                    <div class="cost-bar bar small-bar">
                        <div class="bar-fill"></div>
                        <div class="segment cost" :style="{height: summary.cost_percent+'%'}"></div>
                    </div>
                    <div class="bar usage-bar small-bar">
                        <div class="bar-fill"></div>
                        <div class="segment paid-instant" :style="{height: summary.use_subscription_percent+'%'}"></div>
                        <div class="segment free-instant" :style="{height: summary.use_free_instant_percent+'%'}"></div>
                    </div>
                </span>
            </div>
        </v-app-bar>

        <v-navigation-drawer dark v-model="drawerRight" app right class="pt-12">
            <v-toolbar absolute width="100%">
                <v-toolbar-title>
                    <v-icon small>mdi-pencil-outline</v-icon>
                    Edit Configs
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="drawerRight = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>

            </v-toolbar>
            <configs class="pt-4"></configs>


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
            },
            loading() {
                return this.$store.state.tabDataLoading
            }
        }
    };
</script>

<style lang="scss">

    .toolbar-summary {
        display: inline-flex;

        div.bar {
            display: flex;
            flex-direction: column;
            height: 30px;
            width: 20px;
            margin-right: 2px;
            background: #ccc;
        }

        .bar-fill {
            background: #ccc;
            width: 100%;
            display: block;
            flex-grow: 10;
        }

        div.segment {
            width: 100%;
            display: block;

            &.cost {
                background: #555;
            }

            &.free-instant {
                background: green;
            }

            &.paid-instant {
                background: dodgerblue;
            }
        }
    }

    .v-slider--vertical {
        min-height: 400px !important;
        margin: 0 !important;
    }


</style>