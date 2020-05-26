<template>
    <div>
        <v-tooltip
                max-width="400"
                color="#333"
                bottom
        >
            <template v-slot:activator="{on}">
                <span v-on="on" v-html="anchor" />
            </template>
            <div >
                <slot></slot>
            </div>
        </v-tooltip>
    </div>
</template>

<script>

    export default {
        name: "QuickTooltip",
        props: ["anchor", "tip"],
        computed: {

        },
    }
</script>

<style scoped>

</style>