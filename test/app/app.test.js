'use strict';
const mm = require('egg-mock');
const assert = require('assert');

describe('test wechat', () => {
  let app;
  before(() => {
    app = mm.app();
    return app.ready();
  });

  afterEach(mm.restore);
  after(() => app.close());

  it('right config wechat getAccesstoken', function* () {
    const config = {
      appId: 'wxa340dfe999102e4e',
      appsecret: '14d6235650c89f1478cdf074923396e6',
    };
    const wechat = app.weChat.create(config, app);
    const result = yield wechat.getAccessToken();
    assert(result.access_token);
  });
  it('wrong config wechat getAccesstoken', function* () {
    const config = {
      appId: 'wxa340dfe99910224e',
      appsecret: '14d6235650c89f1478cdf074923396e6',
    };
    const wechat = app.weChat.create(config, app);
    const result = yield wechat.getAccessToken();
    if (result.hasOwnProperty('access_token') && result.expires_time > app.getNowSysTime()) {
      assert(result.access_token);
      assert(result.expires_time > app.getNowSysTime());
    } else {
      assert(result.errcode);
    }
  });
  it('right create wechat menu', function* () {
    const config = {
      appId: 'wxa340dfe999102e4e',
      appsecret: '14d6235650c89f1478cdf074923396e6',
    };
    const wechat = app.weChat.create(config, app);
    const result = yield wechat.getAccessToken();
    assert(result.access_token);
    const accessToken = result.access_token;
    const menu = {
      button: [
        {
          type: 'click',
          name: '今日歌曲',
          key: 'V1001_TODAY_MUSIC',
        },
        {
          name: '菜单',
          sub_button: [
            {
              type: 'view',
              name: '搜索',
              url: 'http://www.soso.com/',
            },
            {
              type: 'click',
              name: '赞一下我们',
              key: 'V1001_GOOD',
            }],
        }],
    };
    const res = yield wechat.createMenu(menu, accessToken);
    assert(res.errcode === 0);
  });
  it('wrong create wechat menu', function* () {
    const config = {
      appId: 'wxa340dfe999102e4e',
      appsecret: '14d6235650c89f1478cdf074923396e6',
    };
    const wechat = app.weChat.create(config, app);
    const result = yield wechat.getAccessToken();
    assert(result.access_token);
    const accessToken = result.access_token;
    const menu = {
      button: [
        {
          type: 'click',
          name: '今日歌曲',
          key: 'V1001_TODAY_MUSIC',
        },
        {
          name: '菜单',
          sub_button: [
            {
              type: 'view',
              name: '搜索',
              url: 'http://www.soso.com/',
            },
            {
              type: 'miniprogram',
              name: 'wxa',
              url: 'http://mp.weixin.qq.com',
              appid: 'wx286b93c14bbf93aa',
              pagepath: 'pages/lunar/index',
            },
            {
              type: 'click',
              name: '赞一下我们',
              key: 'V1001_GOOD',
            }],
        }],
    };
    const res = yield wechat.createMenu(menu, accessToken);
    assert(res.errcode !== 0);
  });
});
