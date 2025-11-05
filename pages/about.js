import { Target, Eye, Heart, Lightbulb, Book, Award, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function AboutPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <section className="relative h-[400px] bg-gradient-to-r from-[#003c6f] to-[#005a9c] overflow-hidden">
        <div className="absolute inset-0 bg-black/30">
          <img
            src="/origen-carne-angus-prueba.jpg"
            alt="Campo ganadero"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl md:text-2xl max-w-3xl">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="/pablo-etcheberry-a-la-derecha-de-manga-con-camisa-EA2RNH7KXZEZVGH6HQMRFKSPPM.jpg"
                alt="Pablo Etcheverry y equipo en el campo"
                className="rounded-lg shadow-2xl w-full"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-[#003c6f] mb-6">
                {t('about.inventorsTitle')}
              </h2>
              <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                {t('about.inventorsText1')}
              </p>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                {t('about.inventorsText2')}
              </p>
              <Link href="/contact">
                <Button className="bg-[#003c6f] hover:bg-[#002b50] text-white px-8 py-6 text-lg">
                  {t('about.talkToUs')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="flex flex-col h-full">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
              </div>
              <CardContent className="flex-grow flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-8 w-8 text-[#003c6f]" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 mb-3">{t('about.mission')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about.missionText')}
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
              </div>
              <CardContent className="flex-grow flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-[#003c6f]" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 mb-3">{t('about.vision')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about.visionText')}
                </p>
              </CardContent>
            </Card>

            <Card className="flex flex-col h-full">
              <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
              </div>
              <CardContent className="flex-grow flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-[#003c6f]" />
                </div>
                <h3 className="font-medium text-xl text-gray-800 mb-3">{t('about.values')}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about.valuesText')}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#003c6f] to-[#002b50] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">
              {t('about.philosophyTitle')}
            </h2>
            <p className="text-xl leading-relaxed mb-4">
              {t('about.philosophyText')}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.expertSupport')}</h3>
              <p className="text-blue-100 leading-relaxed">
                {t('about.expertSupportText')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Book className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.practicalKnowledge')}</h3>
              <p className="text-blue-100 leading-relaxed">
                {t('about.practicalKnowledgeText')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.validateEffort')}</h3>
              <p className="text-blue-100 leading-relaxed">
                {t('about.validateEffortText')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">{t('about.growTogether')}</h3>
              <p className="text-blue-100 leading-relaxed">
                {t('about.growTogetherText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#003c6f] mb-6">
            {t('about.ctaTitle')}
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            {t('about.ctaText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-[#003c6f] hover:bg-[#002b50] text-white px-8 py-6 text-lg">
                {t('about.viewProducts')}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-[#003c6f] text-[#003c6f] hover:bg-[#003c6f] hover:text-white px-8 py-6 text-lg">
                {t('about.contactNow')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
