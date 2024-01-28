import { describe, expect, it } from 'bun:test'
import { Elysia } from 'elysia';

//------------------------------------------------------------
// sendSMS
// @body {string} body text
// @to {string} tel //e.g. '09046213611'
// @return {object}
// e.g. process.env.SMS_API_TOKEN
//
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
const TO=process.env.SMS_TOTEL
const INPUT_LEN_TEL=11
const SMS_API_TOKEN= process.env.SMS_API_TOKEN
const SMS_NOTIFICATION_EMAILS=process.env.SMS_NOTIFICATION_EMAILS
const endpoint='https://api.smslink.jp/'

async function sendSMS(body, to){

    console.log("sendSMSLink:===========================\n")

    let curl =`
    curl "`+endpoint+`api/v1/delivery" \
    -X POST \
    -d '{"contacts":[{"phone_number":"`+to+`"}],"text_message":"`+body+`","reserved_at":"","click_count":true,"notification_emails":["`+SMS_NOTIFICATION_EMAILS+`"]}' \
    -H "Accept:       application/json" \
    -H "token:        `+process.env.SMS_API_TOKEN+`" \
    -H "Content-Type: application/json"`

    const res = await exec(curl)
    return res
}


describe('SMS送信テスト', () => {
    it('送信して配信対象に登録できたか', async () => {

        const res = await sendSMS("mytest", process.env.SMS_TOTEL)

        // console.log(res)
        //console.log(res.stdout.indexOf("配信対象に登録しました")!==-1)
        const ok = res.stdout.indexOf("配信対象に登録しました")!==-1
        // 比較する
        expect(ok).toEqual(true)

    })
})



