import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  hasNuxtModule,
  installModule,
  addTemplate,
  resolveFiles,
  type Resolver,
} from "@nuxt/kit";
import { parse, resolve, dirname } from "pathe";
import { defu } from "defu";
import type { LocaleConfig } from "../runtime/composables/defineLocale";
// import type { Directions, LocaleFile } from "@nuxtjs/i18n";
import { resolveSchema, generateTypes } from "untyped";
import type { ModuleOptions } from "../module";
import type { Nuxt } from "@nuxt/schema";
import jiti from "jiti";

export type ResolveType = (...path: string[]) => string;

// interface LocaleObject extends Record<string, any> {
//   code: String;
//   name?: string;
//   dir?: Directions;
//   domain?: string;
//   file?: string | LocaleFile;
//   files?: string[] | LocaleFile[];
//   isCatchallLocale?: boolean;
//   iso?: string;
// }

// const definitions = await resolveFiles(resolve('./runtime/locale/'), "*/definition.ts")

export async function GetDefinitionsPaths(
  resolver: Resolver,
  path: string,
  pattern: string | string[] = "*/definition.ts",
) {
  const definitions = await resolveFiles(resolver.resolve(path), pattern);

  return definitions;
}

export async function GetLocales(nuxt: Nuxt, options: ModuleOptions) {
  const resolver = createResolver(nuxt.options.rootDir);
  const jit = jiti(resolver.resolve("."), {
    interopDefault: true,
    esmResolve: true,
    transformModules: [resolver.resolve("./runtime/composables/defineLocale")],
  });

  let definitions = [];

  for (const localeDir of options.localeDirs) {
    definitions.push(...(await GetDefinitionsPaths(resolver, localeDir)));
  }

  // const definitions = await GetDefinitionsPaths(resolver,)

  let locales: Array<ComputedLocale> = [];

  for (const _definitionPath of definitions) {
    const locale = jit(_definitionPath);
    locales.push(await ComputeLocale(resolver, _definitionPath, locale));
  }

  return locales;
}

// export async function GetTypedLocales(resolver: Resolver) {
//   const locales: Array<ComputedLocale & { _datetimeFormatTypes: string; _numberFormatTypes: string }> = await GetLocales(resolver) as any

//   for (const locale of locales) {
//     locale._datetimeFormatTypes = generateTypes(await resolveSchema(locale.locale.datetimeFormats), { addExport: false, interfaceName: `${locale.locale.code}_dtf` })
//     locale._numberFormatTypes = generateTypes(await resolveSchema(locale.locale.numberFormats))
//   }

//   return locales
// }

export async function ComputeLocale(
  resolver: Resolver,
  _definitionPath: string,
  locale: LocaleConfig,
) {
  const conf = defu(locale, {
    locale: {
      files: await resolveFiles(
        await resolver.resolvePath(dirname(_definitionPath)),
        "**.json",
      ),
    }, // as LocaleObject,
    _definitionPath,
    _dirname: dirname(_definitionPath),
  });

  console.log({ conf });

  return conf;
}

export type ComputedLocale = Awaited<ReturnType<typeof ComputeLocale>>;
