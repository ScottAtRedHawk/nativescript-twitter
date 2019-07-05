import { View } from "tns-core-modules/ui/core/view";
export declare class TNSTwitter_Custom {
  static init(key: string, secret: string): void;
  static getCurrentUserEmail(): Promise<any>;
  static getCurrentUser(
    userID: string,
    token?: string,
    tokenSecret?: string
  ): Promise<any>;
  static logIn(controller: any): Promise<any>;
}
export declare class TNSTwitterButton_Custom extends View {}
export declare class CustomApiService_Custom {
  makeRequest(url: any, method: any, options?: any): Promise<any>;
  toJsObject: (objCObj: any) => any;
}
