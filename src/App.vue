<template>
    <v-app>
        <app-bar></app-bar>

        <v-content style="margin-bottom: 0">
            <router-view></router-view>
            <single-journal></single-journal>
            <startup-tutorial></startup-tutorial>
        </v-content>

        <v-snackbar
                color="warning"
                top
                v-model="$store.state.notSupportedMsgOpen">
            Sorry, that's not supported yet. Contact team@ourresearch.org for more info.
            <v-btn text @click="$store.commit('closeNotSupportedMsg')">close</v-btn>
        </v-snackbar>

        <v-snackbar
                top
                :color="$store.state.snackbarColor"
                v-model="$store.state.snackbarIsOpen">
            {{$store.state.snackbarMsg}}
            <v-btn text @click="$store.commit('closeSnackbar')">close</v-btn>
        </v-snackbar>
        <v-footer
                class="text-right main-footer"
        >
            <div class="text-center" style="width:100%">
                <a href="https://github.com/ourresearch/unpaywall-journals">Open Source,</a> made with ❤︎ by <a
                    href="https://ourresearch.org">Our Research.</a> | <a href="mailto:team@ourresearch.org">Contact</a>
            </div>
        </v-footer>


    </v-app>
</template>

<script>
    import StartupTutorial from "./components/StartupTutorial"
    import SingleJournal from "./components/SingleJournal"
    import AppBar from "./components/AppBar"

    export default {
        name: 'App',
        components: {
            SingleJournal,
            StartupTutorial,
            AppBar,
        },
        data: () => ({
            drawerRight: false,
            activeViewIndex: 0,
            wizardOpen: false,
        }),
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            singleJournalIssnl() {
                return this.$store.state.singleJournalIssnl
            },
            singleJournalData() {
                return this.$store.state.singleJournalData
            },
            account() {
                return this.$store.state.user
            },
            selectedScenario() {
                return this.$store.getters.selectedScenario
            },

        },
        methods: {
            clearSingleJournal() {
                console.log("clear single journal")
                this.$store.commit('clearSingleJournal')
            },
            openWizard() {
                this.$store.dispatch("openWizard")
            }
        },
        async mounted() {
            try {
                await this.$store.dispatch("fetchUser")
                const data = {
                    user_id: this.$store.getters.userId,
                    name: this.$store.getters.userName,
                }
                if (this.$store.getters.userEmail) data.email = this.$store.getters.userEmail
                this.$intercom.boot(data)
            } catch (e) {
                console.log("user is not logged in.", e)
            }
        },
        watch: {
            "$route": {
                immediate: true,
                handler: function (val) {
                    try {
                        this.$intercom.update()
                    } catch (e) {
                        // it seems like right when the page loads, it throws this error. i can silence it by setting "immediate: false" but i'm afraid that will cause the initial pageload to not be logged to Intercom.
                        const expectedError = "Cannot read property 'apply' of undefined"
                        if (e.message !== expectedError) {
                            throw e
                        }
                    }
                }
            }
        },
    };
</script>

<style lang="scss">
    .v-content {
        background: #fafafa;
    }

    .v-tooltip__content {
        opacity: 1 !important;
    }

    .dot-tooltip-edit-mode-true {
        display: none !important;
    }

    .no-highlight {
        .theme--light.v-btn--active::before {
            opacity: 0;
        }

        .theme--light.v-btn--active:hover::before {
            opacity: .05;
        }
    }

    .breadcrumbs {
        .theme--light.v-btn--active::before {
            opacity: 0;
        }

        .theme--light.v-btn {
            text-transform: none !important;
            padding: 0 5px;
        }

        .theme--light.v-btn--active:hover::before {
            opacity: .05;
        }

    }


    .toolbar-summary {
        display: inline-flex;

        div.bar {
            display: flex;
            flex-direction: column;
            height: 30px;
            width: 20px;
            margin-right: 2px;
            background: #ccc;
        }

        .bar-fill {
            background: #ccc;
            width: 100%;
            display: block;
            flex-grow: 10;
        }

        div.segment {
            width: 100%;
            display: block;

            &.cost {
                background: #555;
            }

            &.free-instant {
                background: green;
            }

            &.paid-instant {
                background: dodgerblue;
            }
        }
    }

    .v-slider--vertical {
        min-height: 400px !important;
        margin: 0 !important;
    }

    .main-footer {
        font-size: 14px;

        a {
            color: #333 !important;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }


    a.low-key-link {
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
    img.gravatar {
        border-radius: 60px;
    }


</style>