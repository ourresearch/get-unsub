<template>
    <v-card flat class="">
        <v-list id="scenarios-list" v-if="publisherScenariosAreAllLoaded">

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
            return {

            }
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