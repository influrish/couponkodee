// See package.json. Workers' own fetch cannot reach private network ranges, so the SSRF-filtering
// Agent from undici is not needed here. The dispatcher option is ignored.
export class Agent {
  constructor() {}
  close() { return Promise.resolve() }
  destroy() { return Promise.resolve() }
}
export class ProxyAgent extends Agent {}

export const fetch = (input, init) => {
  const { dispatcher: _ignored, ...rest } = init || {}
  return globalThis.fetch(input, rest)
}
export const Headers = globalThis.Headers
export const Request = globalThis.Request
export const Response = globalThis.Response
export const FormData = globalThis.FormData

export default { Agent, ProxyAgent, fetch, Headers, Request, Response, FormData }
