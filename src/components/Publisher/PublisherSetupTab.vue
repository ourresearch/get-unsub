<template>
    <v-card flat class="pa-3">
        <v-card-title>
            {{publisherName}} Setup
        </v-card-title>
        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    Big Deal Cost
                </div>
                <div class="body-2">
                    The annual cost of your <em>current</em> {{publisherName}} Big Deal. This is used as the default for
                    new Forecast Scenarios.
                </div>
            </v-col>
            <v-col>
                <div class="option-row d-flex">
                    <div class="title pl-7">
                        {{publisherBigDealCost | currency}}
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn outlined>Edit</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>
        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    Download counts
                </div>
                <div class="body-2">
                    Your 2019 COUNTER report
                </div>
            </v-col>
            <v-col>
                <div class="option-row d-flex">
                    <v-icon class="px-2 pt-0">mdi-alert</v-icon>
                    <div class="text">
                        <div class="title">
                            Missing
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn outlined>Upload</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    A-la-carte prices
                </div>
                <div class="body-2">
                    Each journal's cost of individual subscription.
                </div>
            </v-col>
            <v-col>
                <div class="option-row d-flex align-start mb-6">
                    <v-icon class="pa-2">mdi-radiobox-marked</v-icon>
                    <div class="text">
                        <div class="title">
                            Public pricelist
                        </div>
                        <div class="body-2">
                            Prices from the {{publisherName}} public pricelist, as posted online.
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                </div>
                <div class="option-row d-flex align-start">
                    <v-icon class="pa-2">mdi-radiobox-blank</v-icon>
                    <div class="text">
                        <div class="title">
                            Custom pricelist
                        </div>
                        <div class="body-2">
                            Prices from a spreadsheet you upload.
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn outlined disabled>Upload</v-btn>
                </div>
            </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    Perpetual Access dates
                </div>
                <div class="body-2">
                    Each journal's date ranges for which you have perpetual access to articles. Only dates after 2010 affect forecasting.
                </div>
            </v-col>
            <v-col>
                <div class="option-row d-flex align-start mb-6">
                    <v-icon class="pa-2">mdi-radiobox-marked</v-icon>
                    <div class="text">
                        <div class="title">
                            Full perpetual access
                        </div>
                        <div class="body-2">
                            You have perpetual access to all {{publisherName}} backfile content published since 2010.
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                </div>
                <div class="option-row d-flex align-start">
                    <v-icon class="pa-2">mdi-radiobox-blank</v-icon>
                    <div class="text">
                        <div class="title">
                            Partial perpetual access
                        </div>
                        <div class="body-2">
                            You lack post-2010 perpetual access for some journals. Perpetual access date ranges, by journal, are taken from a spreadsheet you've uploaded.
                        </div>
                    </div>
                    <v-spacer></v-spacer>
                    <v-btn outlined disabled>Upload</v-btn>
                </div>
            </v-col>
        </v-row>


    </v-card>
</template>


<script>
    import _ from "lodash"
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {makePublisherJournalRow} from "../../shared/publisher";
    import {publisherJournalColumns} from "../../shared/publisher";
    import PublisherJournalTableRow from "./PublisherJournalTableRow";


    export default {
        name: "PublisherSetupTab",
        components: {},
        props: {},
        data() {
            return {}
        },
        methods: {},
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherBigDealCost",
            ]),
        },
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style scoped>

</style>