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

        <v-toolbar-items class="account breadcrumbs" v-if="institutionName">
            <v-btn class="px-5" text :to="`/i/${institutionId}`">
                <v-icon color="grey darken-2" small class="pr-2">mdi-bank</v-icon>
                <span class="title">
                    {{ institutionName }}

                </span>

            </v-btn>
        </v-toolbar-items>

        <v-spacer/>
        <div class="no-highlight">
            <v-btn text color="primary" v-if="!$store.getters.isUserSubscribed" to="/purchase">
                Buy
            </v-btn>



            <v-btn class="breadcrumbs" text to="/login" v-if="!isLoggedIn">Log in</v-btn>
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
            <v-btn icon to="/support" v-if="!scenarioName">
                <v-icon>mdi-help-circle-outline</v-icon>
            </v-btn>
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
                'institutionName',
                'institutionId',
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


</style>