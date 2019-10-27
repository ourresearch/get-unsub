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
        <div><pre>{{account}}</pre></div>


    </v-container>
</template>

<script>
    export default {
        name: "Account",
        methods: {
            increment(){
                this.$store.commit("increment")
            }
        },
        computed: {
            count() {
                return this.$store.getters.count
            },
            account(){
                return this.$store.state.account
            }
        },
        mounted(){
            console.log("mount up")
        },
    }
</script>

<style scoped>

</style>