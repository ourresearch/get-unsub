<template>
    <div>
        <span>
            {{journals.length}} <slot></slot>
        </span>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from "vuex";
    import _ from "lodash";
    import {api, toBase64} from "../../api";

    export default {
        name: "PublisherFileJournalsList",
        props: {
            "journals": Array,
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapGetters([
                "publisherId",
            ]),
        },
        methods: {
            ...mapActions([]),
            ...mapMutations([
            ]),
            close(){
                this.errorMsg = null
                this.fileSelected = null
            },

        }
    }
</script>

<style scoped>

</style>