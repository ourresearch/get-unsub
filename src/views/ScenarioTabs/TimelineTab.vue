<template>
    <v-container fluid class="tab">
        <h2 class="display-3">Timeline</h2>
        <pre>{{data}}</pre>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "TimelineTab"
    }
</script>

<style scoped>

</style>