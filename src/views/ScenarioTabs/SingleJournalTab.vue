<template>
    <v-container fluid class="tab">
        <h2 class="display-3">Single Journal</h2>
        <pre>{{data}}</pre>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "SingleJournalTab"
    }
</script>

<style scoped>

</style>