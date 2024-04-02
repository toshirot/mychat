import { initDB, isSendingAllowed, insertTel, normalizeTelNum, hasTel, getTimeDiff } from '../../src/utils';

const db = initDB()
const sec = 300
const tel = process.env.SMS_TOTEL
insertTel(tel)

setTimeout(async function(){
    const res = await hasTel(db, tel, sec)
    console.log(res)
    const res2= await getTimeDiff(db, tel)
    console.log(res2)
}, 0)
