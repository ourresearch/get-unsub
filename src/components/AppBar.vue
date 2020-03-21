<template>
    <v-app-bar app>
        <v-progress-linear
                :active="$store.state.loading > 0"
                :indeterminate="$store.state.loading > 0"
                absolute
                top
                color="green"
        />
        <v-toolbar-title class="headline">
            <router-link to="/">
                <img class="pl-3 pt-3" src="../assets/logo.png" alt="">
            </router-link>
        </v-toolbar-title>


        <v-divider
                class="ml-4"
                vertical
                v-if="$store.getters.isLoggedIn"
        />

        <v-toolbar-items class="account breadcrumbs d-flex align-center pl-4" v-if="account">

            <!-- first breadcrumb -->
            <span class="first-breadcrumb breadcrumb-segment headline" v-if="!thirdBreadcrumb">
                <router-link
                        class="breadcumbs-publisher-link"
                        to="/a">
                    <v-icon style="margin-top:-4px;">mdi-home-outline</v-icon>
                </router-link>
                <span class="chevron pl-1 pr-2" v-if="pkgId">
                    ›
                </span>
            </span>

            <!-- second breadcrumb -->
            <div v-if="pkgName" class="breadcrumb-segment">
                <div class="top">
                    Publisher
                </div>
                <div class="bottom headline">
                    <span v-if="!thirdBreadcrumb">
                        {{pkgName}}
                    </span>
                    <router-link
                            v-if="!!thirdBreadcrumb"
                            class="breadcumbs-publisher-link"
                            :to="'/a/' + pkgId">
                        {{pkgName}}
                    </router-link>
                    <span v-if="!!thirdBreadcrumb" class="chevron px-3">
                        ›
                    </span>
                </div>
            </div>

            <!-- third breadcrumb -->
            <div v-if="thirdBreadcrumb=='scenario'" class="breadcrumb-segment">
                <div class="top">
                    Scenario
                </div>
                <div class="bottom headline">
                    <span v-if="!selectedScenarioIsLoading">
                        {{scenarioName}}
                    </span>
                    <span v-if="selectedScenarioIsLoading" class="grey--text">
                        Loading...
                    </span>
                </div>
            </div>
            <div v-if="thirdBreadcrumb=='apc'">
                <div class="top">
                    Current spending
                </div>
                <div class="bottom headline">
                    Your publishing costs
                </div>
            </div>

        </v-toolbar-items>

        <v-spacer/>
        <v-toolbar-items>
            <v-btn text color="primary" v-if="!$store.getters.isCustomerAccount" to="/purchase">Pricing</v-btn>
            <v-btn text to="/support" v-if="!scenarioName">Help</v-btn>
            <v-btn text to="/login" v-if="!$store.getters.isLoggedIn">Log in</v-btn>

            <v-menu offset-y v-if="account">
                <template
                        v-slot:activator="{ on }">
                    <v-btn text
                           class="px-2 toolbar-summary"
                           v-on="on"
                    >
                        <v-icon>mdi-account</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/a">
                        <v-list-item-icon>
                            <v-icon>mdi-account</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            My account
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="logout">
                        <v-list-item-icon>
                            <v-icon>mdi-logout</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Log out
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar-items>

        <template v-slot:extension v-if="scenarioName">
            <scenario-menu-scenario/>
            <scenario-menu-view/>
            <scenario-menu-subscriptions />
            <scenario-menu-columns/>
            <scenario-menu-settings/>
            <scenario-menu-export/>
            <scenario-menu-help/>
        </template>

    </v-app-bar>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    import {api} from "../api"
    import ScenarioMenuScenario from "./ScenarioMenu/ScenarioMenuScenario";
    import ScenarioMenuSubscriptions from "./ScenarioMenu/ScenarioMenuSubscriptions";
    import ScenarioMenuView from "./ScenarioMenu/ScenarioMenuView";
    import ScenarioMenuColumns from "./ScenarioMenu/ScenarioMenuColumns";
    import ScenarioMenuSettings from "./ScenarioMenu/ScenarioMenuSettings";
    import ScenarioMenuExport from "./ScenarioMenu/ScenarioMenuExport";
    import ScenarioMenuHelp from "./ScenarioMenu/ScenarioMenuHelp";
    import appConfigs from "../appConfigs";

    export default {
        name: "AppBar",
        components: {
            ScenarioMenuScenario,
            ScenarioMenuView,
            ScenarioMenuSubscriptions,
            ScenarioMenuColumns,
            ScenarioMenuExport,
            ScenarioMenuSettings,
            ScenarioMenuHelp,
        },
        data() {
            return {
                thirdBreadcrumb: null,
            }
        },
        methods: {
            increment() {
            },
            logout() {
                this.$store.commit("logout")
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearSelectedPkg")
                this.$router.push("/")
            }
        },
        computed: {
            ...mapGetters([
                'scenarioId',
                'scenarioName',
                'pkgId',
                'pkgName',
                'selectedScenarioIsLoading',
            ]),
            summary() {
                return this.$store.getters.summary
            },
            api() {
                return api
            },
            isApcPage(){
                // hack for now
                return !!location.href.match(/\/apc$/)
            },
            count() {
            },
            account() {
                return this.$store.getters.selectedAccount
            },
            selectedPkg() {
                return this.$store.getters.selectedPkg
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {
            "$route": {
                immediate: true,
                handler: function(to, from){
                    console.log("route change", to, from)
                    if (to.name === "publisherApc") {
                        this.thirdBreadcrumb = "apc"
                    }
                    else if (to.name === "publisherScenario") {
                        this.thirdBreadcrumb = "scenario"
                    }
                    else {
                        this.thirdBreadcrumb = null
                    }

                }
            }
        }
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        /*background: #eee;*/
        border-top: 1px solid #ddd;
    }

    .breadcumbs-publisher-link {
        color: #333 !important;
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    .breadcrumbs {
        .breadcrumb-segment {
            .top {
                font-size: 12px;
            }
        }
        .headline {
            line-height: 1 !important;
        }
    }


</style>