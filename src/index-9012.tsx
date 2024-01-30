import { Elysia } from 'elysia';
import type { WS } from '@types/bun';
import { html } from '@elysiajs/html';
import { staticPlugin } from '@elysiajs/static';
import { Database } from 'bun:sqlite';
import { 
    adjustHours, 
    getCookie, 
    setCookie, 
    hasDataImg, 
    dataImgWrap2Img,
    urlWrap2Img, 
    urlWrap2Link,
    inputBox,
    regBox_1,
    regBox_2,
    regBox_3
} from "./utils";
const crypto = require('crypto');
import 'dotenv/config';

//===========================================
// 定数

// チャット名
const CHAT_NAME = 'myChat';
// バージョン
const VERSION = '0.1.023';
// 出力するメッセ―ジ数
const LIMIT = 20;
// ポート HTTP と WebSocket 共通
const PORT = 9012;

//===========================================
// interface

type MsgType = 'msg' | 'info' | 'bc'; 

interface Head {
    type: MsgType;
}
interface Body {
    type: any;
}
interface MsgData {
    head: Head;
    body: Body;
}

//===========================================
// データベースの作成

// データベースファイルの名前を指定
const DB_FILE_NAME = './db/'+CHAT_NAME+'.sqlite';
// テーブルの名前を指定
const TABLE_NAME = 'chat_logs';
// 新しいデータベースインスタンスを作成し、ファイルが存在しない場合はデータベースファイルを作成
const db = new Database(DB_FILE_NAME, { create: true });
// 同時書き込みが行われる状況でパフォーマンスを大幅に向上させる先行書き込みログ モード(WAL) 
db.exec('PRAGMA journal_mode = WAL;');

// テーブルが存在しない場合はテーブルを作成
const sql_table_create =
    `CREATE TABLE IF NOT EXISTS 
        ${TABLE_NAME}
        (
            id INTEGER PRIMARY KEY, 
            name VARCHAR(255), 
            msg VARCHAR(255), 
            uid VARCHAR(32), 
            created_at TIMESTAMP
        );`
        
// SQLを実行する　
doQuery(db, sql_table_create);

//===========================================
// サーバーを立てる HTTPとWebSocket
// 

// クライアントを入れとく配列 ブロードキャスト用
let clients: WebSocket[] = [];

const app = new Elysia()
    .use(html())
    .use(staticPlugin()) //ここでstaticプラグインを適用する

    //------------------------------------------------------------
    // SMS送信  ログインチェック POST
    // セキュリティコードを送信する
    // e.g. https://reien.top:5000/api/login-tel-sms/
    .post('/api/sms-code/', ({ body}) => {

        console.log(body.tel  )
        //console.log(req.body )
        if(!body)return
        if(!body.tel)return
        // console.log('sms-code:',new Date(),req.body)

        const seqCode=!!(''.padStart)?
            (''+parseInt(Math.random()*10000,10)).padStart(4, "0"):
            (''+parseInt(Math.random()*10000,10))//ieはpadStartが無いので4桁までの数字
        let num=''//'下記リンククリックで電話番号確認が完了します。 '
                +''
                +'このコードをブラウザに入力してください'
                +' '
                +seqCode
        //telへセキュリティコードSMSを送る
       // sendSMS(body,  req.body.tel)
        sendSMS(num,  body.tel)
        
        
        console.log('/api/sms-code/ send to sms', num)
        //ブラウザへレスポンス
        //app.send(JSON.stringify(seqCode))

    })

    .get('/', ({ cookie: { name, uid } }) => { 
        const DEFAULT_NAME = '通りすがりさん';
        
        // Elysia cookieは、デフォルトでは、Reactive Cookie はオブジェクトのタイプを
        // 自動的にエンコード/デコードできるため、エンコード/デコードを気にせずに 
        // Cookie をオブジェクトとして扱うことができます。
        // https://elysiajs.com/patterns/cookie.html#cookie

        // cookie から名前とuidを取得
        if(!name.value){
            // name をセットする
            name.value=DEFAULT_NAME
        } else {
        }
        if(!uid.value){
            // uid をセットする
            uid.value= mkmd5(Math.random().toString())
        }
    return  `
    <html lang='ja'>
        
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <title>${CHAT_NAME} updating</title>
            <script src="/public/js/cripto-js.js"></script>
            <script src="/public/js/purify.min.js"></script>
            <script>
// for time
${adjustHours}
// for input box
${inputBox}
${regBox_1}
${regBox_2}
${regBox_3}
// for cookie
${getCookie}
${setCookie}
// for image and links
${hasDataImg}
${dataImgWrap2Img}
${urlWrap2Img}
${urlWrap2Link}
const getLS = (key, val)  => JSON.parse(decrypt(localStorage.getItem(key) || '[]', val))
const setLS = (key, val) => {
  localStorage.setItem(key, encrypt(JSON.stringify(val), val))
}
const decrypt_js = (str, solt) => CryptoJS.AES.decrypt(str,  solt).toString(CryptoJS.enc.Utf8)
const encrypt_js = (str, solt) => CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), solt).toString()
const sanitize = (str) => {
    str=(str+'').replace(/\\n/g, '-r-n%n-r-')
    str=str.replace(/-r-n%n-r-/g, '<br />')
    return DOMPurify.sanitize(str)
}
            </script>
            <link rel="stylesheet" href="/public/css/base.css">
            <link rel="stylesheet" href="/public/css/input-box.css">
            <link rel="stylesheet" href="/public/css/msg-box.css">

        </head>
        <body>

            <div id=nav>
                <a href="https://qiita.com/toshirot/items/c5654156c8799ac28d83" target=qiita>
                →このチャットの作り方</a><br>
                →Github/mychat <a href="https://github.com/toshirot/mychat">https://github.com/toshirot/mychat</a>
            </div>

            <div id=contact></div>
            <script>
            // 初期ボックス
            window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid.value}')
            </script>

            <script>
                // 接続
                const socket = new WebSocket('ws://'+location.host+'/ws');
                // 接続時イベント
                socket.onopen = function (event) {
                    console.log('ws opend: ', event.target.url, new Date())
                    socket.send(JSON.stringify({
                        head:{type: 'info'},
                        body:{
                            name: 'system',
                            msg: encrypt_js('誰かがサーバーへ接続しました。', "123").toString(),
                            uid: 'system'
                        }
                    }))
                };
                // 着信時イベント
                socket.onmessage = function (event) {

                    // event.data is 
                    //  e.g. '{"head":{"type":"msg"},"body":[[52,"aa","aa","2023-12-20 14:39:04"]]}'
                    if(!event.data)return // 無ければ無視する
                    let data=JSON.parse(event.data) // object化する
                    if(!data.body)return // 無ければ無視する

                    // 下から上に向かって追記するので SELECT ASC で昇順取得したリストをafterbeginで追記する
                    data.body.reverse()
                    console.log(data.body)
                    let msg_class='msgbox-left'
                    let msgbox=''
                    for(let i=0;i<${LIMIT};i++){
                        try{
                            console.log("-0-"+decrypt_js(data.body[i][0], "123")+"-1-"+decrypt_js(data.body[i][1], "123")+"-2-"+decrypt_js(data.body[i][2], "123")+"-3-"+decrypt_js(data.body[i][3], "123")+"-4-"+decrypt_js(data.body[i][4], "123")+"--")
                            console.log("-0-"+data.body[i][0]+"-1-"+data.body[i][1]+"-2-"+data.body[i][2]+"-3-"+data.body[i][3]+"-4-"+data.body[i][4]+"--")

                            if (!data.body || !data.body[i] || !data.body[i][3]) continue;
                            data.body[i][2]=data.body[i][2].replace(/\\n/g, '<br>')
                            // メッセージを出力する
                            if(!!data.body[i]){
                                // デフォルトのメッセージ表示位置はleft側
                                msg_class='msgbox-left'
                                if(data.head.type==='info'){
                                    msg_class='msgbox-info'
                                }
                                if(!document.cookie){
                                    // クッキーが無い場合は、メッセージをleft側に表示する
                                    msg_class='msgbox-left'
                                } else {
                                    let uid_cookie=document.cookie.match(/uid=(.{0,32})/)
                                    // uidクッキーがある場合は、自分のメッセージをright側に表示する
                                    if(uid_cookie){
                                        if(data.body[i][3]===document.cookie.match(/uid=(.{0,32})/)[1]){
                                            // 自分のメッセージはright側に表示する
                                            msg_class='msgbox-right'
                                        }
                                    } else {
                                        // uid cookieをセットする
                                        document.cookie='uid=${uid.value};';
                                    }
                                }

                                // msgbox を作る
                                let dec_name=decrypt_js(data.body[i][1], "123");
                                let dec_msg=decrypt_js(data.body[i][2], "123");
                                //console.log(data.body[i][1])
                                //console.log(dec_name, dec_msg)
                                msgbox='<div class="msgbox '+msg_class+'" style="">\
                                    <div class="namebox">\
                                    '+data.body[i][0] +': '+ dec_name+' &gt; ('+adjustHours(data.body[i][4], +9)+') \
                                    </div>\
                                    <div class="msg" uid="'+data.body[i][3]+'" \
                                    style="display:block;"> \
                                    '+dec_msg+'\
                                    </div>\
                                    <div style="clear:both;inline-block;">\
                                    </div>\
                                </div>'
                                if(window.msgs){
                                    msgs.insertAdjacentHTML('afterbegin', msgbox)
                                }
                            } 
                        } catch(e){}
                    }
                };
                // 切断時イベント
                socket.onclose = function (event) {
                    console.log('ws closed: ', event.target.url, new Date())
                };
                // DOM構築時イベント
                document.addEventListener('DOMContentLoaded', function () {
                    if(!window.input_name)return
                    if(!!document.cookie){
                        // 名前をcookieから取得し表示する
                        input_name.value = getCookie('name') 
                    } else {
                        // クッキーに名前が見つからない場合のデフォルト処理を追加
                        input_name.value = '${DEFAULT_NAME}';
                        // 名前をcookieに保存する
                        setCookie('name', '${DEFAULT_NAME}');
                        // uid cookieを保存する
                        setCookie('uid', '${uid.value}');
                    }
                });
                // 名前入力時イベント
                if(window.input_name){
                    input_name.addEventListener('keyup', function () {
                        // 名前をcookieに保存する
                        setCookie('name', input_name.value||input_name);
                    });
                }

                // 送信ボタンクリック時イベント
                if(window.btn_send){
                    btn_send.addEventListener('click', function (e) {
                        e.preventDefault();
                        // 名前とメッセージがあれば送信する
                        if(!!input_name.value && !!input_msg.value) {
                            // 名前をcookieに保存する
                            setCookie('name', input_name.value||input_name);
                            // uid cookieを保存する
                            setCookie('uid', '${uid.value}');
                            // 送信する
                            socket.send(JSON.stringify({
                                head:{type: 'msg'},
                                body:{
                                    name: encrypt_js(sanitize(window.input_name.value), "123").toString(),
                                    msg: encrypt_js(sanitize(window.input_msg.value), "123").toString(),
                                    uid: '${uid.value}'
                                }
                            }));
                            // 送信したらメッセージ欄を空にする
                            input_msg.value='';
                        }
                    });
                }
            </script>
        </body>
    </html>
        `})

    // WebSocket サーバー
    .ws('/ws', {
        open(ws: WS): void {

            // クライアント配列を作る (ブロードキャスト等で利用する)。
            clients.push(ws)
            // DBからメッセージを 初期 LIMIT件 降順で取り出してクライアントへ送信する
            let sql_select = 'SELECT * FROM ' + TABLE_NAME + ' ORDER BY ID DESC LIMIT '+ LIMIT +';'
            let res: any= doQuery(db, sql_select);
            // データ配列を接続してきたクライアントへ返す
            const data: MsgData = {
                head: {
                  type: "msg",
                },
                body: res,
            };
            // メッセージを送信する
            ws.send(JSON.stringify(data));
            
        },
        // メッセージが届いたら返すだけの簡単なエコーサーバー
        message(ws: WS, msgoj: MsgData): void {
            // メッセージの構文エラーははじく
            if (!msgoj || !msgoj.head || !msgoj.body) return;

            // Elysia の XSS やバリデーションの確認をまだしていないので、
            // 一応、msgoj を文字列化してスクリプトタグを除去し、オブジェクトへ戻す
            /*
            if(typeof msgoj=='object'){
                let msgstr=JSON.stringify(msgoj)
                msgstr=''+sanitize(msgstr)
                console.log(msgstr)
                msgoj=JSON.parse(msgstr)
            } else return; // オブジェクト以外は無視する
            */
  
            // タイプにより処理を分ける
            // type:msg はDBへ登録する
            if(msgoj.head.type==='msg'){
                console.log('msg',msgoj.body)
                msgoj.body.name = msgoj.body.name.slice(0, 300);
                msgoj.body.msg = msgoj.body.msg.slice(0, 300);
                let sql_ins = 
                        'INSERT OR IGNORE INTO ' 
                        + TABLE_NAME 
                        + ' VALUES (null, "'+msgoj.body.name+'", "'+msgoj.body.msg+'", "'+msgoj.body.uid+'", CURRENT_TIMESTAMP);'
                // insert する
                doQuery(db, sql_ins)
                // 最後の 1件だけ select する
                let sql_1 = 'SELECT * FROM ' + TABLE_NAME + ' ORDER BY ID DESC LIMIT 1;'
                let res = doQuery(db, sql_1)//こんな配列で返ってくる。 [[0件目], [1件目], [2件目], [3件目]] 
                // sql_1 結果セットのメッセージ配列をブロードキャストする
                broadCast(ws, msgoj.head.type, res)
            } else if(msgoj.head.type==='info'){
                // infoは DB へ保存しない。
                // 届いたinfoメッセージをブロードキャストする
                let time=new Date()
                broadCast(ws, msgoj.head.type, [['', '--※info', msgoj.body.msg, msgoj.body.uid, 
                  // UTCから日本時間への変換をクライアント側でしてるので、
                  // クライアントから届いた日本時間をマイナス9時間して 
                  // SQLite出力同様のUTCに揃える
                  adjustHours(new Date(), -9)
                ]]) 
            } else {}
        }
    })
    .listen(PORT, (token: any) => {
        if (token) {
            console.log(`Listening to port ${PORT}`);
        } else {
            console.error(`Failed to listen to port ${PORT}`);
        }
    });

//------------------------------------------------------------
// sendSMS
// @body {string} body text
// @to {string} tel //e.g. '09046213611'
// @return {object}
// e.g. .SMS_の付く定数は環境変数へ登録しておく
//
const util = require('util');
const childProcess = require('child_process');
const exec = util.promisify(childProcess.exec);
const INPUT_LEN_TEL=11
const SMS_TOTEL=process.env.SMS_TOTEL
const SMS_API_TOKEN= process.env.SMS_API_TOKEN
const SMS_NOTIFICATION_EMAILS=process.env.SMS_NOTIFICATION_EMAILS
const endpoint='https://api.smslink.jp/'

async function sendSMS(body, to){
    if(to.length!==INPUT_LEN_TEL)return
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

//===========================================
// uid を作成する関数
//  @param {String} sql - 実行するSQLクエリ
//  @returns {String} - 結果の文字列
function mkmd5(str: string): string {
    return crypto.createHash('md5').update(str).digest('hex')
}

//===========================================
// データベースクエリを実行する関数
//  @param {String} sql - 実行するSQLクエリ
//  @returns {Array} - 結果の配列
type QueryResultType = Array<any>; 
function doQuery(db: Database, sql: string): QueryResultType {
    return db.query(sql).values();
}

//===========================================
// 全クライアントへブロードキャストする関数
//  @param {Object} ws - WebSocket インスタンス
//  @param {String} msg - 送信するメッセージ
//  @returns {void} - なし

// 全クライアントへブロードキャストする
function broadCast(ws: WS, type: any, msg: any): void {
    let msgtype=(type==='info')?type:'bc'
    clients.forEach(function (socket, i) {
        const data: MsgData = {
            "head": {
              "type": msgtype
            },
            "body": msg,
        };
        // console.log(data)
        socket.send(JSON.stringify(data) );
    })
}