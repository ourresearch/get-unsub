<template>
    <v-container class="account">
        <div>
            <span class="account">
                <v-icon>mdi-account</v-icon>
                <span class="word">{{ account.name }}</span>
            </span>
        </div>
        <h1 class="display-3">Your Account</h1>
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
                return this.$store.state.account
            }
        },
        mounted() {
            console.log("mount up")
        },
    }
</script>

<style scoped>

</style>