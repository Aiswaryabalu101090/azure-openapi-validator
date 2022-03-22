"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pathParamSchema = void 0;
const URL_MAX_LENGTH = 2083;
const pathParamSchema = (param, _opts, paths) => {
    if (param === null || typeof param !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
    if (!param.in || !param.name) {
        return [];
    }
    const errors = [];
    const isOas3 = !!param.schema;
    const schema = isOas3 ? param.schema : param;
    if (isOas3) {
        path.push('schema');
    }
    if (schema.type !== 'string') {
        errors.push({
            message: 'Path parameter should be defined as type: string.',
            path: [...path, 'type'],
        });
    }
    if (!schema.maxLength && !schema.pattern) {
        errors.push({
            message: 'Path parameter should specify a maximum length (maxLength) and characters allowed (pattern).',
            path,
        });
    }
    else if (!schema.maxLength) {
        errors.push({
            message: 'Path parameter should specify a maximum length (maxLength).',
            path,
        });
    }
    else if (schema.maxLength && schema.maxLength >= URL_MAX_LENGTH) {
        errors.push({
            message: `Path parameter maximum length should be less than ${URL_MAX_LENGTH}`,
            path,
        });
    }
    else if (!schema.pattern) {
        errors.push({
            message: 'Path parameter should specify characters allowed (pattern).',
            path,
        });
    }
    return errors;
};
exports.pathParamSchema = pathParamSchema;
exports.default = exports.pathParamSchema;
//# sourceMappingURL=path-param-schema.js.map