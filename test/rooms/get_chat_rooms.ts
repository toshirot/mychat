
import { Database } from 'bun:sqlite';

//============================================
// Chat用データベースの作成
//============================================
// チャット名
const CHAT_NAME = 'myChat';
// データベースファイルの名前を指定
const DB_FILE_NAME = __dirname + '/_DB_'+CHAT_NAME+'.sqlite';

// テーブルの名前を指定
const TABLE_ROOMS = 'chat_rooms';

// 新しいデータベースインスタンスを作成し、ファイルが存在しない場合はデータベースファイルを作成
const db = new Database(DB_FILE_NAME, { create: true });
// 同時書き込みが行われる状況でパフォーマンスを大幅に向上させる先行書き込みログ モード(WAL) 
db.exec('PRAGMA journal_mode = WAL;');

// 全てのチャットルームを取得するAPI
async function getAllChatRooms(): Promise<any[]> {
    const sql = `
        SELECT * FROM ${TABLE_ROOMS}`;
    return await db.query(sql).all();
}

//============================================
// 全てのチャットルームを取得する
getAllChatRooms().then((rooms) => {

    console.log('全てのチャットルーム');
    console.log(rooms);
})

