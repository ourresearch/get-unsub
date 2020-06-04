<template>
    <v-card flat class="pa-3">

        <v-row class="section py-6">
            <v-col cols="4">
                <div class="title">
                    {{config.displayName}}
                </div>
                <div class="body-2">
                    {{ config.descr }}
                </div>
            </v-col>
            <v-col cols="8">
                <publisher-file-option
                        :key="option.heading"
                        v-for="option in config.options"
                        :option="option"
                />
            </v-col>
        </v-row>


    </v-card>


</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";
    import PublisherFileOption from "./PublisherFileOption";


    export default {
        name: "PublisherSetupTab",
        components: {
            PublisherFileUpload,
            PublisherFileJournalsList,
            PublisherFileOption,
        },
        props: {
            config: Object,
        },
        data() {
            return {
                dialogs: {
                    uploadFile: false,
                    deleteFile: false,
                },
                snackbars: {
                    uploadSuccess: false,
                    deleteSuccess: false
                },
            }
        },
        computed: {
            ...mapGetters([
                "publisherName",
                "publisherId",
                "publisherBigDealCost",
                "publisherJournals",
            ]),




        },
        methods: {
            clickOption(option){
                console.log("clickOption", option)
                if (option.isSelected) return
                if (option.isDefault) this.dialogs.deleteFile = true
                else this.dialogs.uploadFile = true
            },
        },
        created() {
        },
        mounted() {
        },
        watch: {}
    }
</script>

<style lang="scss">

    .v-radio {
        align-items: flex-start;
        padding: 0 0 20px 0;
    }

    .v-input--selection-controls .v-radio > .v-label {
        display: block;
        margin-top: -7px;
    }

</style>