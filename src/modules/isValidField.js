
import { isDOMNode, mergeObjects, runFunctionsSequence, validateFieldObjDefault } from './helpers';
import { isValid } from './isValid';

export function isValidField( fieldEl, fieldOptions, validationRules, validationErrors ){

    const obj = mergeObjects({}, validateFieldObjDefault, {fieldEl});

    if( !isDOMNode(fieldEl) ){ return Promise.resolve(obj); }

    const isValidValue =      fieldEl.value.trim().length > 0,
          isRequired =        fieldEl.required,
          isReqFrom =         fieldEl.matches('[data-required-from]'),
          isValidateIfFilled =fieldEl.matches('[data-validate-if-filled]'),
          rfsObject = {
            functionsList: fieldOptions.beforeValidation,
            data: {fieldEl}
        };

    return runFunctionsSequence(rfsObject)
        .then(data => {

            let dataObj = data.pop();
            return new Promise(resolve => {
                if(
                    (!isRequired && !isValidateIfFilled && !isReqFrom) ||   // IT IS A NORMAL FORM FIELD
                    (isValidateIfFilled && !isValidValue) ||                // IT IS data-validate-if-filled AND EMPTY
                    (isReqFrom && !isRequired )                             // IT IS data-required-from AND NOT required
                ){

                    dataObj.result = true;
                    resolve( dataObj );
                
                } else {

                    resolve( isValid( fieldEl, fieldOptions, validationRules, validationErrors ) );
                    
                }

            });

        });

}
