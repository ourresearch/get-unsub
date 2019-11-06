<template>
    <div class="tab" v-if="$store.getters.configs">

        <v-list>
                <v-list-item :key="myConfig.name"
                             :data="myConfig"
                             v-for="myConfig in configsList"
                             v-model="selectedConfig"
                             @click.stop="edit(myConfig.name)">
                    <v-list-item-content class="body-2">
                        {{myConfig.displayName}}
                    </v-list-item-content>

                    <v-list-item-action class="font-weight-bold pl-2">
                        <span class="percent" v-if="myConfig.display==='percent'">
                            {{myConfig.value}}%
                        </span>
                        <span class="number" v-if="myConfig.display==='number'">
                            {{myConfig.value}}
                        </span>
                        <span class="dollars" v-if="myConfig.display==='dollars'">
                            {{myConfig.value | currency}}
                        </span>
                        <span class="boolean" v-if="myConfig.display==='boolean'">
                            {{myConfig.value }}
                        </span>
                    </v-list-item-action>



                </v-list-item>

            <!--            <v-subheader>Subscription costs</v-subheader>-->
            <!--            <config :data="configs.cost_bigdeal" @edit="edit"></config>-->
            <!--            <config :data="configs.cost_bigdeal_increase" @edit="edit"></config>-->
            <!--            <config :data="configs.cost_alacart_increase" @edit="edit"></config>-->
            <!--            <config :data="configs.cost_content_fee_percent" @edit="edit"></config>-->
            <!--            <v-divider></v-divider>-->

            <!--            <v-subheader>ILL</v-subheader>-->
            <!--            <config :data="configs.cost_ill" @edit="edit"></config>-->
            <!--            <config :data="configs.ill_request_percent_of_delayed" @edit="edit"></config>-->
            <!--            <v-divider></v-divider>-->

            <!--            <v-subheader>Open Access</v-subheader>-->
            <!--            <config :data="configs.include_bronze" @edit="edit"></config>-->
            <!--            <config :data="configs.include_submitted_version" @edit="edit"></config>-->
            <!--            <config :data="configs.social_networks_percent" @edit="edit"></config>-->
            <!--            <v-divider></v-divider>-->

            <!--            <v-subheader>Institutional value</v-subheader>-->
            <!--            <config :data="configs.weight_citation" @edit="edit"></config>-->
            <!--            <config :data="configs.weight_authorship" @edit="edit"></config>-->
            <!--            <v-divider></v-divider>-->
        </v-list>

        <v-dialog v-if="configToEdit" v-model="showDialog" max-width="300">
            <v-card>
                <v-card-title>
                    Edit {{configToEdit.displayName}}
                </v-card-title>
                <v-card-text>
                    <div>
                        <v-text-field
                                v-if="configToEdit.display==='dollars'"
                                outlined
                                @keydown.enter="saveEdit"
                                prepend-inner-icon="mdi-currency-usd"
                                v-model="configToEdit.value"
                        ></v-text-field>
                        <v-text-field
                                v-if="configToEdit.display==='percent'"
                                outlined
                                @keydown.enter="saveEdit"
                                append-icon="mdi-percent"
                                v-model="configToEdit.value"
                        ></v-text-field>
                        <v-text-field
                                v-if="configToEdit.display==='number'"
                                outlined
                                @keydown.enter="saveEdit"
                                v-model="configToEdit.value"
                        ></v-text-field>
                        <v-switch
                                v-if="configToEdit.display==='boolean'"
                                color="primary"
                                v-model="configToEdit.value"
                                :label="configToEdit.displayName"
                        ></v-switch>
                    </div>
                    <div class="descr">
                        {{configToEdit.descr}}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed @click="saveEdit" :loading="saving" color="primary">Save</v-btn>
                    <v-btn depressed @click="showDialog=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>


<script>
    const configsDisplay = {
        cost_alacart_increase: {
            name: "cost_alacart_increase",
            default: 8,
            value: null,
            display: "percent",
            displayName: "A la carte subscription cost growth",
            descr: "The annual percent increase you expect in ala cart subscription prices (literature suggests 8%).",
        },
        cost_bigdeal: {
            name: "cost_bigdeal",
            default: 2100000,
            value: null,
            display: "dollars",
            displayName: "Base cost",
            descr: "The base cost of your package right now -- either your Big Deal cost or the sum of subscriptions you are currently paying."
        },
        cost_bigdeal_increase: {
            name: "cost_bigdeal_increase",
            default: 5,
            value: null,
            display: "percent",
            displayName: "Base cost growth",
            descr: "The annual percent increase you expect in your package price (literature suggests 5% if a Big Deal, 8% if individual subscriptions)."

        },
        cost_content_fee_percent: {
            name: "cost_content_fee_percent",
            default: 5.7,
            value: null,
            display: "percent",
            displayName: "A la carte 'content fee'",
            descr: "A content fee charged by publishers when buying subscriptions ala cart, above whatever is included in your current package price (literature suggests 5.7% for subscriptions)."
        },
        cost_ill: {
            name: "cost_ill",
            default: 17,
            value: null,
            display: "dollars",
            displayName: "ILL transaction cost",
            descr: "The cost of an ILL request for your institution (literature suggests $17 is average).",
        },
        ill_request_percent_of_delayed: {
            name: "ill_request_percent_of_delayed",
            default: 5,
            value: null,
            display: "percent",
            displayName: "ILL frequency, as percent of delayed access",
            descr: "The percent of accesses which you estimate will result in ILL requests, of papers not available instantly (literature suggests 5).",
        },
        include_bronze: {
            name: "include_bronze",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include Bronze OA",
            descr: "Include Bronze OA as a type of fulfillment.  Bronze OA is when a paper is made freely available on a publisher site without an open license (includes Elsevier's \"open archive\" journals).",
        },
        include_submitted_version: {
            name: "include_submitted_version",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Permit non-peer-reviewed versions",
            descr: "For Green OA, allow submitted versions as a type of fulfillment.  Submitted versions are papers made available in repositories as preprints or other versions that have not yet been peer reviewed.",
        },
        include_social_networks: {
            name: "include_social_networks",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include ASN-hosted content",
            descr: "Include Academic Social Networks (ASNs) as a type of fulfillment -- these include ResearchGate, Academia.edu, and other social sites where academics post papers that are not open repositories.",
        },
        include_backfile: {
            name: "include_backfile",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include perpetual-access backfile content",
            descr: "Include backfile content as a type of fulfillment.  Disable to see what fulfillment would be like if you don't have perpetual access.",
        },
        package: {
            display: false
        },
        weight_authorship: {
            name: "weight_authorship",
            default: 100,
            value: null,
            display: "number",
            displayName: "Institutional authorship weight",
            descr: "A paper authored by someone in your institution contributes this many download-equivalent points to the Usage of the journal.  A common value is 100 -- in this case an authored paper in this journal is modelled as the equivalent of 100 downloads of this journal.",
        },
        weight_citation: {
            name: "weight_citation",
            default: 10,
            value: null,
            display: "number",
            displayName: "Institutional citation weight",
            descr: "A citation from someone in your institution contributes this many download-equivalent points to the Usage of the journal.  A common value is 10 -- in this case a citation from your institution to this journal is modelled as the equivalent of 10 downloads of this journal.",
        },
    }

    import Config from '../components/Config'


    export default {
        props: [],
        components: {Config},
        name: "ConfigsTab",
        data: () => ({
            configToEdit: 9999,
            showDialog: false,
            one: [
                "cost_bigdeal",
                "cost_bigdeal_increase",
                "cost_alacart_increase",
                "cost_content_fee_percent",
            ],
            selectedConfig: null,

        }),
        computed: {
            configs() {
                const myConfigs = this.$store.getters.config
                const ret = {...configsDisplay}
                Object.keys(configsDisplay).forEach(k => {
                    ret[k].value = this.$store.getters.config(k)
                })
                return ret
            },
            configsList() {
                return Object.keys(configsDisplay).map(k => {
                    const newVal = this.$store.getters.config(k)
                    const ret = {...configsDisplay[k]}
                    ret.value = newVal
                    return ret
                }).filter(c => c.display)
            },
            saving() {
                return this.$store.state.tabDataLoading
            }
        },
        methods: {
            edit(k) {
                console.log("edit", k)
                this.configToEdit = this.configs[k]
                this.showDialog = true
            },
            closeDialog() {
                this.showDialog = false
                this.configToEdit = 9999;

            },
            saveEdit() {
                console.log("save this")
                const config = {
                    k: this.configToEdit.name,
                    v: this.configToEdit.value
                }
                this.$store.dispatch("setConfig", config)
                    .then(r => {
                        this.closeDialog()
                    })
            }
        }
    }
</script>

<style scoped>

</style>