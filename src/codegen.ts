import type { Nuxt, NuxtApp } from "@nuxt/schema";
import { GetLocales } from "./utils/handler";
import { createResolver } from "@nuxt/kit";
import { resolveSchema, generateTypes } from "untyped";
import type { ModuleOptions } from "./module";
import {builders} from "magicast"

export async function codegenI18nTypes(data: {
  nuxt: Nuxt;
  app: NuxtApp;
  options: any;
}): Promise<string> {
  const resolver = createResolver(import.meta.url);

  const locales = await GetLocales(data.nuxt, data.options);

  // const schema = generateTypes(await resolveSchema(await import(resolver.resolve(locales[0].locale.files[0]))), { addExport: false, interfaceName: locales[0].locale.code })
  // `type ${locale.locale.code.toString()}DateTimeFormat = ${")`
  return `import type {
  DefineLocaleMessage,
  DefineDateTimeFormat,
  DefineNumberFormat
} from 'vue-i18n'

${
  // Locale messages
  locales
    .map(
      (locale) =>
        `type ${locale.locale.code.toString()} = ${Number(locale.locale.files?.length) > 0 ? locale.locale.files?.map((file) => `typeof import("${file}")`).join(" & ") : `{} /** Locale @${locale.locale.code} has no files */`}`,
    )
    .join("\n")
}



declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends ${locales.map((locale) => locale.locale.code).join(", ")} { }

  export interface DefineDateTimeFormat {
    ${
      // Locale datetimeFormats
      [
        ...new Set(
          Object.keys(
            locales.reduce((a, b) => ({ ...a, ...b.datetimeFormats }), {}),
          ),
        ),
      ]
        .map((format) => {
          return `"${format}": Intl.DateTimeFormatOptions`;
        })
        .join("\n\t\t")
    }
  }

  export interface DefineNumberFormat {
    ${
      // Locale numberFormats
      [
        ...new Set(
          Object.keys(
            locales.reduce((a, b) => ({ ...a, ...b.numberFormats }), {}),
          ),
        ),
      ]
        .map((format) => {
          return `"${format}": Intl.NumberFormatOptions`;
        })
        .join("\n\t\t")
    }
  }
}`;
}

export async function codegenI18nFormat(data: {
  nuxt: Nuxt;
  app: NuxtApp;
  options: ModuleOptions & { kind: "datetimeFormats" | "numberFormats" };
}): Promise<string> {
  const resolver = createResolver(import.meta.url);

  const locales = await GetLocales(data.nuxt, data.options);

  return JSON.stringify(
    locales.reduce(
      (prev, next) => ({
        ...prev,
        [next.locale.code]: !!next[data.options.kind]
          ? next[data.options.kind]
          : {},
      }),
      {},
    ),
    null,
    2,
  );
}
