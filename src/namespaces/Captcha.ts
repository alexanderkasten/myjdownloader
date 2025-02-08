import type { CaptchaChallenge, CaptchaSolution } from "../types/captcha"

export class Captcha {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  async get(deviceId: string, captchaId: string): Promise<CaptchaChallenge> {
    const params = JSON.stringify({ id: captchaId })
    return this.callAction("/captcha/get", deviceId, [params])
  }

  async solve(deviceId: string, captchaId: string, solution: string): Promise<void> {
    const params = JSON.stringify({ id: captchaId, solution } as CaptchaSolution)
    return this.callAction("/captcha/solve", deviceId, [params])
  }

  async skip(deviceId: string, captchaId: string): Promise<void> {
    const params = JSON.stringify({ id: captchaId })
    return this.callAction("/captcha/skip", deviceId, [params])
  }
}

