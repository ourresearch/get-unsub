<template>
    <v-container fluid v-if="data">
        <v-card class="">
            <v-toolbar flat>
                    <div>
                        <h2 class="display-1">
                            APC costs
                            <v-btn icon
                                   href="https://support.unpaywall.org/support/solutions/articles/44001822217-page-apc-cost"
                                   target="_blank">
                                <v-icon>mdi-information-outline</v-icon>
                            </v-btn>

                        </h2>

                    </div>
                    <v-spacer></v-spacer>
                    <v-text-field
                            v-model="search"
                            append-icon="mdi-magnify"
                            label="Search"
                            flat
                            solo
                            outlined
                            hide-details
                    ></v-text-field>

                </v-toolbar>

            <div v-if="data" class="px-3">
                <div class="stat">
                    <span class="k">Annual Open Access Article Processing Costs (APC) to this publisher: </span>
                    <span class="v">{{ totalCost | currency }}</span>
                    <span class="k"> (estimated) </span>
                </div>
                <div>
                    Includes <em>all</em> journals published by this package’s publisher (Elsevier) where authors from your institution have paid APCs for gold or hybrid open access.
                </div>

            </div>




            <v-divider></v-divider>

            <v-card v-if="data" flat>
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
                        <tr @click="openSingleJournal(item.issnl)"
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
    import axios from 'axios'
    import {mapGetters, mapMutations} from 'vuex'

    import {api} from '../api'


    export default {
        name: "PublsherApcs",
        components: {},
        data() {
            return {
                data: null,
                search: "",
            }
        },
        methods: {
            async getData() {
                let path = `package/${this.publisherId}/apc`

                // temp development hack!!!
                path = "scenario/demo-scenario-wVJCKiMPNZ/apc"

                const resp = await api.get(path)
                this.data = resp.data
            },
            getColDisplayType(colName) {
                const myHeader = this.data.headers.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }
            },
            openSingleJournal(issnl) {
                console.log("@click on openSingleJournal()", issnl)
                this.$store.commit('setZoomIssnl', issnl)
            },
        },
        computed: {
            ...mapGetters([
               "publisherId",
               "publisherName"
            ]),
            totalCost(){
              return this.data.headers.find(h=>h.value==="cost_apc").raw
            },
            totalFractionalAuthorship(){
              return this.data.headers.find(h=>h.value==="fractional_authorship").raw
            },

            account() {
                return this.$store.state.account
            },
            pkg() {
                return this.$store.getters.selectedPublisher
            },
            scenario() {
                return this.$store.getters.selectedScenario
            },
            scenarioId() {
                return this.$route.params.scenarioId
            },
            tableHeaders() {
                const metaHeaders = [
                    {text: "Title", value: "title"},
                ]
                return [...metaHeaders, ...this.data.headers]
            },
            tableRows() {
                return this.data.journals.map(j => {
                    let ret = j.table_row
                    ret.title = j.meta.title
                    ret.subject = j.meta.subject
                    ret.issnl = j.meta.issn_l
                    ret.subscribed = j.meta.subscribed
                    return ret
                })
            },
        },
        created() {
        },
        mounted() {
            this.$store.dispatch("fetchPublisher", this.$route.params.publisherId)
            this.getData()

        },
        watch: {
        }
    }
</script>

<style lang="scss">
    .tab.loading {
        opacity: .5;
        transition: opacity .25s ease-in-out;
    }

    table tr.subscribed {
        background: #C2DBFD !important;
    }
    table tr {
        cursor: pointer;
    }

    .v-data-table-header th.sortable {
        min-width: 100px;
        vertical-align:bottom;
        padding-bottom: 5px;
        padding-top: 5px;
    }

</style>