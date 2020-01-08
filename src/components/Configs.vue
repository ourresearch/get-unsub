<template>
    <div class="tab" v-if="$store.getters.selectedScenario">

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
                <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    <v-icon>mdi-settings</v-icon>
                    Edit {{configToEdit.displayName}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="showDialog=false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
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
                    <v-btn depressed @click="saveEdit" color="primary">Save</v-btn>
                    <v-btn depressed @click="showDialog=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>


<script>

    import Config from '../components/Config'
    import appConfigs from "../appConfigs.js"


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
                const ret = {...appConfigs.scenarioConfigs}
                Object.keys(appConfigs.scenarioConfigs).forEach(k => {
                    ret[k].value = this.$store.getters.config(k)
                })
                return ret
            },
            configsList() {
                return Object.keys(appConfigs.scenarioConfigs).map(k => {
                    const newVal = this.$store.getters.config(k)
                    const ret = {...appConfigs.scenarioConfigs[k]}
                    ret.value = newVal
                    return ret
                }).filter(c => c.display)
            },
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
            async saveEdit() {
                console.log("save this", this.configToEdit)
                const config = {
                    k: this.configToEdit.name,
                    v: this.configToEdit.value
                }
                // make sure to set the configs before closing this
                this.closeDialog()
                await this.$store.dispatch("setConfig", config)
            }
        }
    }
</script>

<style scoped>

</style>