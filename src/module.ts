import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  hasNuxtModule,
  installModule,
  addTemplate,
  resolveFiles,
  addTypeTemplate,
  updateTemplates,
  useLogger,
} from "@nuxt/kit";
// import type { ModuleHooks } from "@nuxtjs/i18n";
import { parse, resolve, dirname, isAbsolute, relative, join, } from "pathe";
import { readdir, readdirSync } from "node:fs";
import { GetLocales } from "./utils/handler";
import { codegenI18nFormat, codegenI18nTypes } from "./codegen";
import jiti from "jiti";
import defu from "defu";
import { addImports } from "@nuxt/kit";

// declare module "@nuxt/schema" {
//   interface NuxtHooks extends ModuleHooks {}
// }

// Module options TypeScript interface definition

// export * from "./runtime/composables/defineLocale";

export interface ModuleOptions {
  localeDirs: string[];
  definitionName: string;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@syncronet/i18n",
    configKey: "syncronetI18n",
  },
  // Default configuration options of the Nuxt module
  defaults: {
    localeDirs: [],
    definitionName: "definition.ts",
  },
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);
    const logger = useLogger("@syncronet/i18n");

    if (!hasNuxtModule("@nuxtjs/i18n")) {
    }

    // Read all the json files for each language folder in ./locales
    // const locales = {}
    // const files = import.meta.globEager('./locales/**/*.json')
    // for (const path in files) {
    //   const lang = path.split('/').pop().split('.').shift()
    //   locales[lang] = files[path]
    // }

    // const lookup = createResolver(_nuxt.options.srcDir).resolve(".");
    // const te = jiti(lookup, { interopDefault: true });

    // console.log(te(_options.test));

    if (_options.localeDirs.length < 1) {
      _options.localeDirs.push("./locale");
    }

    addImports({
      name: "defineLocale",
      as: "defineLocale",
      from: resolver.resolve("./runtime/composables/defineLocale"),
    });

    addTypeTemplate({
      filename: "types/syncronet-i18n.d.ts",
      getContents: codegenI18nTypes,
      options: _options,
    });

    addTemplate({
      filename: "i18n/datetimeFormats.json",
      getContents: codegenI18nFormat,
      options: defu(_options, { kind: "datetimeFormats" as const }),
      write: true,
    });

    addTemplate({
      filename: "i18n/numberFormats.json",
      getContents: codegenI18nFormat,
      options: defu(_options, { kind: "numberFormats" as const }),
      write: true,
    });

    function isSubDir(parent: string, dir: string) {
      const _relative = relative(parent, dir);
      return _relative && !_relative.startsWith('..') && !isAbsolute(_relative);
    }

    _nuxt.hook("builder:watch", async (event, path) => {
      // logger.log("watcher")
      // console.log({ path, localeDirs: _options.localeDirs, isSubDir: isSubDir(_options.localeDirs[0], joined), joined })

      if (!isAbsolute(path)) {
        const joined = join(_nuxt.options.srcDir, path)

        if (_options.localeDirs.some((dir) => isSubDir(dir, joined))) {
          // console.log({ path, localeDirs: _options.localeDirs, isSubDir: isSubDir(_options.localeDirs[0], joined), joined })

          // if (path.includes("definition.ts")) {
          updateTemplates({ filter: t => t.filename === "i18n/datetimeFormats.json" || t.filename === "i18n/numberFormats.json" || t.filename === "types/syncronet-i18n.d.ts" })
          // }

        }
      }

      // if (_options.localeDirs.some((dir) => path.includes(dir))) {
      //   console.log({ path })

      //   updateTemplates({ filter: t => t.filename === "types/syncronet-i18n.d.ts" })
      // }
      // if (path.includes("definition.ts")) {
      //   updateTemplates({ filter: t => t.filename === "i18n/datetimeFormats.json" || t.filename === "i18n/numberFormats.json" || t.filename === "types/syncronet-i18n.d.ts" })
      // }
    });

    // @ts-ignore
    _nuxt.hook("i18n:registerModule", async (register) => {
      try {
        const locales = await GetLocales(_nuxt, _options);

        const registering = locales.map((locale) => locale.locale);

        register({
          langDir: resolver.resolve("./runtime/locale/"),
          // @ts-ignore
          locales: registering,
        });
      } catch (error) {
        console.error(error);
      }
    });

    // register({
    //   locales: [

    //   ]
    // })
  },
});
