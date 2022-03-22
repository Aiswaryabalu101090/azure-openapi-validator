"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const paginationResponse = (operation, _opts, paths) => {
    var _a, _b;
    if (operation === null || typeof operation !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
    if (!operation.responses || typeof operation.responses !== 'object') {
        return [];
    }
    const resp = Object.keys(operation.responses)
        .find((code) => code.startsWith('2'));
    if (!resp) {
        return [];
    }
    const responseSchema = operation.responses[resp].schema || {};
    const errors = [];
    if (operation['x-ms-pageable']) {
        if (responseSchema.properties && 'value' in responseSchema.properties) {
            if (responseSchema.properties.value.type !== 'array') {
                errors.push({
                    message: '`value` property in pageable response should be type: array',
                    path: [...path, 'responses', resp, 'schema', 'properties', 'value', 'type'],
                });
            }
            if (!((_a = responseSchema.required) === null || _a === void 0 ? void 0 : _a.includes('value'))) {
                errors.push({
                    message: '`value` property in pageable response should be required',
                    path: [...path, 'responses', resp, 'schema', 'required'],
                });
            }
        }
        else if (!responseSchema.allOf) {
            errors.push({
                message: 'Response body schema of pageable response should contain top-level array property `value`',
                path: [...path, 'responses', resp, 'schema', 'properties'],
            });
        }
        const nextLinkName = operation['x-ms-pageable'].nextLinkName || 'nextLink';
        if (responseSchema.properties && nextLinkName in responseSchema.properties) {
            if (responseSchema.properties[nextLinkName].type !== 'string') {
                errors.push({
                    message: `\`${nextLinkName}\` property in pageable response should be type: string`,
                    path: [...path, 'responses', resp, 'schema', 'properties', nextLinkName, 'type'],
                });
            }
            if ((_b = responseSchema.required) === null || _b === void 0 ? void 0 : _b.includes(nextLinkName)) {
                errors.push({
                    message: `\`${nextLinkName}\` property in pageable response should be optional.`,
                    path: [...path, 'responses', resp, 'schema', 'required'],
                });
            }
        }
        else if (!responseSchema.allOf) {
            errors.push({
                message: `Response body schema of pageable response should contain top-level property \`${nextLinkName}\``,
                path: [...path, 'responses', resp, 'schema', 'properties'],
            });
        }
    }
    else {
        const responseHasArray = Object.values(responseSchema.properties || {})
            .some((prop) => (prop === null || prop === void 0 ? void 0 : prop.type) === 'array');
        if (responseHasArray && Object.keys(responseSchema.properties).length <= 3) {
            errors.push({
                message: 'Operation might be pageable. Consider adding the x-ms-pageable extension.',
                path,
            });
        }
    }
    return errors;
};
exports.default = paginationResponse;
//# sourceMappingURL=pagination-response.js.map