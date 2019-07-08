import { View } from 'tns-core-modules/ui/core/view';

export declare class TNSTwitterCustom {
  static init(key: string, secret: string): void;

  static getCurrentUserEmail(): Promise<any>;

  static getCurrentUser(
    userID: string,
    token?: string,
    tokenSecret?: string
  ): Promise<any>;

  static logIn(controller: any): Promise<any>;
}

export declare class TNSTwitterButtonCustom extends View {}

export declare class CustomApiServiceCustom {
  makeRequest(url: any, method: any, options?: any): Promise<any>;

  toJsObject: (objCObj: any) => any;
}
