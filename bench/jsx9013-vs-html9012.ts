

let response
console.log('\n mychat html----------------')
console.time('html')
 //for (let i = 0; i < 10; i++) {
     response =  fetch('http://74.226.208.203:9012/');
     //console.log(response)
 //}
console.timeEnd('html')
console.log('\n mychat jsx----------------')
console.time('jsx')
 //for (let i = 0; i < 10; i++) {
     response =  fetch('http://74.226.208.203:9013/');
     //console.log(response)
 //}
console.timeEnd('jsx')

/*
$ bun /home/tato/bun/elysia/mychat-sqlite2/src/jsx-bench-9018.tsx

jsx was faster.

 html----------------
[12.94ms] html

 jsx----------------
[5.39ms] html


*/