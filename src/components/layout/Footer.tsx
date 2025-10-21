// Footer.tsx
// Footer inspirado en Patagonia.com: limpio, informativo, bien organizado

'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  
  const [currentYear, setCurrentYear] = useState(2025);
  
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12 lg:px-6">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* About Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              About Pensagro
            </h3>
            <p className="text-sm leading-relaxed text-gray-600">
              Premium agricultural products and sustainable farming solutions for a better tomorrow.
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

          {/* Shop Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Shop
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/shop/products"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/new"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  href="/shop/bestsellers"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/help/faq"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/help/shipping"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/help/returns"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 transition-colors hover:text-gray-900"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Contact
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2 text-gray-600">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-500" />
                <span>Buenos Aires, Argentina</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a
                  href="tel:+5491234567890"
                  className="hover:text-gray-900 transition-colors"
                >
                  +54 9 11 2345-6789
                </a>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4 flex-shrink-0 text-gray-500" />
                <a
                  href="mailto:info@pensagro.com"
                  className="hover:text-gray-900 transition-colors"
                >
                  info@pensagro.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-gray-600 sm:flex-row sm:space-y-0">
          <p>© {currentYear} Pensagro. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              href="/legal/terms"
              className="hover:text-gray-900 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/legal/privacy"
              className="hover:text-gray-900 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
