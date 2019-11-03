<template>
        <v-dialog v-model="$store.state.singleJournalId" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card v-if="journal">
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="clearSingleJournal">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Single Journal</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
<!--                        <v-btn dark text @click="dialog = false">Save</v-btn>-->
                    </v-toolbar-items>
                </v-toolbar>
                <v-card-text>
                    <div class="top mt-8">
                        <div class="body-2">{{ journal.issn_l  }}</div>
                        <h1 class="display-3">{{journal.title}}</h1>
                        <div>Publisher: Elsevier</div>
                        <div>Topic: {{journal.subject}}</div>
                    </div>

                    <div>
                        <pre>
                            {{journal}}
                        </pre>
                    </div>





                </v-card-text>
            </v-card>
        </v-dialog>
</template>

<script>
    export default {
        name: 'SingleJournal',
        components: {},
        data: () => ({
            drawerRight: false,
        }),
        computed: {
            summary() {
                return this.$store.getters.summary
            },
            loading() {
                return this.$store.state.tabDataLoading
            },
            singleJournalIssnl(){
                return this.$store.state.singleJournalIssnl
            },
            data(){
                return this.$store.state.singleJournalData
            },
            journal(){
                if (this.$store.state.singleJournalData){
                    return this.$store.state.singleJournalData.journal
                }
            }

        },
        methods: {
            clearSingleJournal(){
                console.log("clear single journal")
                this.$store.commit('clearSingleJournal')
            },
        }
    };
</script>

<style scoped>

</style>