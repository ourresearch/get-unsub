<template>
    <div class="breadcrumbs">
        <v-btn text :to="`/a/${account.urlName}`">
            <v-icon left>mdi-account</v-icon>
            {{account.name}}
        </v-btn>
        <v-icon v-if="selectedPkg">mdi-chevron-right</v-icon>
        <v-btn v-if="selectedPkg" text :to="`/a/${account.urlName}/${selectedPkg.urlName}`">
            <v-icon left>mdi-package-variant</v-icon>
            {{selectedPkg.name}}
        </v-btn>
        <v-icon v-if="selectedScenario">mdi-chevron-right</v-icon>
        <v-btn v-if="selectedScenario" text>
            <v-icon left>mdi-chart-bar</v-icon>
            {{selectedScenario.name}}
        </v-btn>


    </div>
</template>

<script>
    export default {
        name: "Breadcrumbs",
        computed: {
            account(){
                return this.$store.state.account
            },
            selectedPkg(){
                return this.$store.getters.selectedPkg
            },
            selectedScenario(){
                return this.$store.getters.selectedScenario
            },
        }
    }
</script>

<style scoped>

</style>