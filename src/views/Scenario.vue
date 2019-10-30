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

            <v-col cols="10">
                <breadcrumbs></breadcrumbs>
                <div class="body-1">{{scenario.subrs.join(",")}}</div>

                <slider-tab :data="tabData"
                            :scenario="scenario"
                            v-if="activeTabName==='slider'">
                </slider-tab>

                <single-journal-tab :data="tabData"  v-if="activeTabName==='single-journal'"></single-journal-tab>
                <configs-tab :data="scenario.configs"  v-if="activeTabName==='configs'"></configs-tab>
                <costs-tab :data="tabData" v-if="activeTabName==='costs'"></costs-tab>
                <apcs-tab :data="tabData" v-if="activeTabName==='apcs'"></apcs-tab>
                <fulfillment-tab :data="tabData" v-if="activeTabName==='fulfillment'"></fulfillment-tab>
                <timeline-tab :data="tabData"  v-if="activeTabName==='timeline'"></timeline-tab>
                <journals-tab :data="tabData"  v-if="activeTabName==='journals'"></journals-tab>
                <sharing-tab :data="tabData"  v-if="activeTabName==='sharing'"></sharing-tab>
                <impact-tab :data="tabData"  v-if="activeTabName==='impact'"></impact-tab>

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
    import ImpactTab from "./ScenarioTabs/ImpactTab"

    export default {
        name: "Pkg",
        components: {
            ImpactTab,
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
                    {name: "slider", displayName: "Best deal", api:true,},
                    {name: "costs", displayName: "Costs", api:true,},
                    {name: "apc", displayName: "APCs", api:true,},
                    {name: "fulfillment", displayName: "Fulfillment", api:true,},
                    {name: "timeline", displayName: "Timeline", api:true,},
                    {name: "impact", displayName: "Institutional value", api:true,},
                    {name: "journals", displayName: "Journals list", api:true,},
                    {name: "singleJournal", displayName: "Single Journal", api:false,},
                    {name: "configs", displayName: "Configs", api:false,},
                    {name: "sharing", displayName: "Sharing", api:false,},
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
                        console.log("summary response:", this.scenario.summary)
                    })
                    .catch(err => {
                        console.log("got error from updateSummary", url, err)
                    })
                    .finally(()=>this.summaryLoading=false)
            },
            getTabData(){
                if (!this.activeTab.api) return false
                this.tabLoading = true
                this.tabData = null
                const url = this.baseUrl.replace("{key}", this.activeTabName)
                console.log("loading tab data", this.activeTabName)

                axios.post(url, this.scenario)
                    .then(resp => {
                        this.tabData = resp.data
                        console.log("got tab data", resp.data)
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
            activeTab(){
                return this.tabs[this.selectedTabIndex]
            },
            activeTabName(){
                return this.activeTab.name
            }
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
                this.getTabData()
            },
            'scenario.configs': {
                deep: true,
                handler: function(to){
                    console.log("scenario configs just done changed", to)
                    this.updateSummary()
                }
            },
            'scenario.subrs': {
                handler: function(to){
                    console.log("scenario subrs just done changed", to)
                    this.updateSummary()
                }
            }
        }
    }
</script>

<style scoped>

</style>