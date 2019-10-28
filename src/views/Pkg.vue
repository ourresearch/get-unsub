<template>
    <v-container class="pkg" v-if="$store.getters.selectedPkg">
        <breadcrumbs></breadcrumbs>


        <h1 class="display-3">{{ pkg.name }}</h1>
        <v-card outlined>
            <v-card-title>Your Scenarios</v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Subscribed journals</th>
                        <th class="text-left">Cost</th>
                        <th class="text-left">Instant access</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="scenario in pkg.scenarios"
                        :key="scenario.id"
                        @click="$router.push(`/a/${account.id}/${pkg.id}/${scenario.id}`)"
                        style="cursor:pointer;">
                        <td>{{ scenario.name }}</td>
                        <td>{{ scenario.subrs.length }}</td>
                        <td>{{ scenario.cost }}</td>
                        <td>{{ scenario.percentInstantAccess }}%</td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="$store.commit('openNotSupportedMsg')" color="primary">Add new Scenario</v-btn>
            </v-card-actions>
        </v-card>

    </v-container>
</template>

<script>
    import Breadcrumbs from "../components/Breadcrumbs"

    export default {
        name: "Pkg",
        components: {Breadcrumbs},
        data() {
            return {
            }
        },
        methods: {
            increment() {
            }
        },
        computed: {
            count() {
            },
            account() {
                return this.$store.state.account
            },
            pkg(){
                return this.$store.getters.selectedPkg
            }
        },
        created(){
        },
        mounted() {
            this.$store.commit("selectPkg", this.$route.params.pkgId)
            this.$store.commit("clearScenario")

            console.log("pkg: mount up", this.$route.params)
        },
    }
</script>

<style scoped>

</style>