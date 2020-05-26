<template>
    <v-card flat class="">
        <v-card-title>
            {{publisherName}} Journals ({{ sortedJournalsFiltered.length }})
        </v-card-title>
        <v-card flat class="pa-5">
            <v-row>
                <v-col cols="3">
                    <v-checkbox v-model="showJournalsThat.isForecastable">
                        <template v-slot:label>
                            Can be forecasted ({{ journals.filter(j=>j.isForecastable).length | round }})
                        </template>
                    </v-checkbox>
                    <v-checkbox
                            :indeterminate="IsNotForecastableIsIndeterminate"
                            v-model="showJournalsThat.isNotForecastable"
                    >
                        <template v-slot:label>
                            Cannot be forecasted ({{ journals.filter(j=>!j.isForecastable).length | round }})
                        </template>
                    </v-checkbox>
                    <div class="ml-6">
                        <v-checkbox v-model="showJournalsThat.isOa">
                            <template v-slot:label>
                                Not toll-access ({{ journals.filter(j=>j.isOa).length | round }})
                            </template>
                        </v-checkbox>
                        <v-checkbox v-model="showJournalsThat.isInactive">
                            <template v-slot:label>
                                Ceased publishing ({{ journals.filter(j=>j.isInactive).length | round }})
                            </template>
                        </v-checkbox>
                        <v-checkbox v-model="showJournalsThat.isMoved">
                            <template v-slot:label>
                                Moved publishers ({{ journals.filter(j=>j.isMoved).length | round }})
                            </template>
                        </v-checkbox>
                        <v-checkbox v-model="showJournalsThat.isMissingPrice">
                            <template v-slot:label>
                                No price ({{ journals.filter(j=>j.isMissingPrice).length | round }})
                            </template>
                        </v-checkbox>
                    </div>
                </v-col>
                <v-col cols="9">
                    <publisher-journal-tile
                        v-for="journal in currentPageOfJournals"
                        :key="journal.issnl"
                        :journal="journal"
                    />
                </v-col>
            </v-row>
        </v-card>


        <v-divider/>
        <v-card v-if="0" flat class="main-card">
            <div class="table-wrapper">
                <div class="table-portal">
                    <table>
                        <thead>
                        <tr>
                            <th v-for="header in tableHeaders"
                                @click="toggleSort(header.id)"
                                :class="header.id"
                                :key="header.id">

                                <span class="header-width" v-html="header.name"></span>

                                <span class="header-cell-contents">
                                        <v-tooltip
                                                top
                                                color="#333"
                                                max-width="400"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" v-html="header.name">
                                                </span>
                                            </template>
                                            <div>tooltip here</div>
                                        </v-tooltip>
                                    </span>
                            </th>
                            <th>

                            </th>
                        </tr>


                        </thead>
                        <tbody>

                            <publisher-journal-table-row
                                        v-for="journal in currentPageOfJournals"
                                        :key="journal.issnl"
                                        :journal="journal"
                                />
                        </tbody>
                    </table>
                </div>

            </div>
            <v-divider></v-divider>
        </v-card>

        <v-toolbar flat dense v-if="journals.length">
            <v-spacer></v-spacer>
            <div>
                {{pageStartIndex + 1}} &ndash; {{pageEndIndex}}
                of {{sortedJournalsFiltered.length}}
                <v-btn icon :disabled="isFirstPage" @click="pageBack">
                    <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn icon :disabled="isLastPage" @click="pageForward">
                    <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
            </div>
            <v-spacer></v-spacer>
        </v-toolbar>
    </v-card>


</template>

<script>
    import _ from "lodash"
    import appConfigs from "../../appConfigs";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {publisherJournalColumns} from "../../shared/publisher";
    import PublisherJournalTableRow from "./PublisherJournalTableRow";
    import PublisherJournalTile from "./PublisherJournalTile";


    export default {
        name: "PublisherJournalsTab",
        components: {
            PublisherJournalTableRow,
            PublisherJournalTile,
        },
        props: {
        },
        data() {
            return {
                search: "",
                editColumnsOpen: false,
                pageStartIndex: 0,
                sortKey: "title",
                sortDesc: false,
                sortType: "text",
                pageSize: 100,
                showAddColsDialog: false,
                showJournalsThat: {
                    isForecastable: true,
                    isNotForecastable: true,
                    isInactive: true,
                    isMoved: true,
                    isOa: true,
                    isMissingPrice: true
                }

            }
        },
        methods: {
            showColInfo(id) {
                console.log("show col info", id)
            },
            toggleSort(id) {
                this.sortDesc = !this.sortDesc
                this.sortKey = id
                this.sortType = publisherJournalColumns.find(c => c.id === id).displayAs
                console.log("toggle sort", id, this.sortDesc)
            },
            pageForward() {
                if (this.isLastPage) return
                this.pageStartIndex += this.pageSize;
            },
            pageBack() {
                this.pageStartIndex = Math.max(
                    this.pageStartIndex - this.pageSize,
                    0
                )
            },


        },
        computed: {
            ...mapGetters([
                "publisherName",
            ]),
            journals() {
                return this.$store.getters.publisherJournals.map(j => {
                    return j
                })
            },
            // pagination stuff
            pageEndIndex() {
                return Math.min(
                    this.pageStartIndex + this.pageSize,
                    this.journals.length
                )
            },
            isLastPage() {
                return this.pageEndIndex >= this.journals.length
            },
            isFirstPage() {
                return this.pageStartIndex === 0
            },

            tableHeaders() {
                return publisherJournalColumns
                    .map(col => {
                        return {
                            ...col
                        }

                        // ret.textWithDownArrow = ret.text + "&nbsp;▿"
                        // // ret.groupName = configs.journalColGroups.find(g=>{
                        // //     g.cols.includes(g.value)
                        // // })
                    })
            },

            sortedJournals() {
                const fn = (aObj, bObj) => {
                    const a = aObj[this.sortKey]
                    const b = bObj[this.sortKey]

                    let diff
                    if (["currency", "number"].includes(this.sortType)) {
                        diff = a - b
                    }
                    else if (this.sortType === "text") {
                        diff = (a > b) ? 1 : -1
                    }
                    else if (this.sortType === "listOfStrings") {
                        diff = a.length - b.length
                    }
                    // if (this.sortKey.endsWith("text")) {
                    //     diff = ((a[this.sortKey] || "") >= (b[this.sortKey] || "")) ? 1 : -1
                    // }

                    if (this.sortDesc) diff *= -1
                    return diff
                }
                return [...this.journals].sort(fn)
            },
            sortedJournalsFiltered() {
                return this.sortedJournals.filter(j => {
                    if (!this.showJournalsThat.isInactive && j.isInactive) return false
                    if (!this.showJournalsThat.isMoved && j.isMoved) return false
                    if (!this.showJournalsThat.isOa && j.isOa) return false
                    if (!this.showJournalsThat.isMissingPrice && j.isMissingPrice) return false
                    if (!this.showJournalsThat.isForecastable && j.isForecastable) return false

                    return true


                    let ret = true
                    // if (j.isInactive)

                    // Object.entries(this.showJournalsThat).forEach(([attr, show]) => {
                    //     if (j[attr] !== show){
                    //         ret = false
                    //     }
                    // })
                    return ret
                })
            },
            IsNotForecastableIsIndeterminate(){
                const values = [
                    this.showJournalsThat.isInactive,
                    this.showJournalsThat.isMoved,
                    this.showJournalsThat.isOa,
                    this.showJournalsThat.isMissingPrice,
                ]
                const numTrue = values.filter(x=>x).length
                console.log("numTrue", numTrue)
                return (numTrue > 0 && numTrue < values.length)

            },

            currentPageOfJournals() {
                return this.sortedJournalsFiltered.slice(this.pageStartIndex, this.pageEndIndex)
            },



        },
        created() {
        },
        mounted() {
        },
        watch: {
            'showJournalsThat.isNotForecastable': function(to){
                if (!to){
                    this.showJournalsThat.isInactive = false
                    this.showJournalsThat.isMoved = false
                    this.showJournalsThat.isOa = false
                    this.showJournalsThat.isMissingPrice = false
                }
                else {
                    this.showJournalsThat.isInactive = true
                    this.showJournalsThat.isMoved = true
                    this.showJournalsThat.isOa = true
                    this.showJournalsThat.isMissingPrice = true
                }
            }
        }
    }
</script>

<style lang="scss">

    table tr {
        cursor: pointer;

        &:hover {
            background: #fafafa;
        }

        td {
            border-top: 1px solid #eee;
        }
    }

    table {
    }

    table th {
        padding: 0 10px;
        white-space: nowrap;
        background: #fff;
        display: table-cell;
        text-align: left;
        vertical-align: center;
        border-bottom: 1px solid #eee;

        &.name {
            width: 400px;
        }

        .header-cell-contents {
            position: absolute;
            padding-top: 10px;
            top: 0;

        }

        .header-width {
            visibility: hidden;
            display: block;
            height: 0;
        }

        &.title-header {
            text-align: left;
            padding-left: 70px;

        }

    }

    .main-card {
        /*height: 70vh;*/
        overflow: auto;
        position: relative;
    }

    .table-wrapper {
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 100%;
        padding-top: 50px;
        box-sizing: border-box;
        overflow: auto;
        overflow-y: hidden;
    }

    .table-portal {
        overflow-y: scroll;
        overflow-x: hidden;
        min-width: fit-content;
        width: 100%;
    }

    table {
        border-collapse: collapse;
        width: 100%;
        /*overflow-x: auto;*/
        /*width: 100%;*/
        /*position:relative;*/
        /*thead {*/
        /*    display: block;*/
        /*}*/

        tbody {
            /*display: block;*/
            /*overflow: auto;*/
            height: 500px;
            /*width: 100%;*/
        }

    }


</style>