import { PrismaClient } from '@prisma/client'
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

const isProd = process.env.NODE_ENV === 'production';

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: isProd
            ? ['error']                           // Only log errors in production
            : ['query', 'error', 'warn'],          // Verbose in development
        errorFormat: isProd ? 'minimal' : 'pretty',// Shorter error messages in prod
    });
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (!isProd) globalThis.prisma = prisma
