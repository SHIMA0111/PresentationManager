<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=!messagesPerField.existsError('username','password') displayInfo=realm.password && realm.registrationAllowed && !registrationDisabled??; section>
    <#if section = "header">
        <h1 class="login-title">Presentation Manager</h1>
    <#elseif section = "form">
        <div class="login-form-container">
            <div class="login-form">
                <h2>ログイン</h2>
                <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
                    <div class="form-group">
                        <label for="username" class="form-label">
                            <#if !realm.loginWithEmailAllowed>
                                ユーザー名
                            <#elseif !realm.registrationEmailAsUsername>
                                ユーザー名またはメール
                            <#else>
                                メールアドレス
                            </#if>
                        </label>
                        <input tabindex="1" id="username" class="form-input" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="off" placeholder="ユーザー名を入力してください" />
                    </div>

                    <div class="form-group">
                        <label for="password" class="form-label">パスワード</label>
                        <input tabindex="2" id="password" class="form-input" name="password" type="password" autocomplete="off" placeholder="パスワードを入力してください" />
                    </div>

                    <div class="form-group">
                        <div class="checkbox-container">
                            <#if realm.rememberMe && !usernameEditDisabled??>
                                <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" <#if login.rememberMe??>checked</#if>>
                                <label for="rememberMe" class="checkbox-label">ログイン状態を保持</label>
                            </#if>
                        </div>
                    </div>

                    <div class="form-group">
                        <button tabindex="4" class="btn btn-primary" name="login" id="kc-login" type="submit">
                            ログイン
                        </button>
                    </div>
                </form>
                
                <div class="form-links">
                    <#if realm.resetPasswordAllowed>
                        <a href="${url.loginResetCredentialsUrl}" class="link">パスワードをお忘れですか？</a>
                    </#if>
                    <#if realm.password && realm.registrationAllowed && !registrationDisabled??>
                        <a href="${url.registrationUrl}" class="link">アカウントを作成</a>
                    </#if>
                </div>
            </div>
        </div>
    </#if>
</@layout.registrationLayout>