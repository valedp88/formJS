
export const mergeObjects = function( out = {} ){
    for(let i=1; i<arguments.length; i++){
        let obj = arguments[i];

        if(!obj){ continue; }

        for(let key in obj){
            let isArray = Object.prototype.toString.call(obj[key]) === "[object Array]";
            let isObject = Object.prototype.toString.call(obj[key]) === "[object Object]";

            // COPY ONLY ENUMERABLE PROPERTIES
            if( obj.hasOwnProperty(key) ){
                if( isArray ){

                    if( typeof out[key] === 'undefined' ){
                        out[key] = [];
                    }
                    out[key] = out[key].concat( obj[key].slice(0) );

                } else if( isObject ){

                    out[key] = mergeObjects(out[key], obj[key]);

                } else {

                    // * STRING | NUMBER | BOOLEAN | FUNCTION
                    if( Array.isArray(out[key]) ){
                        // IF THIS IS ONE OF ABOVE (*) AND THE DESTINATION OBJECT IS AN ARRAY
                        out[key].push(obj[key]);
                    } else {
                        out[key] = obj[key];
                    }

                }
            }
        }
    }

    return out;
}