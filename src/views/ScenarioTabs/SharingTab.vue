<template>
    <v-container fluid>
        <v-card class="pa-3" v-if="$store.state.tabDataEndpointName === 'report'" fluid>

            <h2 class="display-1">Export scenario</h2>
            <pre>hi i am the report page</pre>
        </v-card>


    </v-container>
</template>

<script>
    export default {
        props: [],

        name: "SharingTab",
        computed: {
            showMe() {
                return this.$store.state.tabDataEndpointName === 'report'
            },
        }
    }
</script>

<style scoped>

</style>