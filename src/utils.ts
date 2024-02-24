
//===========================================
// telを保存して同じtel番号の連続送信を防ぐ
//  @param {String} tel - tel番号

import { Database } from 'bun:sqlite';
/**
isSendingAllowed(tel, (result) => {
    if (result) {
        console.log('Sending is allowed');
    }
}); 
cd ../../../../../../../
INSERT INTO sms_table_name (tel, created_at)
            VALUES ('09046213611', datetime('now'));

insertTel(tel) 

*/
// データベース初期化とテーブル作成
export function initDB(): Database {

    const SMS_DB_FILE_NAME = __dirname+'/../db/SMS.sqlite';
    const SMS_TABLE_NAME = 'sms_table_name';
    const db = new Database(SMS_DB_FILE_NAME, { create: true });
    db.exec('PRAGMA journal_mode = WAL;');

    db.exec(`CREATE TABLE IF NOT EXISTS ${SMS_TABLE_NAME} (
        id INTEGER PRIMARY KEY, 
        tel VARCHAR(11), 
        created_at TIMESTAMP
    )`);
    return db;
}

// 新しい電話番号をデータベースに追加する関数
/*
            INSERT INTO sms_table_name (tel, created_at)
            VALUES ( '07077776006', datetime('now'))
*/
export async function insertTel(tel: string): Promise<void> {
    const db = initDB()
    return new Promise((resolve, reject) => {
        db.exec(`
            INSERT INTO sms_table_name (tel, created_at)
            VALUES (?, datetime('now'))
        `, [tel], (err) => {
            if (err) {
                console.error(err.message);
                reject(err.message);
            } else {
                resolve();
            }
        });
    });
}

// データベースをクローズ
function closeDatabase(db: Database): void {
    db.close();
}
// telを正規化する
export function normalizeTelNum(tel: string): string {
    return tel.replace(/[^0-9]/g, '');
}
// telの桁をチェックする
export function chkTelLen(tel: string): boolean {
    return tel.length===11?true:false;
}
export async function isSendingAllowed(tel: string): Promise<boolean> {
    // ・30秒以内に同じtel番号があればfalseを返す/インターバル30秒置かないと発信できない

    try {
        console.log('tel', tel, typeof tel);
        tel = normalizeTelNum(tel)
        console.log('tel', tel, typeof tel);
        const db = initDB();

        // 直近の同じ電話番号の送信件数を取得
        //const recentCount = getRecentCount(db, tel);
        //console.log('recentCount', recentCount, typeof recentCount);

        // msec秒以内にカラム tel があるか
        let msec = 30000 
        let hadit= await hasTel(db, tel, msec);
        console.log('hadit', hadit, typeof hadit);
        
        if (hadit) {
            // 有れば終了
            closeDatabase(db);
            return false;
        } else {
            // 無ければ送信OK
            return true;
        }

        

    } catch (error) {
        console.error(error.message);
        return false;
    }
}

// ===========================================
// 指定された電話番号に関連する最新のSMSの数を取得します。
//
// @param {Database} db - Database インスタンス
// @param {string} tel - SMS数を取得する電話番号
// @returns {number} - 指定した電話番号に関連する最新のSMSの数
function getRecentCount(db: Database, tel: string){
    return  db.query(`
        SELECT COUNT(*) AS recent_count
        FROM sms_table_name
        WHERE tel = ?
        ORDER BY created_at DESC
        LIMIT 50
    `)
    .get(tel);
}

//===========================================
// 現在の時刻と指定された電話番号の作成日時との時間差
//  @param {Database} db - Database インスタンス
//  @param {string} tel - 時間差を計算する電話番号
//  @returns {number|null} - 秒単位の時間差。一致するレコードが見つからない場合はnull
export async function getTimeDiff(db: Database, tel: string){
    return db.query(`
        SELECT strftime('%s', 'now') - strftime('%s', MAX(created_at)) AS time_diff
        FROM sms_table_name
        WHERE tel = ?
        LIMIT 1
    `)
    .get(tel);
}
//===========================================
// sec 秒以内にカラム tel があるかを調べたい
//  @param {Database} db - Database インスタンス
//  @param {string} tel - 電話番号
//  @param {Number} msec - ミリ秒数
//  @returns {boolean} - 存在すればtrue、存在しなければfalseを返す
/*
SELECT created_at
        FROM sms_table_name
        WHERE tel = '07077776006'
        ORDER BY created_at DESC
        LIMIT 1;
*/
export async function hasTel(db: Database, tel: string, msec: number){
    try {
        // SQLクエリの実行
        const res = await db.query(`
            SELECT created_at
            FROM sms_table_name
            WHERE tel = ?
            ORDER BY created_at DESC
            LIMIT 1
        `).get(tel);

    let created_at_unix=new Date(res.created_at).getTime()//+ (9 * 60 * 60 * 1000)
    let sabun = new Date().getTime()-created_at_unix
    console.log('sabun', sabun,  'msec', msec, res && sabun <= msec)
        // 結果が存在し、かつ作成日時が現在の日時からmsecミリ秒以内のものであればtrueを返す
        return res && sabun <= msec;
    } catch (error) {
        // エラーハンドリング（エラーが発生した場合は例外をキャッチしてfalseを返す）
        console.error('Error executing SQL query:', error);
        return false;
    }
}

//===========================================
// タイムゾーンを変更する e.g. UTC -> JST 
//  @param {Object} date - Date インスタンス
//  @param {Number} adjustHour - 調整する時間数 e.g. -9 | +9
//  @returns {string} - 時間の文字列 e.g. '2023-12-22 09:59'
export function adjustHours(date: Date, adjustHour: number): string {
  if(date instanceof Date === false)date=new Date(date)
  date.setHours(date.getHours() + adjustHour)
  return date.toLocaleString(
      ["ja-JP"], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
}

//===========================================
// 各種登録用の関数
//  @returns {String} - HTML文字列
export function regBox_1(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=regBox_2('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>自身の携帯番号</h2>
            </div>
            <div class="my_tel_title">
            ご自身の携帯電話番号を<br />入力・登録してください
            </div>
            <input type="text" id="input_my_tel" class="input_tel" placeholder="" />
            <br />
            <button id="btn_my_tel_send" type="button" 
              onclick=" event.preventDefault();
              input_my_tel.value = input_my_tel.value||getCookie('mytel')||'';
              setCookie('mytel', input_my_tel.value);
              console.log(input_my_tel.value)
              const response = fetch('http://'+location.host+'/api/sms-code/', {
                method: 'POST',
                body: JSON.stringify({ tel: input_my_tel.value }),
                headers: { 'Content-Type': 'application/json' },
              })
              .then((response) =>  {
                  window.contact.innerHTML=regBox_2('${CHAT_NAME}', '${VERSION}', '${uid}');
              });" 
               />
            登録
            </button>
        </div>
    </form>`
}
//===========================================
// 各種登録用の関数
//  @returns {String} - HTML文字列
export function regBox_2(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>認証</h2>
            </div>
            <div class="my_secu_title">
            届いたセキュリティコードを<br />入力してください
            </div>
            <input type="tel" id="input_my_secu" class="input_tel" 
                maxlength="4"  
                max="4" placeholder="セキュリティコード" autofocus />
            <button id="btn_my_tel_send" type="button" 
            onclick=" 
                event.preventDefault();
                const response = fetch('http://'+location.host+'/api/sec/', {
                    method: 'POST',
                    body: JSON.stringify({ sec: input_my_secu.value }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then((response) =>  {
                    window.contact.innerHTML=regBox_3('${CHAT_NAME}', '${VERSION}', '${uid}');
                });" 
             />
          登録
          </button>
            <br />
            <div class="info">
            <br />
            ※もしセキュリティコードが届かないときは、
            <button
                style="background: #dcced6; border: 1px solid #dcced6; padding: 5px; margin: 5px;"
                onclick="window.contact.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}', '${uid}')" >戻る</button>
            で携帯番号を確認して再送してみてください
            </div>
        </div>
    </form>`
}
//===========================================
// 相手の携帯番号登録用の関数
//  @returns {String} - HTML文字列
export function regBox_3(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>相手の携帯番号</h2>
            </div>
            <div class="to_tel_title">
            接続したい相手の携帯番号
            <input type="text" id="input_to_tel" class="input_tel" placeholder="" autofocus /><br />
            </div>
            <button id="btn_to_tel_send" type="submit" type="button" 
            onclick=" 
                event.preventDefault();
                const response = fetch('http://'+location.host+'/api/sec/', {
                    method: 'POST',
                    body: JSON.stringify({ sec: input_my_secu.value }),
                    headers: { 'Content-Type': 'application/json' }
                })
                .then((response) =>  {
                    window.contact.innerHTML=regBox_4('${CHAT_NAME}', '${VERSION}', '${uid}');
                });" 
             />
          登録
          </button>

        </div>
    </form>`
}
//===========================================
// パスフレーズ登録用の関数
//  @returns {String} - HTML文字列
export function regBox_4(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="reg_box">
            <div class="head">
                <img id="config" src="/public/img/config-icon.png" 
                alt="config" width="40" height="40" 
                onclick="window.contact.innerHTML=inputBox('${CHAT_NAME}', '${VERSION}', '${uid}')" />
                <h2>パスフレーズ</h2>
            </div>
            <div class="pass_title">
            パスフレーズ<span style="font-size:1.2rem;vertical-align: middle;"> (半角英数字8文字以上) </span>
            </div>
            <input type="password" id="input_pass" /><br />
            <div class="pass"></div>
            <button id="btn_send" type="submit">
            登録
            </button>
        </div>
    </form>`
}
//===========================================
// メッセージ入力用の関数
//  @returns {String} - HTML文字列
export function inputBox(CHAT_NAME: string, VERSION: string, uid: string): string{
    return `<form>
        <div class="input_box">
        <div class="head">
            <img id="config" src="/public/img/config-icon.png" 
            alt="config" width="40" height="40" 
            onclick="window.contact.innerHTML=regBox_1('${CHAT_NAME}', '${VERSION}')" />
            <h2><a id=input_box_title_link href=http://`+location.host+`>${CHAT_NAME} v${VERSION} </a></h2>
        </div>
        <div class="name_title">
        名前
        </div>
        <input type="text" id="input_name" uid="${uid}" placeholder="名前を入れてください" /><br />
        <div class="msg_title">
        メッセージ
        </div>
        <textarea id="input_msg" placeholder="メッセージを入力してください"></textarea><br />
        <div class="message">送信</div>
        <button id="btn_send" type="submit">
        送信
        </button>
        </div>
    </form>
    
    <ul safe id=msgs></ul>
    `
}

//===========================================
// cookieを読み出す関数
//  @param {String} key - キー文字列
//  @returns {String} - cookieの値文字列
export function getCookie(key: string) {
    let regex = new RegExp('(?:^|;)\\s*' + key + '=([^;]+)');
    return decodeURIComponent(document.cookie.match(regex)?.[1] || '');
}
//===========================================
// cookieをセットする関数
//  @param {String} key - キー文字列
//  @param {String} value - value
//  @returns {String} - セットした cookie の key value 文字列
//  有効期限やドメインなどをどうするかはあとで検討
export function setCookie(key: string, value: string):string{
    return document.cookie=key+'='+encodeURIComponent(value)+''
}

//===========================================
// 画像をドラッグアンドドロップした際に、その画像の data:image URI を取得する
// 
export function getDataImageByDrop(dropElmentId): boolean{
    document.addEventListener('DOMContentLoaded', function () {
        let dropElment = document.getElementById(dropElmentId);
        dropElment.addEventListener('drop', function (e) {
            e.preventDefault(); // デフォルトのドロップ操作をキャンセル
    
            // ドロップされたファイルが存在するか確認
            if (e.dataTransfer.files.length > 0) {
                var droppedFile = e.dataTransfer.files[0];
    
                // FileReader を使用して画像ファイルを読み込む
                var reader = new FileReader();
    
                reader.onload = function (event) {
                    var imageDataURI = event.target.result;
                    console.log('画像のdata:image URI:', imageDataURI);
    
                    // ここで imageDataURI を使って何かしらの処理を行うことができます
                };
    
                // 画像ファイルを読み込む
                reader.readAsDataURL(droppedFile);
            }
        });
    
        // ドラッグオーバーイベントをキャンセルしてドロップを許可
        dropElment.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
    });
}


//===========================================
// 画像dataの有無
// 
export function hasDataImg(wkmsg: string): boolean{
    let urlRegEx = /^(.*)(data:image\/[a-z]+;base64.*)/i
    let reg=wkmsg.match(urlRegEx)
    //alert('test',reg)
    if (reg){
        return true
    } else {
        return false
    }
}
//===========================================
// 画像dataを img 要素
// 
export function dataImgWrap2Img(wkmsg: string): string {
    // 画像data抽出用正規表現 
    //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAM4AAABWCAYAAACHKqnqAAADLElEQVR4Ae3cQU7bQBgF4Jw23CCnLHcgKa7oBhaRotBFXBlpIjCTEbOJn6UPKXI8Y4nX759HYNPN6GtVAqfTaTwcfo/7/cFrQYPNqk6NsB8C7
    let urlRegEx = /^(.*)(data:image\/[a-z]+;base64,.*)/i
    let tolink = "<img src='$2' style=max-width:50%;>"
    let reg=wkmsg.match(urlRegEx)
    // マッチしたすべてのurl文字列を img要素でラップする
    if (reg){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
        console.log('this is img data.')
    }
    return wkmsg
}
//===========================================
// 画像urlを img 要素に変換する
//  (※urlWrap2Linkと併用する場合は、urlWrap2Linkを先に実行する)
// 
export function urlWrap2Img(wkmsg: string): string {
    // 画像文字列抽出用正規表現 gで複数にマッチする
    let urlRegEx = /^(.*)(https.*\.(jpg|jpeg|gif|png|bmp|webp))(.*)$/i,
    tolink = "$1<a target='_blank' href='$2'><img src='$2' style=max-width:480px;></a>$4<div style=font-size:0.7rem>$2</div>"
    
    // match
    let reg=wkmsg.match(urlRegEx)

    // マッチしたすべてのurl文字列を img要素でラップする
    if (reg){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
    }
    //console.log('2222 urlWrap2Img:',urlRegEx, wkmsg)
    return wkmsg;
}
//===========================================
// urlをlink Element に変換する
// 
export function urlWrap2Link(wkmsg: string): string {
    let lists=[]
    let mobile=('touchstart' in window);
    let target='_blank';
    if(mobile){
        target='_self';
    }
    let imgRegEx=/\.(jpg|jpeg|gif|png|bmp|webp)$/i
    // url文字列抽出用正規表現 gで複数にマッチする
    let urlRegEx = /(s?https?:\/{2,}[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)/g,
        tolink = "<a href='$1'>$1</a>"
    
    if(wkmsg.match(imgRegEx)){
        console.log('this is img.')
        return wkmsg;
    }
    // match
    lists=wkmsg.match(urlRegEx)

    // マッチしたすべてのurl文字列を a要素でラップする
    if (wkmsg.match(urlRegEx)){
        wkmsg = wkmsg.replace(urlRegEx, tolink)
    }

    return wkmsg;
}

