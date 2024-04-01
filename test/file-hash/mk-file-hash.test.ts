import { describe, expect, it } from 'bun:test'
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
/**
bun i @types/node @types/dotenv
bun i crypto
 */

//-----------------------------------------------------------------------------
// FILE_HASHの登録
//-----------------------------------------------------------------------------
// index.jsファイルのパス
const filePath = '../../src/index-9012.tsx';

// ファイルの読み込み
fs.promises.readFile(filePath)
    .then(data => {
        // ハッシュ値の計算
        const hash = crypto.createHash('sha256').update(data).digest('hex');
        
        // .envファイルへの書き込み
        return fs.promises.writeFile('.env', `FILE_HASH=${hash}`);
    })

//-----------------------------------------------------------------------------
// test
//-----------------------------------------------------------------------------
describe('ファイルの改ざん検知', () => {
	it('保存した FILE_HASH 値と同じか？', () => {
		// .envファイルからFILE_HASHの値を読み取り
		dotenv.config();
		const fileHashFromEnv = process.env.FILE_HASH;

		// index.jsファイルのパス
		const NEW_filePath = filePath;

		// ファイルの読み込み
		fs.promises.readFile(filePath)
			.then(data => {
				// ハッシュ値の計算
				const hash = crypto.createHash('sha256').update(data).digest('hex');
				
				// .envファイルに保存されているハッシュ値と比較
				expect(hash).toEqual(fileHashFromEnv)
			})
			.catch(err => {
				console.error('エラーが発生しました:', err);
			});
		
	})
	it('違うファイルで確認。保存した FILE_HASH 値と違うか？', () => {
		// .envファイルからFILE_HASHの値を読み取り
		dotenv.config();
		const fileHashFromEnv = process.env.FILE_HASH;

		// index.jsファイルのパス
		const NEW_filePath = '../../src/utils.ts';

		// ファイルの読み込み
		fs.promises.readFile(filePath)
			.then(data => {
				// ハッシュ値の計算
				const hash = crypto.createHash('sha256').update(data).digest('hex');
				
				// .envファイルに保存されているハッシュ値と比較
				expect(hash).not.toStrictEqual(fileHashFromEnv)
			})
			.catch(err => {
				console.error('エラーが発生しました:', err);
			});
		
	})
})
