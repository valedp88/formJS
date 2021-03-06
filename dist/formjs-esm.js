/* formJS v5.1.0 | Valerio Di Punzio (@SimplySayHi) | https://valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */
const addClass = (element, cssClasses) => {
    cssClasses.split(" ").forEach(className => {
        element.classList.add(className);
    });
}, isNodeList = nodeList => NodeList.prototype.isPrototypeOf(nodeList), removeClass = (element, cssClasses) => {
    cssClasses.split(" ").forEach(className => {
        element.classList.remove(className);
    });
}, isDOMNode = node => Element.prototype.isPrototypeOf(node), customEvents_field = {
    validation: "fjs.field:validation"
}, customEvents_form = {
    init: "fjs.form:init",
    submit: "fjs.form:submit",
    validation: "fjs.form:validation"
}, isPlainObject = object => "[object Object]" === Object.prototype.toString.call(object), mergeObjects = function(out = {}) {
    return Array.from(arguments).slice(1).filter(arg => !!arg).forEach(arg => {
        Object.keys(arg).forEach(key => {
            Array.isArray(arg[key]) ? out[key] = (out[key] || []).concat(arg[key].slice(0)) : isPlainObject(arg[key]) ? out[key] = mergeObjects(out[key] || {}, arg[key]) : Array.isArray(out[key]) ? out[key].push(arg[key]) : out[key] = arg[key];
        });
    }), out;
}, dispatchCustomEvent = (elem, eventName, eventOptions) => {
    eventOptions = mergeObjects({}, {
        bubbles: !0
    }, eventOptions);
    const eventObj = new CustomEvent(eventName, eventOptions);
    elem.dispatchEvent(eventObj);
}, fieldsStringSelector = 'input:not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="hidden"]), select, textarea', finalizeFieldPromise = obj => obj.result ? Promise.resolve() : Promise.reject(obj.errors), finalizeFormPromise = obj => obj.result ? Promise.resolve(obj.fields) : Promise.reject(obj.fields), formatMap = {
    "YYYY-MM-DD": function(dateArray) {
        return dateArray;
    },
    "MM-DD-YYYY": function(dateArray) {
        return [ dateArray[2], dateArray[0], dateArray[1] ];
    },
    "DD-MM-YYYY": function(dateArray) {
        return dateArray.reverse();
    }
}, getDateAsNumber = (dateString, dateFormat) => {
    dateFormat = dateFormat || "YYYY-MM-DD";
    const splitChar = (string => {
        const separator = string.match(/\D/);
        return separator && separator.length > 0 ? separator[0] : null;
    })(dateString);
    if (!(dateFormat.indexOf(splitChar) < 0)) return dateFormat = dateFormat.replace(/[^YMD]/g, "-"), 
    dateString = dateString.split(splitChar), dateString = formatMap[dateFormat](dateString).join("");
}, getJSONobjectFromFieldAttribute = (fieldEl, attrName) => {
    const customAttrEl = fieldEl.closest("[" + attrName + "]");
    return customAttrEl && JSON.parse(customAttrEl.getAttribute(attrName)) || {};
}, getUniqueFields = $nodeList => {
    let currentFieldName = "", currentFieldType = "";
    return Array.from($nodeList).filter($field => {
        const name = $field.name, type = $field.type;
        return (name !== currentFieldName || type !== currentFieldType) && ($field.matches("[data-required-from]") || (currentFieldName = name, 
        currentFieldType = type), !0);
    });
}, mergeValidateFieldDefault = obj => mergeObjects({}, {
    result: !1,
    $field: null
}, obj), isFieldForChangeEvent = $field => $field.matches('select, [type="radio"], [type="checkbox"], [type="file"]'), runFunctionsSequence = ({functionsList: functionsList = [], data: data = {}, stopConditionFn: stopConditionFn = (() => !1)} = {}) => functionsList.reduce((acc, promiseFn) => acc.then(res => {
    let dataNew = mergeObjects({}, res[res.length - 1]);
    return stopConditionFn(dataNew) ? Promise.resolve(res) : new Promise(resolve => {
        resolve(promiseFn(dataNew));
    }).then((result = dataNew) => (res.push(result), res));
}), Promise.resolve([ data ])).then(dataList => dataList.length > 1 ? dataList.slice(1) : dataList), serializeObject = obj => obj && "object" == typeof obj && obj.constructor === Object ? Object.keys(obj).reduce((a, k) => (a.push(k + "=" + encodeURIComponent(obj[k])), 
a), []).join("&") : obj, toCamelCase = string => string.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase()), options = {
    fieldOptions: {
        beforeValidation: [ function({$field: $field, fieldOptions: fieldOptions}) {
            fieldOptions.trimValue && !isFieldForChangeEvent($field) && ($field.value = $field.value.trim()), 
            (($fields, fieldOptions) => {
                ($fields = isNodeList($fields) ? Array.from($fields) : [ $fields ]).forEach($field => {
                    if ("checkbox" !== $field.type && "radio" !== $field.type) {
                        const $container = $field.closest(fieldOptions.questionContainer) || $field;
                        $field.value ? addClass($container, fieldOptions.cssClasses.dirty) : removeClass($container, fieldOptions.cssClasses.dirty);
                    }
                });
            })($field, fieldOptions), fieldOptions.skipUIfeedback || addClass($field.closest(fieldOptions.questionContainer), fieldOptions.cssClasses.pending);
        } ],
        cssClasses: {
            dirty: "is-dirty",
            error: "has-error",
            errorEmpty: "has-error-empty",
            errorRule: "has-error-rule",
            pending: "is-pending",
            valid: "is-valid"
        },
        focusOnRelated: !0,
        maxFileSize: 10,
        onValidationCheckAll: !1,
        preventPasteFields: '[type="password"], [data-equal-to]',
        questionContainer: "[data-formjs-question]",
        skipUIfeedback: !1,
        strictHtmlValidation: !0,
        trimValue: !1,
        validateOnEvents: "input change"
    },
    formOptions: {
        ajaxOptions: {
            cache: "no-store",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            method: "POST",
            mode: "same-origin",
            redirect: "follow",
            timeout: 0,
            url: location.href
        },
        ajaxSubmit: !0,
        beforeSend: [],
        cssClasses: {
            ajaxComplete: "ajax-complete",
            ajaxError: "ajax-error",
            ajaxPending: "ajax-pending",
            ajaxSuccess: "ajax-success",
            submit: "is-submitting",
            valid: "is-valid"
        },
        getFormData: function($filteredFields, trimValues) {
            const formData = {}, $form = this.$form;
            return $filteredFields.forEach($field => {
                const isCheckbox = "checkbox" === $field.type, isRadio = "radio" === $field.type, isSelect = $field.matches("select"), name = $field.name;
                let value = trimValues ? $field.value.trim() : $field.value;
                if (isCheckbox) {
                    value = $field.checked;
                    let $checkboxes = Array.from($form.querySelectorAll('[name="' + name + '"]'));
                    if ($checkboxes.length > 1) {
                        value = [], $checkboxes.filter(field => field.checked).forEach($field => {
                            value.push($field.value);
                        });
                    }
                } else if (isRadio) {
                    const $checkedRadio = $form.querySelector('[name="' + name + '"]:checked');
                    value = null === $checkedRadio ? null : $checkedRadio.value;
                } else if (isSelect) {
                    const $selectedOpts = Array.from($field.options).filter(option => option.selected);
                    $selectedOpts.length > 1 && (value = [], $selectedOpts.forEach($field => {
                        value.push($field.value);
                    }));
                }
                formData[name] = value;
            }), formData;
        },
        handleFileUpload: !0,
        handleSubmit: !0,
        onInitCheckFilled: !0
    }
}, validationRules = {
    date: function(string) {
        return {
            result: /^((((19|[2-9]\d)\d{2})[ \/\-.](0[13578]|1[02])[ \/\-.](0[1-9]|[12]\d|3[01]))|(((19|[2-9]\d)\d{2})[ \/\-.](0[13456789]|1[012])[ \/\-.](0[1-9]|[12]\d|30))|(((19|[2-9]\d)\d{2})[ \/\-.]02[ \/\-.](0[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))[ \/\-.]02[ \/\-.]29))$/g.test(string)
        };
    },
    email: function(string) {
        return {
            result: /^[a-zA-Z_-]([\w.-]?[a-zA-Z0-9])*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?){2,})+$/.test(string)
        };
    },
    number: function(string) {
        return {
            result: /[+-]?([0-9]*[.])?[0-9]+/.test(string)
        };
    },
    checkbox: function(value, $field) {
        const $dataChecks = $field.closest("form").querySelector('[name="' + $field.name + '"][data-checks]');
        return $dataChecks ? function($field) {
            const attrValue = JSON.parse($field.getAttribute("data-checks")), checkedLength = $field.closest("form").querySelectorAll('[name="' + $field.name + '"]:checked').length, isMinOk = checkedLength >= attrValue[0], isMaxOk = checkedLength <= attrValue[1], obj = {
                result: isMinOk && isMaxOk
            };
            return obj.result || (obj.errors = {
                checks: !0
            }, isMinOk || (obj.errors.minChecks = !0), isMaxOk || (obj.errors.maxChecks = !0)), 
            obj;
        }($dataChecks) : {
            result: $field.checked
        };
    },
    equalTo: function(value, $field) {
        return {
            result: value === $field.closest("form").querySelector('[name="' + $field.getAttribute("data-equal-to") + '"]').value
        };
    },
    exactLength: function(value, $field) {
        const valueLength = value.length, exactLength = 1 * $field.getAttribute("data-exact-length"), obj = {
            result: valueLength === exactLength
        };
        return obj.result || (obj.errors = {}, valueLength < exactLength ? obj.errors.minlength = !0 : obj.errors.maxlength = !0), 
        obj;
    },
    file: function(value, $field, fieldOptions) {
        const maxFileSize = 1 * ($field.getAttribute("data-max-file-size") || fieldOptions.maxFileSize), MIMEtype = $field.accept ? new RegExp($field.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from($field.files), obj = {
            result: !0
        };
        return filesList.forEach(file => {
            const exceedMaxFileSize = maxFileSize > 0 && file.size / 1024 / 1024 > maxFileSize, isAcceptedFileType = null === MIMEtype || MIMEtype.test(file.type);
            !exceedMaxFileSize && isAcceptedFileType || (obj.result = !1, void 0 === obj.errors && (obj.errors = {}), 
            exceedMaxFileSize && (obj.errors.maxFileSize = !0), isAcceptedFileType || (obj.errors.acceptedFileType = !0));
        }), obj;
    },
    length: function(value, $field) {
        const valueL = value.length, attrValue = JSON.parse($field.getAttribute("data-length")), isMinlengthOk = valueL >= attrValue[0], isMaxlengthOk = valueL <= attrValue[1], obj = {
            result: isMinlengthOk && isMaxlengthOk
        };
        return obj.result || (obj.errors = {}, isMinlengthOk || (obj.errors.minlength = !0), 
        isMaxlengthOk || (obj.errors.maxlength = !0)), obj;
    },
    max: function(value, $field) {
        let maxVal = $field.max;
        const dateFormat = $field.getAttribute("data-date-format");
        return ("date" === $field.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
        maxVal = maxVal.split("-").join("")), maxVal *= 1, {
            result: (value *= 1) <= maxVal
        };
    },
    maxlength: function(value, $field) {
        return {
            result: value.length <= 1 * $field.maxLength
        };
    },
    min: function(value, $field) {
        let minVal = $field.min;
        const dateFormat = $field.getAttribute("data-date-format");
        return ("date" === $field.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
        minVal = minVal.split("-").join("")), minVal *= 1, {
            result: (value *= 1) >= minVal
        };
    },
    minlength: function(value, $field) {
        return {
            result: value.length >= 1 * $field.minLength
        };
    },
    pattern: function(value, $field) {
        return {
            result: new RegExp($field.pattern).test(value)
        };
    },
    radio: function(value, $field) {
        const $fieldChecked = $field.closest("form").querySelector('[name="' + $field.name + '"]:checked');
        return {
            result: null !== $fieldChecked && $fieldChecked.value.trim().length > 0
        };
    }
}, dataTypeNumber = function(event) {
    const $field = event.target;
    if ($field.matches('[data-type="number"]')) {
        let fieldValue = $field.value;
        if (/[^\d.,+\-]/.test(fieldValue)) {
            event.stopImmediatePropagation();
            let valueReplaced = fieldValue.replace(/[^\d.,+\-]/g, "");
            $field.value = valueReplaced;
        }
    }
}, formValidationEnd = function(event) {
    const formEl = event.target, options = formEl.formjs.options;
    if (!options.fieldOptions.skipUIfeedback) {
        const clMethodName = event.detail.result ? "add" : "remove";
        formEl.classList[clMethodName](options.formOptions.cssClasses.valid);
    }
}, keypressMaxlength = function(event) {
    const $field = event.target;
    if ($field.matches("[maxlength]")) {
        const maxLength = 1 * $field.maxLength, keyPressed = event.which || event.keyCode, allowedKeys = [ 8, 37, 38, 39, 46 ];
        if ($field.value.length >= maxLength && -1 === allowedKeys.indexOf(keyPressed)) return !1;
    }
}, pastePrevent = function(event) {
    const $field = event.target, fieldOptions = $field.closest("form").formjs.options.fieldOptions;
    $field.matches(fieldOptions.preventPasteFields) && event.preventDefault();
};

function ajaxCall($form, formDataObj, options) {
    let timeoutTimer;
    const ajaxOptions = mergeObjects({}, options.formOptions.ajaxOptions), isMultipart = "multipart/form-data" === ajaxOptions.headers["Content-Type"];
    if (ajaxOptions.body = formDataObj, isMultipart && options.formOptions.handleFileUpload) {
        let formDataMultipart = new FormData;
        for (let key in ajaxOptions.body) formDataMultipart.append(key, ajaxOptions.body[key]);
        Array.from($form.querySelectorAll('[type="file"]')).forEach($field => {
            Array.from($field.files).forEach((file, idx) => {
                const name = $field.name + "[" + idx + "]";
                formDataMultipart.append(name, file, file.name);
            });
        }), ajaxOptions.body = formDataMultipart;
    }
    if ("GET" === ajaxOptions.method ? (ajaxOptions.url += (/\?/.test(ajaxOptions.url) ? "&" : "?") + serializeObject(ajaxOptions.body), 
    delete ajaxOptions.body) : ajaxOptions.headers["Content-Type"].indexOf("application/x-www-form-urlencoded") > -1 ? ajaxOptions.body = serializeObject(ajaxOptions.body) : isMultipart || (ajaxOptions.body = JSON.stringify(ajaxOptions.body)), 
    ajaxOptions.headers = new Headers(ajaxOptions.headers), ajaxOptions.timeout > 0) {
        const controller = new AbortController, signal = controller.signal;
        ajaxOptions.signal = signal, timeoutTimer = window.setTimeout(() => {
            controller.abort();
        }, ajaxOptions.timeout);
    }
    return fetch(ajaxOptions.url, ajaxOptions).then(response => {
        if (!response.ok) throw new Error(response.statusText);
        const fetchMethod = ((response, options) => {
            const accept = options.headers.get("Accept"), contentType = response.headers.get("Content-Type"), headerOpt = accept || contentType || "";
            return headerOpt.indexOf("application/json") > -1 || "" === headerOpt ? "json" : headerOpt.indexOf("text/") > -1 ? "text" : "blob";
        })(response, ajaxOptions);
        return response[fetchMethod]();
    }).then(data => (addClass($form, options.formOptions.cssClasses.ajaxSuccess), data)).catch(error => {
        throw addClass($form, options.formOptions.cssClasses.ajaxError), new Error(error.message);
    }).finally(() => {
        timeoutTimer && window.clearTimeout(timeoutTimer), removeClass($form, options.formOptions.cssClasses.submit + " " + options.formOptions.cssClasses.ajaxPending), 
        addClass($form, options.formOptions.cssClasses.ajaxComplete), $form.querySelector('[type="submit"]').disabled = !1;
    });
}

function submit(event) {
    const $form = event.target, instance = $form.formjs, options = instance.options, formCssClasses = options.formOptions.cssClasses, isAjaxForm = options.formOptions.ajaxSubmit, $btn = $form.querySelector('[type="submit"]'), eventPreventDefault = (enableBtn = !0) => {
        $btn && enableBtn && ($btn.disabled = !1), event && event.preventDefault();
    };
    if (isAjaxForm && eventPreventDefault(!1), $btn) {
        if ($btn.disabled) return eventPreventDefault(!1), !1;
        $btn.disabled = !0;
    }
    removeClass($form, formCssClasses.ajaxComplete + " " + formCssClasses.ajaxError + " " + formCssClasses.ajaxSuccess), 
    addClass($form, formCssClasses.submit), instance.validateForm().then(fields => {
        const beforeSendData = {
            stopExecution: !1,
            formData: isAjaxForm ? instance.getFormData() : null
        }, rfsObject = {
            functionsList: options.formOptions.beforeSend,
            data: beforeSendData,
            stopConditionFn: function(data) {
                return data.stopExecution;
            }
        };
        return runFunctionsSequence(rfsObject);
    }).then(dataList => {
        if (dataList.filter(data => data.stopExecution).length > 0) return eventPreventDefault(), 
        !1;
        if (isAjaxForm) {
            const formData = dataList.pop().formData;
            addClass($form, formCssClasses.ajaxPending), dispatchCustomEvent($form, customEvents_form.submit, {
                detail: ajaxCall($form, formData, options)
            });
        }
    }).catch(fields => {
        eventPreventDefault(), removeClass($form, formCssClasses.submit);
    });
}

const validation = function(event) {
    const isChangeEvent = "change" === event.type, $field = event.target, self = $field.closest("form").formjs;
    if ($field.matches(fieldsStringSelector)) {
        const isFieldForChangeEventBoolean = isFieldForChangeEvent($field), hasOnlyChangeEvent = "change" === self.options.fieldOptions.validateOnEvents;
        if (isFieldForChangeEventBoolean && isChangeEvent || !isFieldForChangeEventBoolean && (!isChangeEvent || hasOnlyChangeEvent)) return self.validateField($field).then(() => {
            const type = $field.type, $realtedEqualTo = $field.closest("form").querySelector('[data-equal-to="' + $field.name + '"]');
            return ($field.required || $field.matches("[data-validate-if-filled]")) && "checkbox" !== type && "radio" !== type && $realtedEqualTo && "" !== $realtedEqualTo.value.trim() && self.validateField($realtedEqualTo).catch(errors => {}), 
            mergeValidateFieldDefault({
                result: !0,
                $field: $field
            });
        }).catch(errors => mergeValidateFieldDefault({
            $field: $field,
            errors: errors
        }));
    }
}, validationEnd = function(event) {
    const eventDetail = event.detail, $field = eventDetail.$field, dataFieldOptions = getJSONobjectFromFieldAttribute($field, "data-field-options"), fieldOptions = mergeObjects({}, $field.closest("form").formjs.options.fieldOptions, dataFieldOptions), $container = $field.closest(fieldOptions.questionContainer), isReqFrom = $field.matches("[data-required-from]"), $reqMore = document.querySelector($field.getAttribute("data-required-from"));
    if ($container && !fieldOptions.skipUIfeedback) if (eventDetail.result) {
        if (!isReqFrom || isReqFrom && $reqMore.checked) {
            const errorClasses = fieldOptions.cssClasses.error + " " + fieldOptions.cssClasses.errorEmpty + " " + fieldOptions.cssClasses.errorRule;
            removeClass($container, errorClasses), addClass($container, fieldOptions.cssClasses.valid);
        }
    } else {
        let extraErrorClass = fieldOptions.cssClasses.errorRule;
        const isChecks = $field.matches("[data-checks]"), checkedElLength = isChecks ? $container.querySelectorAll('[name="' + $field.name + '"]:checked').length : 0;
        (!isChecks && eventDetail.errors && eventDetail.errors.empty || isChecks && 0 === checkedElLength) && (extraErrorClass = fieldOptions.cssClasses.errorEmpty);
        let errorClasses = fieldOptions.cssClasses.error + " " + extraErrorClass, errorClassToRemove = fieldOptions.cssClasses.errorEmpty + " " + fieldOptions.cssClasses.errorRule;
        removeClass($container, fieldOptions.cssClasses.valid + " " + errorClassToRemove), 
        addClass($container, errorClasses);
    }
};

const checkFilledFields = $form => {
    const formFields = ($form => getUniqueFields($form.querySelectorAll(fieldsStringSelector)).map($field => {
        const name = $field.name, type = $field.type, isCheckboxOrRadio = "checkbox" === type || "radio" === type, fieldChecked = $form.querySelector('[name="' + name + '"]:checked'), isReqFrom = $field.matches("[data-required-from]"), $reqMore = isReqFrom ? $form.querySelector($field.getAttribute("data-required-from")) : null;
        return isCheckboxOrRadio ? fieldChecked || null : isReqFrom && $reqMore.checked || !isReqFrom && $field.value ? $field : null;
    }).filter($field => null !== $field))($form);
    return Promise.all(formFields.map($field => {
        const isFieldForChangeEventBoolean = isFieldForChangeEvent($field);
        return validation({
            target: $field,
            type: isFieldForChangeEventBoolean ? "change" : ""
        });
    }));
};

function checkFieldValidity($field, fieldOptions, validationRules, validationErrors) {
    if (!isDOMNode($field)) {
        const obj = mergeValidateFieldDefault({
            $field: $field
        });
        return Promise.resolve(obj);
    }
    const $form = $field.closest("form"), isValidValue = $field.value.trim().length > 0, dataFieldOptions = getJSONobjectFromFieldAttribute($field, "data-field-options");
    if (fieldOptions = mergeObjects(fieldOptions, dataFieldOptions), "radio" === $field.type) {
        const $checked = $field.checked ? $field : $form.querySelector('[name="' + $field.name + '"]:checked'), reqMoreIsChecked = $checked && $checked.matches("[data-require-more]"), $findReqMore = reqMoreIsChecked ? $checked : $form.querySelector('[data-require-more][name="' + $field.name + '"]'), $findReqFrom = $findReqMore ? $form.querySelector('[data-required-from="#' + $findReqMore.id + '"]') : null;
        $checked && $findReqFrom && ($findReqFrom.required = $findReqMore.required && $findReqMore.checked, 
        reqMoreIsChecked ? fieldOptions.focusOnRelated && $findReqFrom.focus() : $findReqFrom.value = "");
    }
    if ($field.matches("[data-required-from]") && isValidValue) {
        const $reqMore = $form.querySelector($field.getAttribute("data-required-from"));
        $reqMore.checked = !0, $field.required = $reqMore.required;
    }
    const needsValidation = $field.required || $field.matches("[data-validate-if-filled]") && isValidValue;
    return runFunctionsSequence({
        functionsList: fieldOptions.beforeValidation,
        data: {
            $field: $field,
            fieldOptions: fieldOptions
        }
    }).then(data => {
        const dataObj = data.pop();
        return new Promise(resolve => {
            needsValidation || (dataObj.result = !0), resolve(needsValidation ? function($field, fieldOptions, validationRules, validationErrors) {
                const fieldValue = $field.value, obj = mergeValidateFieldDefault({
                    result: fieldValue.trim().length > 0,
                    $field: $field
                }), isRadioOrCheckbox = /^(radio|checkbox)$/.test($field.type), hasSelectedInput = $field.closest("form").querySelectorAll('[name="' + $field.name + '"]:checked').length > 0;
                if (!isRadioOrCheckbox && !obj.result || isRadioOrCheckbox && !hasSelectedInput) return obj.result = !1, 
                obj.errors = {
                    empty: !0
                }, Promise.resolve(obj);
                const validationMethods = Array.from($field.attributes).reduce((accList, attr) => {
                    const attrName = toCamelCase(attr.name.replace("data-", "")), attrValue = toCamelCase(attr.value), isAttrValueWithFn = ("type" === attrName || "subtype" === attrName) && validationRules[attrValue], isAttrNameWithFn = validationRules[attrName];
                    return (isAttrValueWithFn || isAttrNameWithFn) && accList.push(isAttrValueWithFn ? attrValue : attrName), 
                    accList;
                }, []);
                return new Promise(resolve => {
                    resolve(validationMethods.reduce((accPromise, methodName) => accPromise.then(accObj => new Promise(resolveVal => {
                        resolveVal(validationRules[methodName](fieldValue, $field, fieldOptions));
                    }).then(valObj => {
                        if (!valObj.result) {
                            const errorObj = {};
                            void 0 !== valObj.errors && void 0 !== valObj.errors[methodName] || (errorObj[methodName] = !0), 
                            valObj.errors = mergeObjects({}, valObj.errors, errorObj);
                        }
                        return valObj = valObj.result ? {} : valObj, mergeObjects(accObj, valObj);
                    })), Promise.resolve(obj)));
                }).then(data => (data.result || (data.errors = validationMethods.reduce((accObj, methodName) => {
                    const errors = validationErrors[methodName] && validationErrors[methodName](fieldValue, $field) || {};
                    return mergeObjects(accObj, errors);
                }, data.errors)), data));
            }($field, fieldOptions, validationRules, validationErrors) : dataObj);
        });
    }).then(data => {
        const $container = fieldOptions.questionContainer && data.$field.closest(fieldOptions.questionContainer);
        return $container && removeClass($container, fieldOptions.cssClasses.pending), data;
    });
}

function checkFormValidity($form, fieldOptions, validationRules, validationErrors, fieldToSkip = null) {
    fieldOptions = mergeObjects({}, fieldOptions, {
        focusOnRelated: !1
    });
    const $fieldsList = getUniqueFields($form.querySelectorAll(fieldsStringSelector));
    return Promise.all($fieldsList.map($field => {
        if (fieldToSkip && $field === fieldToSkip) {
            const obj = mergeValidateFieldDefault({
                $field: $field,
                result: !0
            });
            return Promise.resolve(obj);
        }
        return checkFieldValidity($field, fieldOptions, validationRules, validationErrors);
    })).then(fields => {
        const areAllFieldsValid = 0 === fields.filter(fieldObj => !fieldObj.result).length;
        return mergeObjects({}, {
            result: !0,
            fields: []
        }, {
            result: areAllFieldsValid,
            fields: fields
        });
    });
}

class Form {
    constructor(form, optionsObj) {
        const argsL = arguments.length, checkFormElem = (form => {
            let isString = typeof form, isFormSelector = "string" === isString && isDOMNode(document.querySelector(form)) && "form" === document.querySelector(form).tagName.toLowerCase();
            return {
                result: isDOMNode(form) || isFormSelector,
                $el: "string" === isString ? document.querySelector(form) : form
            };
        })(form);
        if (0 === argsL || argsL > 0 && !form) throw new Error('First argument "form" is missing or falsy!');
        if (isNodeList(form)) throw new Error('First argument "form" must be a single DOM node or a form CSS selector, not a NodeList!');
        if (!checkFormElem.result) throw new Error('First argument "form" is not a DOM node nor a form CSS selector!');
        const self = this;
        self.$form = checkFormElem.$el, self.$form.formjs = self, self.options = mergeObjects({}, Form.prototype.options, optionsObj);
        [ "beforeValidation", "beforeSend", "getFormData" ].forEach(cbName => {
            const optionType = self.options.formOptions[cbName] ? "formOptions" : "fieldOptions";
            let cbOpt = self.options[optionType][cbName];
            cbOpt && (self.options[optionType][cbName] = Array.isArray(cbOpt) ? cbOpt.map(cbFn => cbFn.bind(self)) : cbOpt.bind(self));
        }), function($form, options) {
            $form.noValidate = !0;
            const fieldOptions = options.fieldOptions, formOptions = options.formOptions;
            fieldOptions.strictHtmlValidation && ($form.addEventListener("keypress", keypressMaxlength, !1), 
            $form.addEventListener("input", dataTypeNumber, !1)), fieldOptions.preventPasteFields && $form.querySelectorAll(fieldOptions.preventPasteFields).length && $form.addEventListener("paste", pastePrevent, !1), 
            fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
                const useCapture = /^(blur|focus)$/.test(eventName);
                $form.addEventListener(eventName, validation, useCapture);
            }), $form.addEventListener(customEvents_field.validation, validationEnd, !1), $form.addEventListener(customEvents_form.validation, formValidationEnd, !1), 
            formOptions.handleSubmit && ($form.addEventListener("submit", submit), formOptions.ajaxSubmit && ($form.getAttribute("enctype") && (formOptions.ajaxOptions.headers["Content-Type"] = $form.getAttribute("enctype")), 
            $form.getAttribute("method") && (formOptions.ajaxOptions.method = $form.getAttribute("method").toUpperCase()), 
            $form.getAttribute("action") && (formOptions.ajaxOptions.url = $form.getAttribute("action"))));
        }(self.$form, self.options);
        let initOptions = {};
        if (self.options.formOptions.onInitCheckFilled) {
            const focusOnRelated = self.options.fieldOptions.focusOnRelated;
            self.options.fieldOptions.focusOnRelated = !1, initOptions.detail = checkFilledFields(self.$form).then(fields => (self.options.fieldOptions.focusOnRelated = focusOnRelated, 
            fields));
        }
        dispatchCustomEvent(self.$form, customEvents_form.init, initOptions);
    }
    destroy() {
        !function($form, options) {
            options.fieldOptions.strictHtmlValidation && ($form.removeEventListener("keypress", keypressMaxlength, !1), 
            $form.removeEventListener("input", dataTypeNumber, !1)), options.fieldOptions.preventPasteFields && $form.removeEventListener("paste", pastePrevent, !1), 
            options.formOptions.handleSubmit && $form.removeEventListener("submit", submit), 
            options.fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
                const useCapturing = "blur" === eventName;
                $form.removeEventListener(eventName, validation, useCapturing);
            }), $form.removeEventListener(customEvents_field.validation, validationEnd, !1), 
            $form.removeEventListener(customEvents_form.validation, formValidationEnd, !1), 
            delete $form.formjs;
        }(this.$form, this.options);
    }
    getFormData(trimValues = this.options.fieldOptions.trimValue) {
        const $formFields = this.$form.querySelectorAll("input, select, textarea"), $filteredFields = Array.from($formFields).filter(elem => elem.matches(':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-data])'));
        return this.options.formOptions.getFormData($filteredFields, trimValues);
    }
    validateField(field, fieldOptions) {
        const self = this, $field = "string" == typeof field ? self.$form.querySelector(field) : field;
        fieldOptions = mergeObjects({}, self.options.fieldOptions, fieldOptions);
        const $form = self.$form;
        return checkFieldValidity($field, fieldOptions, self.validationRules, self.validationErrors).then(obj => (dispatchCustomEvent(obj.$field, customEvents_field.validation, {
            detail: obj
        }), obj.result && fieldOptions.onValidationCheckAll ? checkFormValidity($form, fieldOptions, self.validationRules, self.validationErrors, obj.$field).then(dataForm => {
            dispatchCustomEvent($form, customEvents_form.validation, {
                detail: dataForm
            });
        }) : obj.result || removeClass($form, self.options.formOptions.cssClasses.valid), 
        obj)).then(finalizeFieldPromise);
    }
    validateForm(fieldOptions) {
        fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
        const $form = this.$form;
        return checkFormValidity($form, fieldOptions, this.validationRules, this.validationErrors).then(data => (data.fields.forEach(obj => {
            obj.isCheckingForm = !0, dispatchCustomEvent(obj.$field, customEvents_field.validation, {
                detail: obj
            });
        }), dispatchCustomEvent($form, customEvents_form.validation, {
            detail: data
        }), data)).then(finalizeFormPromise);
    }
    static addValidationErrors(errorsObj) {
        Form.prototype.validationErrors = mergeObjects({}, Form.prototype.validationErrors, errorsObj);
    }
    static addValidationRules(rulesObj) {
        Form.prototype.validationRules = mergeObjects({}, Form.prototype.validationRules, rulesObj);
    }
    static setOptions(optionsObj) {
        Form.prototype.options = mergeObjects({}, Form.prototype.options, optionsObj);
    }
}

Form.prototype.options = options, Form.prototype.validationErrors = {}, Form.prototype.validationRules = validationRules, 
Form.prototype.version = "5.1.0";

export default Form;
