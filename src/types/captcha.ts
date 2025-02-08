export interface CaptchaChallenge {
  id: string
  type: string
  explain: string
  timeout: number
  data: string
}

export interface CaptchaSolution {
  id: string
  solution: string
}

