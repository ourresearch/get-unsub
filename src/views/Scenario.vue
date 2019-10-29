<template>
    <v-container fluid class="pkg" v-if="scenario">
        <v-row>
            <v-col cols="2">
                <div class="summary">
                    <div class="loading" v-if="summaryLoading">summary loading</div>
                    <div class="loaded" v-if="!summaryLoading">
                        subscribed journals: {{scenario.summary.num_journals_subscribed}}
                        %instant access: {{scenario.summary.use_instant_percent }}
                    </div>
                </div>
                <div v-for="tab in tabs"
                     @click="setTab(tab.name)"
                     :key="tab.name">
                    {{tab.displayName}}
                </div>
            </v-col>
            <v-col>
                <breadcrumbs></breadcrumbs>

                <pre>{{scenario}}</pre>
            </v-col>
        </v-row>


    </v-container>
</template>

<script>
    import axios from 'axios'
    import Breadcrumbs from "../components/Breadcrumbs"

    export default {
        name: "Pkg",
        components: {Breadcrumbs},
        data() {
            return {
                scenario: null,
                apiData: null,
                tabs: [
                    {name: "slider", displayName: "Best deal"},
                    {name: "singleJournal", displayName: "Single Journal", hideOnMenu: true},
                    {name: "config", displayName: "Configs"},
                    {name: "costs", displayName: "Costs"},
                    {name: "apcs", displayName: "APCs"},
                    {name: "fulfillment", displayName: "Fulfillment"},
                    {name: "timeline", displayName: "Timeline"},
                    {name: "journals", displayName: "Journals list"},
                    {name: "sharing", displayName: "Sharing"},
                ],
                selectedTab: {name: "slider", displayName: "Best deal"},
                baseUrl: "https://unpaywall-jump-api.herokuapp.com/scenario/{key}?package=demo",

                summaryLoading: false,



            }
        },
        methods: {
            setTab(tabName){
                const url = "/a/"
                    + this.$route.params.userId + "/"
                    + this.$route.params.pkgId + "/"
                    + this.$route.params.scenarioId + "/"
                    + tabName


                this.$router.push(url)

            },
            setTabData(tabName) {
                console.log("setting tab data")
            },
            updateSummary(){
                const url = this.baseUrl.replace("{key}", "summary")
                console.log("updating summary", url)
                this.summaryLoading = true
                axios.post(url, this.scenario)
                    .then(resp => {
                        console.log("got summary back", resp.data._summary)
                        this.scenario.summary = resp.data._summary
                    })
                    .catch(err => {
                        console.log("got error from updateSummary", url, err)
                    })
                    .finally(()=>this.summaryLoading=false)

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
    }
</script>

<style scoped>

</style>