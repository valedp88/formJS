/* formJS v5.0.0 | Valerio Di Punzio (@SimplySayHi) | https://valeriodipunzio.com/plugins/formJS/ | https://github.com/SimplySayHi/formJS | MIT license */
const addClass = (element, cssClasses) => {
    cssClasses.split(" ").forEach(className => {
        element.classList.add(className);
    });
}, isNodeList = nodeList => NodeList.prototype.isPrototypeOf(nodeList), removeClass = (element, cssClasses) => {
    cssClasses.split(" ").forEach(className => {
        element.classList.remove(className);
    });
}, isDOMNode = node => Element.prototype.isPrototypeOf(node), checkFormEl = formEl => {
    let isString = typeof formEl, isFormSelector = "string" === isString && isDOMNode(document.querySelector(formEl)) && "form" === document.querySelector(formEl).tagName.toLowerCase();
    return {
        result: isDOMNode(formEl) || isFormSelector,
        element: "string" === isString ? document.querySelector(formEl) : formEl
    };
}, customEvents_field = {
    validation: "fjs.field:validation"
}, customEvents_form = {
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
}, getUniqueFields = nodeList => {
    let currentFieldName = "", currentFieldType = "";
    return Array.from(nodeList).filter(fieldEl => {
        const name = fieldEl.name, type = fieldEl.type;
        return (name !== currentFieldName || type !== currentFieldType) && (fieldEl.matches("[data-required-from]") || (currentFieldName = name, 
        currentFieldType = type), !0);
    });
}, mergeValidateFieldDefault = obj => mergeObjects({}, {
    result: !1,
    fieldEl: null
}, obj), isFieldForChangeEvent = fieldEl => fieldEl.matches('select, [type="radio"], [type="checkbox"], [type="file"]'), runFunctionsSequence = ({functionsList: functionsList = [], data: data = {}, stopConditionFn: stopConditionFn = (() => !1)} = {}) => functionsList.reduce((acc, promiseFn) => acc.then(res => {
    let dataNew = mergeObjects({}, res[res.length - 1]);
    return stopConditionFn(dataNew) ? Promise.resolve(res) : new Promise(resolve => {
        resolve(promiseFn(dataNew));
    }).then((result = dataNew) => (res.push(result), res));
}), Promise.resolve([ data ])).then(dataList => dataList.length > 1 ? dataList.slice(1) : dataList), serializeObject = obj => obj && "object" == typeof obj && obj.constructor === Object ? Object.keys(obj).reduce((a, k) => (a.push(k + "=" + encodeURIComponent(obj[k])), 
a), []).join("&") : obj, toCamelCase = string => string.replace(/-([a-z])/gi, (all, letter) => letter.toUpperCase()), defaultCallbacksInOptions = {
    fieldOptions: {
        beforeValidation: function(fieldObj) {
            const fieldOptions = this.options.fieldOptions;
            ((fields, fieldOptions) => {
                (fields = isNodeList(fields) ? Array.from(fields) : [ fields ]).forEach(fieldEl => {
                    if ("checkbox" !== fieldEl.type && "radio" !== fieldEl.type) {
                        const containerEl = fieldEl.closest(fieldOptions.questionContainer) || fieldEl;
                        fieldEl.value ? addClass(containerEl, fieldOptions.cssClasses.dirty) : removeClass(containerEl, fieldOptions.cssClasses.dirty);
                    }
                });
            })(fieldObj.fieldEl, fieldOptions), fieldOptions.skipUIfeedback || addClass(fieldObj.fieldEl.closest(fieldOptions.questionContainer), fieldOptions.cssClasses.pending);
        }
    },
    formOptions: {
        getFormData: function(filteredFields) {
            const formData = {}, formEl = this.formEl;
            return filteredFields.forEach(fieldEl => {
                const isCheckbox = "checkbox" === fieldEl.type, isRadio = "radio" === fieldEl.type, isSelect = fieldEl.matches("select"), name = fieldEl.name;
                let value = fieldEl.value;
                if (isCheckbox) {
                    value = fieldEl.checked;
                    let checkboxes = Array.from(formEl.querySelectorAll('[name="' + name + '"]'));
                    if (checkboxes.length > 1) {
                        value = [], checkboxes.filter(field => field.checked).forEach(fieldEl => {
                            value.push(fieldEl.value);
                        });
                    }
                } else if (isRadio) {
                    const checkedRadio = formEl.querySelector('[name="' + name + '"]:checked');
                    value = null === checkedRadio ? null : checkedRadio.value;
                } else if (isSelect) {
                    const selectedOpts = Array.from(fieldEl.options).filter(option => option.selected);
                    selectedOpts.length > 1 && (value = [], selectedOpts.forEach(fieldEl => {
                        value.push(fieldEl.value);
                    }));
                }
                formData[name] = value;
            }), formData;
        }
    }
}, options = {
    fieldOptions: {
        beforeValidation: [ defaultCallbacksInOptions.fieldOptions.beforeValidation ],
        cssClasses: {
            dirty: "is-dirty",
            error: "has-error",
            errorEmpty: "has-error-empty",
            errorRule: "has-error-rule",
            pending: "is-pending",
            valid: "is-valid"
        },
        focusOnRelated: !0,
        handleFileUpload: !0,
        onValidationCheckAll: !1,
        preventPasteFields: '[type="password"], [data-equal-to]',
        questionContainer: "[data-formjs-question]",
        skipUIfeedback: !1,
        strictHtmlValidation: !0,
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
        getFormData: defaultCallbacksInOptions.formOptions.getFormData,
        handleSubmit: !0
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
    checkbox: function(value, fieldEl) {
        const dataChecksEl = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"][data-checks]');
        return dataChecksEl ? function(fieldEl) {
            const attrValue = JSON.parse(fieldEl.getAttribute("data-checks")), checkedElLength = fieldEl.closest("form").querySelectorAll('[name="' + fieldEl.name + '"]:checked').length, isMinOk = checkedElLength >= attrValue[0], isMaxOk = checkedElLength <= attrValue[1], obj = {
                result: isMinOk && isMaxOk
            };
            return obj.result || (obj.errors = {
                checks: !0
            }, isMinOk || (obj.errors.minChecks = !0), isMaxOk || (obj.errors.maxChecks = !0)), 
            obj;
        }(dataChecksEl) : {
            result: fieldEl.checked
        };
    },
    equalTo: function(value, fieldEl) {
        return {
            result: value === fieldEl.closest("form").querySelector('[name="' + fieldEl.getAttribute("data-equal-to") + '"]').value
        };
    },
    exactLength: function(value, fieldEl) {
        const valueLength = value.length, exactLength = 1 * fieldEl.getAttribute("data-exact-length"), obj = {
            result: valueLength === exactLength
        };
        return obj.result || (obj.errors = {}, valueLength < exactLength ? obj.errors.minlength = !0 : obj.errors.maxlength = !0), 
        obj;
    },
    file: function(value, fieldEl) {
        const maxFileSize = 1 * (fieldEl.getAttribute("data-max-file-size") || 0), MIMEtype = fieldEl.accept ? new RegExp(fieldEl.accept.replace("*", "[^\\/,]+")) : null, filesList = Array.from(fieldEl.files), obj = {
            result: !0
        };
        return filesList.forEach(file => {
            const exceedMaxFileSize = maxFileSize > 0 && file.size / 1024 / 1024 > maxFileSize, isAcceptedFileType = null === MIMEtype || MIMEtype.test(file.type);
            !exceedMaxFileSize && isAcceptedFileType || (obj.result = !1, void 0 === obj.errors && (obj.errors = {}), 
            exceedMaxFileSize && (obj.errors.maxFileSize = !0), isAcceptedFileType || (obj.errors.acceptedFileType = !0));
        }), obj;
    },
    length: function(value, fieldEl) {
        const valueL = value.length, attrValue = JSON.parse(fieldEl.getAttribute("data-length")), isMinlengthOk = valueL >= attrValue[0], isMaxlengthOk = valueL <= attrValue[1], obj = {
            result: isMinlengthOk && isMaxlengthOk
        };
        return obj.result || (obj.errors = {}, isMinlengthOk || (obj.errors.minlength = !0), 
        isMaxlengthOk || (obj.errors.maxlength = !0)), obj;
    },
    max: function(value, fieldEl) {
        let maxVal = fieldEl.max;
        const dateFormat = fieldEl.getAttribute("data-date-format");
        return ("date" === fieldEl.type || dateFormat) && (value = getDateAsNumber(value, dateFormat), 
        maxVal = maxVal.split("-").join("")), maxVal *= 1, {
            result: (value *= 1) <= maxVal
        };
    },
    maxlength: function(value, fieldEl) {
        return {
            result: value.length <= 1 * fieldEl.maxLength
        };
    },
    min: function(value, fieldEl) {
        let minVal = fieldEl.min;
        const dateFormat = fieldEl.getAttribute("data-date-format");
        return ("date" === fieldEl.type || fieldEl.getAttribute("data-date-format")) && (value = getDateAsNumber(value, dateFormat), 
        minVal = minVal.split("-").join("")), minVal *= 1, {
            result: (value *= 1) >= minVal
        };
    },
    minlength: function(value, fieldEl) {
        return {
            result: value.length >= 1 * fieldEl.minLength
        };
    },
    pattern: function(value, fieldEl) {
        return {
            result: new RegExp(fieldEl.pattern).test(value)
        };
    },
    radio: function(value, fieldEl) {
        const fieldChecked = fieldEl.closest("form").querySelector('[name="' + fieldEl.name + '"]:checked');
        return {
            result: null !== fieldChecked && fieldChecked.value.trim().length > 0
        };
    }
}, dataTypeNumber = function(event) {
    const fieldEl = event.target;
    if (fieldEl.matches('[data-type="number"]')) {
        let fieldValue = fieldEl.value;
        if (/[^\d.,+\-]/.test(fieldValue)) {
            event.stopImmediatePropagation();
            let valueReplaced = fieldValue.replace(/[^\d.,+\-]/g, "");
            fieldEl.value = valueReplaced;
        }
    }
}, keypressMaxlength = function(event) {
    const fieldEl = event.target;
    if (fieldEl.matches("[maxlength]")) {
        const maxLength = 1 * fieldEl.maxLength, keyPressed = event.which || event.keyCode, allowedKeys = [ 8, 37, 38, 39, 46 ];
        if (fieldEl.value.length >= maxLength && -1 === allowedKeys.indexOf(keyPressed)) return !1;
    }
}, pastePrevent = function(event) {
    const fieldEl = event.target, fieldOptions = fieldEl.closest("form").formjs.options.fieldOptions;
    fieldEl.matches(fieldOptions.preventPasteFields) && event.preventDefault();
};

function ajaxCall(formEl, formDataObj, options) {
    let timeoutTimer;
    const ajaxOptions = mergeObjects({}, options.formOptions.ajaxOptions), isMultipart = "multipart/form-data" === ajaxOptions.headers["Content-Type"];
    if (ajaxOptions.body = formDataObj, isMultipart && options.fieldOptions.handleFileUpload) {
        let formDataMultipart = new FormData;
        for (let key in ajaxOptions.body) formDataMultipart.append(key, ajaxOptions.body[key]);
        Array.from(formEl.querySelectorAll('[type="file"]')).forEach(field => {
            Array.from(field.files).forEach((file, idx) => {
                const name = field.name + "[" + idx + "]";
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
        if (!response.ok) return Promise.reject(response);
        const fetchMethod = ((response, options) => {
            const accept = options.headers.get("Accept"), contentType = response.headers.get("Content-Type"), headerOpt = accept || contentType || "";
            return headerOpt.indexOf("application/json") > -1 || "" === headerOpt ? "json" : headerOpt.indexOf("text/") > -1 ? "text" : "blob";
        })(response, ajaxOptions);
        return response[fetchMethod]();
    }).then(data => (addClass(formEl, options.formOptions.cssClasses.ajaxSuccess), data)).catch(error => (addClass(formEl, options.formOptions.cssClasses.ajaxError), 
    Promise.reject(error))).finally(() => {
        timeoutTimer && window.clearTimeout(timeoutTimer), removeClass(formEl, options.formOptions.cssClasses.submit + " " + options.formOptions.cssClasses.ajaxPending), 
        addClass(formEl, options.formOptions.cssClasses.ajaxComplete), formEl.querySelector('[type="submit"]').disabled = !1;
    });
}

function submit(event) {
    const formEl = event.target, instance = formEl.formjs, options = instance.options, formCssClasses = options.formOptions.cssClasses, isAjaxForm = options.formOptions.ajaxSubmit, btnEl = formEl.querySelector('[type="submit"]'), eventPreventDefault = (enableBtn = !0) => {
        btnEl && enableBtn && (btnEl.disabled = !1), event && event.preventDefault();
    };
    if (isAjaxForm && eventPreventDefault(!1), btnEl) {
        if (btnEl.disabled) return eventPreventDefault(!1), !1;
        btnEl.disabled = !0;
    }
    removeClass(formEl, formCssClasses.ajaxComplete + " " + formCssClasses.ajaxError + " " + formCssClasses.ajaxSuccess), 
    addClass(formEl, formCssClasses.submit), instance.validateForm().then(fields => {
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
            addClass(formEl, formCssClasses.ajaxPending), dispatchCustomEvent(formEl, customEvents_form.submit, {
                detail: ajaxCall(formEl, formData, options)
            });
        }
    }).catch(fields => {
        eventPreventDefault(), removeClass(formEl, formCssClasses.submit);
    });
}

const validation = function(event) {
    const isChangeEvent = "change" === event.type, fieldEl = event.target, self = fieldEl.closest("form").formjs;
    if (fieldEl.matches(fieldsStringSelector)) {
        const isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl);
        if (isFieldForChangeEventBoolean && isChangeEvent || !isFieldForChangeEventBoolean && !isChangeEvent) return self.validateField(fieldEl).then(() => {
            const type = fieldEl.type, realtedFieldEqualTo = fieldEl.closest("form").querySelector('[data-equal-to="' + fieldEl.name + '"]');
            return (fieldEl.required || fieldEl.matches("[data-validate-if-filled]")) && "checkbox" !== type && "radio" !== type && realtedFieldEqualTo && "" !== realtedFieldEqualTo.value.trim() && self.validateField(realtedFieldEqualTo).catch(errors => {}), 
            mergeValidateFieldDefault({
                result: !0,
                fieldEl: fieldEl
            });
        }).catch(errors => mergeValidateFieldDefault({
            fieldEl: fieldEl,
            errors: errors
        }));
    }
}, validationEnd = function(event) {
    const fieldsArray = event.detail.fieldEl ? [ event.detail ] : event.detail.fields, options = fieldsArray[0].fieldEl.closest("form").formjs.options.fieldOptions;
    fieldsArray.forEach(obj => {
        const fieldEl = obj.fieldEl;
        if (fieldEl.matches(fieldsStringSelector)) {
            const containerEl = fieldEl.closest(options.questionContainer), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = document.querySelector(fieldEl.getAttribute("data-required-from"));
            if (null !== containerEl && removeClass(containerEl, options.cssClasses.pending), 
            null !== containerEl && !options.skipUIfeedback) if (obj.result) {
                if (!isReqFrom || isReqFrom && reqMoreEl.checked) {
                    const errorClasses = options.cssClasses.error + " " + options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
                    removeClass(containerEl, errorClasses), addClass(containerEl, options.cssClasses.valid);
                }
            } else {
                let extraErrorClass = options.cssClasses.errorRule;
                const isChecks = fieldEl.matches("[data-checks]"), checkedElLength = isChecks ? containerEl.querySelectorAll('[name="' + fieldEl.name + '"]:checked').length : 0;
                (!isChecks && obj.errors && obj.errors.empty || isChecks && 0 === checkedElLength) && (extraErrorClass = options.cssClasses.errorEmpty);
                const errorClasses = options.cssClasses.error + " " + extraErrorClass, errorClassToRemove = options.cssClasses.errorEmpty + " " + options.cssClasses.errorRule;
                removeClass(containerEl, options.cssClasses.valid + " " + errorClassToRemove), addClass(containerEl, errorClasses);
            }
        }
    });
};

function formStartup(formEl, options) {
    formEl.noValidate = !0;
    const fieldOptions = options.fieldOptions, formOptions = options.formOptions;
    fieldOptions.strictHtmlValidation && (formEl.addEventListener("keypress", keypressMaxlength, !1), 
    formEl.addEventListener("input", dataTypeNumber, !1)), fieldOptions.preventPasteFields && formEl.querySelectorAll(fieldOptions.preventPasteFields).length && formEl.addEventListener("paste", pastePrevent, !1), 
    fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
        const useCapturing = "blur" === eventName;
        formEl.addEventListener(eventName, validation, useCapturing);
    }), formEl.addEventListener(customEvents_field.validation, validationEnd, !1), formOptions.handleSubmit && (formEl.addEventListener("submit", submit), 
    formOptions.ajaxSubmit && (formEl.getAttribute("enctype") && (formOptions.ajaxOptions.headers["Content-Type"] = formEl.getAttribute("enctype")), 
    formEl.getAttribute("method") && (formOptions.ajaxOptions.method = formEl.getAttribute("method").toUpperCase()), 
    formEl.getAttribute("action") && (formOptions.ajaxOptions.url = formEl.getAttribute("action"))));
}

const checkFilledFields = formEl => {
    const formFields = (formEl => getUniqueFields(formEl.querySelectorAll(fieldsStringSelector)).map(fieldEl => {
        const name = fieldEl.name, type = fieldEl.type, isCheckboxOrRadio = "checkbox" === type || "radio" === type, fieldChecked = formEl.querySelector('[name="' + name + '"]:checked'), isReqFrom = fieldEl.matches("[data-required-from]"), reqMoreEl = isReqFrom ? formEl.querySelector(fieldEl.getAttribute("data-required-from")) : null;
        return isCheckboxOrRadio ? fieldChecked || null : isReqFrom && reqMoreEl.checked || !isReqFrom && fieldEl.value ? fieldEl : null;
    }).filter(fieldEl => null !== fieldEl))(formEl);
    return Promise.all(formFields.map(fieldEl => {
        const isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl);
        return validation({
            target: fieldEl,
            type: isFieldForChangeEventBoolean ? "change" : ""
        });
    })).then(fields => fields).catch(fields => fields);
};

function checkFieldValidity(fieldEl, fieldOptions, validationRules, validationErrors) {
    if (!isDOMNode(fieldEl)) {
        const obj = mergeValidateFieldDefault({
            fieldEl: fieldEl
        });
        return Promise.resolve(obj);
    }
    const formEl = fieldEl.closest("form"), isValidValue = fieldEl.value.trim().length > 0;
    if ("radio" === fieldEl.type) {
        const checkedEl = fieldEl.checked ? fieldEl : formEl.querySelector('[name="' + fieldEl.name + '"]:checked'), reqMoreIsChecked = checkedEl && checkedEl.matches("[data-require-more]"), findReqMoreEl = reqMoreIsChecked ? checkedEl : formEl.querySelector('[data-require-more][name="' + fieldEl.name + '"]'), findReqFromEl = findReqMoreEl ? formEl.querySelector('[data-required-from="#' + findReqMoreEl.id + '"]') : null;
        checkedEl && findReqFromEl && (findReqFromEl.required = findReqMoreEl.required && findReqMoreEl.checked, 
        reqMoreIsChecked ? fieldOptions.focusOnRelated && findReqFromEl.focus() : findReqFromEl.value = "");
    }
    if (fieldEl.matches("[data-required-from]") && isValidValue) {
        const reqMoreEl = formEl.querySelector(fieldEl.getAttribute("data-required-from"));
        reqMoreEl.checked = !0, fieldEl.required = reqMoreEl.required;
    }
    const needsValidation = fieldEl.required || fieldEl.matches("[data-validate-if-filled]") && isValidValue;
    return runFunctionsSequence({
        functionsList: fieldOptions.beforeValidation,
        data: {
            fieldEl: fieldEl
        }
    }).then(data => {
        const dataObj = data.pop();
        return new Promise(resolve => {
            needsValidation || (dataObj.result = !0), resolve(needsValidation ? function(fieldEl, validationRules, validationErrors) {
                const fieldValue = fieldEl.value, obj = mergeValidateFieldDefault({
                    result: fieldValue.trim().length > 0,
                    fieldEl: fieldEl
                }), isRadioOrCheckbox = /^(radio|checkbox)$/.test(fieldEl.type), hasSelectedInput = fieldEl.closest("form").querySelectorAll('[name="' + fieldEl.name + '"]:checked').length > 0;
                if (!isRadioOrCheckbox && !obj.result || isRadioOrCheckbox && !hasSelectedInput) return obj.result = !1, 
                obj.errors = {
                    empty: !0
                }, Promise.resolve(obj);
                const validationMethods = Array.from(fieldEl.attributes).reduce((accList, attr) => {
                    const attrName = toCamelCase(attr.name.replace("data-", "")), attrValue = toCamelCase(attr.value), isAttrValueWithFn = ("type" === attrName || "subtype" === attrName) && validationRules[attrValue], isAttrNameWithFn = validationRules[attrName];
                    return (isAttrValueWithFn || isAttrNameWithFn) && accList.push(isAttrValueWithFn ? attrValue : attrName), 
                    accList;
                }, []);
                return new Promise(resolve => {
                    resolve(validationMethods.reduce((accPromise, methodName) => accPromise.then(accObj => new Promise(resolveVal => {
                        resolveVal(validationRules[methodName](fieldValue, fieldEl));
                    }).then(valObj => {
                        if (!valObj.result) {
                            const errorObj = {};
                            void 0 !== valObj.errors && void 0 !== valObj.errors[methodName] || (errorObj[methodName] = !0), 
                            valObj.errors = mergeObjects({}, valObj.errors, errorObj);
                        }
                        return valObj = valObj.result ? {} : valObj, mergeObjects(accObj, valObj);
                    })), Promise.resolve(obj)));
                }).then(data => (data.result || (data.errors = validationMethods.reduce((accObj, methodName) => {
                    const errors = validationErrors[methodName] && validationErrors[methodName](fieldValue, fieldEl) || {};
                    return mergeObjects(accObj, errors);
                }, data.errors)), data));
            }(fieldEl, validationRules, validationErrors) : dataObj);
        });
    });
}

function checkFormValidity(formEl, fieldOptions, validationRules, validationErrors, fieldToSkip = null) {
    fieldOptions = mergeObjects({}, fieldOptions, {
        focusOnRelated: !1
    });
    const fieldsList = getUniqueFields(formEl.querySelectorAll(fieldsStringSelector));
    return Promise.all(fieldsList.map(fieldEl => {
        if (fieldToSkip && fieldEl === fieldToSkip) {
            const obj = mergeValidateFieldDefault({
                fieldEl: fieldEl,
                result: !0
            });
            return Promise.resolve(obj);
        }
        return checkFieldValidity(fieldEl, fieldOptions, validationRules, validationErrors);
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
    constructor(formEl, optionsObj) {
        !function(self, formEl, optionsObj) {
            const argsL = arguments.length, checkFormElem = checkFormEl(formEl);
            if (0 === argsL || argsL > 0 && !formEl) throw new Error('First argument "formEl" is missing or falsy!');
            if (isNodeList(formEl)) throw new Error('First argument "formEl" must be a single DOM node or a form CSS selector, not a NodeList!');
            if (!checkFormElem.result) throw new Error('First argument "formEl" is not a DOM node nor a form CSS selector!');
            self.formEl = checkFormElem.element, self.formEl.formjs = self, self.options = mergeObjects({}, self.constructor.prototype.options, optionsObj);
            const cbList = [ "beforeValidation", "beforeSend", "getFormData" ];
            cbList.forEach(cbName => {
                const optionType = self.options.formOptions[cbName] ? "formOptions" : "fieldOptions";
                let cbOpt = self.options[optionType][cbName];
                cbOpt && (self.options[optionType][cbName] = Array.isArray(cbOpt) ? cbOpt.map(cbFn => cbFn.bind(self)) : cbOpt.bind(self));
            }), formStartup(self.formEl, self.options);
        }(this, formEl, optionsObj);
    }
    destroy() {
        !function(formEl, options) {
            options.fieldOptions.strictHtmlValidation && (formEl.removeEventListener("keypress", keypressMaxlength, !1), 
            formEl.removeEventListener("input", dataTypeNumber, !1)), options.fieldOptions.preventPasteFields && formEl.removeEventListener("paste", pastePrevent, !1), 
            options.formOptions.handleSubmit && formEl.removeEventListener("submit", submit), 
            options.fieldOptions.validateOnEvents.split(" ").forEach(eventName => {
                const useCapturing = "blur" === eventName;
                formEl.removeEventListener(eventName, validation, useCapturing);
            }), formEl.removeEventListener(customEvents_field.validation, validationEnd, !1), 
            delete formEl.formjs;
        }(this.formEl, this.options);
    }
    getFormData() {
        const formFieldsEl = this.formEl.querySelectorAll("input, select, textarea"), filteredFields = Array.from(formFieldsEl).filter(elem => elem.matches(':not([type="reset"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([data-exclude-data])'));
        return this.options.formOptions.getFormData(filteredFields);
    }
    validateField(fieldEl, fieldOptions) {
        fieldEl = "string" == typeof fieldEl ? this.formEl.querySelector(fieldEl) : fieldEl, 
        fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
        const formEl = this.formEl, skipUIfeedback = this.options.fieldOptions.skipUIfeedback;
        return checkFieldValidity(fieldEl, fieldOptions, this.validationRules, this.validationErrors).then(obj => new Promise(resolve => {
            obj.fieldEl && (dispatchCustomEvent(obj.fieldEl, customEvents_field.validation, {
                bubbles: !1,
                detail: obj
            }), dispatchCustomEvent(formEl, customEvents_field.validation, {
                detail: obj
            }), fieldOptions.onValidationCheckAll && obj.result ? (fieldOptions.skipUIfeedback = !0, 
            resolve(checkFormValidity(formEl, fieldOptions, this.validationRules, this.validationErrors, obj.fieldEl).then(dataForm => {
                const clMethodName = dataForm.result ? "add" : "remove";
                return formEl.classList[clMethodName](this.options.formOptions.cssClasses.valid), 
                dispatchCustomEvent(formEl, customEvents_form.validation, {
                    detail: dataForm
                }), fieldOptions.skipUIfeedback = skipUIfeedback, obj;
            }))) : obj.result || removeClass(formEl, this.options.formOptions.cssClasses.valid)), 
            resolve(obj);
        })).then(finalizeFieldPromise);
    }
    validateFilledFields() {
        return checkFilledFields(this.formEl);
    }
    validateForm(fieldOptions) {
        fieldOptions = mergeObjects({}, this.options.fieldOptions, fieldOptions);
        const formEl = this.formEl;
        return checkFormValidity(formEl, fieldOptions, this.validationRules, this.validationErrors).then(data => {
            const clMethodName = data.result ? "add" : "remove";
            return formEl.classList[clMethodName](this.options.formOptions.cssClasses.valid), 
            validationEnd({
                detail: data
            }), dispatchCustomEvent(formEl, customEvents_form.validation, {
                detail: data
            }), data;
        }).then(finalizeFormPromise);
    }
    static addValidationErrors(errorsObj) {
        this.prototype.validationErrors = mergeObjects({}, this.prototype.validationErrors, errorsObj);
    }
    static addValidationRules(rulesObj) {
        this.prototype.validationRules = mergeObjects({}, this.prototype.validationRules, rulesObj);
    }
    static setOptions(optionsObj) {
        this.prototype.options = mergeObjects({}, this.prototype.options, optionsObj);
    }
}

Form.prototype.options = options, Form.prototype.validationErrors = {}, Form.prototype.validationRules = validationRules, 
Form.prototype.version = "5.0.0";

export default Form;
