<template>
  <v-container class="pa-0">
    <v-tabs
        v-if="publisherName && !publisherIsLoading"
        class="" v-model="currentTab"
    >
<!--        <v-btn class="" icon><v-icon>mdi-chevron-left</v-icon></v-btn>-->
        <v-tab
                class="low-key-button"
                :disabled="publisherIsFeeder || !publisherCounterIsLive"
        >
          <v-icon small left>mdi-chart-box-outline</v-icon>
            Forecast scenarios
          <span class="ml-1 caption">({{publisherScenarios.length}})</span>
        </v-tab>
        <v-tab
                class="low-key-button"
                :disabled="publisherIsFeeder || !publisherCounterIsLive"
        >
          <v-icon small left>mdi-cash-100</v-icon>
            APCs
        </v-tab>
        <v-tab
                class="low-key-button"
        >
          <v-icon small left>mdi-cog-outline</v-icon>
            Setup
        </v-tab>
    </v-tabs>

  </v-container>
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
                "publisherCounterIsLive",
                "publisherName",
                "publisherIsLoading",
                "publisherScenarios",
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