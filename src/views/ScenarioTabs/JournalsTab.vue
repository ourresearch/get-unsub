<template>
    <v-container v-if="data && data.headers" :class="{loading: loading}">

        <v-card >
            <v-tabs>
                <v-tab>
                    Stats
                </v-tab>
                <v-tab>
                    List
                </v-tab>


                <v-tab-item>
                    <v-container fluid>
                        <v-row>
                            <v-col>
                                sum-up here
                            </v-col>
                            <v-col cols="2" v-for="(header, i) in data.headers" class="text-right">
                                <div class="main title">{{header.raw | round}}</div>
                                <div class="under subtitle-1">{{header.text}}</div>
                            </v-col>
                        </v-row>

                    </v-container>

                </v-tab-item>
                <v-tab-item>
                    <v-card>
                        <v-toolbar
                                color="gray"
                                flat
                        >
                            <v-text-field
                                    v-model="search"
                                    append-icon="mdi-magnify"
                                    label="Search"
                                    flat
                                    solo
                                    outlined
                                    hide-details
                            ></v-text-field>
                            <v-spacer></v-spacer>

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
                                <tr @click="openSingleJournal(item.issnl)" :class="{subscribed: item.subscribed}">
                                    <td>
                                        <div class="py-2">
                                            <div class="float-left mr-2">
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
                                            </div>
                                            <div>
                                                <div :style="{'font-weight': item.subscribed ? 'normal' : 'normal'}"
                                                     style="font-size:18px;">{{item.title}}
                                                </div>
                                                <div class="caption">{{item.subject}}</div>

                                            </div>
                                        </div>
                                    </td>
                                    <td v-for="(v,k) in item"
                                        v-if="!['issnl', 'title', 'subject', 'subscribed'].includes(k)"
                                        :key="k">
                                        {{ v }}
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
    export default {
        props: [],
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
                    let ret = {}
                    Object.keys(j).forEach(key => {
                        if (key !== 'meta') {
                            ret[key] = j[key]
                        }
                    })
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
                console.log("@click on openSingleJournal()", issnl)
                this.$store.dispatch('openSingleJournal', issnl)
            }
        }
    }
</script>

<style scoped lang="scss">
    table tr.subscribed {
        background: #C2DBFD !important;
    }

</style>