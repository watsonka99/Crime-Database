// Created By Kieran Watson

const MoPi = {

    /**
     * function to check if an object is due to be reviewed or deleted
     * @param {*} date : Java script date on origin
     * @param {*} flagLength : length of time to flag in miliseconda
     */
    reviewFlag : (date, flagLength) => {

        if ((new Date().getTime()) - flagLength >  date.getTime()) 
        {
            return true;
        } 
        return false;
    },

    /**
     * Convert years into miliseconds
     * 
     * @param {*} year How many years to convert
     */
    yearToMiliseconds: year => {return Math.round(31556952000 * year)}
}

module.exports = MoPi;