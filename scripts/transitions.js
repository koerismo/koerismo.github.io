/*  Transition functions should do two things:
*   1. Set up the document so that it is ready to transition.
*   2. Return an async function that performs the transition and resolves on completion. */

function TransitionEntry() {
	// Stuff here will be called when the loader begins

	return async function() {
		// Stuff here will be called when the loader ends
		document.body.classList.add('loaded');
	}
}

function TransitionExit() {

	return async function() {
		return new Promise( resolve=>{
			document.body.classList.remove('loaded');
			document.body.classList.add('exiting');
			setTimeout( resolve, 300 );
		});
	}
}


/* This function should be called once at the beginning of the body element. */

function ReadyTransitions( entry, exit ) {
	const doEntry = entry();
	let awaitingExit = false;

	document.addEventListener( 'readystatechange', e=>{
		if ( document.readyState !== 'complete' ) { return }

		doEntry();
		document.addEventListener( 'click', async e=>{
			if (e.target.nodeName !== 'A' || awaitingExit) { return }
			awaitingExit = true;
			e.preventDefault();
			await exit()();
			e.target.click();
		});

	});
}


ReadyTransitions( TransitionEntry, TransitionExit );