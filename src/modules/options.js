
import { defaultCallbacksInOptions } from './optionsUtils';

export const options = {

    fieldOptions: {
        beforeValidation:       [defaultCallbacksInOptions.fieldOptions.beforeValidation],
        cssClasses: {
            dirty:              'is-dirty',
            error:              'has-error',
            errorEmpty:         'has-error-empty',
            errorRule:          'has-error-rule',
            pending:            'is-pending',
            valid:              'is-valid'
        },
        focusOnRelated:         true,
        onValidationCheckAll:   false,
        preventPasteFields:     '[type="password"], [data-equal-to]',
        questionContainer:      '[data-formjs-question]',
        skipUIfeedback:         false,
        strictHtmlValidation:   true,
        validateOnEvents:       'input change'
    },

    formOptions: {
        ajaxOptions:            {
            cache:              'no-store',
            credentials:        'same-origin',
            headers: {
                                'Content-Type': 'application/json',
                                'Accept':       'application/json'
            },
            method:             'POST',
            mode:               'same-origin',
            redirect:           'follow',
            timeout:            0,
            url:                location.href
        },
        ajaxSubmit:             true,
        beforeSend:             [],
        cssClasses: {
            ajaxComplete:       'ajax-complete',
            ajaxError:          'ajax-error',
            ajaxPending:        'ajax-pending',
            ajaxSuccess:        'ajax-success',
            submit:             'is-submitting',
            valid:              'is-valid'
        },
        getFormData:            defaultCallbacksInOptions.formOptions.getFormData,
        handleFileUpload:       true,
        handleSubmit:           true
    }
    
}
