type JwtCompanyType = "platform" | "client";

export type AccessTokenPayload = {
  sub: string;
  email: string;
  role: string;
  companyId: string;
  companyType: JwtCompanyType;
};

export const decodeAccessToken = (
  token: string,
): AccessTokenPayload | null => {
  try {
    const [, payload] = token.split(".");
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json) as AccessTokenPayload;
  } catch {
    return null;
  }
};
