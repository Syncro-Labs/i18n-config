import type { DefineDateTimeFormat, DefineNumberFormat, Locale } from "vue-i18n";

//#region @Nuxtjs/i18n try and remove, if LocaleObject can be imported from @nuxtjs/i18n
type _Directions = 'ltr' | 'rtl' | 'auto';

type _LocaleFile = {
  path: string;
  cache?: boolean;
};

export interface _LocaleObject extends Record<string, any> {
  code: Locale;
  name?: string;
  dir?: _Directions;
  domain?: string;
  file?: string | _LocaleFile;
  files?: string[] | _LocaleFile[];
  isCatchallLocale?: boolean;
  iso?: string;
}
//#endregion

export interface LocaleConfig {
  locale: _LocaleObject;
  datetimeFormats?: DefineDateTimeFormat;
  numberFormats?: DefineNumberFormat;
}

export function defineLocale(locale: LocaleConfig): LocaleConfig {
  return locale;
}
