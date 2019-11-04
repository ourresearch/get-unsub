<template>
    <div v-if="$store.state.selectedScenario">




        <journals-tab></journals-tab>



<!--        <configs-tab :data="scenario.configs"  v-if="activeTabName==='configs'"></configs-tab>-->

<!--        <sharing-tab :data="tabData"  v-if="activeTabName==='sharing'"></sharing-tab>-->


    </div>
</template>

<script>
    import axios from 'axios'

    import SliderTab from "./ScenarioTabs/SliderTab"
    import SingleJournalTab from "./ScenarioTabs/SingleJournalTab"
    import JournalsTab from "./ScenarioTabs/JournalsTab"
    import SharingTab from "./ScenarioTabs/SharingTab"

    export default {
        name: "Pkg",
        components: {
            SliderTab,
            SingleJournalTab,
            JournalsTab,
            SharingTab
        },
        data() {
            return {
            }
        },
        methods: {
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
            const pkgId = this.$route.params.pkgId
            const scenarioId = this.$route.params.scenarioId

            this.$store.commit("selectPkg", pkgId)
            this.$store.commit("selectScenario", scenarioId)
            this.$store.dispatch("setTabData", "journals")
            this.$store.dispatch("updateSummary")


        },
        watch: {
        }
    }
</script>

<style  lang="scss">
    .tab.loading {
        opacity: .5;
        transition: opacity .25s ease-in-out;
    }

</style>