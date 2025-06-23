import { Response } from "express";
import { injectable } from "tsyringe";

@injectable()
export class CookieHelper {
  private readonly isProduction = process.env.NODE_ENV === "production";

  setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: "strict",
      maxAge: 1000 * 60 * 15,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
  }

  clearAuthCookies(res: Response): void {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: "strict",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: this.isProduction,
      sameSite: "strict",
    });
  }
}
