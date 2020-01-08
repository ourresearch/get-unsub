<template>
    <v-container class="account" v-if="$store.getters.selectedAccount">
        <h1 class="display-3">Your Account</h1>
        <v-card outlined>
            <v-card-title>Your Packages</v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Journals</th>
                        <th class="text-left">COUNTER</th>
                        <th class="text-left">Custom perpetual access</th>
                        <th class="text-left">Custom prices</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="pkg in $store.getters.selectedAccount.packages"
                        :key="pkg.id"
                        @click="$router.push(`/a/${pkg.id}`)"
                        style="cursor:pointer;">
                        <td>{{ pkg.name }}</td>
                        <td>{{ pkg.numJournals }}</td>
                        <td>{{ pkg.hasCounterData }}</td>
                        <td>{{ pkg.hasCustomPerpetualAccess }}</td>
                        <td>{{ pkg.hasCustomPrices }}</td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
            <v-card-actions>
                <div class="wrap" @click="$store.commit('openNotSupportedMsg')">
                    <v-btn disabled depressed color="primary">Add new package</v-btn>
                </div>
            </v-card-actions>
        </v-card>

    </v-container>
</template>

<script>
    export default {
        name: "Account",
        components: {},
        data() {
            return {
            }
        },
        methods: {
            increment() {
                this.$store.commit("increment")
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            },
            account() {
                return this.$store.state.user
            },

        },
        mounted() {
            this.$store.commit("clearSelectedPkg")
            this.$store.commit("clearSelectedScenario")

        },
    }
</script>

<style scoped>

</style>