
import Vue from 'vue';
import debounce from 'lodash.debounce';
import mixin from './mixins';

Vue.component('g-form', {
    render(e){
        var self = this;
        return e('form', {
            on: {
                submit(e){
                    self.save(e);
                }
            }
        }, [
            self.messages.map(function (error) {
                return e('div', {class: 'error-message'}, error);
            }), self.$slots.default
        ]);
    },
    props: ['url', "validation", "before", 'after', 'error', 'save-change'],
    data(){
        return {
            values: {},
            messages: [],
            errors: this.error || [],
            loading: false,
            bouncer: debounce(() => {
                this.save();
            }, this.saveChange || 500)
        }
    },
    methods: {
        $upstream(name, value){
            this.values[name] = value;
        },
        $bounce(){
            this.bouncer();
        },
        empty(){
            this.values = {};
        },
        clear(){
            this.errors = [];
            this.messages = [];
            this.$children.forEach((item) => {
                if('$clear' in item){
                    item.$clear();
                }
            });
        },
        validate(){
            var success = true;
            this.$children.forEach((item) => {
                if('$validate' in item){
                    if(item.$validate() === false)
                        success = false;
                }
            });
            if(!success){
                this.messages.push("Please rectify the errors below before continuing.");
                return false;
            }
            return true;
        },
        parseErrors(){
            var errors = {};
            for(var name in this.errors){
                if(name.indexOf('.') > -1){
                    errors = this.recurse(errors, name.split('.'), this.errors[name]);
                }
                else{
                    errors[name] = this.errors[name];
                }
            }
            return errors;
        },
        recurse(errors, arr, value){
            var field = arr.shift();
            if(!errors[field]){
                if(parseInt(field)){
                    errors[field] = [];
                }
                else{
                    errors[field] = {};
                }
            }
            if(arr.length){
                errors[field] = this.recurse(errors[field], arr, value);
            }
            else{
                errors[field] = value;
            }
            return errors;
        },
        setErrors(){
            var errors = this.parseErrors();
            this.$children.forEach((item) => {
                if('$setErrors' in item){
                    for(var name in errors){
                        if(item.name === name || item.path == name){
                            item.$setErrors(errors[name]);
                            continue;
                        }
                    }
                    if(item._name =="<GSteps>"){
                        item.$setErrors(errors)
                    }
                }
            });
            this.messages.push("Please rectify the errors below before continuing.");
        },
        save(e){
            if (e != undefined && 'preventDefault' in e)
                e.preventDefault();
            this.clear();
            this.loading = true;
            var values = this.values;
            if(this.before){
                var values = this.before(values);
                if(values === false)
                {
                    this.loading = true;
                    this.$emit('after', false);
                    return;
                }
            }
            if(this.validate() === false){
                this.loading = false;
                this.$emit('after', false);
                return false;
            }
            this.$http.post(window.api_url+this.url, values).then((res) => {
                this.loading = false;
                if('model' in res.data){
                    this.$emit('input', res.data.model);
                }
                if('errors' in res.data){
                    this.errors = res.data.errors;
                    this.setErrors();
                }
                this.$emit('after', res);
            }, (res) => {

                if('errors' in res.data){
                    this.errors = res.data.errors;
                    this.setErrors();
                }
                if(this.after) {
                    this.after(res);
                }
            });
        }
    }
});

Vue.component('g-submit', {
    render(e){
        return e('button', {type: 'button', class:{'submit':true}}, this.$slots.default);
    }
});

Vue.component('g-a', {
    props: ['href', 'click'],
    render(e){
        var self = this;
        var on = {
            click(e){
                e.preventDefault();
                self.$router.push(self.href);
            }
        };
        if(this.click){
            on = {
                click(e){
                    e.preventDefault();
                    self.click();
                    self.$router.push(self.href);
                }
            }
        }
        return e('a', {
            domProps: {
                href: self.href,
            },
            on:on,
            class: {
                'active': self.$route.path == self.href
            }
        }, this.$slots.default)
    }
});

Vue.component('g-empty', {
    template: '<div><slot></slot></div>',
    props: ['name', 'path', 'vals'],
    data(){
        if(this.vals)
            return {values: this.vals};
        return {};
    },
    mixins: [mixin.passthrough_mixin]
});

Vue.component('g-container', {
    render(e){
        var self = this;
        return e('div', {
            class: {
                'input-container': true,
                hasError: self.errors.length,
                'required': self.required !== undefined
            }
        }, [
            (self.display !== undefined) ? e('label', {for: 'g_' + self.name}, (self.required !== undefined) ? [self.display_name+' ', e('span', {class:'required'}, '*')] : self.display_name) : null,
            self.$slots.default,
            self.errors.map(function (error) {
                return e('div', {class: 'error-list-item'}, error);
            })
        ])
    },
    props: ['name', 'display', 'required'],
    data(){
        return {
            display_name: this.display,
            errors: []
        };
    },
    mixins: [mixin.passthrough_mixin]
});

Vue.component('g-input', {
    render(createElement){
        var self = this;
        return createElement('input', {
            domProps: {
                value: self.val,
                type: self.type || 'text',
                id: 'g_' + self.name
            },
            on: {
                input: function (event) {
                    self.$upstream(self.name, event.target.value);
                    self.value = event.target.value;
                    self.$emit('input', event.target.value);
                    self.$emit('change', event.target.value);
                    if (self.saveChange != undefined) {
                        self.$bounce();
                    }
                }
            }
        })
    },
    props: ['type', 'name', 'saveChange', 'rules', 'val'],
    mixins: [mixin.end_of_line_mixin]
});
Vue.component('g-radio', {
    render(createElement){
        var self = this;
        return createElement('div', {
            style:{
                'text-align':'left'
            }
        },[
            createElement('input', {
                domProps: {
                    value: self.val,
                    type: 'radio'
                },
                on: {
                    input: function (event) {
                        self.$upstream(self.name, event.target.value);
                        self.value = event.target.value;
                        self.$emit('input', event.target.value);
                        self.$emit('change', event.target.value);
                        if (self.saveChange != undefined) {
                            self.$bounce();
                        }
                    }
                }
            }),
            createElement('span', this.$slots.default)
        ]);
    },
    props: ['type', 'name', 'saveChange', 'rules', 'val'],
    mixins: [mixin.end_of_line_mixin]
});

Vue.component('g-textarea', {
    render(createElement){
        var self = this;
        return createElement('textarea', {
            domProps: {
                value: self.val,
                id: 'g_' + self.name
            },
            on: {
                input: function (event) {
                    self.$upstream(self.name, event.target.value);
                    self.value = event.target.value;
                    self.$emit('input', event.target.value);
                    self.$emit('change', event.target.value);
                    if (self.saveChange != undefined) {
                        self.$bounce();
                    }
                }
            }
        })
    },
    props: ['name', 'saveChange', 'rules', 'val'],
    mixins: [mixin.end_of_line_mixin]
});


Vue.component('g-checkbox', {
    render(l){
        var self = this;
        this.$upstream(this.name, this.value ? this.true_val : this.false_val);
        var req = self.rules && self.rules.indexOf('required') > -1;
        return l('label', {
            domProps: {
                for: "g_" + self.name,
            },
            class: {
                hasError: self.errors.length,
                required: req
            }
        }, [
            self.errors.map(function (item) {
                return l('div', {
                    class: {
                        'error-list-item': true
                    },
                }, item);
            }),
            l('input', {
                domProps: {
                    checked: self.value,
                    value: self.true_val,
                    type: 'checkbox',
                    id: 'g_' + self.name
                },
                on: {
                    change(event){
                        self.$upstream(self.name, event.target.checked ? self.true_val : self.false_val);
                        self.$emit('input', event.target.checked ? self.true_val : self.false_val);
                        self.$emit('change', event.target.checked ? self.true_val : self.false_val);
                        if (self.saveChange != undefined) self.$bounce();
                    }
                }
            }),
            (self.rules !== undefined && self.rules.indexOf('required') > -1) ? [self.display_name, l('span', {class:'required'}, '*')] : self.display_name
        ])
    },
    props: ['name', 'saveChange', 'true', 'false', 'rules', 'val'],
    mixins: [mixin.passthrough_mixin, mixin.end_of_line_mixin],
    data(){
        return {
            display_name: this.display || this.$slots.default,
            true_val: this.true || true,
            false_val: this.false || false,
            errors: []
        }
    },
});



Vue.component('g-select', {
    render(createElement){
        var self = this;
        return createElement('select', {
            domProps: {
                id: 'g_' + self.name
            },
            on: {
                change: function (event) {
                    self.$upstream(self.name, event.target.value);
                    self.value = event.target.value;
                    self.$emit('input', event.target.value);
                    self.$emit('change', event.target.value);
                    if (self.saveChange != undefined) {
                        self.$bounce();
                    }
                },
                select: function (event) {
                    self.$upstream(self.name, event.target.value);
                }
            }
        }, self.options.map((option) => {
            return createElement('option', {
                domProps: {
                    value: option.value,
                    selected: self.val == option.value
                }
            }, option.name || option.value);
        }));
    },
    props: ['name', 'saveChange', 'rules', 'val', 'options'],
    mixins: [mixin.end_of_line_mixin],
});