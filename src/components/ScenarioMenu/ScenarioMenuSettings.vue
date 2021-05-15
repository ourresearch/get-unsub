<template>
    <div>
        <v-menu
                offset-y
                :close-on-content-click="false"
                ref="settingsMenu"
        >
            <template v-slot:activator="{ on }">
                <v-btn
                        text
                        class="text-capitalize"
                        v-on="on"
                >
                    Parameters
                </v-btn>
            </template>
            <v-list dense>

                <v-menu
                        v-for="group in configGroups"
                        :key="'groupMenuConfigs'+group.name"
                        offset-x
                        :open-on-hover="true"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item
                                v-on="on"
                                @click=""
                        >
                            <v-list-item-title class="font-weight-regular">
                                {{group.displayName}}
                            </v-list-item-title>
                            <v-list-item-action>
                                <v-icon>mdi-menu-right</v-icon>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                    <v-list dense>
                        <v-tooltip
                                right
                                v-for="config in group.contents"
                                :key="group.name+config.name"
                                max-width="400"
                                color="#333"
                        >
                            <template v-slot:activator="{ on }">
                                <v-list-item
                                        class="body-2"
                                        @click="startEdit(config.name)"
                                        v-on="on"
                                >
                                    <v-list-item-content>
                                        {{config.displayName}}
                                    </v-list-item-content>

                                    <v-list-item-action class="font-weight-bold pl-2">
                                        <settings-item-value :config-name="config.name"/>
                                    </v-list-item-action>
                                </v-list-item>
                            </template>
                            <span v-html="config.descr"></span>
                        </v-tooltip>


                    </v-list>

                </v-menu>

                <v-tooltip
                        v-if="0"
                        right
                        max-width="400"
                >
                    <template v-slot:activator="{ on }">
                        <v-list-item v-on="on" @click="openResetConfirmation">
                            <v-list-item-title class="font-weight-regular">
                                Reset all
                            </v-list-item-title>
                        </v-list-item>
                    </template>
                    <span>
                        Reset all this scenario's settings to their default values.
                    </span>
                </v-tooltip>


            </v-list>
        </v-menu>

        <v-dialog v-model="showDialog" max-width="400" persistent>
            <v-card v-if="showDialog">
              <v-card-title>
                        <v-icon left>mdi-playlist-edit</v-icon>
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
                        <p>We'll send an email to <strong>{{ userEmail }} </strong> when we're done (don't forget to check your spam).</p>
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
                    <v-spacer />
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

        <v-dialog v-model="showResetDialog" max-width="400" persistent>
            <v-card v-if="showResetDialog">
                <v-card-title class="headline">
                    Confirm reset
                </v-card-title>
                <v-card-text class="pt-4">
                    <div>
                        Are you sure you want to reset all settings for this scenario back their default values? This can't be undone, so it's a good idea to save a backup copy first.
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed
                           @click="confirmReset"
                           color="primary"
                           :loading="savingReset"
                    >
                        Yes, reset all settings
                    </v-btn>
                    <v-btn depressed @click="showResetDialog=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex"
    import appConfigs from "../../appConfigs";
    import SettingsItemValue from "../Settings/SettingsItemValue";

    export default {
        name: "ScenarioMenuSettings",
        components: {
            SettingsItemValue,
        },
        data: () => ({
            selectedConfigValue: null,
            showDialog: false,
            showResetDialog: false,
            selectedConfigName: null,
            savingConfig: false,
            savingReset: false,
            showSaveEditConfirmation: false,
        }),
        computed: {
            ...mapGetters([
                "publisherFilesDict",
                "institutionIsConsortium",
                "publisherCurrencySymbol",
                "userEmail",
            ]),
            configGroups: () => appConfigs.scenarioConfigGroups,
            selectedConfigData() {
                return appConfigs.scenarioConfigs[this.selectedConfigName]
            },
        },
        methods: {
            ...mapActions([
                "resetAllConfigs",
            ]),
            startEdit(configName) {
                this.$refs.settingsMenu.isActive = false
                this.showDialog = true
                this.selectedConfigName = configName
                this.selectedConfigValue = this.$store.getters.config(configName)
            },
            async saveEditHandler(){
                if (this.institutionIsConsortium){
                    if (this.showSaveEditConfirmation) {
                        return this.saveEdit()
                    }
                    else {
                        this.showSaveEditConfirmation = true
                        return
                    }
                }
                else {
                    return this.saveEdit()
                }

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
                this.showSaveEditConfirmation = false
            },
            async openResetConfirmation() {
                this.$refs.settingsMenu.isActive = false
                this.showResetDialog = true
            },
            async confirmReset() {
                this.savingReset = true
                await this.$store.dispatch("resetAllConfigs")
                this.savingReset = false
                this.showResetDialog = false
                this.$store.commit("snackbar", "Settings reset")
            },
        }
    }
</script>

<style scoped>

</style>