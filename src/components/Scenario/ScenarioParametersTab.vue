<template>
    <v-card flat class="px-2">
        <v-checkbox
            v-model="showDetails"
            label="Show parameter details"
            dense
            class="ml-2"
        />
        <v-row>
            <template
                    v-for="group in configGroups"
            >
                <v-col cols="6"
                       class="pr-12"
                       :key="'groupMenuConfigs'+group.name"
                >
                    <v-subheader>{{group.displayName}}</v-subheader>
                    <v-divider></v-divider>
                    <v-list>
                        <v-list-item
                                v-for="config in group.contents"
                                :key="group.name+config.name"
                                @click="startEdit(config.name)"
                                :disabled="publisherIsConsortialProposalSet"

                        >
                            <v-list-item-content>
                                <div>
                                    {{config.displayName}}
                                </div>
                                <div v-if="showDetails" class="body-2" style="color: #555;">
                                    {{config.descr}}
                                </div>
                            </v-list-item-content>
                            <v-list-item-action class="font-weight-bold pl-2">
                                <settings-item-value :config-name="config.name"/>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-col>
            </template>

        </v-row>

        <v-dialog v-model="showDialog" max-width="500" persistent>
            <v-card v-if="showDialog">
                <v-card-title>
                    <v-icon left>mdi-cog-outline</v-icon>
                    {{selectedConfigData.displayName}}
                </v-card-title>

                <div v-if="institutionIsConsortium">
                    <v-alert
                            color="warning"
                            text
                            icon="mdi-alert"
                    >
                        <p class="font-weight-bold">This could take a while...</p>
                        <p>
                            Changing this parameter will recalculate the forecast, which can take up to 60 minutes.
                            You won't be able to view or edit this scenario during that time.
                        </p>
                        <p>We'll send an email to <strong>{{ userEmail }} </strong> when we're done (don't forget to
                            check your spam).</p>
                    </v-alert>

                </div>

                <v-card-text class="pt-4">
                    <div>
                        <v-text-field
                                v-if="selectedConfigData.display==='dollars'"
                                outlined
                                type="number"
                                :disabled="savingConfig"
                                @keydown.enter="saveEdit"
                                :prefix="publisherCurrencySymbol"
                                v-model="selectedConfigValue"
                        />
                        <v-text-field
                                v-if="selectedConfigData.display==='percent'"
                                outlined
                                type="number"
                                :disabled="savingConfig"
                                @keydown.enter="saveEdit"
                                suffix="%"
                                v-model="selectedConfigValue"
                        />
                        <v-text-field
                                v-if="selectedConfigData.display==='number'"
                                outlined
                                type="number"
                                :disabled="savingConfig"
                                @keydown.enter="saveEdit"
                                v-model="selectedConfigValue"
                        />
                        <v-switch
                                v-if="selectedConfigData.display==='boolean'"
                                color="primary"
                                :disabled="savingConfig"
                                v-model="selectedConfigValue"
                                :label="selectedConfigData.displayName"
                        />
                    </div>
                    <div class="descr">
                        {{selectedConfigData.descr}}
                    </div>
                </v-card-text>

                <v-card-actions>
                    <v-spacer/>
                    <v-btn depressed @click="cancelEdit">Cancel</v-btn>
                    <v-btn
                            depressed
                            @click="saveEdit"
                            :loading="savingConfig"
                            color="primary"
                    >
                        {{ (institutionIsConsortium) ? 'Save and wait' : 'Save' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </v-card>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import appConfigs from "../../appConfigs";
    import SettingsItemValue from "../Settings/SettingsItemValue";

    export default {
        name: "ScenarioParametersTab",
        components: {
            SettingsItemValue,
        },
        props: {
            myRole: String,
            isConsortialFeeder: Boolean,
            publishers: Array,
        },
        data() {
            return {
                selectedConfigValue: null,
                showDialog: false,
                selectedConfigName: null,
                savingConfig: false,
                showDetails: true,
            }
        },
        methods: {
            ...mapMutations([
                "snackbar",
            ]),
            startEdit(configName) {
                // this.$refs.settingsMenu.isActive = false
                this.showDialog = true
                this.selectedConfigName = configName
                this.selectedConfigValue = this.$store.getters.config(configName)
            },
            async saveEdit() {
                console.log("saving config edit", this.selectedConfigValue)
                this.savingConfig = true
                await this.$store.dispatch("setSelectedScenarioConfig", {
                    key: this.selectedConfigName,
                    value: this.selectedConfigValue,
                })
                this.cancelEdit()
                if (!this.institutionIsConsortium) {
                    this.$store.commit("snackbar", "Setting updated")
                }
            },
            cancelEdit() {
                this.selectedConfigName = null
                this.selectedConfigValue = null
                this.showDialog = false
                this.savingConfig = false
            },
        },
        computed: {
            ...mapGetters([
                'institutionId',
                'institutionName',
                'institutionIsDemo',
                "institutionIsConsortium",
                "institutionUsersWithRoles",
                'userConsortia',
                'userInstitutions',
                'publisherIsConsortialProposalSet',
            ]),
            configGroups: () => appConfigs.scenarioConfigGroups,
            selectedConfigData() {
                return appConfigs.scenarioConfigs[this.selectedConfigName]
            },

        },
        created() {
        },
        mounted() {
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>