<template>
    <v-list-item @click.stop="$emit('edit', data.name)">
        <v-list-item-content class="body-2">
            {{data.displayName}}
        </v-list-item-content>
        <v-list-item-action class="font-weight-bold pl-2">
            <span class="percent" v-if="data.display==='percent'">
                {{data.value}}%
            </span>
            <span class="number" v-if="data.display==='number'">
                {{data.value}}
            </span>
            <span class="dollars" v-if="data.display==='dollars'">
                {{data.value | currency}}
            </span>
            <span class="boolean" v-if="data.display==='boolean'">
                {{data.value }}
            </span>
        </v-list-item-action>
        <v-list-item-action>
            <v-btn icon text >
                <v-icon small>mdi-pencil-outline</v-icon>
            </v-btn>
        </v-list-item-action>
    </v-list-item>
</template>

<script>
    export default {
        name: "Config",
        props: ["data"],
        data: () => ({
        }),
    }
</script>

<style scoped>

</style>