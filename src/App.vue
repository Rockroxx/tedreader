<template>
  <div id="app">
    <top-menu></top-menu>
    <router-view></router-view>
    <bottom-footer></bottom-footer>
    <div style="clear:both"></div>
  </div>
</template>

<script>
    import menu from './menu.vue';
    import footer from './footer.vue';

    export default {
        name: 'app',
        components: {
            'top-menu': menu,
            'bottom-footer': footer
        }
    }
</script>

<style lang="scss" type="text/scss">
  @import "styles/mixins";
  @import "styles/functions";

  @import "styles/pagination";
  * {
    margin: 0;
    padding: 0;
    border: 0;
    outline: 0;
    font-size: 100%;
    vertical-align: baseline;
    background: transparent;
    box-sizing: border-box;
  }
  html{
    height:100%;
  }
  body{
    min-height:100%;
    height:100%;

  }
  .container{
    position: relative;
    margin: auto;

    @include desktop{
      width: 1024px;
    }
  }

  #app{
    position: relative;
    margin-top:0em;
    min-height:100%;
  }
  .input-container{
    clear:both;
    label{
      float: left;
      padding-left: 1em
    }
    label > input{
      text-align: left;
      display: inline-block;
      width: auto;
    }
  }
  input, button, select{
    display: block;
    padding: 0.5em;
    border: solid get-color() 0.1em;
    box-shadow: none;
    outline: none;
    box-sizing: border-box;
    margin-bottom: 0.25em;
    margin-top: 0.25em;
    width:100%;
    background-color: transparent;
  }
  button:hover{
    cursor: pointer;
  }
  p{
    padding: 0 .5em;
  }
  a{
    color: inherit;
    text-decoration: none;
    color: get-color();
    &:visited{

    }
    &:hover{
      text-decoration: underline;
      cursor: pointer;
      color: get-color($type: 'dark');
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
</style>
