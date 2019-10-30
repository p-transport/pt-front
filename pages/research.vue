<template>
    <b-container class="mt-5 mb-5">
        <b-row align-h="center">
            <b-col lg="10">
                <div class="page page-about">
                    
                    <b-row align-h="center">
                        <b-col lg="8">
                            <h1>Research project on improved public transport in rural areas of Iceland</h1>
                            <div class="page-content" v-html="results.rendered"></div>
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
        axios.get('http://wp.publictransport.is/wp-json/wp/v2/pages/488').then((res) => {
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

