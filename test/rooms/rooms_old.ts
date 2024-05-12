import { Database } from 'bun:sqlite';

//============================================
// Chat用データベースの作成
//============================================
// チャット名
const CHAT_NAME = 'myChat';
// データベースファイルの名前を指定
const DB_FILE_NAME = __dirname + '/_test_'+CHAT_NAME+'.sqlite';

//============================================
// テーブル生成
//============================================
// テーブルの名前を指定
const TABLE_MSGS = 'chat_msgs';
const TABLE_ROOMS = 'chat_rooms';
const TABLE_USERS = 'chat_users';
// 新しいデータベースインスタンスを作成し、ファイルが存在しない場合はデータベースファイルを作成
const db = new Database(DB_FILE_NAME, { create: true });
// 同時書き込みが行われる状況でパフォーマンスを大幅に向上させる先行書き込みログ モード(WAL) 
db.exec('PRAGMA journal_mode = WAL;');

// テーブルが存在しない場合はテーブルを作成
// 型は互換性考慮のため、VARCHAR と TIMESTAMP にしている <これは正しい型ではない>

// テーブル作成 メッセージデータ
const sql_table_rooms_create =
    `CREATE TABLE IF NOT EXISTS ${TABLE_ROOMS} (
            room_id INTEGER PRIMARY KEY,
            room_name VARCHAR(255),
            created_at TIMESTAMP
        );`
const sql_table_users_create =
    `CREATE TABLE IF NOT EXISTS ${TABLE_USERS} (
            user_uid VARCHAR(128) PRIMARY KEY,
            user_name VARCHAR(255),
            created_at TIMESTAMP
        );`
const sql_table_msg_create =
    `CREATE TABLE IF NOT EXISTS 
        ${TABLE_MSGS}
        (
            room_id INTEGER,
            user_uid VARCHAR(128),
            user_name VARCHAR(255), 
            user_msg VARCHAR(200000),
            created_at TIMESTAMP,
            PRIMARY KEY (room_id, user_uid),
            FOREIGN KEY (room_id) REFERENCES rooms(room_id),
            FOREIGN KEY (user_uid) REFERENCES users(user_uid)
        );`

// rooms SQLを実行する
doQuery(db, sql_table_rooms_create);
// users SQLを実行する
doQuery(db, sql_table_users_create);
// msg SQLを実行する
doQuery(db, sql_table_msg_create);

//============================================
// データ初期化
//============================================

// 全てのチャットルームを削除するAPI
await deleteAllChatRooms()
// 全てのユーザーを削除するAPI
await deleteAllChatUsers()
// 全てのメッセージを削除するAPI
await deleteAllChatMessages()


//============================================
// サンプル
//============================================
// ランダムな整数を生成する関数
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const randm_num = getRandomInt(1, 100); // 1から100のランダムな整数

// 各テーブルにデータを挿入するサンプルを実行する
async function runSampleInserts(randm_num) {
    const room_name = 'Hoge_'+randm_num; // チャットルーム名
    const room_id = randm_num
    const user_uid = 'user_'+randm_num; // ユーザーID
    const user_name = 'John Doe_'+randm_num; // ユーザー名
    const user_msg = 'Random Message '+randm_num; // 固定のメッセージ
    try {
        await insertChatRoom(room_name);// チャットルームを挿入
        await insertChatUser(user_uid, user_name);// ユーザーを挿入
        await insertChatMessage(room_id, user_uid, user_name, user_msg);// Chatメッセージを挿入
        console.log('Sample inserts completed successfully.');
    } catch (error) {
        console.error('Error occurred during sample inserts:', error);
    }
}

runSampleInserts(randm_num+1);
 
// 出力
console.log((await getAllChatRooms())[0].room_name)// get all chat rooms
console.log((await getAllChatUsers())[0].user_name) // get all chat users
console.log((await getAllChatMessages())[0].user_msg)// get all chat messages
/*
// サンプルを実行する
runSampleInserts(randm_num+1);
runSampleInserts(randm_num+2);
runSampleInserts(randm_num+3);

// 出力
console.log(await getAllChatRooms())// get all chat rooms
console.log(await getAllChatUsers()) // get all chat users
console.log(await getAllChatMessages())// get all chat messages
*/

//============================================
// 関数
//============================================

//--------------------------------------------
// INSERT
//--------------------------------------------

// チャットルームを挿入するAPI
async function insertChatRoom(room_name: string): Promise<number> {
    const sql = `
        INSERT INTO ${TABLE_ROOMS} (room_name, created_at)
        VALUES (?, datetime('now'))`;

        console.log(room_name)
   await db.run(sql, [room_name]);
}

// ユーザーを挿入するAPI
async function insertChatUser(user_uid: string, user_name: string): Promise<void> {
    const sql = `
        INSERT INTO ${TABLE_USERS} (user_uid, user_name, created_at)
        VALUES (?, ?, datetime('now'))`;

        console.log(user_uid, user_name)
    await db.run(sql, [user_uid, user_name]);
}

// Chatメッセージを挿入するAPI
async function insertChatMessage(room_id: number, user_uid: string, user_name: string, user_msg: string): Promise<void> {
    const sql = `
        INSERT INTO ${TABLE_MSGS} (room_id, user_uid, user_name, user_msg, created_at)
        VALUES (?, ?, ?, ?, datetime('now'))`;

        console.log(room_id, user_uid, user_name, user_msg)
    await db.run(sql, [room_id, user_uid, user_name, user_msg]);
}

//--------------------------------------------
// SELECT
//--------------------------------------------

// 全てのチャットルームを取得するAPI
async function getAllChatRooms(): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_ROOMS}`;
    return await db.query(sql).all();
}

// 全てのユーザーを取得するAPI
async function getAllChatUsers(): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_USERS}`;
    return await db.query(sql).all();
}

// 全てのメッセージを取得するAPI
async function getAllChatMessages(): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_MSGS}`;
    return await db.query(sql).all();
}

// 特定のチャットルームのメッセージを取得するAPI
async function getChatMessagesByRoom(roomId: number): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_MSGS}
        WHERE room_id = ?`;
    return await db.query(sql, [roomId]).all();
}

// 特定のユーザーのメッセージを取得するAPI
async function getChatMessagesByUser(userUid: string): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_MSGS}
        WHERE user_uid = ?`;
    return await db.query(sql, [userUid]).all();
}

// 特定のチャットルーム内の全てのユーザーを取得するAPI
async function getUsersInRoom(roomId: number): Promise<any[]> {
    const sql = `
        SELECT DISTINCT user_uid FROM ${TABLE_MSGS}
        WHERE room_id = ?`;
    return await db.query(sql, [roomId]).all();
}

//--------------------------------------------
// DELETE
//--------------------------------------------

// 全てのチャットルームを削除するAPI
async function deleteAllChatRooms(): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_ROOMS}`;
    await db.run(sql);
}

// 全てのユーザーを削除するAPI
async function deleteAllChatUsers(): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_USERS}`;
    await db.run(sql);
}

// 全てのメッセージを削除するAPI
async function deleteAllChatMessages(): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_MSGS}`;
    await db.run(sql);
}

// チャットルームを削除するAPI
async function deleteChatRoom(roomId: number): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_ROOMS}
        WHERE id = ?`;
    await db.run(sql, [roomId]);
}

// ユーザーを削除するAPI
async function deleteChatUser(userUid: string): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_USERS}
        WHERE user_uid = ?`;
    await db.run(sql, [userUid]);
}

// Chatメッセージを削除するAPI
async function deleteChatMessage(roomId: number, userUid: string): Promise<void> {
    const sql = `
        DELETE FROM ${TABLE_MSGS}
        WHERE room_id = ? AND user_uid = ?`;
    await db.run(sql, [roomId, userUid]);
}


//===========================================
// データベースクエリを実行する関数
//  @param {String} sql - 実行するSQLクエリ
//  @returns {Array} - 結果の配列
type QueryResultType = Array<any>; 
function doQuery(db: Database, sql: string): QueryResultType {
    return db.query(sql).values();
}