


<template>
    <div class="breadcrumbs">
        <v-btn icon small text :to="`/a/${account.id}`" active-class="">
            <v-icon>mdi-account</v-icon>
        </v-btn>
        <v-icon v-if="selectedPkg">mdi-chevron-right</v-icon>
        <v-btn icon small text v-if="selectedPkg" text :to="`/a/${account.id}/${selectedPkg.id}`">
            <v-icon>mdi-package-variant</v-icon>
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
                return this.$store.state.user
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

<style scoped lang="scss">
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

</style>