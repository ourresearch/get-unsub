<template>
    <span class="config-edit-link" @click="editConfig(configKey)">
        <span class="config-link-text">
            {{ text }}</span><v-icon small color="#333333">mdi-pencil-outline</v-icon>
    </span>
</template>

<script>

    export default {
        props: ['text', 'config-key'],
        components: {},
        name: "ConfigEditLink",
        methods: {
            editConfig(configKey) {
                this.$store.commit("showEditConfig", configKey)
            },
        }
    }
</script>

<style scoped lang="scss">
    .config-edit-link {
        cursor: pointer;
        .config-link-text {
            border-bottom: 1px dashed #333;

        }
        i {
            vertical-align: 0;
            margin-left: 2px;
        }
    }

</style>