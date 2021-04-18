<template>
    <v-tabs v-if="institutionName" class="ml-1" v-model="currentTab">
        <v-tab class="low-key-button">Packages</v-tab>
        <v-tab class="low-key-button">Users</v-tab>
        <v-tab class="low-key-button">ROR ID</v-tab>
        <v-tab class="low-key-button">Consortial</v-tab>
    </v-tabs>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "AppBarExtInstitution",
        components: {},
        data() {
            return {
                foo: 42,
            }
        },
        methods: {},
        computed: {
            ...mapGetters([
                "institutionName",
            ]),
            currentTab: {
                get() {
                    console.log("get currentTab")
                    return this.$store.getters.institutionTabShowing
                },
                set(newVal) {
                    this.$store.commit("setInstitutionTabShowing", newVal)
                }
            }
        },
        created() {
            this.currentTab = 0
        },
        watch: {
            "foo": {
                immediate: true,
                handler: function (to, from) {
                }
            }
        }
    }
</script>

<style lang="scss">


</style>