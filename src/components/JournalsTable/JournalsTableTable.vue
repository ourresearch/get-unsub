<template>
        <v-card flat class="">
            <v-card flat v-if="sortedJournals" class="main-card">
                <div class="table-wrapper mt-8">
                    <div class="table-portal">
                        <table>
                            <thead>
                            <tr>
                                <th class="title-header">
                                    <span class="header-cell-contents">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on">
                                                    Title&nbsp;▿
                                                </span>
                                            </template>
                                            <v-list dense>
                                                <v-list-item @click="sortTable('title', true)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-descending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Asc
                                                    </v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="sortTable('title', false)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-ascending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Desc
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>
                                        </v-menu>
                                    </span>
                                </th>
                                <th v-for="header in tableHeaders" :key="header.value">
                                    <span class="header-width" v-html="header.textWithDownArrow"></span>

                                    <span class="header-cell-contents">
                                        <v-menu offset-y>
                                            <template v-slot:activator="{ on }">
                                                <span v-on="on" v-html="header.textWithDownArrow">
                                                </span>
                                            </template>
                                            <v-list dense>
                                                <v-list-item @click="sortTable(header.value, true)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-descending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Asc
                                                    </v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="sortTable(header.value, false)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-sort-ascending</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Sort Desc
                                                    </v-list-item-title>
                                                </v-list-item>
                                                <v-list-item @click="$store.commit('hideTableCol', header.value)">

                                                    <v-list-item-icon>
                                                        <v-icon>mdi-table-remove</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Remove
                                                    </v-list-item-title>
                                                </v-list-item>
<!--                                                <v-list-item @click="getInfo(header.value)">-->
                                                <v-list-item
                                                        @click="$store.commit('showColInfo', header.value)">
                                                    <v-list-item-icon>
                                                        <v-icon>mdi-information-outline</v-icon>
                                                    </v-list-item-icon>
                                                    <v-list-item-title>
                                                        Info
                                                    </v-list-item-title>
                                                </v-list-item>
                                            </v-list>

                                        </v-menu>

                                    </span>


                                </th>
                                <th>

                                </th>
                            </tr>


                            </thead>
                            <tbody>
                            <journal-row
                                    v-for="journal in currentPageOfJournals"
                                    :key="journal.issn_l"
                                    :journal="journal"
                                    :headers="tableHeaders"
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
            <col-info-dialog></col-info-dialog>
        </v-card>




</template>

<script>
    import _ from "lodash"
    import appConfigs from "../../appConfigs";
    import JournalRow from "./JournalRow"
    import ColInfoDialog from "./ColInfoDialog"


    export default {
        name: "JournalsTableTable",
        components: {
            JournalRow,
            ColInfoDialog
        },
        props: {
            "journals": Array,
        },
        data() {
            return {
                search: "",
                editColumnsOpen: false,
                pageStartIndex: 0,
                sortKey: "title",
                sortDesc: false,
                pageSize: 100,
                showAddColsDialog: false,

            }
        },
        methods: {

            getColDisplayType(colName) {
                const myHeader = appConfigs.journalCols.find(h => h.value === colName)
                if (myHeader) {
                    return myHeader.display
                } else {
                    return "number"
                }
            },
            sortTable(colname, asc = true) {
                console.log("sort table", colname, asc)
                this.pageStartIndex = 0
                this.sortKey = colname
                this.sortDesc = !asc
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
                return appConfigs.journalCols
                    .filter(h => {
                        return this.$store.getters.tableColsToShow.includes(h.value)
                    })
                    .map(h => {
                        const ret = {...h}
                        ret.textWithDownArrow = ret.text + "&nbsp;▿"
                        // ret.groupName = configs.journalColGroups.find(g=>{
                        //     g.cols.includes(g.value)
                        // })

                        return ret
                    })
            },

            sortedJournals() {
                const fn = (a, b) => {
                    let diff = a[this.sortKey] - b[this.sortKey]
                    if (this.sortKey === "title") {
                        diff = (a.title > b.title) ? 1 : -1
                    }
                    if (this.sortKey.endsWith("text")) {
                        diff = ((a[this.sortKey] || "") >= (b[this.sortKey] || "")) ? 1 : -1
                    }
                    if (this.sortDesc) diff *= -1
                    return diff
                }
                return [...this.journals].sort(fn)
            },
            sortedJournalsFiltered() {
                return this.sortedJournals.filter(j=>!j.isHiddenByFilters)
            },
            currentPageOfJournals(){
                return this.sortedJournalsFiltered.slice(this.pageStartIndex, this.pageEndIndex)
            }
        },
        created() {
        },
        mounted() {
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