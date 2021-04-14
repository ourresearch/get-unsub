<template>
    <v-app-bar
            :extended="!!isLoggedIn"
            color="#fff"
            app
            elevate-on-scroll
    >
        <router-link to="/">
            <img class="mt-2" style="width:130px;" src="../../assets/unsub-logo.png"
                 alt=""/>
        </router-link>
        <!--        <v-toolbar-title class="headline">-->
        <!--        </v-toolbar-title>-->


        <v-toolbar-items v-if="isLoggedIn" class="pl-4">

            <!--            INSTITUTION                                          -->
            <!--*****************************************************************-->

            <v-menu v-if="institutionId" open-on-hover offset-y content-class="no-highlight">
                <template v-slot:activator="{on}">
                    <v-btn
                            text
                            class="low-key-button no-highlight breadcrumb-button"
                            style="min-width: 0;"
                            v-on="on"
                            :to="`/i/${institutionId}`"
                    >
                        <v-icon color="#777">
                            {{ institutionIsConsortium ? "mdi-lan" : "mdi-bank-outline"}}
                        </v-icon>
                        <template v-if="publisherName">
                            <v-icon color="#777" small>mdi-chevron-right</v-icon>
                        </template>
                        <span v-if="!publisherName" class="pl-2 pr-5 text-h6">
                            {{ institutionName }}
                        </span>
                    </v-btn>
                </template>
                <div v-if="institutionName">
                    <v-list dense class="pb-0">
                        <v-list-item :to="`/i/${institutionId}`">
                            <v-list-item-icon>
                                <v-icon class="mt-4">
                                    {{ institutionIsConsortium ? "mdi-lan" : "mdi-bank-outline"}}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content class="font-weight-bold">
                                <div>
                                    <div class="body-2 mb-1">
                                        Current {{ institutionIsConsortium ? "consortium" : "institution" }}:
                                    </div>
                                    <div>
                                        {{institutionName}}
                                    </div>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                        <template v-if="orgsOtherThanCurrent.length">
                            <v-subheader class="body-2 mt-2">
                                Other
                                {{ userHasAConsortium ? "organizations" : "institutions"}}

                                ({{ orgsOtherThanCurrent.length
                                }}):
                            </v-subheader>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                    <div style="overflow: scroll; max-height: 500px;">
                        <v-list dense v-if="orgsOtherThanCurrent.length">

                            <v-list-item
                                    v-for="org in orgsOtherThanCurrent"
                                    :key="org.id"
                                    :to="`/i/${org.institution_id}`"
                            >
                                <v-list-item-icon>
                                    <v-icon>
                                        {{ org.is_consortium ? "mdi-lan" : "mdi-bank-outline"}}
                                    </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <div>
                                        {{org.institution_name}}
                                    </div>
                                    <div v-if="org.is_consortium" class="caption">
                                        consortium
                                    </div>
                                </v-list-item-content>
                            </v-list-item>

                        </v-list>

                    </div>

                </div>
            </v-menu>


            <!--            PUBLISHER                                            -->
            <!--*****************************************************************-->
            <v-menu v-if="publisherId" open-on-hover offset-y content-class="no-highlight">
                <template v-slot:activator="{on}">
                    <v-btn
                            text
                            class="low-key-button no-highlight breadcrumb-button"
                            v-on="on"
                            :to="`/i/${institutionId}/p/${publisherId}`"
                    >
                        <v-icon color="#777">
                            {{(publisherIsOwnedByConsortium) ? "mdi-package-up" : "mdi-package-variant" }}
                        </v-icon>
                        <template v-if="scenarioName">
                            <v-icon color="#777" small>mdi-chevron-right</v-icon>
                        </template>
                        <span v-if="!scenarioName" class="pl-2 pr-2 text-h6">
                            {{ publisherName }}
                        </span>
                        <v-chip
                                small
                                v-if="publisherIsOwnedByConsortium"
                        >
                            consortial feeder
                        </v-chip>
                        <span outlined class="pr-5" v-if="!scenarioName"></span>
                    </v-btn>
                </template>
                <div v-if="publisherName">
                    <v-list class="pb-0" dense>
                        <v-list-item :to="`/i/${institutionId}/p/${publisherId}`">
                            <v-list-item-icon>
                                <v-icon class="mt-4">
                                    {{(publisherIsOwnedByConsortium) ? "mdi-package-up" : "mdi-package-variant" }}
                                </v-icon>
                            </v-list-item-icon>
                            <v-list-item-content class="font-weight-bold">
                                <div>
                                    <div class="body-2 mb-1">
                                        Current package:
                                    </div>
                                    <div  class="d-flex justify-space-between">
                                        {{publisherName}}
                                        <v-chip
                                                x-small
                                                v-if="publisherIsOwnedByConsortium"
                                                class="font-weight-regular ml-2"
                                        >
                                            consortial feeder
                                        </v-chip>
                                    </div>
                                </div>
                            </v-list-item-content>
                        </v-list-item>
                        <template v-if="publishersOtherThanCurrent.length">
                            <v-subheader class="body-2 mt-2">Other packages ({{publishersOtherThanCurrent.length}}):
                            </v-subheader>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                    <div style="overflow: scroll; max-height: 500px;">
                        <v-list dense>
                            <v-list-item
                                    v-for="pub in publishersOtherThanCurrent"
                                    :key="pub.id"
                                    :to="`/i/${institutionId}/p/${pub.id}`"
                            >
                                <v-list-item-icon>
                                    <v-icon>
                                        {{(pub.is_owned_by_consortium) ? "mdi-package-up" : "mdi-package-variant" }}
                                    </v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <div  class="d-flex justify-space-between">
                                    {{pub.name}}
                                        <v-chip
                                                x-small
                                                v-if="pub.is_owned_by_consortium"
                                                class="font-weight-regular ml-2"
                                        >
                                            consortial feeder
                                        </v-chip>
                                    </div>
<!--                                    <div class="caption">-->
<!--                                        {{pub.publisher}}-->
<!--                                    </div>-->
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </div>

                </div>
            </v-menu>


            <!--            SCENARIO                                          -->
            <!--*****************************************************************-->
            <v-menu v-if="scenarioId" open-on-hover max-height="500" offset-y content-class="no-highlight">
                <template v-slot:activator="{on}">
                    <v-btn
                            text
                            class="low-key-button no-highlight breadcrumb-button"
                            v-on="on"
                    >
                        <v-icon color="#777">
                            mdi-chart-box-outline
                        </v-icon>
                        <span class="pl-2 pr-5 text-h6">
                            {{ scenarioName }}
                        </span>
                    </v-btn>
                </template>
                <div v-if="scenarioName">
                    <v-list class="pb-0" dense>
                        <v-list-item :to="`./${scenarioId}`">
                            <v-list-item-icon>
                                <v-icon class="mt-4">mdi-chart-box-outline</v-icon>
                            </v-list-item-icon>
                            <v-list-item-content class="font-weight-bold">
                                <div>
                                    <div class="body-2 mb-1">
                                        Current scenario:
                                    </div>
                                    <div>
                                        {{scenarioName}}

                                    </div>

                                </div>
                            </v-list-item-content>
                        </v-list-item>

                        <template v-if="scenariosOtherThanCurrent.length">
                            <v-subheader class="body-2 mt-2">Other scenarios ({{ scenariosOtherThanCurrent.length }}):
                            </v-subheader>
                            <v-divider></v-divider>
                        </template>
                    </v-list>
                    <div style="overflow: scroll; max-height: 500px;">
                        <v-list dense>
                            <v-list-item
                                    v-for="scenario in scenariosOtherThanCurrent"
                                    :key="scenario.id"
                                    :to="`/i/${institutionId}/p/${publisherId}/s/${scenario.id}`"
                            >
                                <v-list-item-icon>
                                    <v-icon>mdi-chart-box-outline</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <span v-if="scenario.saved">
                                        {{scenario.saved.name}}
                                    </span>
                                    <span v-if="!scenario.saved">
                                        Loading scenario...
                                    </span>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </div>

                </div>
            </v-menu>


        </v-toolbar-items>


        <div class="no-highlight ml-8 hidden-sm-and-down" v-if="!isLoggedIn">
            <v-menu offset-y content-class="no-highlight">
                <template v-slot:activator="{on}">
                    <v-btn text color="" v-on="on" class="">
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

            <v-btn text href="http://help.unsub.org/en/" target="_blank" class="mx-1">
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
            <app-bar-ext-scenario v-if="scenarioName" />

<!--            <app-bar-ext-publisher />-->
            <app-bar-ext-institution />
        </template>


    </v-app-bar>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import AppBarExtScenario from "./AppBarExtScenario";
    import AppBarExtPublisher from "./AppBarExtPublisher";
    import AppBarExtInstitution from "./AppBarExtInstitution";

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
            AppBarExtScenario,
            AppBarExtPublisher,
            AppBarExtInstitution,

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
                'isLoggedIn',

                "userName",
                "userEmail",

                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                'userConsortia',
                'userInstitutions',

                'publisherId',
                'publisherName',
                'institutionPublishers',
                'publisherPublisher',
                'publisherIsOwnedByConsortium',

                'scenarioId',
                'scenarioName',
                'publisherScenarios',
                'selectedScenarioIsLoading',

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
            orgs() {
                return this.userConsortia.concat(this.userInstitutions)
            },
            orgsOtherThanCurrent() {
                return this.orgs.filter(i => {
                    return i.institution_id !== this.institutionId
                })
            },
            userHasAConsortium() {
                return this.orgs.find(org => {
                    return org.is_consortium
                })
            },
            publishersOtherThanCurrent() {
                const ret = this.institutionPublishers.filter(p => {
                    return p.id !== this.publisherId
                }).sort((a, b) => {
                    console.log("sorting", a, b)
                    return a.is_owned_by_consortium - b.is_owned_by_consortium
                })

                console.log("publishersOtherThanCurrent", ret)
                return ret
            },
            scenariosOtherThanCurrent() {
                return this.publisherScenarios.filter(s => {
                    return s.id !== this.scenarioId
                })
            }
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
    .breadcrumb-button {
        min-width: 0 !important;
        padding: 0 2px 0 7px !important;
        /*span.big-text {*/
        /*    !*font-weight: bold;*!*/
        /*    font-size: 18px;*/
        /*}*/
    }


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