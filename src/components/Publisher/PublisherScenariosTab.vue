<template>
    <v-card flat class="">
        <v-list id="scenarios-list" v-if="publisherScenariosAreAllLoaded">
            <v-list-item>
                <v-list-item-content class="pb-0">
                    <v-row align="end" class="caption font-weight-bold" style="cursor: default;">
                        <v-col cols="6" class="pb-0">
                            Name
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="2" class="text-right pr-5 pb-0">
                            <v-tooltip bottom max-width="400" color="#333">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">
                                        Annual cost
                                    </span>
                                </template>
                                <div>
                                    Five-year average annual cost to the library, including ILL and a-la-carte subscription costs.
                                </div>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="1" class="text-center pb-0">
                            <v-tooltip bottom max-width="400" color="#333">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">
                                        Instant fulfillment
                                    </span>
                                </template>
                                <div>
                                    Percentage of article requests the library can fulfill <em>instantly</em> over the next five years (via subscription, backfile, or OA).
                                </div>
                            </v-tooltip>

                        </v-col>
                        <v-col cols="1" class="text-center pb-0">
                            <v-tooltip bottom max-width="400" color="#333">
                                <template v-slot:activator="{ on }">
                                    <span v-on="on">
                                        Subscribed journals
                                    </span>
                                </template>
                                <div>
                                    Number of journal subscriptions retained (via a-la-carte subscription) after cancelling Big Deal.
                                </div>
                            </v-tooltip>
                        </v-col>
                        <v-col cols="1"></v-col>

                    </v-row>
                </v-list-item-content>
                <v-list-item-action></v-list-item-action>
            </v-list-item>

            <publisher-scenario-row
                    v-for="scenario in publisherScenarios"
                    :scenario="scenario"
            >
            </publisher-scenario-row>

            <v-fade-transition>
                <v-list-item
                        @click="openCreateDialog"
                        key="add-scenario"
                        id="new-scenario-button"
                >
                    <v-list-item-avatar size="50">
                        <v-btn icon>
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title class="body-2 text--secondary">
                            New scenario
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-fade-transition>


        </v-list>


    </v-card>


</template>


<script>
    import _ from "lodash"
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import publisherFileUploadConfigs from "../PublisherFile/publisherFileConfigs";

    import PublisherScenarioRow from "./PublisherScenarioRow";


    export default {
        name: "PublisherScenariosTab",
        components: {
            PublisherScenarioRow,
        },
        props: {},
        data() {
            return {}
        },
        methods: {
            ...mapMutations([
                "openCreateDialog",
            ]),
        },
        computed: {
            ...mapGetters([
                "institutionId",

                "pkgId",
                "publisherName",
                "publisherScenarios",
                "publisherScenariosAreAllLoaded",
                "publisherId",
                "publisherBigDealCost",
                "publisherFiles",
            ]),
        },
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style lang="scss">


</style>