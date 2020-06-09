<template>
    <div>
        <div class="option-row d-flex">
            <div class="title pl-7">
                Perpetual access, baby
            </div>
            <v-spacer />
            <publisher-file-upload file-type="perpetualAccess" />
        </div>
        <div class="option-row d-flex" v-if="isUploaded">
            <div class="title pl-7">
                Perpetual access is uploaded
            </div>
        </div>

    </div>
</template>


<script>
    import _ from "lodash"
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {api} from "../../api";
    import PublisherFileUpload from "../PublisherFile/PublisherFileUpload";
    import PublisherFileJournalsList from "./PublisherFileJournalsList";
    import PublisherFileOption from "./PublisherFileOption";


    export default {
        name: "PublisherFileCounter",
        components: {
            PublisherFileUpload,
            PublisherFileJournalsList,
            PublisherFileOption,
        },
        props: {},
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
                "publisherFiles",
            ]),
            myFileInfo(){
                return this.publisherFiles.find(f => f.id === "perpetualAccess")
            },
            isUploaded(){
                return this.myFileInfo.uploaded
            },


        },
        methods: {
            clickOption(option) {
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