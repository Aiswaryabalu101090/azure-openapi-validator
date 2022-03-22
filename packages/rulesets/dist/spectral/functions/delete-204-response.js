"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delete204Response = (deleteResponses, _opts, paths) => {
    if (deleteResponses === null || typeof deleteResponses !== 'object') {
        return [];
    }
    const path = paths.path || paths.target || [];
    if (!deleteResponses['204'] && !deleteResponses['202']) {
        return [{
                message: 'A delete operation should have a 204 response.',
                path,
            }];
    }
    return [];
};
exports.default = delete204Response;
//# sourceMappingURL=delete-204-response.js.map