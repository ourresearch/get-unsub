<template>
    <div v-if="scenario">
        hi scenario



<!--        <journals-tab></journals-tab>-->
<!--        <sharing-tab></sharing-tab>-->





<!--        <configs-tab :data="scenario.configs"  v-if="activeTabName==='configs'"></configs-tab>-->

<!--        <sharing-tab :data="tabData"  v-if="activeTabName==='sharing'"></sharing-tab>-->


    </div>
</template>

<script>
    import axios from 'axios'


    export default {
        name: "Pkg",
        components: {
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
            scenario(){
                return this.$store.getters.selectedScenario
            }
        },
        created(){
        },
        mounted() {
            console.log("scenario: mount up")
            const pkgId = this.$route.params.pkgId
            const scenarioId = this.$route.params.scenarioId

            this.$store.dispatch("fetchPkg", pkgId)
            this.$store.dispatch("fetchScenario", scenarioId)



            // this.$store.dispatch("setTabData", "journals")
            // this.$store.dispatch("updateSummary")


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