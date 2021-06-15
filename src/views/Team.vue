<template>
    <v-container class="mt-3">
        <v-card flat class="pa-6">

            <v-row>
                <v-col cols="12" sm="6">
                    <div class="text-h3 font-weight-bold">
                        Our Team
                    </div>
                    <div class="mt-6">
                        <p>
                            Unsub is a project of <a href="https://ourresearch.org">OurResearch,</a> a
                            nonprofit
                            building tools to help make scholarly research more open, connected, and reusable. We maintain a small full-time team, which helps us stay agile and sustainable. That's us in the picture (clockwise from top):
                        </p>
                        <ul class="mb-4">
                            <li>
                                <strong>Richard Orr</strong> (<a
                                    href="https://twitter.com/unpaywall_dev">Twitter</a>): Lead developer on the <a
                                    href="https://unpaywall.org">Unpaywall</a> project.
                            </li>
                            <li>
                                <strong>Heather
                                    Piwowar</strong> (<a
                                    href="https://docs.google.com/document/d/1S7aKmG_l3wJxAc4lb5gJYMwNVDnAT7HlQWcaXADwA1s/edit?usp=sharing">bio, </a>
                                <a href="https://scholar.google.com/citations?user=1YLq0XMAAAAJ&hl=en">publications, </a>
                                <a href="https://twitter.com/researchremix">Twitter</a>): Co-founder, programmer, doer of many things.
                            </li>
                            <li>
                                <strong>Jason Priem</strong> (<a
                                    href="https://docs.google.com/document/d/1SkUuOYrpfUF-LC7aC1sBa_phG-_qN-f3hkL9fMooTm4/edit?usp=sharing">bio, </a>
                                <a href="https://scholar.google.com/citations?user=w32jC0YAAAAJ&hl=en">publications, </a>
                                <a href="https://twitter.com/jasonpriem">Twitter</a>): Co-founder, programmer, doer of many things.
                            </li>


                        </ul>

                        <p>
                            If you'd like to get in touch, we'd love to hear from you! You can use the little blue message icon on the bottom right of your screen, or drop us an email at <a href="mailto:team@ourresearch.org">team@ourresearch.org</a>

                        </p>
                    </div>
                </v-col>
                <v-col cols="12" sm="6">
                    <div class="pa-3">
                        <v-img class="team" width="100%" src="https://i.imgur.com/9jAEk46.jpg" alt=""/>
                    </div>
                </v-col>
            </v-row>
        </v-card>


    </v-container>
</template>

<script>
    export default {
        name: "Team",
        metaInfo() {
            return {
                title: `Team`
            }
        },
    }
</script>

<style scoped>

</style>