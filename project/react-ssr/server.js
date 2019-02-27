const http = require('http');
const config = require('./config/server');

const start = require('react-ssr-with-koa/app');
const logger = require('react-ssr-with-koa/dist/logger');
const html = require('react-ssr-with-koa/dist/html');
const Proxy2Server = require('react-ssr-with-koa/dist/proxyToServer');


const Router = require('koa-router');
const router = new Router();

start().then((app) => {

    // 使用默认log，需要放在最前面
    app.performance();

    // 使用react-ssr-with-koa里的proxy
    // 使用默认的ssr
    app.init({
        useDefaultSSR: false,
        useDefaultProxy: true
    });



    // api
    // 直接转发
    router.get('/api/simpleResponse', async (ctx, next) => {
        const _app_proxy = new Proxy2Server(ctx.req, ctx.res);

        const proxyOption = {
            selfHandleResponse: false,
            target: `${config.proxyPath}/simpleResponse`,
        };

        await _app_proxy.asyncTo(proxyOption, ctx)
            .catch((e) => {
                console.log(e)
            });
        console.log('fff')
    });
    // api
    // 需要简单包装下response
    router.all('/api/*', async (ctx, next) => {

        ctx.respond = false;

        const prefix = 'api';
        const proxyPath = ctx.request.url.replace(new RegExp(`^/${prefix}/`), '/');

        const res = ctx.res;

        // 在res上挂载app_proxyRes,拿到response时会调用这个方法
        res.app_proxyRes = (dataObj, send) => {
            send(dataObj)
        };

        const _app_proxy = new Proxy2Server(ctx.req, ctx.res);

        const proxyOption = {
            selfHandleResponse: true,
            target: `${config.proxyPath}/${proxyPath}`,
        };

        await _app_proxy.to(proxyOption, ctx);
    });

    // page
    router.get("/index*", async (ctx, next) => {

        const PAGE = 'index';

        const htmlObj = new html(ctx, PAGE)
            .init({
                ssr: true,
            })
            // 如果不在这里传入initialData
            // 可在组件static getInitialProps()方法里直接return数据
            // 每种数据的获取方式只能选择其中一种方式，不能混用
            // 使用redux情况下，需要在indexSSR组件中获取数据，见示例
            // .injectInitialData({
            //     pageProps: {},    // 根组件(App)下的数据
            //     routeProps: {     // 路由组件下的数据
            //         My: {
            //             serverData: 'my inject data'
            //         }
            //     }
            // })

        await htmlObj.render().catch((e) => {
                logger.error(e);
            }
        );
    });

    router.get("/account*", async (ctx, next) => {

        const PAGE = 'account';

        const htmlObj = new html(ctx, PAGE)
            .init({
                ssr: true,
            })
        // 如果不在这里传入initialData
        // 可在组件里直接return数据
        // .injectInitialData({
        //     pageProps: {},
        //     routeProps: {
        //         My: {
        //             serverData: 'my inject data'
        //         }
        //     }
        // })

        await htmlObj.render().catch((e) => {
                logger.error(e);
            }
        );
    });

    app.use(router.routes());

    const port = config.port;
    const appCallback = app.callback();
    const server = http.createServer(appCallback);

    server
        .listen(port)
        .on('clientError', (err, socket) => {
            // handleErr(err, 'caught_by_koa_on_client_error');
            socket.end('HTTP/1.1 400 Bad Request Request invalid\r\n\r\n');
        });


    console.log(`custom Server client running on: http://localhost: ${port}`);
});

