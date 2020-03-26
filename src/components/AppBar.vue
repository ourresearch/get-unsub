<template>
    <v-app-bar app>
        <v-toolbar-title class="headline">
            <router-link to="/">
                <img class="pl-3 pt-3" src="../assets/logo.png" alt="">
            </router-link>
        </v-toolbar-title>


        <v-divider
                class="ml-4"
                vertical
                v-if="isLoggedIn"
        />

        <v-toolbar-items class="account breadcrumbs d-flex align-center pl-4" v-if="isLoggedIn">

            <!-- first breadcrumb -->
            <span class="first-breadcrumb breadcrumb-segment headline" v-if="!thirdBreadcrumb">
                <router-link
                        class="breadcumbs-publisher-link"
                        to="/u">
                    <v-icon style="margin-top:-4px;">mdi-home-outline</v-icon>
                </router-link>
                <span class="chevron pl-1 pr-2" v-if="publisherId">
                    ›
                </span>
            </span>

            <!-- second breadcrumb -->
            <div v-if="publisherName" class="breadcrumb-segment">
                <div class="top">
                    Publisher
                </div>
                <div class="bottom headline">
                    <span v-if="!thirdBreadcrumb">
                        {{publisherName}}
                    </span>
                    <router-link
                            v-if="!!thirdBreadcrumb"
                            class="breadcumbs-publisher-link"
                            :to="'/a/' + publisherId">
                        {{publisherName}}
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
        <div>
            <v-btn text color="primary" v-if="!$store.getters.isUserSubscribed" to="/purchase">
                Buy
            </v-btn>

            <v-btn icon to="/support" v-if="!scenarioName">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>

            <v-btn text to="/login" v-if="!isLoggedIn">Log in</v-btn>
            <v-menu offset-y v-if="isLoggedIn">
                <template
                        v-slot:activator="{ on }">
                    <v-btn icon
                           class="px-2"
                           v-on="on"
                    >
                        <v-icon>mdi-account</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/u">
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
        </div>

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

    import ScenarioMenuScenario from "./ScenarioMenu/ScenarioMenuScenario";
    import ScenarioMenuSubscriptions from "./ScenarioMenu/ScenarioMenuSubscriptions";
    import ScenarioMenuView from "./ScenarioMenu/ScenarioMenuView";
    import ScenarioMenuColumns from "./ScenarioMenu/ScenarioMenuColumns";
    import ScenarioMenuSettings from "./ScenarioMenu/ScenarioMenuSettings";
    import ScenarioMenuExport from "./ScenarioMenu/ScenarioMenuExport";
    import ScenarioMenuHelp from "./ScenarioMenu/ScenarioMenuHelp";

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
            logout() {
                this.$store.commit("logout")
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearSelectedPublisher")
                this.$router.push("/")
            }
        },
        computed: {
            ...mapGetters([
                'scenarioId',
                'scenarioName',
                'publisherId',
                'publisherName',
                'selectedScenarioIsLoading',
                'isLoggedIn',
                'foo',
            ]),
            isApcPage(){
                // hack for now
                return !!location.href.match(/\/apc$/)
            },
            account() {
                return this.$store.getters.selectedAccount
            },
            selectedPublisher() {
                return this.$store.getters.selectedPublisher
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