import DB, { AliasRecord } from "../db";
import { isLoggedIn, ApiRequest } from "./auth";

const MAX_CACHE_STALENESS = 1000 * 60 * 5; // 5min in ms

let internalCacheUpdateMs = 0;
let internalCache: AliasRecord[] = null;

let externalCacheUpdateMs = 0;
let externalCache: AliasRecord[] = null;

function currentMs() {
  return new Date().getTime();
}

async function updateInternalCache(force = false) {
  if (
    !internalCache ||
    force ||
    currentMs() - internalCacheUpdateMs > MAX_CACHE_STALENESS
  ) {
    const aliases = (await DB<AliasRecord>("aliases")
      .select("link")
      .select("label")
      .select("priority")
      .select("alias")) as AliasRecord[];
    internalCache = aliases;
  }
}

async function updateExternalCache(force = false) {
  if (
    !externalCache ||
    force ||
    currentMs() - externalCacheUpdateMs > MAX_CACHE_STALENESS
  ) {
    const aliases = (await DB<AliasRecord>("aliases")
      .select("link")
      .select("label")
      .select("priority")
      .select("alias")
      .whereRaw("internal is not true")) as AliasRecord[];
    externalCache = aliases;
  }
}

export async function addAlias(
  alias: string,
  link: string,
  { label, internal = true }: { label?: string; internal?: boolean }
) {
  await DB<AliasRecord>("aliases").insert({
    alias,
    link,
    label,
    internal,
  });

  await Promise.all([updateInternalCache(true), updateExternalCache(true)]);
}

async function getInternalAliases() {
  await updateInternalCache();

  return internalCache;
}

async function getExternalAliases() {
  await updateExternalCache();

  return externalCache;
}

export function getAliases(req: ApiRequest): Promise<AliasRecord[]> {
  return isLoggedIn(req)
    ? getInternalAliases()
    : getExternalAliases();
}


export async function getLinkForAlias(
  alias: string
): Promise<string | undefined> {
  await updateExternalCache();

  return externalCache.find((record) => record.alias === alias)?.link;
}


