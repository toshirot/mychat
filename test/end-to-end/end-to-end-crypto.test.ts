// e.g. see happy-dom https://bun.sh/guides/test/happy-dom
// bun add -d @happy-dom/global-registrator
// 

import { describe, expect, it, test } from 'bun:test'
import crypto from 'crypto';

// get set LocalStorage
const getLS = (key:any, val:any):any  => JSON.parse(decrypt(localStorage.getItem(key) || '[]', val))
const setLS = (key:any, val:any):any => {
  localStorage.setItem(key, encrypt(JSON.stringify(val), val))
}



describe('end-to-endで暗号化', () => {
    test('input要素からLocalStorageにセットしてデータを取り出す', async () => {

        // 注意: あらかじめ環境変数に設定しておく
        // $ export PASS_PHRASE="mypassphrase"
        const PASS_PHRASE = process.env.PASS_PHRASE

        document.body.innerHTML = `
            <input type="password" id="pass" name="pass" value="${PASS_PHRASE}">
            <script>
                localStorage.setItem('pass', encrypt(pass.value));
            </script>
        `
        const testMsg = 
        `むかしむかしあるところにおじさんとおばさんが住んでいました
        むかしむかしあるところにおじさんとおばさんが住んでいました
        むかしむかしあるところにおじさんとおばさんが住んでいました`;

        const fetchData = async () => {
            console.log(typeof fetch)
            /*
            const response = await fetch('http://74.226.208.203:9017/data', {
                    method: "POST",
                    body: encrypt(testMsg, PASS_PHRASE),
                    credentials: "same-origin"
            });
            const data = await response.text();
            let resdata=decrypt(data, PASS_PHRASE)
            console.log(resdata)


            //return data;
            return resdata//response.text();*/

            return 123
        }
        fetchData().then((resdata) => {
            console.log(resdata)
            // 比較する
            expect(resdata).toEqual(testMsg)
        })

       // fetchData().then((data) => {

     //   }


    })
})


function encrypt(text: string, password: string) {
    const cipher = crypto.createCipher('aes-256-cbc', password)
    const crypted = cipher.update(text, 'utf-8', 'hex')
    return crypted + cipher.final('hex')
}
function decrypt(text: string, password: string) {
    const decipher = crypto.createDecipher('aes-256-cbc', password)
    const decrypted = decipher.update(text, 'hex', 'utf-8')
    return decrypted + decipher.final('utf-8')
}
