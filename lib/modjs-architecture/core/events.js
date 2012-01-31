function add_event(element, type, fn, capture) {
    //-- Default to event bubbling
    if (!capture) {
        capture = false;
    }

    //-- DOM level 2 method
    if (element.add_eventListener) {
        element.add_eventListener(type, fn, capture);
    }
    else {
        //-- event capturing not supported
        if (capture) {
            throw new Error('add_event(element, type, fn, capture): This browser does not support event capturing');
        }
        else {
            var type_ref = '__' + type;

            //-- create function stack in the DOM space of the element; seperate stacks for each event type
            if (element[type_ref]) {
                //-- check if handler is not already attached, don't attach the same function twice to match behavior of add_eventListener
                if (array_search(fn, element[type_ref]) > -1) {
                    return;
                }
            }
            else {
                //-- create the stack if it doesn't exist yet
                element[type_ref] = [];

                //-- if there is an inline event defined store it in the stack
                if (element['on' + type]) {
                    element[type_ref][0] = element['on' + type];
                }

                //-- attach helper function using the DOM level 0 method
                element['on' + type] = IE_event_handler;
            }

            //-- add reference to the function to the stack
            element[type_ref][element[type_ref].length] = fn;
        }
    }
}

function remove_event(element, type, fn, capture) {
    //-- Default to event bubbling
    if (!capture) {
        capture = false;
    }

    //-- DOM level 2 method
    if (element.remove_eventListener) {
        element.remove_eventListener(type, fn, capture);
    }
    else {
        var type_ref = '__' + type;

        //-- Check if there is a stack of function references for this event type on the object
        if (element[type_ref]) {
            //-- check if function is present in the stack
            var i = array_search(fn, element[type_ref]);
            if (i > -1) {
                try {
                    delete element[type_ref][i];
                }
                catch(e) {
                    element[type_ref][i] = null;
                }
            }
        }
    }
}

function IE_event_handler(e) {
    e = e || window.event;
    var type_ref = '__' + e.type,
        retValue = true;

    //-- iterate through the stack and execute each function in the scope of the object by using function.call
    for (var i = 0, j = this[type_ref].length; i < j; i++) {
        if (this[type_ref][i]) {
            if (Function.call) {
                retValue = this[type_ref][i].call(this, e) && retValue;
            }
            else {
                //-- IE 5.0 doesn't support call or apply, so use this
                this.__fn = this[type_ref][i];
                retValue = this.__fn(e) && retValue;
            }
        }
    }

    if (this.__fn) {
        try {
            delete this.__fn;
        }
        catch(e) {
            this.__fn = null;
        }
    }

    return retValue;
}

function array_search(val, arr) {
    var i = arr.length;

    while (i--) {
        if (arr[i] && arr[i] === val) {
            break;
        }
    }

    return i;
}