module.exports = (stringMarkup, preloadState, options, ctx) => {
    return `
    <!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,shrink-to-fit=no,user-scalable=0">
    <meta name="theme-color" content="#000000">
    <meta content="yes" name="apple-mobile-web-app-capable"/>
    <meta content="black" name="apple-mobile-web-app-status-bar-style"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>React App</title>
    <script>
        window.PointerEvent = void 0
    </script>
    <script>
        ${options.flexibleStr}
    </script>
    ${options.css}
    ${preloadState}
</head>
<body>
<div>dddd</div>
<div id="root">${stringMarkup}</div>
<script type="text/javascript" src="//j1.58cdn.com.cn/js/login/passportMobileLogin.js"></script>
${options.js}
</body>
</html>
    
    `
}
