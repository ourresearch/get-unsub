<template>
    <v-container class="login">
        <v-row class="pt-12"  align="center" justify="center">
                <v-card width="400">
                    <v-card-title>
                        Log in to your account
                    </v-card-title>
                    <v-card-text>
                        <div>
                        <v-text-field
                                label="Username"
                                placeholder="Username"
                                outlined
                        ></v-text-field>
                        <v-text-field
                                label="Password"
                                placeholder="Password"
                                outlined
                                type="password"
                        ></v-text-field>

                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn large depressed color="primary">
                            Log in
                        </v-btn>
                    </v-card-actions>
                </v-card>
        </v-row>


    </v-container>
</template>

<script>
    export default {
        name: "Login"
    }
</script>

<style scoped>

</style>