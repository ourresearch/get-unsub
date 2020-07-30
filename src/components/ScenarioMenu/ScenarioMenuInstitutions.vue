<template>
    <div>
        <v-btn
                text
                class="text-capitalize"
                @click="openDialog"
        >
            Institutions
        </v-btn>


        <v-dialog scrollable fullscreen v-model="dialogs.institutionList">
            <v-card flat class="pb-4">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-icon>mdi-bank</v-icon>
                        Your member institutions
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <div class="mr-3">
                        <v-text-field
                                hide-details
                                clearable
                                outlined
                                dense
                                label="Search institutions"
                                autocomplete="false"
                                v-model="search"
                                append-icon="mdi-magnify"
                                full-width
                        />
                    </div>
                    <v-btn icon text @click="closeDialog">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <template v-slot:extension>
                        <v-row>
                            <v-col cols="5" class="d-flex">
                                <v-checkbox
                                        @change="multiSelectClick"
                                        hide-details
                                        value
                                        v-model="multiSelect"
                                        :indeterminate="someSelected"
                                        class="py-0 my-0 mr-6 ml-2"
                                />
                                <span class="">
                                    Title
                                </span>
                            </v-col>
                            <v-col cols="2">
                                Usage
                            </v-col>
                            <v-col cols="4">
                                Tags
                            </v-col>
                        </v-row>
                    </template>
                </v-toolbar>
                <v-progress-linear indeterminate v-if="isLoading"></v-progress-linear>
                <v-card-text
                        class="pt-8"
                        style="height: 100vh;"
                >
                    <div v-if="!isLoading">
                        <v-row v-for="institution in institutions" class="">
                                <v-col cols="5" class="d-flex">
                                    <v-checkbox
                                            hide-details
                                            class="my-1 py-0 mr-6"
                                            v-model="includedInstitutionIds"
                                            :value="institution.institution_id"
                                    />
                                    <span class="title">
                                        {{institution.institution_name}}
                                    </span>
                                </v-col>
                                <v-col cols="2">
                                    {{institution.usage | round}}
                                </v-col>
                                <v-col cols="4">

                                </v-col>
                        </v-row>
                    </div>
                    <div v-if="isLoading" class="text-center">
                        Loading...
                    </div>
                </v-card-text>
                <v-divider/>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn @click="closeDialog" color="primary" depressed>Save</v-btn>
                    <v-btn @click="closeDialog" depressed>Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


    </div>
</template>

<script>
    import appConfigs from "../../appConfigs";
    import {urlBase} from "../../api";
    import {api} from "../../api";
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "ScenarioMenuInstitutions",
        data() {
            return {
                dialogs: {
                    institutionList: false
                },
                isLoading: false,
                institutions: [],
                search: "",
                includedInstitutionIds: [],
                multiSelectState: "none",
                multiSelect: false,
                someSelected: false,
            }
        },
        computed: {
            ...mapGetters([
                "scenarioId",
            ]),
            csvUrl() {
                let scenarioId = this.$store.getters.scenarioId
                let url = `${urlBase}/scenario/${this.scenarioId}/export.csv`;
                url += "?jwt=" + localStorage.getItem("token")
                return url
            },
        },
        methods: {
            multiSelectClick() {
                if (this.includedInstitutionIds.length) { // anything is selected
                    this.includedInstitutionIds = []
                } else { // nothing is selected
                    this.includedInstitutionIds = this.institutions.map(i => i.institution_id)
                }
            },
            async openDialog() {
                this.isLoading = true
                this.dialogs.institutionList = true
                const url = `scenario/${this.scenarioId}/member-institutions`
                console.log("openDialog getting this url", url)
                const resp = await api.get(url)
                console.log("api get member institutions resp", resp)
                this.institutions = resp.data.institutions
                this.includedInstitutionIds = this.institutions.filter(i => i.included).map(i => i.institution_id)
                if (this.includedInstitutionIds.length) {
                    this.multiSelect = true
                }
                this.isLoading = false
            },
            closeDialog() {
                this.dialogs.institutionList = false
                this.isLoading = false
                this.institutions = []
            },
        },
        watch: {
            includedInstitutionIds: function(to){
                console.log("change in includedInstitutionIds", to)
                if (to.length === 0) { // none selected
                    this.someSelected = false
                    this.multiSelect = false
                }
                else if (to.length === this.institutions.length){ // all selected
                    this.someSelected = false
                    this.multiSelect = true
                }
                else { // some selected
                    this.someSelected = true
                    this.multiSelect = true
                }
            }
        }
    }
</script>

<style>
    .v-dialog__content {
        z-index: 9999999999 !important;
    }
</style>