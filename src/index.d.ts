import { View } from "@nativescript/core";
import { Property } from "@nativescript/core/ui/core/properties";

export declare class TNSTwitter {
  public static init(key: string, secret: string): void;

  public static getCurrentUserEmail(): Promise<any>;

  public static getCurrentUser(
    userID: string,
    token?: string,
    tokenSecret?: string
  ): Promise<any>;

  public static logIn(controller: any): Promise<any>;
  public static getNativeConfig(): any;

  public static getNativeToken(): any;
}

export declare class TNSTwitterButton extends View {
  static text: string;
}

export const textProperty: Property<TNSTwitterButton, string>;

export declare class CustomApiService {
  public makeRequest(url: any, method: any, options?: any): Promise<any>;

  public toJsObject: (objCObj: any) => any;
}
