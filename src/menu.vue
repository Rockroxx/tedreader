<template>
    <div id="menu">
        <div class="container">
            <ul>
                <li>
                    <g-a :href="'/'" :click="disableMenu">TED Reader</g-a>
                </li>
                <li id="mobile-menu-button">
                    <a @click="show_menu = !show_menu"><i class="fa fa-bars"></i></a>
                </li>
                <li class="hidden-mobile">
                    <g-a :href="'/about'">About</g-a>
                </li>
                <li class="hidden-mobile">
                    <g-a :href="'/search'">Find Tenders</g-a>
                </li>
            </ul>
            <transition name="left-spring">
                <div v-if="show_menu" id="mobile-menu">
                    <ul>
                        <li>
                            <g-a :href="'/'" :click="disableMenu">Home</g-a>
                        </li>
                        <li>
                            <g-a :href="'/search'" :click="disableMenu">Find Tenders</g-a>
                        </li>
                        <li>
                            <g-a :href="'/about'" :click="disableMenu">About</g-a>
                        </li>
                        <li>
                            <g-a :href="'/sitemap'" :click="disableMenu">Sitemap</g-a>
                        </li>
                        <li>
                            <g-a :href="'/disclaimer'" :click="disableMenu">Disclaimer</g-a>
                        </li>
                    </ul>
                    <div id="right-close-button" @click="disableMenu"></div>
                </div>
            </transition>
            <div style="clear:both"></div>
        </div>
    </div>
</template>

<style lang="scss" type="text/scss">
    @import "./styles/functions";
    @import "./styles/mixins";




    #menu{
        position: absolute;
        left:0;
        right:0;
        height:3em;
        z-index: 500;
        background-color: get-color();
        box-sizing: border-box;
        border-bottom: solid get-color("divider") 0.2em;
        font-weight: 700;
        vertical-align: middle;
        .container{
            height:100%;
        }
        ul{
            height:100%;
            width: 100%;
            margin: 0;
            padding: 0;
            list-style: none;
            clear:both;
            li{
                position: relative;
                height:100%;
                float:right;
                &:first-child{
                    float:left;
                    a{
                        line-height: 2.25;
                        font-size: 125%;
                        @include desktop-wide{
                            margin-left: -1em;
                        }
                    }
                }
                a{
                    color: get-color($type: 'dark');
                    display: block;
                    height:100%;
                    padding: 0 1em;
                    line-height: 3;
                    box-sizing: border-box;
                    &:hover, &.active{
                        text-decoration: none;;
                        background-color: get-color($type: 'light');
                        color: get-color($type: 'dark');
                        border-bottom: solid get-color($base: 'divider') 0.1em;
                        box-shadow: inset 0px 0px 5px 0px;
                    }
                    &.active{
                        &:hover{
                            background-color: darken(get-color($type: 'light'), 5%);
                        }
                    }
                }
                &.hidden-mobile{
                    @include phone{
                        display: none;
                    }
                    @include phone-wide{
                        display: none;
                    }
                }
                &#mobile-menu-button{
                    display: none;
                    @include phone{
                        display: block;
                    }
                    @include phone-wide{
                        display: block;
                    }
                }
            }
        }
        #mobile-menu{
            position: fixed;
            left:0;
            top:2.95em;
            bottom:0;
            right:0;
            z-index:500;
            ul{
                width: 75%;
                top:3em;
                background-color: get-color( $opacity: 0.96);
                border-right: solid get-color($base: 'divider', $type:'light') 0.2em;
                li{
                    float:none;
                    height:auto;
                    border-bottom: solid get-color($type: 'dark') 0.1em;
                    &:first-child{
                        a{
                            line-height: 3;
                            font-size: 100%;
                            padding-left: 1em;
                        }
                    }
                }
                z-index: 100
            }
            #right-close-button{
                position: absolute;
                top:0em;
                right:0;
                bottom:0;
                width:25%;
                background-color: rgba(0, 0, 0, 0.2);
            }
        }
        .left-spring-enter-active {
            transition: all .3s ease;
        }
        .left-spring-leave-active {
            transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
        }
        .left-spring-enter, .left-spring-leave-to {
            transform: translateX(-30px);
            opacity: 0;
        }
    }

</style>

<script type="text/javascript">
    export default {
        name: '',
        methods: {
            disableMenu(){
                this.show_menu = false;
            }
        },
        data(){
            return {
                show_menu: false
            }
        }
    };
</script>