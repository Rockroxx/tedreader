<template>
    <div class="cpv-item-container" :class="'depth-'+depth">
        <div class="cpv-item">
            <a class="children-button" v-if="item.children.length" @click="showing_children = !showing_children"><i class="fa" :class="{'fa-caret-right': !showing_children, 'fa-caret-down': showing_children}"></i></a>
            <div class="spacer" v-else></div>
            <span>{{item.name}}</span>
            <input type="checkbox" @change="setValue($event)">
            <div style="clear:both"></div>
        </div>
        <div class="cpv-item-children" v-if="showing_children">
            <cpv-item v-for="cpv in item.children" :key="cpv.id" v-model="value" :depth="depth+1" :item="cpv"></cpv-item>
        </div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import '../styles/functions';
    @import '../styles/mixins';
    .cpv-item-container{
        border-left: dotted get-color($type: 'dark') 0.05em;
        margin-left: 10px;
        &.depth-0{
            margin-left: 0;
            border-left: 0;
        }
        .cpv-item{
            text-align: left;
            vertical-align: middle;
            .children-button{
                display:block;
                float:left;
                color: get-color($type: 'dark');
                top: 0;
                bottom: 0;
                font-size: 2em;
                padding: 0 0.5em;
                width: 2em;
                text-align: center;
            }
            .spacer{
                display:block;
                height: 2em;
                width: 4em;
                padding: 0 0.5em;
                float:left;
            }
            span{
                line-height: 3;
            }
            input{
                float:right;
                display: inline-block;
                width:2em;
                height:2em;
                margin-right: 2em;
            }

        }
    }
</style>

<script type="text/javascript">
    export default {
        name: 'cpv-item',
        data(){
            return {
                selected: false,
                showing_children: false,
                list: window.categories_list
            };
        },
        mounted(){
            for(var i = 0; i < this.value.length; i++){
                if(this.value[i] == this.item.code){
                    this.$el.children[0].children[2].checked = true;
                }
                if(this.item.code != this.value[i] && this.item.code.substr(0, this.value[i].length) == this.value[i]){
                    this.setDisabled();
                }
            }
        },
        methods:{
            setValue(event){
                var l = this.value;
                if(event.target.checked){
                    l.push(this.item.code);
                    this.$children.forEach((child) => {
                        child.setDisabled();
                    });
                }
                else
                {
                    l.splice(this.value.indexOf(this.item.code), 1);
                    this.$children.forEach((child) => {
                        child.setEnabled();
                    });
                }
                this.$emit('input', l);
            },
            setDisabled(){
                this.$el.children[0].children[2].checked = true;
                this.$el.children[0].children[2].disabled = true;
                var index = this.value.indexOf(this.item.code);
                if(index > -1)
                    this.value.splice(index, 1);
                this.$children.forEach((child) => {
                    child.setDisabled();
                });
            },
            setEnabled(){
                this.$el.children[0].children[2].checked = false;
                this.$el.children[0].children[2].disabled = false;

                this.$children.forEach((child) => {
                    child.setEnabled();
                });
            }
        },
        props: ['item', 'depth', 'value']
    };
</script>