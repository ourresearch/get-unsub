<template>
    <v-container class="mt-3" v-if="userEmail.endsWith('@ourresearch.org')">
        <v-card-title flat class="pa-2">
            <div class="text-h3 mb-6 font-weight-bold">
                Unsub Admin
            </div>
        </v-card-title>
        <app-bar-ext-admin/>
        <v-divider/>
        <v-tabs-items v-model="adminTabShowing">
            <v-tab-item>
                <lookup-institution/>
            </v-tab-item>
            <v-tab-item>
                <add-institution/>
            </v-tab-item>
            <v-tab-item>
                <lookup-user/>
            </v-tab-item>
            <v-tab-item>
                <add-user/>
            </v-tab-item>
            <v-tab-item>
                <remove-user/>
            </v-tab-item>
        </v-tabs-items>
    </v-container>
    <v-container class="mt-3" v-else>
        <v-card-title flat class="pa-2">
            <div class="text-h3 mb-6 font-weight-bold">
                Sorry, you don't have access to this page
            </div>
        </v-card-title>
    </v-container>
</template>

<script>
    import {api} from "../api";
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import appConfigs from "../appConfigs";

    import AddInstitution from "../components/Admin/AddInstitution";
    import LookupInstitution from "../components/Admin/LookupInstitution";
    import LookupUser from  "../components/Admin/LookupUser";
    import AddUser from "../components/Admin/AddUser";
    import RemoveUser from "../components/Admin/RemoveUser";

    import AppBarExtAdmin from "@/components/AppBar/AppBarExtAdmin";

    export default {
        name: "Admin",
        metaInfo() {
            return {
                title: `Unsub Admin`
            }
        },
        components: {
            AppBarExtAdmin,
            LookupInstitution,
            AddInstitution,
            LookupUser,
            AddUser,
            RemoveUser,
        },
        data() {
            return {}
        },
        computed: {
            ...mapGetters([
                "adminTabShowing",
                "userEmail",
            ]),
        },
        methods: {},
        async mounted() {
            console.log("Admin mount up!")
            this.$store.commit("setAdminTabShowing", 0)
        },
    }
</script>

<style scoped>

</style>
