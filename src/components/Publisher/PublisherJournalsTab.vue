<template>
    <v-card flat class="">
        <v-card-title>
            {{publisherName}} Journals
        </v-card-title>
        <v-divider/>
        <v-card flat class="main-card">
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
                of {{journals.length}}
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
    import {makePublisherJournalRow} from "../../shared/publisher";
    import {publisherJournalColumns} from "../../shared/publisher";
    import PublisherJournalTableRow from "./PublisherJournalTableRow";


    export default {
        name: "PublisherJournalsTab",
        components: {PublisherJournalTableRow},
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
                return this.sortedJournals.filter(j => !j.isHiddenByFilters)
            },
            currentPageOfJournals() {
                return this.sortedJournalsFiltered.slice(this.pageStartIndex, this.pageEndIndex)
            }
        },
        created() {
        },
        mounted() {
        },
        watch: {}
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