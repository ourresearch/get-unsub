<template>
    <v-container fluid class="pkg pa-0 ma-0" v-if="scenario">


        <v-row>
            <v-col cols="2" class="pa-0">
                <v-navigation-drawer permanent>
                    <v-list dense>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{scenario.summary.use_instant_percent}}% Instant access
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{scenario.summary.cost_percent}}% Cost
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title>
                                    {{scenario.summary.num_journals_subscribed}} Subscriptions
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-item-group v-model="selectedTabIndex">
                            <v-list-item v-for="(tab, i) in tabs" :key="i">
                                <v-list-item-icon>
                                  <v-icon>mdi-account</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                    <v-list-item-title v-text="tab.displayName"></v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>

                </v-navigation-drawer>


<!--                <div class="summary">-->
<!--                    <div class="loading" v-if="summaryLoading">summary loading</div>-->
<!--                    <div class="loaded" v-if="!summaryLoading">-->
<!--                        subscribed journals: {{scenario.summary.num_journals_subscribed}}-->
<!--                        %instant access: {{scenario.summary.use_instant_percent }}-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div v-for="tab in tabs"-->
<!--                     @click="setTab(tab.name)"-->
<!--                     :key="tab.name">-->
<!--                    {{tab.displayName}}-->
<!--                </div>-->
            </v-col>

            <v-col>
                <breadcrumbs></breadcrumbs>

                <slider-tab :data="tabData" v-if="selectedTabIndex===0"></slider-tab>
                <single-journal-tab :data="tabData" v-if="selectedTabIndex===1"></single-journal-tab>
                <configs-tab :data="scenario.configs" v-if="selectedTabIndex===2"></configs-tab>
                <costs-tab :data="tabData" v-if="selectedTabIndex===3"></costs-tab>
                <apcs-tab :data="tabData" v-if="selectedTabIndex===4"></apcs-tab>
                <fulfillment-tab :data="tabData" v-if="selectedTabIndex===5"></fulfillment-tab>
                <timeline-tab :data="tabData" v-if="selectedTabIndex===6"></timeline-tab>
                <journals-tab :data="tabData" v-if="selectedTabIndex===7"></journals-tab>
                <sharing-tab :data="tabData" v-if="selectedTabIndex===8"></sharing-tab>

            </v-col>
        </v-row>


    </v-container>
</template>

<script>
    import axios from 'axios'
    import Breadcrumbs from "../components/Breadcrumbs"

    import SliderTab from "./ScenarioTabs/SliderTab"
    import SingleJournalTab from "./ScenarioTabs/SingleJournalTab"
    import ConfigsTab from "./ScenarioTabs/ConfigsTab"
    import CostsTab from "./ScenarioTabs/CostsTab"
    import ApcsTab from "./ScenarioTabs/ApcsTab"
    import FulfillmentTab from "./ScenarioTabs/FulfillmentTab"
    import TimelineTab from "./ScenarioTabs/TimelineTab"
    import JournalsTab from "./ScenarioTabs/JournalsTab"
    import SharingTab from "./ScenarioTabs/SharingTab"

    export default {
        name: "Pkg",
        components: {
            Breadcrumbs,
            SliderTab,
            SingleJournalTab,
            ConfigsTab,
            CostsTab,
            ApcsTab,
            FulfillmentTab,
            TimelineTab,
            JournalsTab,
            SharingTab
        },
        data() {
            return {
                scenario: null,
                tabData: null,
                tabs: [
                    {name: "slider", displayName: "Best deal"},
                    {name: "singleJournal", displayName: "Single Journal", hideOnMenu: true},
                    {name: "configs", displayName: "Configs"},
                    {name: "costs", displayName: "Costs"},
                    {name: "apc", displayName: "APCs"},
                    {name: "fulfillment", displayName: "Fulfillment"},
                    {name: "timeline", displayName: "Timeline"},
                    {name: "journals", displayName: "Journals list"},
                    {name: "sharing", displayName: "Sharing"},
                ],
                selectedTabIndex: 0,
                baseUrl: "https://unpaywall-jump-api.herokuapp.com/scenario/{key}?package=demo",

                summaryLoading: false,
                tabLoading: false,



            }
        },
        methods: {
            setTabData(tabName) {
                console.log("setting tab data")
            },
            updateSummary(){
                const url = this.baseUrl.replace("{key}", "summary")
                console.log("updating summary", url)
                this.summaryLoading = true
                axios.post(url, this.scenario)
                    .then(resp => {
                        this.scenario.summary = resp.data._summary
                    })
                    .catch(err => {
                        console.log("got error from updateSummary", url, err)
                    })
                    .finally(()=>this.summaryLoading=false)
            },
            getTabData(){
                this.tabLoading = true
                const tabName = "apc"
                const url = this.baseUrl.replace("{key}", tabName)
                console.log("loading tab data", tabName)

                axios.post(url, this.scenario)
                    .then(resp => {
                        this.tabData = resp.data
                    })
                    .catch(err => {
                        console.log("got error from getTabData()", url, err)
                    })
                    .finally(()=>this.tabLoading=false)
            }
        },
        computed: {
            count() {
            },
            account() {
                return this.$store.state.account
            },
            pkg(){
                return this.$store.getters.selectedPkg
            },
        },
        created(){
        },
        mounted() {
            console.log("scenario: mount up")
            const userId = this.$route.params.userId
            const pkgId = this.$route.params.pkgId
            const scenarioId = this.$route.params.scenarioId
            const tabId = this.$route.params.tabId




            this.$store.commit("selectPkg", pkgId)
            this.$store.commit("selectScenario", scenarioId)

            this.scenario = {...this.$store.state.selectedScenario}
            this.updateSummary()
        },
        watch: {
            selectedTabIndex: function(to, from) {
                console.log("tab change", to)
                this.getTabData()
            }
        }
    }
</script>

<style scoped>

</style>