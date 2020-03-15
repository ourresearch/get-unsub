<template>


    <v-app-bar app clipped-left>
        <v-toolbar-title class="headline">
            <router-link to="/">
                <img class="mt-3" style="margin: 12px 28px 0" src="../assets/logo.png" alt="">
            </router-link>
        </v-toolbar-title>


        <v-progress-linear
                :active="$store.state.loading > 0"
                :indeterminate="$store.state.loading > 0"
                absolute
                bottom
                color="green"
        ></v-progress-linear>


        <v-divider
                class="ml-8"
                vertical
                v-if="$store.getters.isLoggedIn"
        ></v-divider>

        <v-toolbar-items class="breadcrumbs" v-if="account">
            <v-btn class="pa-0 pl-4" text to="/a" active-class="">
                <v-icon left>mdi-account</v-icon>
                <v-icon v-if="selectedPkg">mdi-chevron-right</v-icon>
                <span v-if="!selectedPkg">{{account.name}}</span>
            </v-btn>
            <v-btn text class="pl-4" v-if="selectedPkg" :to="`/a/${selectedPkg.id}`">
                <v-icon left>mdi-package-variant</v-icon>
                <span>{{selectedPkg.name}}</span>

                <v-icon v-if="selectedScenario">mdi-chevron-right</v-icon>
            </v-btn>
            <v-btn class="pl-4" v-if="selectedScenario" text>
                <v-icon left>mdi-chart-bar</v-icon>
                {{selectedScenario.name}}
            </v-btn>


        </v-toolbar-items>


        <v-spacer></v-spacer>

        <v-toolbar-items>

            <v-btn text
                   v-if="selectedScenario"
                   class="px-2 toolbar-summary"
                   @click="$store.commit('toggleConfigsOpen')">
                Settings
            </v-btn>

            <v-btn text color="primary" v-if="!$store.getters.isCustomerAccount" to="/purchase">Pricing</v-btn>
            <v-btn text to="/support">Help</v-btn>

            <v-btn text to="/login" v-if="!$store.getters.isLoggedIn">Log in</v-btn>

            <v-btn text
                   v-if="account"
                   class="px-2 toolbar-summary"
                   @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>

        </v-toolbar-items>


    </v-app-bar>


</template>

<script>
    import {api} from "../api"

    export default {
        name: "AppBar",
        components: {},
        data() {
            return {}
        },
        methods: {
            increment() {
            },
            logout(){
                this.$store.commit("logout")
                this.$store.commit("clearSelectedScenario")
                this.$store.commit("clearSelectedPkg")
                this.$router.push("/")
            }
        },
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            api() {
                return api
            },
            count() {
            },
            account() {
                return this.$store.getters.selectedAccount
            },
            selectedPkg() {
                return this.$store.getters.selectedPkg
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },
        },
        created() {
        },
        mounted() {
        },
    }
</script>

<style scoped>

</style>