"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobileScRegex = exports.scRegex = exports.playlistPattern = exports.videoPattern = void 0;
exports.videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;
exports.playlistPattern = /^.*(list=)([^#\&\?]*).*/;
exports.scRegex = /^https?:\/\/(soundcloud\.com)\/(.*)$/;
exports.mobileScRegex = /^https?:\/\/(soundcloud\.app\.goo\.gl)\/(.*)$/;
//# sourceMappingURL=patterns.js.map