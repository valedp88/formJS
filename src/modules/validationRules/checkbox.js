
import { checks } from './checks';

export const checkbox = function( fieldEl ){
    let dataChecksEl = fieldEl.closest('form').querySelector('[name="' + fieldEl.name + '"][data-checks]');
    return dataChecksEl ? checks(dataChecksEl): {result: fieldEl.checked};
}
