<template>
    <v-container fluid class="tab" v-if="showMe">
        <h2 class="display-3">Sharing</h2>
        <pre></pre>
    </v-container>
</template>

<script>
    export default {
        props: [],

        name: "SharingTab",
        computed: {
            showMe() {
                return this.$store.getters.currentScenarioPage === 'report'
            },
        }
    }
</script>

<style scoped>

</style>