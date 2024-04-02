import { initDB, isSendingAllowed, insertTel, normalizeTelNum, hasTel, getTimeDiff } from '../../src/utils';
import { describe, expect, it } from 'bun:test'
import { Database } from 'bun:sqlite';
 
 

const db = initDB()
const msec = 3*1000 // 3秒以内の連続送信不許可
const tel = process.env.SMS_TOTEL
let INTERVAL=0


// const res = await sendSMS("mytest", process.env.SMS_TOTEL)
// const ok = res.stdout.indexOf("配信対象に登録しました")!==-1

describe('連続送信不許可', () => {
    it('3秒以内に該当telの記録があったか', async () => {
        const db = initDB()
        const msec = 3000 // 3秒以内の連続送信不許可
        // telを登録する
        insertTel(process.env.SMS_TOTEL);
        // 期待値
        const expectValue= true
        // 3 秒以内にカラム tel があるか調べる
        const res = await hasTel(db, process.env.SMS_TOTEL, msec)
        // 比較する
        expect(res).toEqual(expectValue)

    })
    it('3秒置いてから、3秒以内に該当telの記録があったか', async (done) => {
        const db = initDB()
        const msec = 3000 // 3秒以内の連続送信不許可
        // INTERVAL
        const INTERVAL=3003

        // INTERVAL後に比較する
        setTimeout(async() => {
            // 期待値
            const expectValue= false
            // 3 秒以内にカラム tel があるか調べる
            const res = await hasTel(db, process.env.SMS_TOTEL, msec)
            // 比較する
            expect(res).toEqual(expectValue)
            done();
        }, INTERVAL)

    })
})

