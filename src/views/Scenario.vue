<template>
    <div v-if="$store.state.selectedScenario">




        <journals-tab></journals-tab>
        <sharing-tab></sharing-tab>


<v-dialog class="tab" v-model="$store.state.wizardOpen && this.$store.state.wizardData">
        <v-card>
            <v-toolbar dark color="primary">
                <v-toolbar-title>
                    <span v-if="$store.getters.wizardLoading">Loading the</span>
                    Subscription Wizard
                    <span v-if="$store.getters.wizardLoading">...</span>
                </v-toolbar-title>
                <v-progress-linear
                        :active="$store.getters.wizardLoading"
                        :indeterminate="$store.getters.wizardLoading"
                        absolute
                        bottom
                        color="white"
                ></v-progress-linear>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="$store.commit('clearWizard')">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-items>
                    <!--                        <v-btn dark text @click="dialog = false">Save</v-btn>-->
                </v-toolbar-items>

            </v-toolbar>

            <slider-tab :data="this.$store.state.wizardData"></slider-tab>


        </v-card>
</v-dialog>



<!--        <configs-tab :data="scenario.configs"  v-if="activeTabName==='configs'"></configs-tab>-->

<!--        <sharing-tab :data="tabData"  v-if="activeTabName==='sharing'"></sharing-tab>-->


    </div>
</template>

<script>
    import axios from 'axios'

    import SliderTab from "./ScenarioTabs/SliderTab"
    import JournalsTab from "./ScenarioTabs/JournalsTab"
    import SharingTab from "./ScenarioTabs/SharingTab"

    export default {
        name: "Pkg",
        components: {
            SliderTab,
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