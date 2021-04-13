<template>
    <v-list-item
            :key="pub.id"
            @click="goToPackage(pub.id)"
    >
        <v-list-item-icon>
            <v-icon>
                {{(isConsortialFeeder) ? "mdi-package-up" : "mdi-package-variant"}}
            </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
            <v-list-item-title
                    class="headline font-weight-bold"
            >
                {{pub.name}}
                <v-chip
                        small
                        v-if="isConsortialFeeder"
                        class="font-weight-regular"
                >
                    consortial feeder
                </v-chip>
            </v-list-item-title>
            <v-list-item-subtitle>
                <strong>
                    {{pub.publisher}}
                </strong>
                <template v-if="isConsortialFeeder">consortial feeder</template>
                <template v-if="pub.is_demo">demo</template>
                package
                <template v-if="!isConsortialFeeder && !iCanEdit">(read-only)</template>
            </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
            <v-menu
                    offset-y
            >
                <template v-slot:activator="{ on }">
                    <v-btn icon v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item disabled>
                        <v-list-item-icon>
                            <v-icon>mdi-pencil</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Rename
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item
                            @click.stop="openDeletePublisherDialog(pub.id)"
                            :disabled="!iCanEdit || institutionIsConsortium"
                    >
                        <v-list-item-icon>
                            <v-icon>mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>
                            Delete
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-list-item-action>

        <v-snackbar v-model="snackbars.deletePublisherSuccess" bottom left>
            Package deleted
            <v-btn dark icon @click="snackbars.deletePublisherSuccess = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>

        <v-dialog v-model="dialogs.deletePublisher" max-width="400">
            <v-card v-if="dialogs.deletePublisher">
                <v-card-title class="headline">
                    Delete Package
                </v-card-title>
                <v-card-text class="pt-4">
                    Are you sure you want to delete this package?
                </v-card-text>
                <v-card-actions>
                    <v-spacer/>
                    <v-btn text
                           @click="closeDeletePublisherDialog"
                           :disabled="deletePublisherLoading"
                    >
                        Cancel
                    </v-btn>
                    <v-btn depressed
                           @click="deletePublisher"
                           :loading="deletePublisherLoading"
                           color="primary"
                    >
                        Yes, delete it
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-list-item>

</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'


    export default {
        name: "InstitutionPublisherRow",
        components: {},
        props: {
            pub: Object,
            myRole: String,
            isConsortialFeeder: Boolean,
        },
        data() {
            return {
                deletePublisherId: null,
                deletePublisherLoading: false,
                dialogs: {
                    deletePublisher: false,
                },
                snackbars: {
                    deletePublisherSuccess: false,
                }
            }
        },
        methods: {
            async goToPackage(packageId) {
                const url = `/i/${this.institutionId}/p/${packageId}`
                await this.$router.push(url)
            },
            openDeletePublisherDialog(id) {
                this.deletePublisherId = id
                this.dialogs.deletePublisher = true

            },
            closeDeletePublisherDialog() {
                this.deletePublisherId = null
                this.dialogs.deletePublisher = false
            },
            async deletePublisher() {
                console.log("delete publisher", this.deletePublisherId)
                this.deletePublisherLoading = true
                await this.$store.dispatch("deletePublisher", this.deletePublisherId)
                this.deletePublisherLoading = false
                this.closeDeletePublisherDialog()
                this.snackbars.deletePublisherSuccess = true
            },
        },
        computed: {
            ...mapGetters([
                "institutionId",
                "institutionIsConsortium",
                "institutionOwnPublishers",
                "institutionConsortialFeederPublishers",
            ]),
            iCanEdit() {
                if (this.isConsortialFeeder){
                    // only ConsortiumAdmin can edit consortial feeder packages
                    return this.myRole === "ConsortiumAdmin"
                }
                else {
                    return ["ConsortiumAdmin", "Admin", "Collaborator"].includes(this.myRole)
                }
            }

        },
        watch: {}
    }
</script>

<style lang="scss">


</style>