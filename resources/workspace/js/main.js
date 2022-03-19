/*
? @document-start
======================
| MAIN PROGRAM LOGIC |
==================================================================================================================================

? @author:                 William J. Horn
? @document-name:          main.js
? @document-created:       03/18/2022
? @document-modified:      03/19/2022
? @document-version:       v1.0.0

==================================================================================================================================

? @document-info
==================
| ABOUT DOCUMENT |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-changelog
======================
| DOCUMENT CHANGELOG |
==================================================================================================================================

Coming soon

==================================================================================================================================

? @document-todo
=================
| DOCUMENT TODO |
==================================================================================================================================

-   Think of better way to store row metadata (instead of using buttons as look-up keys) --NOT DONE
-   Fix bug with resetting localStorage data every 24 hours --DONE

==================================================================================================================================
*/

/* ------------------------- */
/* Global Element References */
/* ------------------------- */
const rowContainerDiv = $("#row-container");
const currentDateTag = $("#current-date");

/* ----------------------- */
/* Internal Program States */
/* ----------------------- */
// global hash map of task row metadata
const rowTable = new Map();

/* ----------------- */
/* Utility Functions */
/* ----------------- */

// generate mathematical sequence of {12, 1, 2, ..., 12, 1, 2, ...}
function getClockHour(index) {
    const time = (index + 11)%12 + 1;
    const postfix = ~~(index/12)%2 == 0 ? "am" : "pm";
    return { value: time, timePostfix: postfix }
}

// wrap for-loop logic in a 'setInterval' to achieve delay between loop cycles
// (made for animating the row opacity on page load)
function forInterval(start, stop, step, delay, callback) {
    let count = start;
    const routine = setInterval(() => {
        callback(count);
        count += step;
        if (count > stop) clearInterval(routine);
    }, delay);
}

// update individual row each clock tick (every second) with the appropriate time state.
// time state will be "before", "current", or "after" your current time relative to the row's time
function updateRowTimeState(rowMetadata, currentTime) {
    const currentHour = currentTime.getHours();
    const compareHour = rowMetadata.totalHours;
    const rowDiv = rowMetadata.rowDiv;
    const textarea = rowMetadata.textarea;

    // compute whether current time is before, after, or present, relative to each row's local time
    const timeState = currentHour === compareHour
        ? "current" : currentHour > compareHour 
        ? "before" : "after";

    // update the row's class based on it's time state
    // * "time-state-before":
    //      - disables textarea input
    //      - changes css color and background color
    // * "time-state-after"/"time-state-current":
    //      - enables default functionality again
    if (timeState != rowMetadata.currentTimeState) {
        rowDiv.removeClass("time-state-" + rowMetadata.currentTimeState);
        rowMetadata.currentTimeState = timeState;
        rowDiv.addClass("time-state-" + timeState);
        textarea.attr("disabled", timeState === "before");
    }
}

// function responsible for initial generation of task rows
// task rows are generated based on for loop index, initial load time (new Date()), 
// and old saved data in localStorage
function createTaskRow(index, loadTime, savedTasks) {
    const totalHours = index%24; // make sure 'hour' is the same sequence as 'new Date().getHours()'

    // create containers
    const rowDiv = $("<div>");
    const scheduleTimeDiv = $("<div>");
    const taskInfoDiv = $("<div>");
    const saveAreaDiv = $("<div>");

    // create content
    const scheduleTime = $("<p>");
    const textarea = $("<textarea>");
    const saveButton = $("<button>");

    // set content properties
    const clockHour = getClockHour(totalHours);
    $(scheduleTime).text(clockHour.value + clockHour.timePostfix);
    $(saveButton).text("Save");
    $(textarea).text(savedTasks[index] || "");

    // set classes
    $(rowDiv).addClass("row row-load-anim");
    $(scheduleTimeDiv).addClass("schedule-time col-sm-12 col-md-2 col-lg-1");
    $(taskInfoDiv).addClass("task-info col-sm col-lg");
    $(saveAreaDiv).addClass("save-area col-sm-12 col-md-2 col-lg-1");
    $(saveButton).addClass("save-btn");
    $(scheduleTime).addClass("time-label");

    // append content to containers
    $(scheduleTimeDiv).append(scheduleTime);
    $(taskInfoDiv).append(textarea);
    $(saveAreaDiv).append(saveButton);
    
    // append containers
    $(rowDiv).append(scheduleTimeDiv);
    $(rowDiv).append(taskInfoDiv);
    $(rowDiv).append(saveAreaDiv);

    const rowMetadata = {
        rowDiv: $(rowDiv),
        textarea: $(textarea),
        totalHours: totalHours,
        rowIndex: index,
        clockHour: clockHour,
        currentTimeState: undefined,
        getTaskInfo: () => $(textarea).val(),
    }

    updateRowTimeState(rowMetadata, loadTime); // update row immediately
    globalTimeEvent.connect(currentTime => updateRowTimeState(rowMetadata, currentTime)); // update row with time event

    // save metadata about the row inside rowTable with button literal
    rowTable.set($(saveButton)[0], rowMetadata);
    return rowDiv;
}

// callback for save button click event
function onSaveButtonClicked(event) {
    const rowData = rowTable.get(event.target);

    // if the save button is clicked, AND the row is not in the 'before' time state, then...
    if (rowData && rowData.currentTimeState != "before") {
        datastore.update(TASK_SAVE_KEY, oldData => {
            oldData = oldData || {};
            oldData[rowData.rowIndex] = rowData.getTaskInfo();
            return oldData
        });
    }
}

function init() {
    // generate the task rows
    forInterval(0, 23, 1, 50, index => {
        const rowDiv = createTaskRow(index, loadTime, savedTasks);
        $(rowContainerDiv).append(rowDiv);
    });

    // create main save button click event listener
    $(rowContainerDiv).on("click", onSaveButtonClicked);
}

// wait for page to load then begin the program
$(document).ready(() => init());