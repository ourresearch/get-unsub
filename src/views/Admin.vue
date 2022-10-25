<template>
    <v-container class="mt-3">
        <v-card-title flat class="pa-6">        
            <div class="text-h3 mb-6 font-weight-bold">
                Unsub Admin
            </div>
        </v-card-title>
               
        <v-card flat class="pa-6">
            <div class="text-h4 mb-6 font-weight-bold">
                Add an institution
            </div>
            <p>Look up the institution's ROR ID at <a href="https://ror.org/">ror.org</a></p>
            <p>This can take a while as this step requires populating a database table that can be slow</p>
            <v-form
                v-model="addInstitutionFormIsValid"
                ref="form"
                class="pa-3"
                :disabled="addInstitutionFormIsLoading"
                v-if="!addInstitutionFormIsSubmitted"
            >
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formDataAddInst.institution"
                            label="Institution Name"
                            outlined
                            :rules="stringRules"
                            required
                            hint="e.g., University of Arizona"
                            persistent-hint
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formDataAddInst.ror"
                            label="ROR ID(s)"
                            outlined
                            required
                            hint="Single ID (e.g. 01wka8n18) or many (e.g. 01wka8n18,03kk7td41)"
                            persistent-hint
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-btn
                            @click="addInstSubmit"
                            color="primary"
                            x-large
                            :loading="addInstitutionFormIsLoading"
                        >
                            Add
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>

        <v-card flat class="pa-6">
            <div class="text-h4 mb-6 font-weight-bold">
                Add a user to an institution
            </div>
            <p>
                Two separate use cases for this form:
                <ul>
                    <li>Add a user to a Jisc institution. <strong>Only fill in email, Jisc ID, and permissions</strong></li>
                    <li>Add a user to any other institution. <strong>Fill in email, institution id, permissions</strong></li>
                </ul>
            </p>
            <p>Person's name and password are optional, and typically we don't fill these out</p>
            <p>Unless otherwise asked by the user, choose "Admin" for Permissions</p>
            <v-form
                v-model="addUserFormIsValid"
                ref="form"
                class="pa-3"
                :disabled="addUserFormIsLoading"
                v-if="!addUserFormIsSubmitted"
            >
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formDataAddUser.email"
                            type="email"
                            label="Email"
                            outlined
                            :rules="emailRules"
                            required
                        />
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formDataAddUser.institution"
                            label="Institution ID"
                            outlined
                            hint="e.g., institution-qfB9zhq5upVN"
                            persistent-hint
                        />
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field
                            v-model="formDataAddUser.jiscid"
                            label="3 letter Jisc ID"
                            outlined
                            :rules="stringRules"
                            hint='e.g., "hul" for University of Hull'
                            persistent-hint
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="3">
                        <v-text-field
                            v-model="formDataAddUser.name"
                            type="name"
                            label="Person's Name"
                            outlined
                        />
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-select
                            v-model="formDataAddUser.permissions"
                            :items="permission_levels"
                            item-text="role"
                            item-value="role_values"
                            label="Permissions"
                            outlined
                        />
                    </v-col>
                    <v-col cols="12" md="2">
                        <v-text-field
                            v-model="formDataAddUser.password"
                            label="Password"
                            outlined
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="2">
                        <v-btn
                            @click="addUserSubmit"
                            color="primary"
                            x-large
                            :loading="addUserFormIsLoading"
                        >
                            Add
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>

        <v-card flat class="pa-6">
            <div class="text-h4 mb-6 font-weight-bold">
                Remove user access from an institution
            </div>
            <p>This action does not delete the user or the institution. This action removes permissions for the user and institution pair. Access can be given back by usign the "Add a user to an institution" form above.</p>
            <p>You can look up institution IDs in the Unsub database, or the <a href="https://docs.google.com/spreadsheets/d/1QRHMFxr9KyTjnmmk9uubCPP80RRcXald-MButhp2ZwQ/edit#gid=1782987841">institution level summary spreadsheet</a>.</p>
            <v-form
                v-model="removeUserFormIsValid"
                ref="form"
                class="pa-3"
                :disabled="removeUserFormIsLoading"
                v-if="!removeUserFormIsSubmitted"
            >
                <v-row>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formDataRemoveUser.email"
                            type="email"
                            label="Email"
                            outlined
                            :rules="emailRules"
                            required
                        />
                    </v-col>
                    <v-col cols="12" md="4">
                        <v-text-field
                            v-model="formDataRemoveUser.institution"
                            label="Institution ID"
                            outlined
                            :rules="stringRules"
                            required
                            hint="e.g., institution-qfB9zhq5upVN"
                            persistent-hint
                        />
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="12" md="4">
                        <v-btn
                            @click="removeUserSubmit"
                            color="primary"
                            x-large
                            :loading="removeUserFormIsLoading"
                        >
                            Remove
                        </v-btn>
                    </v-col>
                </v-row>
            </v-form>
        </v-card>


    </v-container>
</template>

<script>
    import {api} from "../api";
    import Vue from 'vue'
    import appConfigs from "../appConfigs";

    export default {
        name: "Admin",
        metaInfo() {
            return {
                title: `Unsub Admin`
            }
        },
        data() {
            return {
                formDataAddInst: {
                    institution: "",
                    ror: "",
                },
                formDataAddUser: {
                    email: "",
                    institution: "",
                    name: "",
                    permissions: "",
                    password: "",
                    jiscid: "",
                },
                formDataRemoveUser: {
                    email: "",
                    institution: "",
                },
                stringRules: [
                    v => !!v || "This field is required."
                ],
                emailRules: [
                    v => !!v || "This field is required.",
                    v => /.+@.+/.test(v) || 'This email isn\'t valid.',
                    v => {
                        if (/gmail|hotmail|yahoo|inbox\.ru|qq\.com/.test(v)) {
                            return 'This looks like a personal email address.'
                        }
                        else return true
                    }
                ],
                addInstitutionFormIsValid: false,
                addUserFormIsValid: false,
                removeUserFormIsValid: false,
                addInstitutionFormIsLoading: false,
                addUserFormIsLoading: false,
                removeUserFormIsLoading: false,
                addInstitutionFormIsSubmitted: false,
                addUserFormIsSubmitted: false,
                removeUserFormIsSubmitted: false,
            }
        },
        computed: {
            permission_levels() {
                return [
                    {
                        role: "Admin",
                        role_values: "admin,modify,view",
                    },
                    {
                        role: "Collaborator",
                        role_values: "modify,view",
                    },
                    {
                        role: "Viewer",
                        role_values: "view",
                    },
                ]
            }
        },
        methods: {
            async addInstSubmit() {
                // this.$refs.form.validate()
                if (!this.addInstitutionFormIsValid) {
                    console.log("add institution form is not ready")
                    return
                }
                const url = `institution`
                console.log("adding an institution", url)
                const postData = {
                    institution_name: this.formDataAddInst.institution,
                    ror_ids: this.formDataAddInst.ror,
                }
                this.addInstitutionFormIsLoading = true
                const resp = await api.post(url, postData)
                this.addInstitutionFormIsLoading = false
            },
            async addUserSubmit() {
                this.$refs.form.validate()
                if (!this.addUserFormIsValid) {
                    console.log("add user form is not ready")
                    return
                }
                const url = `user`
                console.log("adding a user to an institution", url)
                const postData = {
                    name: this.formDataAddUser.name,
                    email: this.formDataAddUser.email,
                    institution_id: this.formDataAddUser.institution,
                    permissions: this.formDataAddUser.permissions,
                    password: this.formDataAddUser.password,
                    jiscid: this.formDataAddUser.jiscid,
                }
                this.addUserFormIsLoading = true
                const resp = await api.post(url, postData)
                this.addUserFormIsLoading = false
            },
            async removeUserSubmit() {
                // this.$refs.form.validate()
                if (!this.removeUserFormIsValid) {
                    console.log("remove user form is not ready")
                    return
                }
                const url = `user/remove-access`
                console.log("removing a user from an institution", url)
                const postData = {
                    email: this.formDataRemoveUser.email,
                    institution_id: this.formDataRemoveUser.institution,
                }
                this.removeUserFormIsLoading = true
                const resp = await api.post(url, postData)
                this.removeUserFormIsLoading = false
            },
        }
    }
</script>

<style scoped>

</style>
