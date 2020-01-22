import * as fs from 'fs';

let autoIncrementNumber = 0;
process.currentTickId = 0;

function customConsole(logToPrintout){
  console.log(`${++autoIncrementNumber}: tick: ${process.currentTickId} : ${logToPrintout}`);
}

customConsole("main module starts ...in tick: ${process.currentTickId}")
fs.readFile('input.txt', (err, data) => {
   if (err) {
      customConsole(err);
      return;
   }
   console.log(data.toString());
});

setTimeout(() => {
   customConsole("timeout1");
   process.nextTick(() => {
      process.currentTickId++;
      customConsole("this is process.nextTick added inside setTimeout1");
   })   
 }, 0);

 setTimeout(() =>{
   customConsole('timeout2');
 },1000);

setImmediate(() => {
   customConsole('immediate');
});
process.nextTick(() => {
   process.currentTickId++;
   customConsole('this is process.nextTick 1');
});
process.nextTick(() => {
   process.currentTickId++;
   customConsole('this is process.nextTick 2');
});
customConsole('main module ends');