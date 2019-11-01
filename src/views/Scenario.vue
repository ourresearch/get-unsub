<template>
    <v-container fluid class="pkg pa-0 ma-0" v-if="$store.state.selectedScenario">


        <slider-tab :data="tabData"
                    v-if="$store.state.scenarioTab==='slider'">
        </slider-tab>

        <journals-tab :data="tabData"
                      @update="updateTabData"
                      v-if="$store.state.scenarioTab==='journals'">

        </journals-tab>



<!--        <configs-tab :data="scenario.configs"  v-if="activeTabName==='configs'"></configs-tab>-->

<!--        <sharing-tab :data="tabData"  v-if="activeTabName==='sharing'"></sharing-tab>-->


    </v-container>
</template>

<script>
    import axios from 'axios'

    import SliderTab from "./ScenarioTabs/SliderTab"
    import SingleJournalTab from "./ScenarioTabs/SingleJournalTab"
    import ConfigsTab from "./ScenarioTabs/ConfigsTab"
    import JournalsTab from "./ScenarioTabs/JournalsTab"
    import SharingTab from "./ScenarioTabs/SharingTab"

    export default {
        name: "Pkg",
        components: {
            SliderTab,
            SingleJournalTab,
            ConfigsTab,
            JournalsTab,
            SharingTab
        },
        data() {
            return {
                scenario: null,
                tabData: null,
                baseUrl: "https://unpaywall-jump-api.herokuapp.com/scenario/{key}?package=demo",

                summaryLoading: false,
                tabLoading: false,
            }
        },
        methods: {
            setTabData(tabName) {
                console.log("setting tab data")
            },
            getPageData(){
                this.updateTabData(this.activeTabName)
            },
            updateTabData(endpoint){
                this.tabLoading = true
                const url = this.baseUrl.replace("{key}", endpoint)
                console.log("loading tab data", this.activeTabName)

                axios.post(url, this.$store.state.selectedScenario)
                    .then(resp => {
                        this.tabData = resp.data
                        console.log("got tab data", resp.data)
                    })
                    .catch(err => {
                        console.log("got error from getPageData()", url, err)
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
            activeTabName(){
                return this.$store.state.scenarioTab
            }
        },
        created(){
        },
        mounted() {
            console.log("scenario: mount up")
            const pkgId = this.$route.params.pkgId
            const scenarioId = this.$route.params.scenarioId

            this.$store.commit("selectPkg", pkgId)
            this.$store.commit("selectScenario", scenarioId)

            this.getPageData()
        },
        watch: {
            activeTabName: function(to, from) {
                this.tabData = null
                this.getPageData()
            },
        }
    }
</script>

<style scoped lang="scss">
    .summary {
        &.loading {
            opacity: .1;
        }
    }

</style>