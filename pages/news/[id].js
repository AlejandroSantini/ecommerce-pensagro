import { useRouter } from 'next/router';
import { Clock, User, ArrowLeft, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

const BLOG_POSTS = [
  {
    id: 'guia-cerca-electrica',
    title: 'Guía completa para instalar tu primera cerca eléctrica',
    excerpt: 'Instalar una cerca eléctrica puede parecer complicado, pero con la guía correcta es un proceso sencillo. Aprende paso a paso cómo hacerlo de manera segura y eficiente.',
    author: 'Equipo Pensagro',
    date: '15 de Enero, 2025',
    readTime: '8 min',
    image: '/mock/pel%20418.png',
    category: 'Instalación',
    tags: ['instalación', 'principiantes', 'electrificadores', '+1'],
    content: `
      <h2>Introducción</h2>
      <p>Una cerca eléctrica es una solución eficiente y económica para delimitar áreas en tu campo. En esta guía completa, te explicaremos paso a paso cómo instalar tu primera cerca eléctrica de manera segura y efectiva.</p>
      
      <h2>Materiales necesarios</h2>
      <ul>
        <li>Electrificador o boyero eléctrico</li>
        <li>Alambre conductor de alta resistencia</li>
        <li>Postes o varillas aislantes</li>
        <li>Aisladores para los postes</li>
        <li>Jabalina de tierra</li>
        <li>Conectores y herramientas básicas</li>
      </ul>
      
      <h2>Paso 1: Planificación</h2>
      <p>Antes de comenzar, es fundamental planificar el recorrido de tu cerca. Considera los siguientes aspectos:</p>
      <ul>
        <li>Perímetro total a cercar</li>
        <li>Puntos de acceso necesarios</li>
        <li>Ubicación del electrificador</li>
        <li>Distancia entre postes (recomendado: cada 10-15 metros)</li>
      </ul>
      
      <h2>Paso 2: Instalación del sistema de tierra</h2>
      <p>Un buen sistema de tierra es crucial para el funcionamiento eficiente de tu cerca eléctrica. La jabalina debe clavarse al menos 1 metro en tierra húmeda y estar conectada firmemente al terminal negativo del electrificador.</p>
      
      <h2>Paso 3: Colocación de postes</h2>
      <p>Instala los postes siguiendo tu planificación. Asegúrate de que estén firmes y alineados. Los postes esquineros necesitan mayor refuerzo ya que soportan más tensión.</p>
      
      <h2>Paso 4: Tendido del alambre</h2>
      <p>Comienza desde el electrificador y tiende el alambre pasándolo por los aisladores. Mantén una tensión uniforme pero no excesiva. Para ganado vacuno, una altura de 80-100 cm suele ser adecuada.</p>
      
      <h2>Paso 5: Conexiones eléctricas</h2>
      <p>Conecta el alambre al terminal positivo del electrificador. Verifica todas las conexiones y asegúrate de que no haya cortocircuitos con vegetación o estructuras metálicas.</p>
      
      <h2>Paso 6: Prueba y ajustes</h2>
      <p>Enciende el electrificador y verifica el voltaje con un tester. El voltaje adecuado debe estar entre 4,000 y 7,000 voltios. Realiza los ajustes necesarios.</p>
      
      <h2>Consejos de mantenimiento</h2>
      <ul>
        <li>Revisa el voltaje semanalmente</li>
        <li>Limpia la vegetación que pueda tocar el alambre</li>
        <li>Verifica las conexiones periódicamente</li>
        <li>Reemplaza aisladores dañados inmediatamente</li>
      </ul>
      
      <h2>Conclusión</h2>
      <p>Con esta guía, ya tienes los conocimientos básicos para instalar tu primera cerca eléctrica. Recuerda que la seguridad es lo primero y que un mantenimiento regular garantizará el funcionamiento óptimo de tu sistema por muchos años.</p>
    `,
  },
  {
    id: 'ventajas-electrificadores-solares',
    title: '5 ventajas de usar electrificadores solares en tu campo',
    excerpt: 'La energía solar está revolucionando el agro. Descubre por qué un electrificador solar no solo es una opción ecológica, sino también más rentable y eficiente.',
    author: 'Juan Carlos Rivas',
    date: '10 de Enero, 2025',
    readTime: '6 min',
    image: '/mock/PEL%20S1000%20(F).png',
    category: 'Destacado',
    tags: ['energía solar', 'electrificadores', 'sostenibilidad', '+1'],
    content: `
      <h2>Introducción</h2>
      <p>Los electrificadores solares representan una revolución en el manejo ganadero moderno. A continuación, exploraremos las 5 ventajas principales que hacen de esta tecnología una inversión inteligente para tu campo.</p>
      
      <h2>1. Ahorro económico significativo</h2>
      <p>Aunque la inversión inicial puede ser mayor, los electrificadores solares eliminan completamente el costo de electricidad o baterías. En promedio, el retorno de inversión se logra en 2-3 años, y el equipo puede durar más de 20 años con mantenimiento mínimo.</p>
      
      <h2>2. Independencia energética total</h2>
      <p>No dependes de la red eléctrica ni de baterías que hay que cambiar constantemente. Esto es especialmente valioso en campos remotos donde el acceso a electricidad es limitado o inexistente.</p>
      
      <h2>3. Bajo mantenimiento</h2>
      <p>Los paneles solares modernos requieren muy poco mantenimiento. Una limpieza ocasional del panel y verificación de conexiones son generalmente suficientes para mantener el sistema funcionando óptimamente.</p>
      
      <h2>4. Respeto por el medio ambiente</h2>
      <p>Al utilizar energía limpia y renovable, reduces la huella de carbono de tu operación ganadera. Esto no solo beneficia al planeta, sino que también puede abrirte puertas a certificaciones ambientales y mejores precios en el mercado.</p>
      
      <h2>5. Confiabilidad en cualquier clima</h2>
      <p>Los electrificadores solares modernos incluyen baterías de respaldo que almacenan energía para días nublados o lluviosos. Esto garantiza protección continua sin interrupciones, sin importar las condiciones climáticas.</p>
      
      <h2>Consideraciones para la instalación</h2>
      <p>Para maximizar el rendimiento de tu electrificador solar:</p>
      <ul>
        <li>Orienta el panel hacia el norte (en el hemisferio sur)</li>
        <li>Mantén el panel libre de sombras</li>
        <li>Instala a una altura que proteja de animales</li>
        <li>Verifica la capacidad de la batería según el perímetro a cercar</li>
      </ul>
      
      <h2>Conclusión</h2>
      <p>Los electrificadores solares son más que una tendencia ecológica; son una solución práctica y económica que se paga sola con el tiempo. Si estás considerando instalar o renovar tu sistema de cercas eléctricas, la energía solar debería estar en el tope de tu lista de opciones.</p>
    `,
  },
  {
    id: 'sistema-pesaje-ganado',
    title: 'Cómo elegir el sistema de pesaje adecuado para tu ganado',
    excerpt: 'Pesar tu ganado es clave para la rentabilidad. Un buen sistema de pesaje te permite tomar decisiones informadas sobre nutrición, salud y ventas.',
    author: 'Equipo Pensagro',
    date: '5 de Enero, 2025',
    readTime: '7 min',
    image: '/mock/86000%20w%20portada.png',
    category: 'Destacado',
    tags: ['pesaje', 'ganado', 'tecnología', '+1'],
    content: `
      <h2>¿Por qué es importante pesar el ganado?</h2>
      <p>El peso del ganado es un indicador fundamental de salud, crecimiento y momento óptimo de venta. Sin datos precisos de peso, estás tomando decisiones a ciegas que pueden costarte miles de dólares en productividad perdida.</p>
      
      <h2>Tipos de sistemas de pesaje</h2>
      
      <h3>Balanzas fijas</h3>
      <p>Son las más precisas y duraderas. Ideales para operaciones grandes donde se pesa ganado frecuentemente. Su instalación es permanente y requiere una estructura sólida.</p>
      
      <h3>Balanzas portátiles</h3>
      <p>Perfectas para productores que necesitan movilidad. Se pueden trasladar entre diferentes potreros o campos. Aunque menos precisas que las fijas, los modelos modernos ofrecen excelente exactitud.</p>
      
      <h3>Bastones de pesaje</h3>
      <p>Una alternativa económica que estima el peso basándose en mediciones corporales. Útil para seguimiento rápido, aunque no reemplaza una balanza para decisiones comerciales importantes.</p>
      
      <h2>Factores a considerar</h2>
      
      <h3>Capacidad de peso</h3>
      <p>Asegúrate de que la balanza soporte el peso de tus animales más grandes con margen de seguridad. Para ganado de carne, considera balanzas de al menos 1,500 kg de capacidad.</p>
      
      <h3>Precisión</h3>
      <p>La precisión debe ser de ±0.5% o mejor. Para decisiones comerciales, cada kilogramo cuenta y puede significar diferencias importantes en el precio final.</p>
      
      <h3>Durabilidad</h3>
      <p>El equipo estará expuesto a condiciones duras: peso, movimiento, clima. Busca construcciones robustas en acero galvanizado o inoxidable con componentes sellados.</p>
      
      <h3>Facilidad de lectura</h3>
      <p>Los displays digitales modernos con números grandes y retroiluminación facilitan la lectura en cualquier condición de luz. Algunos modelos incluyen conectividad Bluetooth para registro automático de datos.</p>
      
      <h2>Características adicionales útiles</h2>
      <ul>
        <li>Función de promedio para animales inquietos</li>
        <li>Memoria para almacenar pesajes individuales</li>
        <li>Conexión a software de gestión ganadera</li>
        <li>Batería de larga duración o energía solar</li>
        <li>Protección contra sobrecarga</li>
      </ul>
      
      <h2>Retorno de inversión</h2>
      <p>Un sistema de pesaje se paga solo rápidamente al permitirte:</p>
      <ul>
        <li>Vender animales en el peso óptimo</li>
        <li>Ajustar dietas eficientemente</li>
        <li>Detectar problemas de salud tempranamente</li>
        <li>Evaluar el rendimiento de diferentes razas o dietas</li>
        <li>Negociar mejores precios con datos concretos</li>
      </ul>
      
      <h2>Conclusión</h2>
      <p>Invertir en un buen sistema de pesaje es invertir en información, y la información es poder en la ganadería moderna. Elige un sistema que se ajuste a tu escala de operación y verás resultados positivos en tu rentabilidad en el corto plazo.</p>
    `,
  },
];

export default function BlogArticlePage() {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();

  const article = BLOG_POSTS.find(post => post.id === id);

  const relatedArticles = BLOG_POSTS.filter(post => post.id !== id).slice(0, 3);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('blog.articleNotFound')}</h1>
          <Link href="/news">
            <Button className="bg-[#003c6f] hover:bg-[#002b50]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToNews')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/news">
            <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('blog.backToNews')}
            </Button>
          </Link>
        </div>
      </div>      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="mb-4">
            <span className="bg-cyan-500 text-white text-sm font-semibold px-3 py-1 rounded-full">
              {article.category}
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {article.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{article.readTime} {t('blog.readingTime')}</span>
            </div>
            <div>
              <span>{article.date}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 pb-8 border-b">
            <span className="text-gray-600 font-medium flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              {t('blog.share')}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank')}
              className="border-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600"
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${article.title}`, '_blank')}
              className="border-gray-300 hover:bg-sky-500 hover:text-white hover:border-sky-500"
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}`, '_blank')}
              className="border-gray-300 hover:bg-blue-700 hover:text-white hover:border-blue-700"
            >
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-gray-100">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Card>
          <CardContent className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content"
            />
          </CardContent>
        </Card>

        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{t('blog.relatedArticles')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((post) => (
                <Link key={post.id} href={`/news/${post.id}`}>
                  <Card className="group h-full cursor-pointer">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#003c6f]"></div>
                    </div>
                    <CardContent>
                      <h3 className="font-medium text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-cyan-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{post.excerpt}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .article-content h2 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .article-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .article-content p {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4b5563;
          margin-bottom: 1.25rem;
        }
        .article-content ul, .article-content ol {
          font-size: 1.125rem;
          line-height: 1.75;
          color: #4b5563;
          margin-bottom: 1.25rem;
          padding-left: 1.5rem;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        .article-content ul {
          list-style-type: disc;
        }
        .article-content ol {
          list-style-type: decimal;
        }
        .article-content strong {
          font-weight: 600;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
}
