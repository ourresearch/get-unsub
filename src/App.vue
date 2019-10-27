<template>
    <v-app>
        <v-app-bar elevate-on-scroll app>
            <v-toolbar-title class="headline">
                <router-link to="/">
                    <span>Unpaywall Journals</span>

                </router-link>
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="support">Support</v-btn>
            <v-btn text to="purchase">Purchase</v-btn>
            <v-btn text to="login">Log in</v-btn>
        </v-app-bar>

        <v-content>
            <router-view></router-view>
        </v-content>

        <v-snackbar
                top
                v-model="$store.state.notSupportedMsgOpen">
            Sorry, that's not supported on the demo account.
            <v-btn text @click="$store.commit('closeNotSupportedMsg')">close</v-btn>
        </v-snackbar>

    </v-app>
</template>

<script>

    export default {
        name: 'App',
        components: {},
        data: () => ({
        }),
        computed: {
        }
    };
</script>
