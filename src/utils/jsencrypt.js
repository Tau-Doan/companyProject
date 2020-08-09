import JSEncrypt from 'jsencrypt/bin/jsencrypt'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIgxtuMatLPBQD5gk/pEkPxere\n' +
  'cHel7aNSfZRqwnG7hU/ood/kCfTTqAqnKyOjq0qXSuCVHgnUk7ELZS7nC3P1WGYe\n' +
  'WxL6zIdK9HLfaMVIHChXau/tATQqhPp/a8ugwme4mSySwstnSrrf7kZqXcTB97n+\n' +
  'ePI/yKrgQ6dAOmdDKwIDAQAB';

const privateKey = 'MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMiDG24xq0s8FAPm\n' +
  'CT+kSQ/F6t5wd6Xto1J9lGrCcbuFT+ih3+QJ9NOoCqcrI6OrSpdK4JUeCdSTsQtl\n' +
  'LucLc/VYZh5bEvrMh0r0ct9oxUgcKFdq7+0BNCqE+n9ry6DCZ7iZLJLCy2dKut/u\n' +
  'RmpdxMH3uf548j/IquBDp0A6Z0MrAgMBAAECgYEAle0KVqPG6/NZF+0qHy8M/kFD\n' +
  's90uaaA9jZGepxELD2bH8C8RhKY5LQWqKYLlHB0ZIfT35ifWu99O8zFOF64FniwH\n' +
  'X8hwh0PxTfSciF6MvH26o9vNYGJpjoqECGJoic5LqrpowrFOvxL8QtVW+e1EjeQG\n' +
  'p3G6NfYiSlfnGg7hXbkCQQDmAdNCqym6Pk3RJlnZIgtr7CnoIRDNBlybbjASHXYG\n' +
  '+lns34CDV5jXSVcEZ9yfJqS7mBxbDlyIxVDuZpRKoGUdAkEA3yv7papbxUslnX1c\n' +
  '0pRhGoqALQlRUgOz9/wU47ll1C1HkkWNnG4KzU19LqGArXwtWoi//Do5VOgyE0o4\n' +
  'u7s+5wJBAJGuukbR7v4eFF/S8LnNDHrw/KIgv2l9DA8OvbfbnTRSQb782YNXamGB\n' +
  '/HG370+GxHRlpiAueoHOqLI3mtmhuikCQChrsPJ6fpCnYbK6p/tEAKpr93cwvtfZ\n' +
  '79i0gZwVUkoxwUrO6i0xCSfSJyAxBDtnyFcjeZJXgVbNj3RK9yeZbHUCQQDADbSS\n' +
  'iudBFqrrbUkdOVW3D09zHcpRoyGw6pj5J3hUM2mqfQgVmw9EsocoHYzxJ3lXb5zX\n' +
  'm3m4+6td7gtQnSkB';

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKey); // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt(txt) {
  const encryptor = new JSEncrypt();
  encryptor.setPrivateKey(privateKey);
  return encryptor.decrypt(txt)
}


