<template>
    <v-container class="publisher">
        <router-link class="text--secondary low-key-link" :to="`/i/${institutionId}/p/${publisherId}`">
            <strong>‹</strong>
            Back <span v-if="publisherName">to {{publisherName}}</span>
        </router-link>
        <div class="page-title mt-8 mb-4 d-flex">
            <img class="mt-1 mr-2" height="60px" src="https://i.imgur.com/Qt1sOqp.png">
            <div class="text">
                <div class="body-2">
                    Publisher APC costs
                </div>
                <div class="display-2">
                    {{ publisherName }}
                    <v-icon>mdi-chevron-right</v-icon>
                    <span class="text--secondary">Publication costs</span>
                </div>

            </div>
        </div>

        <v-alert v-if="isPublisherDemo" color="info" text dense icon="mdi-information-outline">
            <div class="d-flex align-center">
                <div>
                    This publisher belongs to a demo institution; the data is real, but some functionality is
                    restricted.
                </div>
                <v-spacer></v-spacer>
                <div>
                    <v-btn color="info" text small to="/purchase">upgrade</v-btn>
                </div>
            </div>
        </v-alert>

        <v-card class="mb-4">
            <v-card-text>
                <div class="stat">
                    <span class="k">Annual Open Access Article Processing Costs (APC) to this publisher: </span>
                    <span class="v">{{ publisherApcCost | currency }}</span>
                    <span class="k"> (estimated) </span>
                </div>
                <div>
                    Includes <em>all</em> journals published by this package’s publisher (Elsevier) where authors from your institution have paid APCs for gold or hybrid open access.
                </div>
            </v-card-text>
        </v-card>


        <v-card>

            <v-card-title class="d-flex">
                <v-row>
                    <v-col>
                        Gold/Hybrid OA Journals
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col cols="6">
                        <v-text-field
                                hide-details
                                outlined
                                dense
                                label="Search journals"
                                v-model="search"
                                append-icon="mdi-magnify"
                                full-width
                        />
                    </v-col>
                </v-row>
            </v-card-title>
            <v-divider></v-divider>
            <v-card flat>
                <v-data-table
                        :headers="tableHeaders"
                        :items="tableRows"
                        :items-per-page="25"
                        :search="search"
                        :footer-props="{disableItemsPerPage:true}"
                        :must-sort="true"
                        :fixed-header="true"

                >
                    <template v-slot:item="{ item }">
                        <tr @click="setZoomIssnl(item.issnl)"
                            :class="{subscribed: item.subscribed}">
                            <td>
                                <v-row class="" style="width:400px;">

                                    <v-col style="flex-grow:222;">
                                        <div :style="{'font-weight': item.subscribed ? 'normal' : 'normal'}"
                                             style="font-size:18px;">{{item.title}}
                                        </div>
                                        <div class="caption">{{item.subject}}</div>

                                    </v-col>
                                </v-row>
                            </td>

                            <td v-for="(v,k) in item"
                                v-if="!['issnl', 'title', 'subject', 'subscribed'].includes(k)"
                                :key="item.issnl + k">
                                        <span v-if="getColDisplayType(k)==='number'">
                                            {{ v.toLocaleString()}}
                                        </span>
                                <span v-if="getColDisplayType(k)==='percent'">
                                            {{ v | round }}%
                                        </span>
                                <span v-if="getColDisplayType(k)==='currency'">
                                            {{ v | currency({fractionCount:2}) }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='currency_int'">
                                            {{ v | currency }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='text'">
                                            {{ v }}
                                        </span>
                                <span v-if="getColDisplayType(k)==='float1'">
                                            {{ v.toFixed(1) }}
                                        </span>


                            </td>

                        </tr>

                    </template>


                </v-data-table>

            </v-card>


        </v-card>

    </v-container>
</template>

<script>
    import {api, toBase64} from "../api";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import ScenarioEditDialogs from "../components/ScenarioEditDialogs/ScenarioEditDialogs";

    export default {
        name: "Publisher",
        components: {
            ScenarioEditDialogs,
        },
        data() {
            return {
                uploadDialogIsOpen: false,
                uploadFileType: "",
                fileSelected: null,
                isUploadFileLoading: false,
                errorMsg: "",
                foo: false,
                search: "",
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherScenarios",
                "publisherScenariosCount",
                "isPublisherDemo",
                "institutionId",
                "institutionName",
                "publisherScenariosAreAllLoaded",
                "publisherBigDealCost",

                // apc stuff
                "publisherApcPapersCount",
                "publisherApcAuthorsFractionalCount",
                "publisherApcCost",
                "publisherApcJournals",
                "publisherApcHeaders",

            ]),
            tableRows() {
                return this.$store.getters.publisherApcJournals.map(j => {
                    let ret = j.table_row
                    ret.title = j.meta.title
                    ret.subject = j.meta.subject
                    ret.issnl = j.meta.issn_l
                    ret.subscribed = j.meta.subscribed
                    return ret
                })
            },
            tableHeaders() {
                const metaHeaders = [
                    {text: "Title", value: "title"},
                ]
                return [...metaHeaders, ...this.publisherApcHeaders]
            },
        },
        methods: {
            ...mapMutations([
                "openCopyDialog",
                "openRenameDialog",
                "openDeleteDialog",
                "setZoomIssnl",
            ]),
            ...mapActions([
                "createScenario",
            ]),
            getColDisplayType(colName) {
                const myHeader = this.publisherApcHeaders.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }
            },
        },

        created() {
        },
        mounted() {
            if (!this.publisherName) {
                this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            }


        },
    }
</script>

<style lang="scss">
    .v-toolbar__extension {
        border-top: none !important;
    }

</style>