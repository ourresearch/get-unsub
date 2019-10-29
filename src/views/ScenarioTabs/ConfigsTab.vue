<template>
    <v-container fluid class="tab">
        <v-row>
            <v-col cols="4">
                <v-text-field
                        v-for="(configVal, configName) in data"
                        v-model="data[configName]"
                        :key="configName"
                    :label="configName"
                    outlined
                  ></v-text-field>

            </v-col>
        </v-row>


        <pre>{{data}}</pre>
    </v-container>
</template>

<script>
    export default {
        props: ["data"],
        name: "ConfigsTab"
    }
</script>

<style scoped>

</style>