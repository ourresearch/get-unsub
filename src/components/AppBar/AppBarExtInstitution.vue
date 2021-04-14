<template>
    <v-tabs class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">Packages</v-tab>
        <v-tab class="low-key-button">Users</v-tab>
        <v-tab class="low-key-button">ROR ID</v-tab>
        <v-tab class="low-key-button">Consortial</v-tab>
    </v-tabs>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtInstitution",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
                'isLandingPage',
                'isLoggedIn',

                "userName",
                "userEmail",

                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                'userConsortia',
                'userInstitutions',

                'publisherId',
                'publisherName',
                'institutionPublishers',
                'publisherPublisher',
                'publisherIsOwnedByConsortium',

                'scenarioId',
                'scenarioName',
                'publisherScenarios',
                'selectedScenarioIsLoading',

            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.institutionTabShowing
                },
                set(newVal) {
                    this.$store.commit("setInstitutionTabShowing", newVal)
                }
            }
        },
        created() {
            this.currentTab = 0
        },
        mounted() {
        },
        watch: {
            "currentTab": {
                immediate: true,
                handler: function (to, from) {
                    console.log("AppBar: currentTab changd", to)
                    // this.$store.commit("setInstitutionTabShowing", to)
                }
            }
        }
    }
</script>

<style lang="scss">


</style>