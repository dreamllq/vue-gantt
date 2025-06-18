import { useLocale } from 'element-plus';
import { get } from 'lodash';
import zhCn from './zh-cn';
import en from './en';
import ja from './ja';

const locales = {
  'zh-cn': zhCn,
  en,
  ja 
};

export default locales;

export const ct = (str:string) => {
  const { lang } = useLocale();
  const locale = get(locales, lang.value, locales['zh-cn']);
  return get(locale, str, undefined) || get(locales['zh-cn'], str, undefined) || str;
};