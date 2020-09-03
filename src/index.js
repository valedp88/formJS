
import { version }              from './modules/version';
import { customEvents, dispatchCustomEvent, excludeSelector, mergeObjects, removeClass } from './modules/helpers';
import { options }              from './modules/options';
import { validationRules }      from './modules/validationRules';
import { validationEnd }        from './modules/listenerCallbacks';
import { constructorFn }        from './modules/constructor';
import { destroy }              from './modules/destroy';
import { init }                 from './modules/init';
import { checkFieldValidity }   from './modules/checkFieldValidity';
import { checkFormValidity }    from './modules/checkFormValidity';

class Form {

    constructor( formEl, optionsObj ){
        constructorFn(this, formEl, optionsObj);
    }

    destroy(){
        destroy(this.formEl, this.options);
    }
    
    getFormData(){
        const formFieldsEl = this.formEl.querySelectorAll('input, select, textarea'),
              filteredFields = Array.from( formFieldsEl ).filter( elem => elem.matches(excludeSelector) );
        return this.options.formOptions.getFormData(filteredFields);
    }

    init(){
        return init(this.formEl);
    }

    validateField( fieldEl, fieldOptions ){
        fieldEl = (typeof fieldEl === 'string' ? this.formEl.querySelector(fieldEl) : fieldEl);
        fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
        const formEl = this.formEl;
        const skipUIfeedback = this.options.fieldOptions.skipUIfeedback;
        return checkFieldValidity(fieldEl, fieldOptions, this.validationRules, this.validationErrors)
            .then(obj => {
                return new Promise(resolve => {
                    if( obj.fieldEl ){
                        dispatchCustomEvent( obj.fieldEl, customEvents.field.validation, obj, { bubbles: false } );
                        dispatchCustomEvent( formEl, customEvents.field.validation, obj );
                        if( fieldOptions.onValidationCheckAll && obj.result ){
                            // FORCE skipUIfeedback TO true
                            fieldOptions.skipUIfeedback = true;
                            resolve(
                                checkFormValidity( formEl, fieldOptions, this.validationRules, this.validationErrors, obj.fieldEl )
                                    .then(dataForm => {
                                        const clMethodName = dataForm.result ? 'add' : 'remove';
                                        formEl.classList[clMethodName]( this.options.formOptions.cssClasses.valid );
                                        dispatchCustomEvent( formEl, customEvents.form.validation, dataForm );
                                        // RESTORE skipUIfeedback TO THE ORIGINAL VALUE
                                        fieldOptions.skipUIfeedback = skipUIfeedback;
                                        return obj;
                                    })
                            );
                        } else if( !obj.result ){
                            removeClass( formEl, this.options.formOptions.cssClasses.valid );
                        }
                    }
                    resolve( obj );
                });
            });
    }

    validateForm( fieldOptions ){
        fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
        const formEl = this.formEl;
        return checkFormValidity(formEl, fieldOptions, this.validationRules, this.validationErrors)
            .then(data => {
                const clMethodName = data.result ? 'add' : 'remove';
                formEl.classList[clMethodName]( this.options.formOptions.cssClasses.valid );
                validationEnd( {data} );
                dispatchCustomEvent( formEl, customEvents.form.validation, data );
                return data;
            });

    }
    
    static addValidationErrors( errorsObj ){
        this.prototype.validationErrors = mergeObjects({}, this.prototype.validationErrors, errorsObj);
    }

    static addValidationRules( rulesObj ){
        this.prototype.validationRules = mergeObjects({}, this.prototype.validationRules, rulesObj);
    }
    
    static setOptions( optionsObj ){
        this.prototype.options = mergeObjects({}, this.prototype.options, optionsObj);
    }

}

Form.prototype.isInitialized = false;
Form.prototype.options = options;
Form.prototype.validationErrors = {};
Form.prototype.validationRules = validationRules;
Form.prototype.version = version;

export default Form;
