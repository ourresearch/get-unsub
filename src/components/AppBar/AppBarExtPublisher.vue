<template>
    <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">Forecast scenarios</v-tab>
        <v-tab class="low-key-button">APCs</v-tab>
        <v-tab class="low-key-button">Setup</v-tab>
    </v-tabs>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtPublisher",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.publisherTabShowing
                },
                set(newVal) {
                    this.$store.commit("setPublisherTabShowing", newVal)
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