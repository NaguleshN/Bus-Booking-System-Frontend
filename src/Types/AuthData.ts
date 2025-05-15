import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";

export interface loginRequest {
    email: string;
    password: string;
}

export interface registerRequest {
    name: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string,
    role: string,
    companyName: string,
}

export type registerResponse =
  | {
      data: {
        success: boolean;
        message: string;
        data: registerRequest;
      };
      error?: undefined;
    }
  | {
      data?: undefined;
      error: FetchBaseQueryError | SerializedError;
    };


export type loginResponse =
  | {
      data: {
        success: boolean;
        message: string;
        data: {
          token: string;
          user: registerRequest;
        };
      };
      error?: undefined;
    }
  | {
      error: FetchBaseQueryError | SerializedError;
      data?: undefined;
    };