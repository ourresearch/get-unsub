<template>
    <v-app>

        <v-main>
            <app-bar />
            <router-view class="mb-12" />
            <single-journal />
        </v-main>
        <site-footer />

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
            <template v-slot:action="{ attrs }">
                <v-btn
                        text
                        v-bind="attrs"
                        @click="$store.commit('closeSnackbar')"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>




    </v-app>
</template>

<script>
    import SingleJournal from "./components/SingleJournal/SingleJournal"
    import AppBar from "./components/AppBar"
    import SiteFooter from "./components/SiteFooter";

    export default {
        name: 'App',
        components: {
            SingleJournal,
            AppBar,
            SiteFooter,
        },
        metaInfo: {
            // if no subcomponents specify a metaInfo.title, this title will be used
            title: 'Unsub',
            titleTemplate: '%s | Unsub',
            link: [
                // copied over from unpaywall
                // {rel: 'favicon', href: 'favicon.png'},
                // {
                //     rel: 'chrome-webstore-item',
                //     href: 'https://chrome.google.com/webstore/detail/iplffkdpngmdjhlpjmppncnlhomiipha'
                // },
            ],

            meta: []
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
            },
        },

        async mounted() {
        },
        watch: {
            "$route": {
                immediate: false,
                handler: function (val) {
                    window.Intercom('update')

                    // const that = this
                    // setTimeout(function () {
                    //     console.log("running intercom.update()  ")
                    //     that.$intercom.update()
                    // }, 500)
                }
            }
        },
    };
</script>

<style lang="scss">
    .v-main {
        background: #fafafa;
    }

    .v-tooltip__content {
        /*opacity: 1 !important;*/
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
            color: #fff !important;
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

    // hack to get rid of vue's active class on buttons, which makes them display different
    // when they are linking to the page you're on right now.
    // https://github.com/vuetifyjs/vuetify/issues/8172#issuecomment-596935920
    // you have to also add this to the button:
    // <v-btn active-class="no-active"></v-btn>

    .v-btn--active.no-active::before {
        opacity: 0 !important;
    }


</style>