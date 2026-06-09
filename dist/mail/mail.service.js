"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(MailService_1.name);
        this.transporter = null;
        const host = this.config.get('smtp.host');
        if (host) {
            this.transporter = nodemailer.createTransport({
                host,
                port: this.config.get('smtp.port'),
                secure: this.config.get('smtp.port') === 465,
                auth: {
                    user: this.config.get('smtp.user'),
                    pass: this.config.get('smtp.pass'),
                },
            });
        }
    }
    async send(to, subject, html) {
        const from = this.config.get('smtp.from');
        if (!this.transporter) {
            const links = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
            const linkLine = links.length ? `\n  LINK: ${links.join('\n  LINK: ')}` : '';
            this.logger.warn(`[DEV MAIL] To: ${to} | ${subject}${linkLine}`);
            return;
        }
        await this.transporter.sendMail({ from, to, subject, html });
    }
    async sendVerificationEmail(to, token) {
        const url = `${this.config.get('corsOrigin')}/auth/verify-email?token=${token}`;
        await this.send(to, 'Verify your ApexTrade account', `<h2>Welcome to ApexTrade</h2><p>Confirm your email to activate your account:</p>
       <p><a href="${url}">Verify my email</a></p><p>This link expires in 24 hours.</p>`);
    }
    async sendPasswordResetEmail(to, token) {
        const url = `${this.config.get('corsOrigin')}/auth/reset-password?token=${token}`;
        await this.send(to, 'Reset your ApexTrade password', `<h2>Password reset requested</h2><p>Click below to set a new password:</p>
       <p><a href="${url}">Reset password</a></p><p>If you didn't request this, ignore this email. Link expires in 1 hour.</p>`);
    }
    async sendSecurityAlert(to, message) {
        await this.send(to, 'ApexTrade security alert', `<h2>Security alert</h2><p>${message}</p>`);
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map