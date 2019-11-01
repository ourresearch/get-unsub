<template>
    <v-container fluid class="tab" v-if="showMe">
        <v-row>
            <v-col cols="2" class="py-0">
                <v-navigation-drawer floating class="mt-2">
                        <v-list>
                            <v-subheader>VIEWS</v-subheader>
                            <v-list-item-group v-model="activeViewIndex">
                                <v-list-item
                                        @click="$emit('update', view.value)"
                                        v-for="(view, i) in views"
                                        :key="i"
                                >
<!--                                    <v-list-item-icon>-->
<!--                                        <v-icon v-text="view.icon">{{view.icon}}</v-icon>-->
<!--                                    </v-list-item-icon>-->

                                    <v-list-item-content>
                                        <v-list-item-title v-text="view.displayName"></v-list-item-title>
                                    </v-list-item-content>

                                </v-list-item>
                            </v-list-item-group>
                        </v-list>
                    <v-divider></v-divider>
                </v-navigation-drawer>

            </v-col>

            <v-col cols="10">
                <v-card>
                    <v-card-text>
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

                    </v-card-text>

                </v-card>
                <v-card>
                    <v-toolbar
                            color="gray"
                            dark
                            flat
                    >
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
                            :must-sort="true"

                    >
                        <template v-slot:item="{ item }">
                            <tr :class="{subscribed: item.subscribed}">
                                <td>
                                    <div class="py-2">
                                        <div class="float-left mr-2">
                                            <v-btn icon text
                                                   @click="subscribe(item.issnl)"
                                                   v-if="!item.subscribed">
                                                <v-icon>mdi-cart-outline</v-icon>
                                            </v-btn>
                                            <v-btn icon text
                                                   @click="unsubscribe(item.issnl)"
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

            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        props: [],
        name: "JournalsTab",
        data() {
            return {
                search: '',
                views: [
                    {value: "overview", displayName: "Overview", icon: "mdi-person"},
                    {value: "fulfillment", displayName: "Fulfillment", icon: "mdi-person"},
                    {value: "oa", displayName: "Open Access", icon: "mdi-person"},
                    {value: "impact", displayName: "Impact", icon: "mdi-person"},
                    {value: "costs", displayName: "Read cost", icon: "mdi-person"},
                    {value: "apc", displayName: "APC cost", icon: "mdi-person"},
                ],
                activeViewIndex: 0,

            }
        },
        computed: {
            data(){
                return this.$store.state.tabData
            },
            showMe(){
                return this.$store.getters.currentScenarioPage==='journals'
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
                this.$emit('update', this.activeView)
            },
            unsubscribe(issnl) {
                console.log("UNsubscribe", issnl)
                this.$store.dispatch("removeSubr", issnl)
                this.$emit('update', this.activeView)
            }
        }
    }
</script>

<style scoped lang="scss">
    table tr.subscribed {
        background: #C2DBFD !important;
    }

</style>