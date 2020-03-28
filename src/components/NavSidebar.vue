<template>
    <v-navigation-drawer v-if="false" clipped app left dark>

                <vc-donut
                        class="ml-2"
                        foreground="grey"
                        background="#424242"
                        :size="20"
                        :thickness="50"
                        :sections="[{value:20, color: '#50aa06'}, {value:20, color: 'dodgerblue'}, ]"
                />
    </v-navigation-drawer>
</template>

<script>

    export default {
        name: "NavSidebar",
        components: {},
        data() {
            return {}
        },
        methods: {
            increment() {
            }
        },
        computed: {
        },
        created() {
        },
        mounted() {

        },
    }
</script>

<style scoped>

</style>