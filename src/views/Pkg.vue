<template>
    <v-container class="pkg">
        <div class="breadcrumbs">
            <span class="account">
                <v-icon>mdi-account</v-icon>
                <span class="word">{{ account.name }}</span>
            </span>
            >
            <span class="pkg">
                <v-icon>mdi-package-variant</v-icon>
                <span class="word">{{ pkg.name }}</span>
            </span>
        </div>
        <h1 class="display-3">{{ pkg.name }}</h1>
        <div>
            count: {{count}}
            <v-btn depressed small @click="increment">Increment</v-btn>
        </div>
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
                        @click="$router.push(`/a/${account.urlName}/${pkg.urlName}/${scenario.urlName}`)"
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
    export default {
        name: "Pkg",
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
        mounted() {
            console.log("mount up")
        },
    }
</script>

<style scoped>

</style>