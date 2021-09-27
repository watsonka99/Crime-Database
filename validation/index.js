// A class of validation methods used to ensure user input is correct - Ryan Donnelly

const validation = {

    badInputs : ["<", ">", "!", "{", "}", "insert", "into", "where", "script", "delete", "input"], //declare an array of bad inputs
    
    /**
     * a method checking if the input contains any of the elements of the array badInputs
     * @param {*} data - data that needs to be validated (Does it contain any bad inputs?)
     */
    containsBadData: function(data){ 
        for(i = 0; i < this.badInputs.length; i++){
            if(String(data).includes(String(this.badInputs[i]))){
                return true;
            }
        }
        return false
    },
    
    //validation for crimes
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} firstName - data that needs to be validated 
     */
    validateFirstName: function(firstName){
        var re = new RegExp("[A-Za-z]{1,50}");
        var contains = this.containsBadData(firstName); 
        if(firstName = "" || !re.test(firstName) || contains == true){ 
            return false 
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} lastName - data that needs to be validated
     */        
    validateLastName: function(lastName){
        var re = new RegExp("[A-Za-z]{1,50}");
        var contains = this.containsBadData(lastName);
        if(lastName = "" || !re.test(lastName) || contains == true){
            return false
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} date - data that needs to be validated
     */  
    validateDate: function(date){
        var re = new RegExp("^(((0[1-9]|[12][0-9]|30)[-/]?(0[13-9]|1[012])|31[-/]?(0[13578]|1[02])|(0[1-9]|1[0-9]|2[0-8])[-/]?02)[-/]?[0-9]{4}|29[-/]?02[-/]?([0-9]{2}(([2468][048]|[02468][48])|[13579][26])|([13579][26]|[02468][048]|0[0-9]|1[0-6])00))$");
        var contains = this.containsBadData(date);
        if(date = "" || !re.test(date) || contains == true){
            return false;
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} time - data that needs to be validated
     */  
    validateTime: function(time){
        var re = new RegExp("/(?:[01]\d|2[0-3]):(?:[0-5]\d):(?:[0-5]\d)/");
        var contains = this.containsBadData(time);
        if(time = "" || !re.test(time) || contains == true){
            return false
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} postcode - data that needs to be validated
     */  
    validatePostcode: function(postcode){
        var re = new RegExp("^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$");
        var contains = this.containsBadData(postcode);
        if(postcode = "" || !re.test(postcode) || contains == true){
            return false
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} classification - data that needs to be validated
     */  
    validateClassification: function(classification){
        var re = new RegExp("^(Group 1|Group 2|Group 3)$");
        var contains = this.containsBadData(classification);
        if(classification = "" || !re.test(classification) || contains == true){
            return false
        }
        return true
    },


    //validation for people
    /**
     * check if the input: is blank, not between the predefined age range, or contains any bad inputs
     * @param {*} lastName - data that needs to be validated
     */  
    validateAge: function(age){
        var contains = this.containsBadData(age);
        if(age = "" || !(age > 0 && age < 200) || contains == true){ 
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} build - data that needs to be validated
     */  
    validateBuild: function(build){
        var contains = this.containsBadData(build);
        if(build = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} clothes - data that needs to be validated
     */  
    validateClothes: function(clothes){
        var contains = this.containsBadData(clothes);
        if(clothes = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} distinguishingFeatures - data that needs to be validated
     */  
    validateDistinguishingFeatures: function(distinguishingFeatures){
        var contains = this.containsBadData(distinguishingFeatures);
        if(distinguishingFeatures = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} elevation - data that needs to be validated
     */  
    validateElevation: function(elevation){
        var contains = this.containsBadData(elevation);
        if(elevation = "" || !(elevation > 0 && elevation < 300) || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} face - data that needs to be validated
     */  
    validateFace: function(face){
        var contains = this.containsBadData(face);
        if(face = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} hair - data that needs to be validated
     */  
    validateHair: function(hair){
        var contains = this.containsBadData(hair);
        if(hair = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * check if the input: is blank, or contains any bad inputs
     * @param {*} gait - data that needs to be validated
     */  
    validateGait: function(gait){
        var contains = this.containsBadData(gait);
        if(gait = "" || contains == true){
            return false
        }
        return true
    },
    /**
     * a method to check if the input: is blank, doesn't match the regex, or contains any bad input
     * @param {*} sex - data that needs to be validated
     */  
    validateSex: function(sex){
        var re = new RegExp("^(male|female)$");
        var contains = this.containsBadData(sex);
        if(sex = "" || !re.test(sex) || contains == true){
            return false
        }
        return true
    },

}

module.exports = validation