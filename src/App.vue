<template>
    <v-app>


        <v-app-bar app clipped-left>
            <v-toolbar-title class="headline">
                <router-link to="/">
                    <img class="mt-3" style="margin: 12px 28px 0" src="./assets/logo.png" alt="">
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
                    vertical
                    v-if="$store.getters.isLoggedIn"
            ></v-divider>

            <v-toolbar-items class="breadcrumbs" v-if="$store.getters.isLoggedIn">
                <v-btn class="pa-0 pl-4" text :to="`/a/${account.id}`" active-class="">
                    <v-icon left>mdi-account</v-icon>
                    <v-icon v-if="selectedPkg">mdi-chevron-right</v-icon>
                    <span v-if="!selectedPkg">{{account.name}}</span>
                </v-btn>
                <v-btn text class="pl-4" v-if="selectedPkg" :to="`/a/${account.id}/${selectedPkg.id}`">
                    <v-icon left>mdi-package-variant</v-icon>
                    <v-icon v-if="selectedScenario">mdi-chevron-right</v-icon>
                    <span v-if="!selectedScenario">{{selectedPkg.name}}</span>
                </v-btn>
                <v-btn class="pl-4" v-if="selectedScenario" text>
                    <v-icon left>mdi-chart-bar</v-icon>
                    {{selectedScenario.name}}
                </v-btn>


            </v-toolbar-items>


            <v-spacer></v-spacer>

            <v-toolbar-items>
                <v-btn text color="primary" to="/purchase">Pricing</v-btn>
                <v-btn text to="/support">Help</v-btn>
                <v-btn text to="/login" v-if="!$store.getters.isLoggedIn">Log in</v-btn>

                <v-btn text
                       v-if="summary"
                       class="px-2 toolbar-summary"
                       @click="$store.commit('toggleConfigsOpen')">
                    <v-icon>mdi-settings</v-icon>
                </v-btn>
            </v-toolbar-items>

            <div class="not-logged-in pl-2" v-if="!$store.getters.isLoggedIn">
            </div>

            <div class="logged-in title" v-if="$store.getters.isLoggedIn && summary">
            </div>

            <!--            <div class="logged-in" v-if="$store.getters.isLoggedIn">-->
            <!--                <v-btn text icon @click="drawerRight = !drawerRight">-->
            <!--                    <v-icon>mdi-settings</v-icon>-->
            <!--                </v-btn>-->
            <!--            </div>-->


        </v-app-bar>


        <v-navigation-drawer v-if="summary" dark v-model="$store.state.configsOpen" app right class="pt-12">
            <v-toolbar absolute width="100%">
                <v-toolbar-title>
                    <v-icon small>mdi-pencil-outline</v-icon>
                    Edit Configs
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="$store.commit('clearConfigsOpen')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>

            </v-toolbar>
            <configs class="pt-4"></configs>
        </v-navigation-drawer>


        <v-navigation-drawer v-if="summary" clipped app left dark>

            <v-list>
                <v-list-item>
                    Cost
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.cost_percent | round()}}%
                    </strong>

                    <vc-donut
                            v-if="summary.cost_percent"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value:summary.cost_percent, color: '#ffffff'}]"
                    ></vc-donut>

                </v-list-item>
                <v-list-item>
                    Instant access
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.use_instant_percent | round()}}%
                    </strong>

                    <vc-donut
                            v-if="summary.use_free_instant_percent"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value:summary.use_free_instant_percent, color: '#50aa06'}, {value:summary.use_subscription_percent, color: 'dodgerblue'}, ]"
                    ></vc-donut>

                </v-list-item>
                <v-list-item>
                    Subscriptions
                    <v-spacer></v-spacer>
                    <strong>
                        {{summary.num_journals_subscribed | round()}}
                    </strong>

                    <vc-donut
                            v-if="summary.num_journals_subscribed >= 0"
                            class="ml-2"
                            foreground="grey"
                            background="#424242"
                            :size="20"
                            :thickness="50"
                            :sections="[{value: 100 * summary.num_journals_subscribed / summary.num_journals_total, color: 'dodgerblue'}]"
                    ></vc-donut>

                </v-list-item>

            </v-list>




            <v-divider></v-divider>


            <v-list>
                <!--                            <v-subheader>VIEWS</v-subheader>-->
                <v-list-item-group v-model="$store.state.tabDataIndex">

                    <template v-for="(view, i) in $store.getters.journalViews"
                    >
                        <v-list-item
                                @click="$store.dispatch('setTabData', view.value)"

                        >
                            <!--                                    <v-list-item-icon>-->
                            <!--                                        <v-icon v-text="view.icon">{{view.icon}}</v-icon>-->
                            <!--                                    </v-list-item-icon>-->

                            <v-list-item-content>
                                <v-list-item-title v-text="view.displayName"></v-list-item-title>
                            </v-list-item-content>

                        </v-list-item>

                        <v-divider v-if="view.value==='apc'"></v-divider>
                    </template>
                    <v-list-item @click="$store.commit('openNotSupportedMsg')">
                        <v-list-item-content>
                            <v-list-item-title>
                                Save as copy
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>


                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>


        <v-content style="margin-bottom: 0">

            <router-view></router-view>

            <single-journal></single-journal>
            <startup-tutorial></startup-tutorial>
        </v-content>

        <v-snackbar
                color="warning"
                top
                v-model="$store.state.notSupportedMsgOpen">
            Sorry, that's not supported on the demo account.
            <v-btn text @click="$store.commit('closeNotSupportedMsg')">close</v-btn>
        </v-snackbar>

        <v-snackbar
                top
                :color="$store.state.snackbarColor"
                v-model="$store.state.snackbarIsOpen">
            {{$store.state.snackbarMsg}}
            <v-btn text @click="$store.commit('closeSnackbar')">close</v-btn>
        </v-snackbar>


        <v-footer
                class="text-right main-footer"
        >
            <div class="text-center" style="width:100%">
                <a href="https://github.com/ourresearch/unpaywall-journals">Open Source,</a> made with ❤︎ by <a
                    href="https://ourresearch.org">Our Research.</a> | <a href="mailto:team@ourresearch.org">Contact</a>
            </div>
        </v-footer>


    </v-app>
</template>

<script>
    import Breadcrumbs from "./components/Breadcrumbs"
    import Configs from "./components/Configs"
    import StartupTutorial from "./components/StartupTutorial"
    import SingleJournal from "./components/SingleJournal"
    import SliderTab from "./views/ScenarioTabs/SliderTab"

    export default {
        name: 'App',
        components: {Breadcrumbs, Configs, SingleJournal, SliderTab, StartupTutorial},
        data: () => ({
            drawerRight: false,
            activeViewIndex: 0,
            wizardOpen: false,
        }),
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            loading() {
                return this.$store.state.tabDataLoading
                    || this.$store.getters.wizardLoading
            },
            singleJournalIssnl() {
                return this.$store.state.singleJournalIssnl
            },
            singleJournalData() {
                return this.$store.state.singleJournalData
            },
            account() {
                return this.$store.state.user
            },
            selectedPkg() {
                return this.$store.getters.selectedPkg
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },

        },
        methods: {
            clearSingleJournal() {
                console.log("clear single journal")
                this.$store.commit('clearSingleJournal')
            },
            openWizard() {
                this.$store.dispatch("openWizard")
            }
        }
    };
</script>

<style lang="scss">

    .breadcrumbs {
        .theme--light.v-btn--active::before {
            opacity: 0;
        }

        .theme--light.v-btn {
            text-transform: none !important;
            padding: 0 5px;
        }

        .theme--light.v-btn--active:hover::before {
            opacity: .05;
        }

    }


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

    .main-footer {
        font-size: 14px;

        a {
            color: #333 !important;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }


</style>