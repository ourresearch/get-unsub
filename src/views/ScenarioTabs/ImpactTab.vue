<template>
    <v-container fluid class="tab">
        <h2 class="display-3">Institutional Value</h2>
        <pre>{{data}}</pre>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "ImpactTab"
    }
</script>

<style scoped>

</style>