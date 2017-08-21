
var passthrough_mixin = {
    methods: {
        $updateName(value){

        },
        $upstream(name, value){
            this.$updateName(value);
            if('$upstream' in this.$parent){
                if(this.values != undefined){
                    this.values[name] = value;
                    var name = (this.path !== undefined) ? this.path : this.name;
                    this.$parent.$upstream(name, this.values);
                }
                else
                    this.$parent.$upstream(name, value);
            }
        },
        $setErrors(errors) {
            this.$children.forEach((item) => {
                for(var name in errors){
                    if(item.name == name || item.path == name)
                        item.$setErrors(errors[name]);
                }
            });
            if(this.errors)
                this.errors = errors;
        },
        $clear(){
            this.$children.forEach((item) => {
                if('$clear' in item)
                    item.$clear();

                if('hasError' in item)
                    item.hasError = false;
            });
            if(this.errors)
                this.errors = [];
        },
        $validate(){
            var success = true;
            this.$children.forEach((item) => {
                if('$validate' in item){
                    if(item.$validate() === false){
                        success = false;
                    }
                }
            });
            if('hasError' in this)
                this.hasError = !success;
            return success;
        },
        $bounce(){
            this.$parent.$bounce();
        }
    }
};

var end_of_line_mixin = {
    model: {
        prop: 'val',
        event: 'input'
    },
    watch: {
        val: function (value) {
            this.value = value;
            this.$upstream(this.name, value);
        },
    },
    methods: {
        $upstream(name, value){
            if('$upstream' in this.$parent){
                this.$parent.$upstream(name, value);
            }
        },
        $clear(){
            this.$el.valid = true;
            if(this.errors)
                this.errors = [];
        },
        $validate(){
            var success = true;
            var errors = [];
            if(this.rules){
                var name = this.$parent.name || this.name;
                if(name.indexOf('.')) name = name.split('.')[0];

                var all_values = [];
                if ('values' in this.$parent) all_values = this.$parent.values;
                else if ('values' in this.$parent.$parent) all_values = this.$parent.$parent.values;

                var validated = Vue.$validate(this.rules, name, this.value, all_values);
                if (validated[0]) {
                    var el = this.$el;
                    if('checkValidity' in this.$el){
                        success = this.$el.checkValidity();
                    }
                    else if('checkValidity' in this.$el.children[0])
                        success = this.$el.children[0].checkValidity();
                }
                else {
                    errors = validated[1];
                    success = false;
                }
            }
            this.$parent.errors = errors;
            if(this.errors)
                this.errors = errors;
            return success;
        },
        $bounce(){
            this.$parent.$bounce();
        }
    },
    data(){
        return {
            value: this.val || null
        }
    },
    mounted(){
        this.$upstream(this.name, this.val || null);
    },
};

export default {passthrough_mixin, end_of_line_mixin};