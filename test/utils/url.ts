import { expect } from '@grafana/plugin-e2e';

/**
 * Url params Helper
 */
export class UrlHelper {
  public params: URLSearchParams;

  constructor(url: string) {
    this.params = new URLSearchParams(url);
  }

  public getParam(name: string) {
    return this.params.get(name);
  }

  public async isParamDifferent(name: string, url: string) {
    const param = this.params.get(name);
    const updatedParams = new URLSearchParams(url);
    return expect(param).not.toEqual(updatedParams.get(name));
  }

  public updateParams(url: string) {
    this.params = new URLSearchParams(url);
  }
}
