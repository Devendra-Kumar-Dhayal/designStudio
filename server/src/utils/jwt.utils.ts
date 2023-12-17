import jwt from "jsonwebtoken";
import config from "config";
import { readFileSync } from "fs";






export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  //keyName: "accessTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  // const signingKey = Buffer.from(
  //   config.get<string>(keyName),
  //   "base64"
  // ).toString("ascii");
  const signingKey =  readFileSync('/Users/nevdread/dev/dellapi2/src/keys/private.pem', 'utf8');

  return jwt.sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
    // algorithm: 'none',
  });
}

export function verifyJwt(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
) {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  try {
    const pk =  readFileSync('/Users/nevdread/dev/dellapi2/src/keys/public.pem', 'utf8');
    const decoded = jwt.verify(token, pk);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
