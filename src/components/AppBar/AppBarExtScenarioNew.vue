<template>
    <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">5yr forecast</v-tab>
        <v-tab class="low-key-button">Parameters</v-tab>
        <v-tab class="low-key-button">Export</v-tab>
    </v-tabs>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtScenarioNew",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
                "userEmail"
            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.scenarioTabShowing
                },
                set(newVal) {
                    this.$store.commit("setScenarioTabShowing", newVal)
                }
            }
        },
        created() {
            this.currentTab = 0
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>