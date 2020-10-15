const be = require('blockexplorer');

be.blockIndex(0)
  .then((result) => {
    console.log(result)
  })
  .catch((err) => {
    throw err
  })


// function getBlock(index) {
//     //add your code here
//     be.blockIndex(index)
//     .then((result) => {
//       console.log(result)
//     })
//     .catch((err) => {
//       throw err
//     })
// }



// (function theLoop (i) {
// 	setTimeout(function () {
//         getBlock(i);
//         i++;
// 		if (i < 3) theLoop(i);
// 	}, 5);
//   })(0);