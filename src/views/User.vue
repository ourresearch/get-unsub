<template>
    <v-container class="user">
        <div class="display-2 my-8">
            <v-icon x-large>mdi-account</v-icon>
            Your account
        </div>
        <v-row>
            <v-col cols="5">
                <v-card>
                    <v-toolbar dark color="#555">
                        <v-icon class="mr-2">mdi-account-details</v-icon>
                        <v-toolbar-title>
                            <div class="">
                                Your details
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-list two-line>
                        <v-list-item>
                            <v-list-item-content>
                                <div class="display-1">
                                    my name
                                </div>
                                <v-list-item-subtitle>
                                    Your name
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title v-html="userEmail" class=""/>
                                <v-list-item-subtitle>
                                    Your email
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>

                        <v-list-item>
                            <v-list-item-content>
                                <v-list-item-title class="">
                                    ••••••••
                                </v-list-item-title>
                                <v-list-item-subtitle>
                                    Your password
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <v-btn icon>
                                    <v-icon color="grey lighten-1">mdi-pencil</v-icon>
                                </v-btn>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <v-toolbar dark color="#555">
                        <v-icon class="mr-2">mdi-bank</v-icon>
                        <v-toolbar-title>
                            <div class="">
                                Your Institutions ({{userInstitutions.length}})
                            </div>
                        </v-toolbar-title>
                    </v-toolbar>
                    <v-list>
                        <v-list-item
                                v-for="insti in userInstitutions"
                                :v-key="insti.institution_id"
                                @click="goToInstitution(insti.institution_id)"
                        >
                            <v-list-item-content>
                                <v-list-item-title class="" v-html="insti.institution_name"/>

                                <v-list-item-subtitle>
                                    Permissions:
                                    {{ insti.permissions.join(", ")}}
                                </v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action>
                                <div class="body-2">
                                    <v-icon small color="grey lighten-1">mdi-alert-circle-outline</v-icon>
                                    Demonstration institution
                                </div>
                            </v-list-item-action>
                        </v-list-item>
                    </v-list>
                    <v-card-text
                            v-if="false"
                            class="mt-6"
                            style="height: 100px; position: relative; background: #fff; border-top:1px solid #ddd;"
                    >
                        <v-btn
                                absolute
                                light
                                small
                                fab
                                top
                                right
                                color="white"
                                @click="showSnackbarNoPermissions = true"
                        >
                            <v-icon>mdi-plus</v-icon>
                        </v-btn>
                    </v-card-text>


                </v-card>
            </v-col>


        </v-row>
        
        <v-snackbar
                v-model="showSnackbarNoPermissions"
                color="error"
                bottom
                left
        >
            <v-icon dark class="mr-3">mdi-alert</v-icon>
            You don't have permissions to do that.
            <v-btn dark icon @click="showSnackbarNoPermissions = false">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </v-container>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "User",
        components: {},
        data() {
            return {
                showSnackbarNoPermissions: false,
            }
        },
        computed: {
            ...mapGetters([
                "userEmail",
                "userInstitutions",
            ]),
        },
        methods: {
            ...mapMutations([]),
            ...mapActions([]),
            goToInstitution(id) {
                console.log("go to institution", id)
                const url = `/i/${id}`
                this.$router.push(url)
            },
        },
        mounted() {

        },
    }
</script>

<style scoped>

</style>