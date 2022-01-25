import { readFileSync } from "fs"
import { JsonPath } from "./types"
import { JsonInstance, JsonParser } from "./jsonParser"
import { Resolver } from "./resolver"
import { fileURLToPath, pathToFileURL, URL } from "url"

export class OpenapiDocument {
  private _specPath = undefined
  private _content = undefined
  private _doc = undefined
  private jsonInstance: JsonInstance
  private resolver
  private parser: JsonParser
  constructor(specPath: string, parser: JsonParser) {
    this.parser = parser
    this._specPath = specPath
  }
  async resolve() {
    this._content = readFileSync(this._specPath).toString()
    this.jsonInstance = this.parser.parse(this._content)
    this._doc = this.jsonInstance.getValue()
    this.resolver = new Resolver(this._doc, this._specPath)
    await this.resolver.resolve()
  }
  getObj() {
    return this._doc
  }
  getContent() {
    return this._content
  }

  getReferences() {
    return this.resolver.getReferences()
  }
  getDocumentPath() {
    return this._specPath
  }
  getPositionFromJsonPath(jsonPath: JsonPath) {
    return this.jsonInstance.getLocation(jsonPath)
  }
}
