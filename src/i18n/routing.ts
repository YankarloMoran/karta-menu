import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'es',
  localePrefix: 'always' // `/en/m/slug` or `/es/m/slug`
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
