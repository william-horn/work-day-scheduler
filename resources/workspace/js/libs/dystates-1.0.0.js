/*
? @document-start
=====================
| DYNAMIC STATE API |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          dynamicstate.js
? @document-created:       03/15/2022
? @document-modified:      03/15/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

- Coming soon

==================================================================================================================================

? @document-api
=============
| ABOUT API |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   

==================================================================================================================================
*/

import PseudoEvent from "./pseudo-events-2.0.0.js";

export default class DynamicState {
    constructor(states) {
        this.states = states;
        this.state = "initial"; // default state

        // events
        this.onStateChanged = new PseudoEvent();
    }

    getState() {
        return this.state;
    }

    setState(state) {
        if (!this.states[state]) {
            console.error("DynamicState Class: '" + state + "' is not a valid state");
            return;
        }

        const oldState = this.state;
        this.state = this.states[state];

        if (oldState != state) {
            this.onStateChanged.fire(this.state);
        }
    }

    isState(state) {
        return this.state === state;
    }
}

