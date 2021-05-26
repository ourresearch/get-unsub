<template>


    <v-card flat tile class="selling-points-card" style="padding: 150px 0;">
        <v-container class="my-5">
            <v-row>
                <v-col cols="12" sm="4" v-for="sellingPoint in sellingPoints">
                    <v-card flat tile class="pa-3">
                        <div class="text-center">
                            <img :src="require(`../../assets/illustrations/${sellingPoint.img}.png`)" alt="">
                        </div>
                        <div class="text-h4 text-center d-flex justify-center selling-point-header" >
                            {{sellingPoint.header}}
                        </div>
                        <div class="pt-8" style="font-size: 18px;">
                            {{sellingPoint.text}}
                        </div>
                    </v-card>
                </v-col>


            </v-row>
        </v-container>


    </v-card>


</template>

<script>
    const sellingPoints = [
        {
            img: "globe",
            color: "",
            header: "See the big picture",
            text: "Account for overlap with Open Access and your Post-Termination Access rights, and layer in journal-level citation and authorship data from your faculty."
        },
        {
            img: "clipboard",
            color: "",
            header: "Explore your options",
            text: "Explore different title-by-title subscription scenarios, and forecast the five-year impact on your library's costs and fulfillment."
        },
        {
            img: "hourglass",
            color: "",
            header: "Save time",
            text: "Ditch the complex spreadsheets--just upload your COUNTER reports and PTA (Post-Termination Access) rights, and let Unsub do the rest."
        },
    ]


    export default {
        name: "UserLogos",
        data() {
            return {
                sellingPoints,
            }
        }
    }
</script>

<style lang="scss">


    .selling-points-card {
        img {
            height: 160px;
        }
    }

</style>