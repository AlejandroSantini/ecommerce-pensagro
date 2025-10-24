// Footer.tsx
// Footer inspirado en Patagonia.com: limpio, informativo, bien organizado

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);
  const { t } = useTranslation();
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              {t('footer.about.title')}
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              {t('footer.about.description')}
            </p>
            <div className="mt-6 flex space-x-4">
              <Link
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 transition-colors hover:text-gray-900"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              {t('footer.shop.title')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/productos"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.shop.allProducts')}
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.shop.electrifiers')}
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.shop.fencing')}
                </Link>
              </li>
              <li>
                <Link
                  href="/productos"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.shop.accessories')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              {t('footer.help.title')}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/ayuda"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.help.faq')}
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.help.shipping')}
                </Link>
              </li>
              <li>
                <Link
                  href="/ayuda"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.help.warranty')}
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  {t('footer.help.contact')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              {t('footer.contact.title')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span>{t('footer.contact.address')}</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a
                  href="tel:+5491134567890"
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.contact.phone')}
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:ventas@pensagro.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  {t('footer.contact.email')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="my-8 border-t border-gray-200" />

        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 sm:flex-row sm:space-y-0">
          <p>{t('footer.copyright', { year: currentYear })}</p>
          <div className="flex space-x-6">
            <Link
              href="/terminos"
              className="hover:text-gray-900 transition-colors"
            >
              {t('footer.terms')}
            </Link>
            <Link
              href="/privacidad"
              className="hover:text-gray-900 transition-colors"
            >
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
