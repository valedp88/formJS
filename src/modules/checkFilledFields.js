
import { getFilledFields, isFieldForChangeEvent } from './helpers';
import { validation } from './listenerCallbacks';

export const checkFilledFields = formEl => {

    const formFields = getFilledFields( formEl );
    // VALIDATE ALL FILLED FIELDS
    return Promise.all( formFields.map(fieldEl => {

        const isFieldForChangeEventBoolean = isFieldForChangeEvent(fieldEl);
        const fakeEventObj = { target: fieldEl, type: (isFieldForChangeEventBoolean ? 'change': '') };
        return validation( fakeEventObj );

    }) )
    .then(fields => fields)
    .catch(fields => fields);

}