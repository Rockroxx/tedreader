<template>
    <div class="category-browser-container">
        <label>{{categories.length}} Categories Selected</label>
        <button class="show-browser-button" type="button" @click="show_browser = true">Categories</button>
        <transition name="left-spring">
            <div class="browser" v-show="show_browser">
                <div class="items-container">
                    <cpv-item v-for="cpv in list" :key="cpv.id" :item="cpv" :depth="0" v-model="categories"></cpv-item>
                </div>
            </div>
        </transition>
        <div class="close-button" v-if="show_browser" @click="show_browser = false"></div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import '../styles/mixins';
    @import '../styles/functions';

    .category-browser-container{
        .browser{
            position: fixed;
            left:0;
            top:0;
            bottom: 0;
            width: 70%;
            background-color:get-color($opacity: 0.86);
            border-right: solid get-color($base: 'divider') 0.2em;
            margin-top: 0;
            z-index: 200;
            overflow-y: scroll;
            .items-container{
                margin-top: 4em;
            }
        }

        .close-button{
            position: fixed;
            top:0;
            bottom:0;
            right:0;
            width:30%;
            background-color: rgba(0,0,0,0.2);
        }
    }
</style>

<script type="text/javascript">
    import CPV_Item from './category.vue';
    import mixins from '../common/form/mixins';

    export default {
        name: 'cpv-browser',
        components: {
            "cpv-item": CPV_Item
        },
        data(){
            return {
                show_browser: false,
                list: [],
                categories: [],
                initial: false
            }
        },
        watch:{
            "value": function(value){
                if(!Array.isArray(value) && value != "")
                    this.categories = this.value.split(',');
            },
            "categories": function(value){
                if(Array.isArray(value)){
                    this.$upstream('categories', this.categories.join(','));
                    this.$emit('input', this.categories.join(','));
                    if(this.initial == true) {
                        if (this.saveChange !== undefined) {
                            this.$bounce();
                        }
                    }
                    else{
                        this.initial = true;
                    }
                }
            }
        },
        mounted(){
            if(this.value){
                this.value = this.value.split(',');
            }
            if(!window.categories_list){
                this.$http.get(window.api_url+'categories').then((response) => {
                    this.list = response.data;
                })
            }
            else this.list = window.categories_list;
        },
        props: ["value", "saveChange"],
        mixins: [mixins.passthrough_mixin]
    };
</script>