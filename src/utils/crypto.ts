import crypto from "node:crypto"
import aesjs from "aes-js"
import pkcs7 from "pkcs7-padding"

export function createSecret(email: string, password: string, domain: string): Buffer {
  return crypto
    .createHash("sha256")
    .update(email + password + domain)
    .digest()
}

export function sign(key: Buffer, data: string): string {
  return crypto.createHmac("sha256", key).update(data).digest("hex")
}

export function encrypt(data: string, ivKey: Buffer): string {
  const stringIvKey = ivKey.toString("binary")
  const stringIv = stringIvKey.substring(0, stringIvKey.length / 2)
  const stringKey = stringIvKey.substring(stringIvKey.length / 2, stringIvKey.length)
  const iv = Buffer.from(stringIv, "binary")
  const key = Buffer.from(stringKey, "binary")
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
  const dataBytes = aesjs.utils.utf8.toBytes(data)
  const paddedData = pkcs7.pad(Buffer.from(dataBytes))
  const encryptedBytes = aesCbc.encrypt(paddedData)
  return Buffer.from(encryptedBytes).toString("base64")
}

export function decrypt(data: string, ivKey: Buffer): string {
  const stringIvKey = ivKey.toString("binary")
  const stringIv = stringIvKey.substring(0, stringIvKey.length / 2)
  const stringKey = stringIvKey.substring(stringIvKey.length / 2, stringIvKey.length)
  const iv = Buffer.from(stringIv, "binary")
  const key = Buffer.from(stringKey, "binary")
  const aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
  const decrypted = aesCbc.decrypt(Buffer.from(data, "base64"))
  const unpaddedData = pkcs7.unpad(Buffer.from(decrypted))
  return unpaddedData.toString("utf8")
}

export function updateEncryptionToken(oldToken: Buffer, updateToken: string): Buffer {
  const updateTokenBytes = Buffer.from(updateToken, "hex")
  return crypto
    .createHash("sha256")
    .update(Buffer.concat([oldToken, updateTokenBytes]))
    .digest()
}

