import base64 from "base-64";
import jwt from "jsonwebtoken";

interface HashingInterface {
  hash: (value: string | object, secret: string) => string;
  compare: (value: string, secret: string) => boolean;
}

const hashing: HashingInterface = {
  hash: (value, secret) => {
    const encValue = base64.encode(
      typeof value === "string" ? value : JSON.stringify(value)
    );
    const signature = jwt
      .sign(typeof value === "string" ? value : JSON.stringify(value), secret)
      .split(".")[2];
    return `${encValue}$${signature}`;
  },

  compare: (value, secret) => {
    const [encValue, signature] = value.split("$");
    try {
      const decValue = base64.decode(encValue);
      return signature === hash(decValue, secret).split("$")[1];
    } catch (error) {
      return false;
    }
  },
};

export const { hash, compare } = hashing;
