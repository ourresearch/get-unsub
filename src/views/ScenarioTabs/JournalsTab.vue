<template>
    <v-container fluid v-if="data && data.headers" :class="{loading: loading}">

        <v-card>
            <v-tabs>
                <v-tab>
                    Stats
                </v-tab>
                <v-tab>
                    journals list
                </v-tab>


                <v-tab-item>
                    <v-card flat>
                        <v-card-title>
                            <div>
                                <h2 class="display-1">
                                    {{data.name}}
                                    <v-chip class="mx-2"
                                            v-if="$store.state.editMode"
                                            color="info">
                                        <v-avatar left>
                                        <v-icon>mdi-pencil</v-icon>
                                      </v-avatar>
                                        Edit mode

                                    </v-chip>
                                </h2>
                            </div>
                        </v-card-title>
                        <v-card-actions class="px-5">
                            <div v-if="data.key==='journals'" style="margin-top:-20px;">
                                <slider-tab :editable="true" :data="data"></slider-tab>
                            </div>




                            <v-row>
                                <v-col cols="5">
                                    <div class="text-summary" v-if="data.key==='fulfillment'">
                                        <p>Over the next five years, {{ header('instant_usage_percent').percent }}% of
                                            your usage is projected to be fulfilled by instant sources, primarily
                                            perpetual access backfile ({{header('use_backfile').percent}}%) and Open
                                            Access ({{header('use_oa').percent}}%).
                                        </p>
                                    </div>
                                    <div class="text-summary" v-if="data.key==='oa'">
                                        <p>Over the next five years, {{ header('use_oa_percent').percent }}% of your
                                            usage can be fulfilled by Open Access. Key contributors include Bronze
                                            ({{header('use_bronze_percent').percent}}%) and Green
                                            ({{header('use_green_percent').percent}}%) OA.
                                        </p>
                                    </div>
                                    <div class="text-summary" v-if="data.key==='impact'">
                                        <p>
                                            Over the next five years, authors affiliated with your institution are projected to cite the journals listed in this scenario {{header('citations').raw | round(2)}} times, and author {{ header('authorships').raw | round(2) }} publications.
                                        </p>
                                        <p>
                                            based on your settings, each citation is contributing the equivalent of {{ $store.getters.configs.weight_citation  }} downloads, and each authored paper is contributing the equivalent of {{ $store.getters.configs.weight_authorship }} downloads to total Usage.
                                        </p>
                                    </div>
                                    <div class="text-summary" v-if="data.key==='costs'">
                                        <p>
                                            Your projected annual spend in this scenario is {{header('scenario_cost').raw | currency }}, with  {{header('ill_cost').raw | currency }} spent on ILL (@ {{$store.getters.configs.cost_ill | currency }}/delivery, based on your settings) and the rest on subscriptions.
                                        </p>
                                    </div>
                                    <div class="text-summary" v-if="data.key==='apc'">
                                        <p>
                                            Your institution’s authors are projected to spend at least {{header('cost_apc').raw | currency }} annually on  APCs paid to this publisher (Elsevier) over the next five years
                                        </p>
                                        <v-alert type="info">
This view is different from the others: it includes all journals published by this package’s publisher (elsevier) authors from your institution have paid APCs for gold or hybrid open access...this gives you a preliminary estimate of your “publish” spend
                                        </v-alert>
                                        <v-alert type="warning">
                                            Data in this view is more preliminary than in the other tabs.
                                        </v-alert>
                                    </div>
                                </v-col>
                                <v-col cols="7">
                                    <div v-if="data.key==='fulfillment'">
                                        Fulfillment graph coming soon...
                                    </div>
                                    <div v-if="data.key==='oa'">
                                        Open Access graph coming soon...
                                        <vc-donut
                                        :sections="donutData"
                                        size="500"
                                        has-legend
                                        legend-placement="bottom"
                                        :thickness="60">
                                      </vc-donut>
                                    </div>
                                    <div v-if="data.key==='impact'">
                                        Impact graph coming soon...
                                    </div>
                                    <div v-if="data.key==='costs'">
                                        Costs graph coming soon...
                                    </div>
                                    <div v-if="data.key==='apc'">
                                        Costs graph coming soon...
                                    </div>
                                </v-col>
                            </v-row>


                        </v-card-actions>


                        <v-row>
                        </v-row>
                    </v-card>


                </v-tab-item>
                <v-tab-item>
                    <v-card>
                        <v-toolbar
                                flat
                        >
                            <div>
                                <h2 class="display-1">{{data.name}} by Journal</h2>
                            </div>
                            <v-spacer></v-spacer>
                            <v-spacer></v-spacer>
                            <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    flat
                                    solo
                                    dense
                                    outlined
                                    hide-details
                            ></v-text-field>

                        </v-toolbar>
                        <v-data-table
                                :headers="tableHeaders"
                                :items="tableRows"
                                :items-per-page="25"
                                :search="search"
                                :footer-props="{disableItemsPerPage:true}"
                                :must-sort="true"
                                :fixed-header="true"
                                height="550px"

                        >
                            <template v-slot:item="{ item }">
                                <tr @click="openSingleJournal(item.issnl)"
                                    :class="{subscribed: item.subscribed}">
                                    <td style="width:40%;">
                                        <v-row class="py-2">
                                            <v-col v-if="data.key !== 'apc'" style="flex-grow:1;">
                                                <v-btn icon text
                                                       @click.stop="subscribe(item.issnl)"
                                                       v-if="!item.subscribed">
                                                    <v-icon>mdi-cart-outline</v-icon>
                                                </v-btn>
                                                <v-btn icon text
                                                       @click.stop="unsubscribe(item.issnl)"
                                                       v-if="item.subscribed">
                                                    <v-icon>mdi-cart</v-icon>
                                                </v-btn>
                                            </v-col>

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
                                        :key="k">
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
                </v-tab-item>
            </v-tabs>


        </v-card>


    </v-container>
</template>

<script>
    import SliderTab from "../ScenarioTabs/SliderTab"

    export default {
        props: [],
        components: {SliderTab},
        name: "JournalsTab",
        data() {
            return {
                search: '',
                activeViewIndex: 0,

            }
        },
        computed: {
            data() {
                return this.$store.state.tabData
            },
            showMe() {
                return true
                return this.$store.getters.currentScenarioPage === 'journals'
            },
            views() {
                return this.$store.getters.journalViews
            },
            donutData(){
                return this.data.headers.map(h=>{
                    return {
                        value: h.percent,
                        label: h.text,
                        key: h.value, // name
                    }
                })
                    .filter(h=>{
                        return !['instant_usage_percent',].includes(h.key)
                    })

            },
            loading() {
                return this.$store.state.tabDataLoading
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
                    // Object.keys(j).forEach(key => {
                    //     if (key !== 'meta') {
                    //         ret[key] = j[key]
                    //     }
                    // })
                    ret.title = j.meta.title
                    ret.subject = j.meta.subject
                    ret.issnl = j.meta.issn_l
                    ret.subscribed = j.meta.subscribed
                    return ret
                })
            },
            activeView() {
                return this.views[this.activeViewIndex]
            }
        },
        methods: {
            subscribe(issnl) {
                console.log("subscribe", issnl)
                this.$store.dispatch("addSubr", issnl)
            },
            unsubscribe(issnl) {
                console.log("UNsubscribe", issnl)
                this.$store.dispatch("removeSubr", issnl)
            },
            openSingleJournal(issnl) {
                if (this.data.key === "apc") {
                    return
                }

                console.log("@click on openSingleJournal()", issnl)
                this.$store.dispatch('openSingleJournal', issnl)
            },
            getColDisplayType(colName) {
                const myHeader = this.data.headers.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }

            },
            header(k) {
                return this.data.headers.find(h => h.value === k)
            }
        }
    }
</script>

<style scoped lang="scss">
    .text-summary {
        font-size: 20px;
    }


    table tr.subscribed {
        background: #C2DBFD !important;
    }

</style>