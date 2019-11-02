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
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        cost_bigdeal: {
            name: "cost_bigdeal",
            default: 2200000,
            value: null,
            display: "dollars",
            displayName: "Big Deal cost",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        cost_bigdeal_increase: {
            name: "cost_bigdeal_increase",
            default: 5,
            value: null,
            display: "percent",
            displayName: "Big Deal cost growth",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",

        },
        cost_content_fee_percent: {
            name: "cost_content_fee_percent",
            default: 5.7,
            value: null,
            display: "percent",
            displayName: "A la carte 'content fee'",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        cost_ill: {
            name: "cost_ill",
            default: 5,
            value: null,
            display: "dollars",
            displayName: "ILL transaction cost",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        ill_request_percent_of_delayed: {
            name: "ill_request_percent_of_delayed",
            default: 10,
            value: null,
            display: "percent",
            displayName: "ILL frequency, as percent of delayed access",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        include_bronze: {
            name: "include_bronze",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include Bronze OA",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        include_submitted_version: {
            name: "include_submitted_version",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include Green OA submitted versions",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        include_social_networks: {
            name: "include_social_networks",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include ASN-hosted content",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        include_backfile: {
            name: "include_backfile",
            default: true,
            value: null,
            display: "boolean",
            displayName: "Include perpetual-access backfile content",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        },
        weight_citation: {
            name: "weight_citation",
            default: 10,
            value: null,
            display: "number",
            displayName: "Institutional citation weight",
            descr: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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