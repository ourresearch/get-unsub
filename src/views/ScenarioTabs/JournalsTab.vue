<template>
    <v-container fluid v-if="data && data.headers" :class="{loading: loading}">

        <v-card >
            <v-tabs>
                <v-tab>
                    Stats
                </v-tab>
                <v-tab>
                    List
                </v-tab>


                <v-tab-item>
                        <v-card flat>
                            <v-card-title >
                                <div>
                                    <h2 class="display-1">{{data.name}}</h2>
                                    <div class="body-1">{{data.description}}</div>
                                </div>
                            </v-card-title>
                            <v-card-actions>
                                <div v-if="data.key==='journals'" style="margin-top:-20px;">
                                    <slider-tab :editable="false" :data="data"></slider-tab>
                                </div>
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
                if (this.data.key==="apc"){
                    return
                }

                console.log("@click on openSingleJournal()", issnl)
                this.$store.dispatch('openSingleJournal', issnl)
            },
            getColDisplayType(colName){
                const myHeader = this.data.headers.find(h=>h.value === colName)
                if (myHeader){
                    return myHeader.display
                }
                else {
                    return "number"
                }

            }
        }
    }
</script>

<style scoped lang="scss">
    table tr.subscribed {
        background: #C2DBFD !important;
    }

</style>