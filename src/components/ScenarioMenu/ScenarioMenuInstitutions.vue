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
            <v-card flat class="">
                <v-toolbar dark flat color="primary">
                    <v-toolbar-title>
                        <v-btn icon @click="closeDialog" class="mr-2">
                            <v-icon>mdi-arrow-left</v-icon>

                        </v-btn>
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
                                        :disabled="isSaving"
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
                        <v-row v-for="institution in sortedInstitutions" class="">
                                <v-col cols="5" class="d-flex">
                                    <v-checkbox
                                            hide-details
                                            class="my-1 py-0 mr-6"
                                            v-model="includedIds"
                                            :value="institution.package_id"
                                            :disabled="isSaving"
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
                <v-divider/>
                <v-card-actions class="py-6 px-6" style="background: #2196F3;">
                    <div class="text" v-if="includedIds.length > 0">
                        <span class="title white--text">
                            <span class="font-weight-bold">
                                {{includedIds.length}}
                            </span>
                            institutions selected
                        </span>
                    </div>
                    <div class="text" v-if="!isLoading && includedIds.length === 0">
                        <span class="subtitle-1 white--text">
                            <v-icon  dark>mdi-alert</v-icon>
                            You must select at least one institution
                        </span>
                    </div>
                    <v-spacer/>
                    <v-btn @click="closeDialog" large dark text>Cancel</v-btn>
                    <v-btn
                            @click="saveDialog"
                            large
                            dark
                            outlined
                            :loading="isSaving"
                            :disabled="!includedIds.length"
                    >
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
                v-model="snackbars.saveSuccess"
                :timeout="3000"
                bottom
        >
            Institutions updated
            <v-btn dark icon @click="snackbars.saveSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>


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
                snackbars: {
                    saveSuccess: false
                },
                isLoading: false,
                isSaving: false,
                institutions: [],
                search: "",
                includedIds: [],
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
            apiUrl(){
                return `scenario/${this.scenarioId}/member-institutions`
            },
            sortedInstitutions(){
                let searchStr = (this.search) ? this.search : ""
                return this.institutions.filter(i => {
                    return i.institution_name.toLowerCase().indexOf(searchStr.toLowerCase()) > -1
                })
            },
        },
        methods: {
            ...mapActions([
                "hydratePublisherScenario",
            ]),
            multiSelectClick() {
                if (this.includedIds.length) { // anything is selected
                    this.includedIds = []
                } else { // nothing is selected
                    this.includedIds = this.institutions.map(i => i.package_id)
                }
            },
            async openDialog() {
                this.isLoading = true
                this.dialogs.institutionList = true
                console.log("openDialog getting this url", this.apiUrl)
                const resp = await api.get(this.apiUrl)
                console.log("api get member institutions resp", resp)
                this.institutions = resp.data.institutions
                this.includedIds = this.institutions.filter(i => i.included).map(i => i.package_id)
                if (this.includedIds.length) {
                    this.multiSelect = true
                }
                this.isLoading = false
            },
            closeDialog() {
                this.dialogs.institutionList = false
                this.isLoading = false
                this.institutions = []
                this.includedIds = []
            },
            async saveDialog(){
                this.isSaving = true
                const postData = {member_institutions: this.includedIds}
                console.log("POSTing institution IDs to server", postData)
                const resp = await api.post(this.apiUrl, postData)
                console.log("institution IDs POSTed successfully. refreshing scenario.", resp)
                await this.hydratePublisherScenario(this.scenarioId) // refresh this specific scenario
                console.log("scenario updated. closing institutions dialog.", resp)

                this.isSaving = false
                this.closeDialog()
                this.snackbars.saveSuccess = true
            },
        },
        watch: {
            includedIds: function(to){
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