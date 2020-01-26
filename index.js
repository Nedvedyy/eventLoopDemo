/**
 * good read https://dev.to/khaosdoctor/node-js-under-the-hood-3-deep-dive-into-the-event-loop-135d
*/


const log = require('why-is-node-running');
import * as fs from 'fs';
import * as Q from 'q'
import * as BlueBird from "bluebird"
import * as colors from "colors"

let sequenceNo = 0;
process.currentTickId = 0;

/* overwrite console.log to include the sequence no, current Tick Id and color */
let orginalConsoleLog =  console.log;
console.log = (content, displayColor = 'green') => {
   orginalConsoleLog(`${++sequenceNo}: tick: ${process.currentTickId} : ${content}`[displayColor]);
}


/*** starting of the main call stack */
orginalConsoleLog('🍺 🍺 🍺 main call stack starts'.rainbow);
/**
 * 1. I/O Queue 
 */
fs.readFile('input.txt', (err, data) => {
   if (err) {
      process.currentTickId++;
      console.log('handling the read input.txt err callback in I/O queue', 'grey');
      return;
   }
   console.log(data.toString());
});

/**
 * 2. Timer Queue
 *  add the timer to the timers heap, at the timer phase, event loop will check the expired timer
*/
setTimeout(() => {
   process.currentTickId++;
   console.log('handling the callback of timeout1 in timeout queue', 'blue');
   process.nextTick(() => {
      process.currentTickId++;
      console.log("hanlding the nextTick callback added inside setTimeout1 nextTick Queue", 'yellow');
   })   
 }, 2);

 setTimeout(() =>{
   process.currentTickId++;
   console.log('handling the callback of timeout2 in timeout queue', 'blue');
 },0);

/**
 * 3. Check queue
 * process.nextTick() fires immediately on the same phase
 * setImmediate() fires on the following iteration or 'tick' of the event loop
 */
setImmediate(() => {
   process.currentTickId++;
   console.log('hanlding the callback of immediate1 in check queue');
});
/**
 * 4. nextTick queue
 * Any time you call process.nextTick() in a given phase, all callbacks passed to process.nextTick() 
 * will be resolved before the event loop continues
*/
process.nextTick(() => {
   process.currentTickId++;
   console.log('handling the callback of nextTick 1 in nextTick Queue', 'yellow');
});
process.nextTick(() => {
   process.currentTickId++;
   console.log('handling the callback of nextTick 2 in nextTick Queue', 'yellow');
});

/**
 * 5. Promises 
 * promises
 */
Promise.resolve().then(() => {
   process.currentTickId++;
   console.log('handling the callback of native promise resolved in microtask queue','cyan')
});
BlueBird.resolve().then(() => {
   process.currentTickId++;
   console.log('handling the callback bluebird promise resolved in check queue')
});
setImmediate(() => {
   process.currentTickId++;
   console.log('handling the callback of immediate2 in check queue')
});
Q.resolve().then(() => { 
   process.currentTickId++;
   console.log('handling the callback of q promise resolved in nextTick queue', 'yellow')
});
process.nextTick(() => {
   process.currentTickId++;
   console.log('handling the callback of nextTick 3 in nextTick Queue', 'yellow');
});
setTimeout(() => {
   process.currentTickId++;
   console.log('handling the callback of timeout3 executed with 3000 delay in timeout Queue', 'blue')
}, 3000);
orginalConsoleLog('🍺 🍺 🍺 main call stack ends'.yellow);
/**this is to print out the callbacks that keep the nodejs running */
//log();


