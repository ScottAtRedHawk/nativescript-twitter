import {
  Application,
  View,
  Http,
  AndroidApplication,
  AndroidActivityResultEventData
} from '@nativescript/core';
import { Property } from '@nativescript/core/ui/core/properties';
import { ad } from '@nativescript/core/utils/utils';
import { fromObject } from '@nativescript/core/data/observable';

declare const com: any;

export class TNSTwitter {
  public static init(key: string, secret: string) {
    const config = new com.twitter.sdk.android.core.TwitterConfig.Builder(
      ad.getApplicationContext()
    )
      .twitterAuthConfig(
        new com.twitter.sdk.android.core.TwitterAuthConfig(key, secret)
      )
      .build();
    com.twitter.sdk.android.core.Twitter.initialize(config);
  }

  public static getCurrentUserEmail(): Promise<any> {
    return new Promise((resolve, reject) => {
      const session = com.twitter.sdk.android.core.TwitterCore.getInstance()
        .getSessionManager()
        .getActiveSession();
      const client = new com.twitter.sdk.android.core.identity.TwitterAuthClient();
      client.requestEmail(
        session,
        new com.twitter.sdk.android.core.Callback({
          success(result) {
            if (result.data && result.data.length > 0) {
              resolve(result.data);
            } else {
              reject({ message: 'This user does not have an email address.' });
            }
          },
          failure(exception) {
            reject({ message: exception.getMessage() });
          }
        })
      );
    });
  }

  public static getCurrentUser(
    userID: string,
    token?: string,
    tokenSecret?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const api = new CustomApiService();
      api
        .makeRequest(
          'https://api.twitter.com/1.1/account/verify_credentials.json',
          'get'
        )
        .then(
          (data) => {
            const user = data.content.toJSON();
            resolve({
              formattedScreenName: user.screen_name,
              isProtected: user.protected,
              isVerified: user.verified,
              name: user.name,
              profileImageLargeURL: user.profile_image_url_https.replace(
                '_normal',
                '_bigger'
              ),
              profileImageMiniURL: user.profile_image_url_https.replace(
                '_normal',
                '_mini'
              ),
              profileImageURL: user.profile_image_url_https,
              profileURL: user.url,
              screenName: user.screen_name,
              userID: user.id,
              token,
              tokenSecret
            });
          },
          (err) => {
            reject(err.message);
          }
        );
    });
  }

  public static logIn(controller: any): Promise<any> {
    return new Promise((resolve, reject) => {
      reject('TODO for Android!!');
    });
  }

  public static getNativeConfig() {
    return com.twitter.sdk.android.core.TwitterCore.getInstance().getAuthConfig();
  }

  public static getNativeToken() {
    return com.twitter.sdk.android.core.TwitterCore.getInstance()
      .getSessionManager()
      .getActiveSession()
      ? com.twitter.sdk.android.core.TwitterCore.getInstance()
          .getSessionManager()
          .getActiveSession()
          .getAuthToken()
      : null;
  }
}

export const textProperty = new Property<TNSTwitterButtonBase, string>({
  name: 'text',
  defaultValue: ''
});

export abstract class TNSTwitterButtonBase extends View {
  text: string;
}

// Defines 'text' property on MyButtonBase class.
textProperty.register(TNSTwitterButtonBase);

// If set to true - nativeView will be kept in memory and reused when some other instance
// of type MyButtonBase needs nativeView. Set to true only if you are sure that you can reset the
// nativeView to its initial state. When true will improve application performance.
(TNSTwitterButtonBase.prototype as any).recycleNativeView = false;

export class TNSTwitterButton extends TNSTwitterButtonBase {
  // View {
  private _android;

  get android() {
    return this._android;
  }

  public createNativeView() {
    this._android = new com.twitter.sdk.android.core.identity.TwitterLoginButton(
      Application.android.foregroundActivity
    );

    // remove twitter icon
    (this
      ._android as android.widget.Button).setCompoundDrawablesWithIntrinsicBounds(
      null,
      null,
      null,
      null
    );

    return this._android;
  }

  public initNativeView() {
    const that = new WeakRef(this);

    const _cb = com.twitter.sdk.android.core.Callback.extend({
      owner: that.get(),
      success(result) {
        this.owner.notify({
          eventName: 'loginStatus',
          object: fromObject({
            value: 'success',
            userName: result.data.getUserName(),
            userID: result.data.getUserId()
          })
        });
      },
      failure(exception) {
        this.owner.notify({
          eventName: 'loginStatus',
          object: fromObject({
            value: 'failed',
            message: exception.getMessage()
          })
        });
      }
    });

    this._android.setCallback(new _cb());

    Application.android.on(
      AndroidApplication.activityResultEvent,
      (args: AndroidActivityResultEventData) => {
        (this._android as any).onActivityResult(
          args.requestCode,
          args.resultCode,
          args.intent
        );
      }
    );
  }

  // transfer JS text value to nativeView.
  [textProperty.setNative](value: string) {
    this.nativeView.setText(value);
  }
}

export class CustomApiService {
  private _config;
  private _token;

  constructor() {
    this._config = TNSTwitter.getNativeConfig();
    this._token = TNSTwitter.getNativeToken();
  }

  makeRequest(url, method, options?): Promise<any> {
    if (this._config && this._token) {
      try {
        const oauth = new com.twitter.sdk.android.core.OAuthSigning(
          this._config,
          this._token
        );
        const auth = oauth.getAuthorizationHeader(
          method,
          url,
          options ? this.buildOptions(options) : null
        );
        return Http.request({
          url: url,
          method: method,
          headers: {
            Authorization: auth
          }
        });
      } catch (ex) {
        return new Promise((resolve, reject) => {
          reject(ex);
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        reject('User is not logged in');
      });
    }
  }

  private buildOptions(value) {
    let store = new java.util.HashMap();

    Object.keys(value).forEach((item, key) => {
      switch (typeof value[item]) {
        case 'string':
          store.put(item, value[item]);
          break;
        case 'boolean':
          store.put(item, new java.lang.String(String(value[item])));
          break;
        case 'number':
          store.put(item, value[item]);
          break;
      }
    });
    return store;
  }
}
