import { Elysia } from 'elysia';
import type { WS } from '@types/bun';
import { html } from '@elysiajs/html'
import { Database } from 'bun:sqlite';
import { adjustHours } from "./utils";
const crypto = require('crypto');
//bun add @elysiajs/cookie
//console.log('md5:    ' + crypto.createHash('md5').update('aaa').digest('hex'));

// チャット名
const chatName = 'myChat';
// バージョン
const version = '0.1.011';

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
const dbFileName = './db/'+chatName+'.sqlite';
// テーブルの名前を指定
const tableName = 'chat_logs';
// 新しいデータベースインスタンスを作成し、ファイルが存在しない場合はデータベースファイルを作成
const db = new Database(dbFileName, { create: true });
// 同時書き込みが行われる状況でパフォーマンスを大幅に向上させる先行書き込みログ モード(WAL) 
db.exec('PRAGMA journal_mode = WAL;');
// テーブルが存在しない場合はテーブルを作成
const sql_table_create =
    'CREATE TABLE IF NOT EXISTS ' 
    + tableName 
    + ' (id INTEGER PRIMARY KEY, name VARCHAR(255), msg VARCHAR(255), uid VARCHAR(32), created_at TIMESTAMP);'
doQuery(db, sql_table_create);

// 出力するメッセ―ジ数
const limit = 20;

// クライアントを入れとく配列 ブロードキャスト用
let clients: WebSocket[] = [];

//===========================================
// サーバーを立てる HTTPとWebSocket
// 
const app = new Elysia()
    .use(html())
    .get('/', ({ cookie: { name, uid } }) => { 
       
        console.log('0  name, uid ' , name.value, uid.value);
        // cookie から名前とuidを取得
        if(name.value && uid.value){
            console.log('1 name, uid ' , name.value, uid.value);
        } else {
            // name をセットする
            name.value='通りすがりさん'
            //uid.value=mkmd5(Math.random().toString(36)
            uid.value= mkmd5(Math.random().toString())
            console.log('2 name, uid ', name.value, uid.value);
        }
 
    return  `
    <html lang='ja'>
        <head>
            <title>${chatName} updating</title>
            <script>${adjustHours} </script>
            <script>//${uid.value} </script>
            <style>
            body{
                background-color:#f2f2f5;
            }
            .msgbox{
                position:relative;
                width:80%;
                min-height:0px;
                margin-top:10px;
                padding:10px;
                padding-left:20px;
                text-align: left;
                color:#333333;
                font-size: 14px;
                border-radius:11px;
                -webkit-border-radius:11px;
                -moz-border-radius:11px;
                box-shadow: 5px 10px 15px #d0d3d3;
            }
            .msgbox-right{
                float: right;
                margin-right:50px;
                background:#fff8ca;
            }
            .msgbox-left{
                float: left;
                margin-left:50px;
                background:#E1FFCA;
            }
            .msgbox-info{
                float: left;
                margin-left:50px;
                background:#e4e5e9;
            }
            .msgbox-right:after{
                left:100%;
                border-left-color:#fff8ca;
            }
            .msgbox-left:after{
                right:100%;
                border-right-color:#E1FFCA;
            }
            .msgbox-info:after{
                right:100%;
                border-right-color #e4e5e9;
            }
            :where(.msgbox-left,.msgbox-right,.msgbox-info):after{
                border: solid transparent;
                content:'';
                height:0;
                width:0;
                pointer-events:none;
                position:absolute;
                border-color: rgba(225, 255, 202, 0);
                border-top-width:10px;
                border-bottom-width:10px;
                border-left-width:24px;
                border-right-width:24px;
                margin-top: -10px;
                top:50%;
            }

            .namebox{
                font-size:11px;
                color:#333333;
                text-align:left;
            }
            </style>
        </head>
        <body><Layout>
            <h1 style=margin-bottom:5px;>${chatName} v${version}</h1>
            
            <a href="https://qiita.com/toshirot/items/c5654156c8799ac28d83" target=qiita>
            →このチャットの作り方</a><br><br>

            名前: <input safe
                id="input_name"
                type="text"
                value="${name.value}"
                uid="${uid.value}"
                placeholder="名前を入れてください"><br>
            メッセージ: <input safe
                id="input_msg"
                type="text"
                onkeyup="if(event.keyCode==13)btn_send.click();"}"
                placeholder="メッセージを入れてください"><br>
            <button id="btn_send">送信</button>
            
            <ul safe id=msgs></ul>

            <div style=font-size:12px;margin-left:30px;clear:both;>
                <h3>Update</h3>
                <ul>
                    <li>2023/12/24 v0.1.005: 
                        <ol>
                            <li>名前欄をcookie保存する</li>
                            <li>送信したらメッセージ欄をクリアする</li>
                        </ol>
                    </li>
                    <li>2023/12/23 v0.1.004: 
                        <ol>
                            <li>メッセージ欄の改行送信機能を追加</li>
                        </ol>
                    </li>
                    <li>2023/12/23 v0.1.003: 
                        <ol>
                            <li>rc/utiles.ts にタイムゾーンの変更関数 adjustHours追加</li>
                        </ol>
                    </li>
                    <li>2023/12/22 v0.1.002: 
                        <ol>
                            <li>typescript 的な型指定や interface定義追加</li>
                        </ol>
                    </li>
                    <li>2023/12/21 v0.1.001: 
                        <ol>
                            <li>interface MsgData を追加</li>
                            <li>typescript 的な型指定を追加</li>
                            <li>chatName と viersion番号を追加</li>
                        </ol>
                    </li>
                </ul>
            </div>

            <script>
                // 接続
                const socket = new WebSocket('ws://74.226.208.203:9012/ws');
                // 接続時イベント
                socket.onopen = function (event) {
                    console.log('cookie at onopen: ', document.cookie)
                    socket.send(JSON.stringify({
                        head:{type: 'info'},
                        body:{
                            name: 'system',
                            msg: '誰かがサーバーへ接続しました。',
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
                    let msg_class='msgbox-left'
                    let msgbox=''
                    for(let i=0;i<${limit};i++){
                        if(data.head.type==='info'){
                           
                            msg_class='msgbox-info'
                        } else if(data.head.type==='bc'){
                            msg_class='msgbox-left'
                        } else if(data.head.type==='msg'){
                            msg_class='msgbox-right'
                        }
                        try{
                            if(data.body[i][3]===0)continue
                            if(data.body[i][3]===undefined)continue
                            if(!data.body[i][3])console.log('data.body[i][3]: ', data.body[i][3])

    
                            // メッセージを出力する
                            if(!!data.body[i]){
                                if(data.body[i][3]==='${uid.value}'){
                                    msg_class='msgbox-left'
                                }
                                console.log('msg_class', msg_class, data.body[i][2], data.body[i][3],  '${uid.value}')
                                msgbox='<div class="msgbox '+msg_class+'" style="">\
                                    <div class="namebox">\
                                    '+data.body[i][1]+' &gt; ('+adjustHours(data.body[i][4], +9)+') \
                                    </div>\
                                    <div class="msg" uid="'+data.body[i][3]+'" \
                                    style="display:block;"> \
                                    '+data.body[i][2]+'\
                                    </div>\
                                    <div style="clear:both;inline-block;">\
                                    </div>\
                                </div>'
                                msgs.insertAdjacentHTML('afterbegin', msgbox)
                            } 
                        } catch(e){}

                    }

                };
                // 送信ボタンクリック時イベント
                btn_send.addEventListener('click', function () {
                    // 名前とメッセージがあれば送信する
                    if(!!input_name.value && !!input_msg.value) {
                        console.log('cookie at click: ', document.cookie)
                        // 名前をcookieに保存する
                        document.cookie='name='+input_name.value+';';
                        document.cookie='uid=${uid.value};';
                        console.log('cookie at clicked: ', document.cookie)
                        // 送信する
                        socket.send(JSON.stringify({
                            head:{type: 'msg'},
                            body:{
                                name: input_name.value,
                                msg: input_msg.value,
                                uid: '${uid.value}'
                            }
                        }));
                        // 送信したらメッセージ欄を空にする
                        input_msg.value='';
                    }
                });
            </script>
        </body>
    </html>
        `})

    // WebSocket サーバー
    .ws('/ws', {
        open(ws: WS): void {
            //console.log('cookie:',  setCookie)
            /*
            let plainText='123'
            console.log('md5:    ' + mkmd5(plainText));
            //console.log('ws---', ws, ws.data.cookie.name._value  , ws.data.cookie.uid._value  )
            console.log('ws---', ws.data.cookie.name._value  , ws.data.cookie.uid._value  )
            if(!ws.data.cookie.uid._value||ws.data.cookie.uid._value===''){
                // uid をセットする
                ws.data.cookie.uid.value='uid='+mkmd5(plainText)+';';
                console.log('ws-2--', ws.data.cookie.name._value  , ws.data.cookie.uid._value ,mkmd5(plainText) )
            } */
           
            // クライアント配列を作る (ブロードキャスト等で利用する)。
            clients.push(ws)
            // DBからメッセージを 初期 limit件 降順で取り出してクライアントへ送信する
            let sql_select = 'SELECT * FROM ' + tableName + ' ORDER BY ID DESC LIMIT '+ limit +';'
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
            if(typeof msgoj=='object'){
                let msgstr=JSON.stringify(msgoj)
                msgstr=(''+msgstr).replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gi, '');
                msgoj=JSON.parse(msgstr)
            } else return; // オブジェクト以外は無視する
  
            // タイプにより処理を分ける
            // type:msg はDBへ登録する
            if(msgoj.head.type==='msg'){
                console.log('msg',msgoj.body)
                let sql_ins = 
                        'INSERT OR IGNORE INTO ' 
                        + tableName 
                        + ' VALUES (null, "'+msgoj.body.name+'", "'+msgoj.body.msg+'", "'+msgoj.body.uid+'", CURRENT_TIMESTAMP);'
                // insert する
                doQuery(db, sql_ins)
                // 最後の 1件だけ select する
                let sql_1 = 'SELECT * FROM ' + tableName + ' ORDER BY ID DESC LIMIT 1;'
                let res = doQuery(db, sql_1)//こんな配列で返ってくる。 [[0件目], [1件目], [2件目], [3件目]] 
                // sql_1 結果セットのメッセージ配列をブロードキャストする
                broadCast(ws, msgoj.head.type, res)
            } else if(msgoj.head.type==='info'){
                // infoは DB へ保存しない。
                // 届いたinfoメッセージをブロードキャストする
                let time=new Date()
                broadCast(ws, msgoj.head.type, [['', '--※info', msgoj.body.msg, '', 
                  // UTCから日本時間への変換をクライアント側でしてるので、
                  // クライアントから届いた日本時間をマイナス9時間して 
                  // SQLite出力同様のUTCに揃える
                  adjustHours(new Date(), -9)
                ]]) 
            } else {}
        }
    })
    .listen(9012, (token: any) => {
        if (token) {
            console.log('Listening to port 9012');
        } else {
            console.error('Failed to listen to port 9012');
        }
    });

function mkMsgLists(msg_class, data){
    return `
    <div class="msgbox `+msg_class+`" style="">
    <div class="namebox">
    `+data.body[i][1]+` &gt; (`+adjustHours(data.body[i][4], +9)+`) 
    </div>
    <div class="msg" uid='`+data.body[i][3]+`'
    style="display:block;"> 
    `+data.body[i][2]+`
    </div>
    <div style="clear:both;inline-block;">
    </div>
  </div>`
}
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
        console.log(data)
        socket.send(JSON.stringify(data) );
    })
}