
export default {
    install: function(Vue, options){

        var validation_rules = {
            validate_required: function(value){
                if(value != '' && value != false && value != null && value != undefined) return true;
                return false;
            },

            validate_min: function(amount, value){
                if(value == null || value == undefined || value.length < amount) return false;
                return true;
            },

            validate_max: function(amount, value){
                if(value.length > amount) return false;
                return true;
            },

            validate_alpha: function(value){
                if(value.match(/^[a-z]/i)){
                    return true;
                }
                return false;
            },
            validate_alpha_num: function(value){
                if(value.match(/^[0-9a-z]/i)){
                    return true;
                }
                return false;
            },

            validate_alpha_num_space: function(value){
                if(value.match(/^[0-9a-z/\s]/i)){
                    return true;
                }
                return false;
            },
        }

        if('rules' in options)
        {
            for(var name in options.rules){
                validation_rules[name] = options[name];
            }
        }

        var messagify = function(rule, field){
            if(Array.isArray(rule)){
                return options.messages[rule[0]+"_failed"].replace(":field", field).replace(":rule", rule[1]);
            }
            else {
                return options.messages[rule+"_failed"].replace(":field", field);
            }
        }

        Vue.prototype.$validator = function(rules, field, value, values){
            var split = rules.split('|');
            var messages = [];
            var success = true;
            for(var i = 0; i < split.length; i++){
                if(split[i].includes(':')){
                    var split_rule = split[i].split(':');
                    var name = "validate_"+split_rule[0];
                    if(validation_rules[name](split_rule[1], value, values) == false) {
                        success = false;
                        messages.push(messagify(split_rule, field));
                    }
                }
                else{
                    var name = "validate_"+split[i];
                    if(validation_rules[name](value) == false) {
                        success = false;
                        messages.push(messagify(split[i], field));
                    }
                }
            }
            return {passed: success, messages:  messages};
        }
    }
};