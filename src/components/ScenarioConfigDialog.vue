<template>
    <v-dialog v-model="showMe" max-width="400">
        <v-card v-if="configToEdit">
            <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    <v-icon>mdi-settings</v-icon>
                    {{configToEdit.displayName}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="close()">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-text class="pt-4">
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
                <v-btn depressed @click="showMe=false">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>


</template>

<script>
    import configs from "../appConfigs"

    export default {
        name: "ScenarioConfigDialog",
        props: [],
        data() {
            return {
                saving: false,
            }
        },
        methods: {
            close() {
                this.$store.commit("clearEditConfig")
            },
            saveEdit() {
                this.$store.dispatch("saveconfigToEdit")
                this.$store.commit("clearEditConfig")
            }
        },
        computed: {
            key() {
                return this.$store.getters.infoKey
            },
            showMe: {
                get: function () {
                    return !!this.$store.getters.configToEdit
                },
                set: function (newVal) {
                    // can only close from here
                    this.$store.commit("clearEditConfig")
                }

            },
            configToEdit: {
                get: function () {
                    return this.$store.getters.configToEdit
                },
                set: function (newVal) {
                    this.$store.commit("setEditConfigValue", newVal)
                }
            }

        }
    }
</script>

<style scoped>

</style>