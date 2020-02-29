<template>
    <b-container class="mt-5 mb-5">
        <b-row align-h="center">
            <b-col lg="10">
                <div class="page page-about">
                    
                    <b-row>
                        <b-col lg="8">
                            <h1>About</h1>
                            <div class="page-content" v-html="results.rendered"></div>
                        </b-col>
                        <b-col lg="3" class="ml-auto">
                            <b-row>
                                <b-col sm="6" md="3" lg="12">
                                    <a href="http://www.hjolafaerni.is/" target="blank"><img src="/logos/hjolafaerni.png" class="logos logos-hjolafaerni" alt="Hjolafaerni logo"></a>
                                </b-col>

                                <b-col sm="6" md="3" lg="12">
                                    <img src="/logos/hugarflug.png" class="logos logos-hugarflug" alt="Hugarflug logo">
                                </b-col>
                                
                                <b-col sm="6" md="3" lg="12">
                                    <img src="/logos/leidalykill.png" class="logos logos-leidalykill" alt="leidalykill logo">
                                </b-col>
                                
                                <b-col sm="6" md="3" lg="12">
                                    <a href="http://www.vegagerdin.is/" target="blank"><img src="/logos/vegagerdin.png" class="logos logos-vegagerdin" alt="Vegagerdin logo"></a>
                                </b-col>
                                
                                <b-col sm="6" md="3" lg="12">
                                    <a href="http://www.ferdamalastofa.is/" target="blank"><img src="/logos/istourist.png" class="logos logos-istourist" alt="Iceland Tourist Board logo"></a>
                                </b-col>
                                
                            </b-row>

                        </b-col>
                    </b-row>
                    
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        
    },
    data () {
        return {
            results: {} 
        }
    },
    mounted() {
        var self = this
        axios.get('https://wp.publictransport.is/wp-json/wp/v2/pages/434').then((res) => {
        self.results = res.data.content
    })
  },
}
</script>

<style lang="scss" scoped>
    .page-content img {
        max-width: 100%;
        height: auto;
    }

    .page-about {
        margin-top: 56px;
    }

    img {
        max-width: 100%;
        height: auto;
    }
</style>

