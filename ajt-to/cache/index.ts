import DB, { AliasRecord} from '../db';

let internalCache = null;
let externalCache = null;

export async function getInternalAliases() {
    if (internalCache) {
        return internalCache;
    }

    let aliases = await DB<AliasRecord>('aliases')
        .select('link')
        .select('label')
        .select('priority')
        .select('aliases')
    
    internalCache = aliases;

    return aliases;

}

export async function getExternalAliases() {
    
}