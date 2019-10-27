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
        <h1 class="display-3">Your Package</h1>
        <div>
            count: {{count}}
            <v-btn depressed small @click="increment">Increment</v-btn>
        </div>
        <v-card outlined>
            <v-card-title>Your Packages</v-card-title>
            <v-card-text>
                <v-simple-table>
                    <thead>
                    <tr>
                        <th class="text-left">Name</th>
                        <th class="text-left">Journals</th>
                        <th class="text-left">COUNTER uploaded</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="pkg in account.packages"
                        :key="pkg.id"
                        @click="$router.push(`/a/${account.urlName}/${pkg.urlName}`)"
                        style="cursor:pointer;">
                        <td>{{ pkg.name }}</td>
                        <td>{{ pkg.numJournals }}</td>
                        <td>{{ pkg.hasCounterData }}</td>
                    </tr>
                    </tbody>
                </v-simple-table>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="$store.commit('openNotSupportedMsg')" depressed color="primary">Add new package</v-btn>
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