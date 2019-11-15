<template>
    <div v-if="scenario">
        hi scenario APCs



    </div>
</template>

<script>
    import axios from 'axios'


    export default {
        name: "ApcTab",
        components: {
        },
        data() {
            return {
            }
        },
        methods: {
        },
        computed: {
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
            console.log("scenario overview: mount up")
            const pkgId = this.$route.params.pkgId
            const scenarioId = this.$route.params.scenarioId

            this.$store.dispatch("fetchPkg", pkgId)
            this.$store.dispatch("fetchScenario", scenarioId)
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