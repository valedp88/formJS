
export const serializeObject = obj => {
    var objToString = (
            (obj && typeof obj === 'object' && obj.constructor === Object) ? 
            Object.keys(obj)
                .reduce((a,k) => {
                    a.push(k+'='+encodeURIComponent(obj[k]));
                    return a
                },[]).join('&') : 
            obj
    );
    return objToString;
}
