<template>
    <v-app-bar
            :flat="isLandingPage"
            :extended="!!scenarioId"
            color="#fff"
            app
    >
        <router-link to="/">
            <img class="mt-2" style="width:130px;" src="../../assets/unsub-logo.png"
                 alt=""/>
        </router-link>
        <!--        <v-toolbar-title class="headline">-->
        <!--        </v-toolbar-title>-->


        <app-bar-breadcrumbs v-if="isLoggedIn"/>


        <div class="no-highlight ml-12 pl-6 hidden-sm-and-down" v-if="!isLoggedIn">
            <v-menu offset-y content-class="no-highlight">
                <template v-slot:activator="{on}">
                    <v-btn text color="" v-on="on">
                        About
                        <v-icon class="">mdi-menu-down</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/team">
                        Team
                    </v-list-item>
                    <v-list-item to="/press">
                        Press
                    </v-list-item>
                    <v-list-item to="/contact">
                        Contact
                    </v-list-item>
                    <v-list-item href="http://help.unsub.org/en/" target="_blank">
                        Knowledge Base
                    </v-list-item>
                </v-list>
            </v-menu>

            <v-btn text href="http://help.unsub.org/en/" target="_blank" class="mx-4">
                Help
            </v-btn>

            <v-btn text color="" v-if="!isLoggedIn" to="/purchase">
                Purchase
            </v-btn>
        </div>


        <v-spacer/>


        <div class="no-highlight" v-if="isLoggedIn">
            <v-btn icon href="http://help.unsub.org/en/" target="_blank">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>

            <v-menu offset-y content-class="no-highlight" min-width="200">
                <template v-slot:activator="{on}">
                    <v-btn icon color="" v-on="on">
                        <v-icon class="">mdi-account-circle-outline</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item class="py-2">
                        <div class="body-2">
                            <div>
                                You're signed in as
                            </div>
                            <div class="font-weight-bold">
                                {{userEmail}}
                            </div>
                        </div>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item to="/u">
                        Your account
                    </v-list-item>
                    <v-list-item @click="logout">
                        Log out
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <div class="no-highlight hidden-sm-and-down" v-if="!isLoggedIn">
            <v-btn outlined color="primary" to="/request-demo">
                Get Demo
            </v-btn>
            <v-btn
                    text
                    to="/login"
                    id="header-login-link"
                    class="ml-4"
            >
                Log in
            </v-btn>
        </div>


        <div class="hidden-md-and-up">
            <v-menu offset-y content-class="no-highlight" min-width="150">
                <template v-slot:activator="{on}">
                    <v-btn icon color="" v-on="on">
                        <v-icon class="">mdi-menu</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item to="/request-demo" class="font-weight-bold">
                        Get Demo
                    </v-list-item>
                    <v-list-item to="/team">
                        Team
                    </v-list-item>
                    <v-list-item to="/press">
                        Press
                    </v-list-item>
                    <v-list-item to="/contact">
                        Contact
                    </v-list-item>
                    <v-list-item href="http://help.unsub.org/en/" target="_blank">
                        Help
                    </v-list-item>
                    <v-list-item to="/purchase">
                        Purchase
                    </v-list-item>
                    <v-list-item to="/login">
                        Log in
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>

        <template v-slot:extension>
                <v-row style="margin-left:150px;">
                    <scenario-menu-scenario key="scenario"/>
                    <scenario-menu-view key="view"/>
                    <scenario-menu-subscriptions v-if="0" key="subscriptions"/>
                    <scenario-menu-columns key="columns"/>
                    <scenario-menu-settings key="settings"/>
                    <scenario-menu-export key="export"/>
                    <scenario-menu-help key="help"/>
                    <v-spacer/>
                    <div class="pt-2" v-if="institutionIsConsortium">
                        <scenario-edit-dialogs-institutions/>
                    </div>
                </v-row>
        </template>


    </v-app-bar>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import AppBarBreadcrumbs from "./AppBarBreadcrumbs";
    import ScenarioMenuScenario from "../ScenarioMenu/ScenarioMenuScenario";
    import ScenarioMenuSubscriptions from "../ScenarioMenu/ScenarioMenuSubscriptions";
    import ScenarioMenuView from "../ScenarioMenu/ScenarioMenuView";
    import ScenarioMenuColumns from "../ScenarioMenu/ScenarioMenuColumns";
    import ScenarioMenuSettings from "../ScenarioMenu/ScenarioMenuSettings";
    import ScenarioMenuExport from "../ScenarioMenu/ScenarioMenuExport";
    import ScenarioMenuHelp from "../ScenarioMenu/ScenarioMenuHelp";

    export default {
        name: "AppBar",
        components: {
            AppBarBreadcrumbs,

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
                showBannerContent: !localStorage.getItem("surveyBannerDismissed"),
            }
        },
        methods: {
            logout() {
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearPublisher")
                this.$store.commit("clearInstitution")
                this.$store.commit("logout")
                this.$router.push("/")
            },
            dismissBanner() {
                localStorage.setItem("surveyBannerDismissed", "true")
                this.showBannerContent = false
            }
        },
        computed: {
            ...mapGetters([
                'isLandingPage',
                'scenarioId',
                'scenarioName',
                'publisherId',
                'publisherName',
                'selectedScenarioIsLoading',
                'isLoggedIn',
                'institutionName',
                'institutionId',
                'institutionIsDemo',
                'foo',
                "userName",
                "userEmail",
                "institutionIsConsortium",
            ]),
            isApcPage() {
                // hack for now
                return !!location.href.match(/\/apc$/)
            },
            account() {
                return this.$store.getters.selectedAccount
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },
            backgroundColor() {
                return (this.institutionIsConsortium) ? "primary" : "white"
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {
            "$route": {
                immediate: true,
                handler: function (to, from) {

                }
            }
        }
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        /*background: #eee;*/


        /*border-top: 1px solid #ddd;*/
        /*padding-right: 27px;*/
        /*color: #fff;*/
        /*background: #2196F3;*/
        /*display: flex;*/
        /*justify-content: space-between;*/
    }


</style>