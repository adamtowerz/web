import DB, { AliasRecord} from '../db';

let internalCache = null;
let externalCache = null;

async function updateInternalCache() {
    const aliases = await DB<AliasRecord>('aliases')
        .select('link')
        .select('label')
        .select('priority')
        .select('alias')
    internalCache = aliases;
}

async function updateExternalCache() {
    const aliases = await DB<AliasRecord>('aliases')
        .select('link')
        .select('label')
        .select('priority')
        .select('alias')
        .whereRaw('internal is not true')
    externalCache = aliases;
}

export async function addAlias(alias: string, link: string, {
    label, internal = true
}: {label?: string, internal?: boolean}) {
    await DB<AliasRecord>('aliases').insert({
        alias, link, label, internal
    })

    await Promise.all([updateInternalCache(), updateExternalCache()]);

}

export async function getInternalAliases() {
    if (!internalCache) {
        await updateInternalCache();
    }

    return internalCache;
}

export async function getExternalAliases() {
    if (!externalCache) {
        await updateExternalCache();
    }

    return externalCache;
}