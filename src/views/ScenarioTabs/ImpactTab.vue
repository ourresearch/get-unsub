<template>
    <v-container fluid class="tab">
        <v-row>
            header stuff
        </v-row>
        <v-row>

        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "ImpactTab",
        computed: {
            tableHeaders(){
                return this.data.headers
            }

        }
    }
</script>

<style scoped>

</style>