<template>
    <v-tabs align-with-title>
        <v-tab>Tab 1</v-tab>
        <v-tab>Tab 2</v-tab>
        <v-tab>Tab 3</v-tab>
    </v-tabs>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtInstitution",
        components: {},
        data() {
            return {
                foo: 42
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
        },
        created() {
        },
        mounted() {
        },
        watch: {
            "$route": {
                immediate: true,
                handler: function (to, from) {

                }
            }
        }
    }
</script>

<style lang="scss">


</style>