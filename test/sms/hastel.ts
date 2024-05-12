import { initDB, isSendingAllowed, insertTel, normalizeTelNum, hasTel, getTimeDiff } from '../../src/utils';

const db = initDB()
const msec = 3*1000 // 3秒以内の連続送信不許可
const tel = process.env.SMS_TOTEL
let INTERVAL=0
insertTel(tel)

let res = await hasTel(db, tel, msec)
console.log(res)
let res2= await getTimeDiff(db, tel)
console.log(res2.time_diff)
if(res2.time_diff<=msec){
    INTERVAL=(msec-res2.time_diff)
    console.log('INTERVAL', INTERVAL)
}
setTimeout(async function(){
    res = await hasTel(db, tel, msec)
    console.log(res)
    res2= await getTimeDiff(db, tel)
    console.log(res2.time_diff)

}, INTERVAL)
