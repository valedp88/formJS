
document.addEventListener('click', function(e){
    var key = e.which || e.keyCode;

    if( key === 1 ){
        var elem = e.target,
            cardHeaderSelector = '.panel-collapsible .card-header',
            dropDownSelector = '[data-toggle="dropdown"]',
            checkElement = function( cssSelector ){
                return (elem.matches(cssSelector) ? elem : (elem.closest(cssSelector) || null));
            };
        
        if( checkElement(cardHeaderSelector) ){
            
            // OPEN PANEL
            e.preventDefault();

            var cardHeader = checkElement(cardHeaderSelector),
                panelEl = elem.closest('.panel').querySelector('.card-body'),
                panelDisplay = panelEl.style.display;
            
            cardHeader.classList.toggle('active');
            panelEl.style.display = (panelDisplay === '' || panelDisplay === 'none' ? 'block' : 'none');

        } else if( checkElement(dropDownSelector) ){

            // OPEN DROPDOWN
            e.preventDefault();

            var dropDown = checkElement(dropDownSelector),
                dropDownList = dropDown.nextElementSibling,
                dropDownAriaExpanded = dropDown.getAttribute('aria-expanded'),
                ariaExpValue = ( !dropDownAriaExpanded || dropDownAriaExpanded === 'false' ? 'true' : 'false' );

            dropDown.setAttribute('aria-expanded', ariaExpValue);
            dropDownList.classList.toggle('show');

        } else {

            // CLOSE ALL OPEN DROPDOWNS
            var dropdownsOpen = document.querySelectorAll(dropDownSelector);
            if( dropdownsOpen.length > 0 ){
                Array.from(dropdownsOpen).forEach(function(elem){
                    elem.setAttribute('aria-expanded', false);
                    elem.nextElementSibling.classList.remove('show');
                });
            }

        }
    }
}, false);
