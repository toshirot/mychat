import Elysia from 'elysia';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
/*
bun i cookie-parser
bun i express-session
bun i passport
//bun i passport-google-authenticator
bun i passport-google-oauth2
*/

const app = new Elysia();
app.use(expressSession({
    secret: env.MY_SECRET,//'secret_key',
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());

// passportの初期化とセッションの設定
app.use(passport.initialize());
app.use(passport.session());

// passportの設定
/*
YOUR_GOOGLE_CLIENT_ID 等はGoogle Cloud PlatformのGoogle API Consoleで取得できます。以下は手順です

Google Cloud Platformにログインし、プロジェクトを選択します。
「APIとサービス」メニューから、「認証情報」を選択します。
「認証情報を作成」をクリックし、「＋認証情報を作成」>「OAuth クライアント ID」を選択します。
アプリケーションの種類を選択し、必要な情報を入力します（ウェブアプリケーションを選択する場合は、許可されたリダイレクトURIも入力する必要があります）。
クライアントIDとクライアントシークレットが生成されます。これらをコピーして、Node.jsアプリケーションのコードに貼り付けます。
コールバックURLは、GoogleのOAuth2認証プロセス中にGoogleからリダイレクトされるURLです。
開発中は、ローカルの開発サーバーのURL（例：http://localhost:3000/auth/google/callback）を使用します。
本番環境では、公開されたサーバーの実際のURLを使用する必要があります。
*/
passport.use(new GoogleStrategy({
    clientID: '294657185395-rll3jgtkum78epqre9duk4kq7o8i13l8.apps.googleusercontent.com',
    clientSecret: 'envで　YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'YOUR_CALLBACK_URL'
}, (accessToken, refreshToken, profile, done) => {
    // ここでユーザーの認証を実装する
    // 通常はユーザーの認証後にユーザー情報をデータベースに保存し、
    // ユーザーを識別するためのセッション情報を作成する
    const user = {
        id: profile.id,
        email: profile.email,
        displayName: profile.displayName,
        // その他のユーザー情報をここに追加できます
    };
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Googleログインエンドポイント
app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Googleログインコールバック
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
        // 認証成功後の処理
        res.cookie('session_token', req.user.session_token);
        res.redirect('/');
    });

// ログアウト
app.get('/logout', (req, res) => {
    req.logout();
    res.clearCookie('session_token');
    res.redirect('/');
});

// サーバーの起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
