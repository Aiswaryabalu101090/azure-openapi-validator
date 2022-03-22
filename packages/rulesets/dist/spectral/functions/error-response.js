"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isArraySchema(schema) {
    return schema.type === 'array' || !!schema.items;
}
function isObjectSchema(schema) {
    return schema.type === 'object' || !!schema.properties || schema.$ref;
}
function validateErrorResponseSchema(errorResponseSchema, pathToSchema) {
    var _a, _b;
    const errors = [];
    if (!errorResponseSchema.properties) {
        errors.push({
            message: 'Error response schema must be an object schema.',
            path: pathToSchema,
        });
        return errors;
    }
    if (!errorResponseSchema.properties.error || !errorResponseSchema.properties.error.properties) {
        errors.push({
            message: 'Error response schema should contain an object property named `error`.',
            path: [...pathToSchema, 'properties', 'error'],
        });
        return errors;
    }
    if (!((_b = (_a = errorResponseSchema.required) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, 'error'))) {
        errors.push({
            message: 'The `error` property in the error response schema should be required.',
            path: [...pathToSchema, 'required'],
        });
    }
    const errorSchema = errorResponseSchema.properties.error;
    const pathToErrorSchema = [...pathToSchema, 'properties', 'error'];
    const hasCode = !!errorSchema.properties.code;
    const hasMessage = !!errorSchema.properties.message;
    if (!hasCode && hasMessage) {
        errors.push({
            message: 'Error schema should contain `code` property.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    else if (hasCode && !hasMessage) {
        errors.push({
            message: 'Error schema should contain `message` property.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    else if (!hasCode && !hasMessage) {
        errors.push({
            message: 'Error schema should contain `code` and `message` properties.',
            path: [...pathToErrorSchema, 'properties'],
        });
    }
    if (hasCode && errorSchema.properties.code.type !== 'string') {
        errors.push({
            message: 'The `code` property of error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'code', 'type'],
        });
    }
    if (hasMessage && errorSchema.properties.message.type !== 'string') {
        errors.push({
            message: 'The `message` property of error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'message', 'type'],
        });
    }
    if (['code', 'message'].every((prop) => { var _a, _b; return !((_b = (_a = errorSchema.required) === null || _a === void 0 ? void 0 : _a.includes) === null || _b === void 0 ? void 0 : _b.call(_a, prop)); })) {
        errors.push({
            message: 'Error schema should define `code` and `message` properties as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    else if (!errorSchema.required.includes('code')) {
        errors.push({
            message: 'Error schema should define `code` property as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    else if (!errorSchema.required.includes('message')) {
        errors.push({
            message: 'Error schema should define `message` property as required.',
            path: [...pathToErrorSchema, 'required'],
        });
    }
    if (!!errorSchema.properties.target && errorSchema.properties.target.type !== 'string') {
        errors.push({
            message: 'The `target` property of the error schema should be type `string`.',
            path: [...pathToErrorSchema, 'properties', 'target'],
        });
    }
    if (!!errorSchema.properties.details && !isArraySchema(errorSchema.properties.details)) {
        errors.push({
            message: 'The `details` property of the error schema should be an array.',
            path: [...pathToErrorSchema, 'properties', 'details'],
        });
    }
    if (!!errorSchema.properties.innererror && !isObjectSchema(errorSchema.properties.innererror)) {
        errors.push({
            message: 'The `innererror` property of the error schema should be an object.',
            path: [...pathToErrorSchema, 'properties', 'innererror'],
        });
    }
    return errors;
}
function validateErrorResponse(errorResponse, responsePath) {
    const errors = [];
    if (!errorResponse.schema) {
        errors.push({
            message: 'Error response should have a schema.',
            path: responsePath,
        });
    }
    else {
        errors.push(...validateErrorResponseSchema(errorResponse.schema, [...responsePath, 'schema']));
    }
    if (!errorResponse.headers || !errorResponse.headers['x-ms-error-code']) {
        errors.push({
            message: 'Error response should contain a x-ms-error-code header.',
            path: !errorResponse.headers ? responsePath : [...responsePath, 'headers'],
        });
    }
    return errors;
}
function errorResponse(responses, _opts, paths) {
    const errors = [];
    const path = paths.path || paths.target || [];
    if (responses.default) {
        errors.push(...validateErrorResponse(responses.default, [...path, 'default']));
    }
    Object.keys(responses).filter((code) => code.match(/[45]\d\d/)).forEach((code) => {
        errors.push(...validateErrorResponse(responses[code], [...path, code]));
        if (!(responses[code]['x-ms-error-response'])) {
            errors.push({
                message: 'Error response should contain x-ms-error-response.',
                path: [...path, code],
            });
        }
    });
    return errors;
}
;
exports.default = errorResponse;
//# sourceMappingURL=error-response.js.map