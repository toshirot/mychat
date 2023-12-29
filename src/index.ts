import { Elysia } from 'elysia';
import type { WS } from '@types/bun';
import { html } from '@elysiajs/html'
import { Database } from 'bun:sqlite';
import { adjustHours } from "./utils";

// チャット名
const chatName = 'myChat';
// バージョン
const version = '0.1.003';

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
    + ' (id INTEGER PRIMARY KEY, name VARCHAR(255), msg VARCHAR(255), created_at TIMESTAMP);'
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
    .get('/', () => `
        <html lang='ja'>
            <head>
                <title>${chatName} updating</title>
                <script>${adjustHours} </script>
            </head>
            <body><Layout>
                <h1 style=margin-bottom:5px;>${chatName} updating v${version}</h1>
                
                <a href="https://qiita.com/toshirot/items/c5654156c8799ac28d83" target=qiita>
                →このチャットの作り方 (最初のバージョン)</a><br><br>

                名前: <input safe
                    id="input_name"
                    type="text"
                    placeholder="名前を入れてください"><br>
                メッセージ: <input safe
                    id="input_msg"
                    type="text"
                    onchange=""
                    placeholder="メッセージを入れてください"><br>
                <button id="btn_send">送信</button>
                
                <ul safe id=msgs></ul>

                <h3>Update</h3>
                <ul>
                    <li>2023/12/23
                        <ol>
                            <li>rc/utiles.ts にタイムゾーンの変更関数 adjustHours追加</li>
                        </ol>
                    </li>
                    <li>2023/12/22
                        <ol>
                            <li>typescript 的な型指定や interface定義追加</li>
                        </ol>
                    </li>
                    <li>2023/12/21 
                        <ol>
                            <li>interface MsgData を追加</li>
                            <li>typescript 的な型指定を追加</li>
                            <li>chatName と viersion番号を追加</li>
                        </ol>
                    </li>
                </ul>

                <script>
                    // 接続
                    const socket = new WebSocket('ws://74.226.208.203:9012/ws');
                    // 接続時イベント
                    socket.onopen = function (event) {
                        socket.send(JSON.stringify({
                            head:{type: 'info'},
                            body:{
                                name: 'system',
                                msg: '誰かがサーバーへ接続しました。'
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
                        for(let i=0;i<${limit};i++){
                            // メッセージを出力する
                            if(!!data.body[i] && !!data.body[i]){
                                msgs.insertAdjacentHTML('afterbegin',
                                  '<br><b>'
                                  +data.body[i][0]+' '
                                  +data.body[i][1]+': </b>'
                                  +data.body[i][2]+' ('+adjustHours(data.body[i][3], +9)+')'
                                )
                            }
                        }

                    };
                    // 送信ボタンクリック時イベント
                    btn_send.addEventListener('click', function () {
                        // 名前とメッセージがあれば送信する
                        if(!!input_name.value && !!input_msg.value) 
                        socket.send(JSON.stringify({
                            head:{type: 'msg'},
                            body:{
                                name: input_name.value,
                                msg: input_msg.value
                            }
                        }));
                    });
                </script>
            </body>
        </html>
    `)
    // WebSocket サーバー
    .ws('/ws', {
        open(ws: WS): void {
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
                        + ' VALUES (null, "'+msgoj.body.name+'", "'+msgoj.body.msg+'", CURRENT_TIMESTAMP);'
                // insert する
                doQuery(db, sql_ins)
                // 最後の 1件だけ select する
                let sql_1 = 'SELECT * FROM ' + tableName + ' ORDER BY ID DESC LIMIT 1;'
                let res = doQuery(db, sql_1)//こんな配列で返ってくる。 [[0件目], [1件目], [2件目], [3件目]] 
                // sql_1 結果セットのメッセージ配列をブロードキャストする
                broadCast(ws, res)
            } else if(msgoj.head.type==='info'){
                // infoは DB へ保存しない。
                // 届いたinfoメッセージをブロードキャストする
                let time=new Date()
                broadCast(ws, [['', '--※info', msgoj.body.msg,
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
function broadCast(ws: WS, msg: any): void {
    clients.forEach(function (socket, i) {
        const data: MsgData = {
            head: {
              type: "bc",// broadCast
            },
            body: msg,
        };
        console.log(data)
        socket.send(JSON.stringify(data) );
    })
}