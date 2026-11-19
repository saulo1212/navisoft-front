import { Public_Sans } from 'next/font/google';
import AppWrapper from '@/components/AppWrapper';
import { appTitle } from '@/helpers';
import 'node-waves/dist/waves.css';
import '@/assets/webfonts/smartadmin/scss/sa-icons.scss';
import '@/assets/webfonts/fontawesome/fontawesome.scss';
import '@/assets/sass/smartapp.scss';
export const metadata = {
  title: {
    default: appTitle,
    template: '%s | ' + appTitle
  },
  description: 'Painel administrativo Navisoft'
};
const publicSans = Public_Sans({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic']
});
export default function RootLayout({
  children
}) {
  return <html lang="pt-BR">
      <head>
        <link id="app-theme" rel="stylesheet" />
      </head>
      <body className={publicSans.className}>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>;
}
