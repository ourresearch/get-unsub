<template>
    <span class="info-link" @click="openInfoDialog">
        <span class="info-link-text">
            {{ text }}</span><v-icon small color="#333333">mdi-information-outline</v-icon>

    </span>
</template>

<script>

    export default {
        props: ['text', 'info-key'],
        components: {},
        name: "InfoLink",
        methods: {
            openInfoDialog(){
                this.$store.commit("showInfo", this.infoKey)
            }
        }
    }
</script>

<style scoped lang="scss">
    .info-link {
        cursor: help;
        .info-link-text {
            border-bottom: 1px dashed #333;

        }
        i {
            vertical-align: 0;
            margin-left: 2px;
        }
    }

</style>