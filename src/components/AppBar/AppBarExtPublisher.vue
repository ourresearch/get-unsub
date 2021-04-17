<template>
    <div>
    <v-tabs v-if="publisherName && !publisherIsLoading" class="" v-model="currentTab">
<!--        <v-btn class="" icon><v-icon>mdi-chevron-left</v-icon></v-btn>-->
        <v-tab
                class="low-key-button"
                :disabled="publisherIsFeeder || !publisherCounterIsUploaded"
        >
            Forecast scenarios
        </v-tab>
        <v-tab
                class="low-key-button"
                :disabled="publisherIsFeeder || !publisherCounterIsUploaded"
        >
            APCs
        </v-tab>
        <v-tab
                class="low-key-button"
        >
            Setup
        </v-tab>
    </v-tabs>
    </div>
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
                "publisherIsFeeder",
                "publisherCounterIsUploaded",
                "publisherName",
                "publisherIsLoading",
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