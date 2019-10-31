<template>
    <v-container fluid class="tab" v-if="data && data.journals">
        <v-row>
            <v-col>
                sum-up here
            </v-col>
            <v-col v-for="(header, i) in data.headers" class="text-right">
                <div class="main display-1">{{header.raw | round}}</div>
                <div class="under subtitle-1">{{header.text}}</div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card>
                    <v-toolbar
                            color="gray"
                            dark
                            flat
                    >
                        Journals: Institutional Value
                        <v-spacer></v-spacer>
                        <v-text-field
                                v-model="search"
                                append-icon="mdi-magnify"
                                label="Search"
                                solo-inverted
                                flat
                                hide-details
                        ></v-text-field>

                    </v-toolbar>
                    <v-data-table
                            :headers="tableHeaders"
                            :items="tableRows"
                            :items-per-page="25"
                            :search="search"
                            :footer-props="{disableItemsPerPage:true}"

                    >
                        <template v-slot:item.title="{ item }">
                            <div class="py-2">
                                <div class="float-left mr-2">
                                    <v-btn icon text v-if="!item.subscribed">
                                        <v-icon>mdi-cart-outline</v-icon>
                                    </v-btn>
                                    <v-btn icon text v-if="item.subscribed">
                                        <v-icon>mdi-cart</v-icon>
                                    </v-btn>
                                </div>
                                <div>
                                    <div style="font-size:18px;">{{item.title}}</div>
                                    <div class="caption">{{item.subject}}</div>

                                </div>

                            </div>

                        </template>


                    </v-data-table>

                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "JournalsTab",
        data() {
            return {
                search: '',
            }
        },
        computed: {
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
            }

        }
    }
</script>

<style scoped>

</style>