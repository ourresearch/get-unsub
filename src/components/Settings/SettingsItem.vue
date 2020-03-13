<template>
    <v-list-item dense class="body-2" @click="showDialog">
        <v-list-item-content>
            {{data.displayName}}
        </v-list-item-content>
        <v-list-item-action class="font-weight-bold pl-2">
            <span class="percent" v-if="data.display==='percent'">
                {{myValue}}%
            </span>
            <span class="number" v-if="data.display==='number'">
                {{myValue}}
            </span>
            <span class="dollars" v-if="data.display==='dollars'">
                {{myValue | currency}}
            </span>
            <span class="boolean" v-if="data.display==='boolean'">
                {{ myValue }}
            </span>
        </v-list-item-action>

        <v-dialog v-model="showDialog" max-width="300">
            <v-card>
                <v-toolbar dark flat color="primary">
                <v-toolbar-title>
                    <v-icon>mdi-settings</v-icon>
                    Edit {{data.displayName}}
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon text @click="showDialog=false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
                <v-card-text>
                    <div>
                        <v-text-field
                                v-if="data.display==='dollars'"
                                outlined
                                @keydown.enter="saveEdit"
                                prepend-inner-icon="mdi-currency-usd"
                                v-model="valueToEdit"
                        />
                        <v-text-field
                                v-if="data.display==='percent'"
                                outlined
                                @keydown.enter="saveEdit"
                                append-icon="mdi-percent"
                                v-model="valueToEdit"
                        />
                        <v-text-field
                                v-if="data.display==='number'"
                                outlined
                                @keydown.enter="saveEdit"
                                v-model="valueToEdit"
                        />
                        <v-switch
                                v-if="data.display==='boolean'"
                                color="primary"
                                v-model="valueToEdit"
                                :label="data.displayName"
                        />
                    </div>
                    <div class="descr">
                        {{data.descr}}
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-btn depressed @click="saveEdit" color="primary">Save</v-btn>
                    <v-btn depressed @click="showDialog=false">Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>



    </v-list-item>
</template>

<script>
    export default {
        name: "SettingsItem",
        props: ["data"],
        data: () => ({
            valueToEdit: null,
            showDialog: false,
        }),
        computed: {
            myValue(){
                return this.$store.getters.config(this.data.name)
            }
        },
        methods: {
            startEdit(){
                this.showDialog = true
                this.valueToEdit = this.myValue
            },
            saveEdit(){
                this.showDialog = false
            },

        }
    }
</script>

<style scoped>

</style>