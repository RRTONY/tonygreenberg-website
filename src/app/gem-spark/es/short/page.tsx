import Image from "next/image";
import Link from "next/link";
import { Sparkles, Trophy } from "lucide-react";
import { FaLinkedin } from "react-icons/fa6";
import { ImpactReport } from "@/components/gemspark/impact-report";
import { PageViewTracker } from "@/components/gemspark/page-view-tracker";
import { ReadingProgressBar } from "@/components/gemspark/reading-progress-bar";
import { VersionSwitcher } from "@/components/gemspark/version-switcher";
import { gemsparkImages } from "@/lib/content/gemspark/images";
import { gemsparkMetadata } from "@/lib/content/gemspark/seo";
import { GemsparkJsonLd } from "@/components/gemspark/gemspark-json-ld";

// The GemSpark, short Spanish version, ported from the GemSpark app's client/src/pages/ShortFormES.tsx
// (Manus app "serensynch", exported 2026-11-10). Same copy (Spanish), links and design; the wrapper
// carries lang="es". Like the app, it has no newsletter popup and its reads count as short-form.
// Mechanical changes only: images come from Sanity through next/image; links to tonygreenberg.com
// open here; "Submit your GemSpark" goes to the long form (/gem-spark, the app's home); the
// LinkedIn icon is react-icons (lucide no longer ships brand icons). The article's
// "prose prose-lg prose-slate" classes are dropped: the app never loaded the typography plugin, so
// live rendered them as plain text styles, which is what this shows.
export const metadata = gemsparkMetadata({
  path: "/gem-spark/es/short",
  title: "El GemSpark",
  description: "Una nueva palabra para el momento en que el azar y el significado colisionan.",
  locale: "es_ES",
  languages: { en: "/gem-spark/short", es: "/gem-spark/es/short" },
});

export default function GemSparkShortEsPage() {
  return (
    <div lang="es" className="min-h-screen bg-[#F5F5F0] font-sans text-[#2C3E50] selection:bg-[#D4E6F1] selection:text-[#2C3E50]">
      <PageViewTracker page="short-form" />
      <GemsparkJsonLd
        version="es-short"
        headline="El GemSpark"
        description="Una nueva palabra para el momento en que el azar y el significado colisionan."
      />
      {/* Reading Progress Bar */}
      <ReadingProgressBar />
      {/* Version Switcher */}
      <VersionSwitcher />

      <main className="max-w-2xl mx-auto px-6 py-12 pt-20">

        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif italic font-light text-[#2C3E50] mb-4 leading-tight">
            El GemSpark
          </h1>
          <p className="text-lg text-[#5D6D7E] font-light">
            Una nueva palabra para el momento en que el azar y el significado colisionan.
          </p>
          <p className="text-md font-serif italic text-[#5D6D7E] mt-2">
            por <Link href="/" className="text-[#5D6D7E] hover:text-[#2C3E50] transition-colors">Tony&nbsp;Greenberg</Link>
          </p>
        </header>

        {/* Content */}
        <article className="max-w-none font-light leading-relaxed [&_p]:mb-5 text-pretty">
          <p className="font-medium text-xl text-[#2C3E50]">Hice una oferta irracional a propósito.</p>
          
          <p>Lo suficientemente baja para ofender ligeramente. Lo suficientemente alta para ser interesante.</p>
          
          <p>La contraoferta volvió con un diez por ciento más de irracionalidad. Algo que nunca pasa.</p>
          
          <p>Ahí supe que el día entero había estado construyendo algo que no había visto venir.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>Esto es lo que he aprendido: optimizamos para la eficiencia y alisamos las arrugas donde realmente vive la magia. Los mejores días empiezan con un fallo. Una interrupción que casi ignoras.</p>
          
          <p>Empezó 12 horas antes. Sin más intención que moverme antes de que la <a href="https://es.wikipedia.org/wiki/Red_neuronal_por_defecto" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">red neuronal por defecto</a> se active y pavimente la posibilidad con lo predecible.</p>
          
          <p>Tomé el sendero <a href="https://www.alltrails.com/trail/us/california/los-leones-trail" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Los Leones</a>. La vista se extendía desde <a href="https://es.wikipedia.org/wiki/Pacific_Palisades_(Los_%C3%81ngeles)" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Pacific Palisades</a> hasta el <a href="https://downtownla.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">centro de LA</a>. Exactamente el horizonte donde terminaría el día. No lo sabía aún. La geometría ya estaba siendo trazada.</p>
          
          <div className="my-8 rounded-sm overflow-hidden shadow-md">
            <Image
              src={gemsparkImages.trail.src}
              width={gemsparkImages.trail.width}
              height={gemsparkImages.trail.height}
              alt="Sendero Los Leones"
              sizes="(min-width: 672px) 624px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <p>Paramos en el <a href="https://www.marvistafarmersmarket.org/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">mercado de Mar Vista</a>. No porque necesitáramos algo. Porque el camino quería una pausa.</p>
          
          <p>La curiosidad fue recompensada con <a href="https://completelypickled.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">pepinillos fermentados de piña y eneldo</a>. Un sabor que suena a error hasta que lo pruebas. La lección: las cosas no tienen que tener sentido para estar bien.</p>
          
          <p>Luego nos dejamos llevar hacia la <a href="https://www.laartshow.com/" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Feria de Arte de LA</a>. La mayoría pasa educadamente. Luego algo te agarra la manga.</p>
          
          <div className="my-8 rounded-sm overflow-hidden shadow-md">
            <Image
              src={gemsparkImages.art.src}
              width={gemsparkImages.art.width}
              height={gemsparkImages.art.height}
              alt="Arte de David Fenton"
              sizes="(min-width: 672px) 624px, 100vw"
              className="h-auto w-full"
            />
          </div>

          <p>La pieza fue creada con <a href="https://es.wikipedia.org/wiki/Sublimaci%C3%B3n_(impresi%C3%B3n)" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">sublimación sobre aluminio grabado</a>. Una técnica rara y difícil que le da a la imagen una profundidad holográfica y metálica. Cambia con la luz. Está viva.</p>
          
          <p>Y ya la había visto antes.</p>
          
          <p>Hace veinte años, en Avondale, compré una pieza con esta misma técnica sin entender qué era. Ahora aparecía otra. Mismo proceso, mismo medio. Y no recordé la primera hasta que estaba negociando la segunda.</p>
          
          <p>Eso es sincronicidad. No se anuncia. Espera a que tú la alcances.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>Quería la pieza. Pero no quería una transacción estándar. Quería una <strong>decisión estructural</strong>.</p>
          
          <p>Hice la oferta en <a href="https://es.wikipedia.org/wiki/Bitcoin" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">Bitcoin</a>. Y añadí una condición: el 13% del precio de compra va inmediatamente a una organización benéfica de su elección.</p>
          
          <p>¿Por qué 13%? Porque rompe el patrón del 10%. Señala intención. Convierte una compra en una alianza.</p>
          
          <p><a href="https://www.linkedin.com/in/dafenton" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">David Fenton</a> aceptó.</p>
          
          <p>Luego me dio algo mejor que el arte. Una regla: &quot;Dale 100 días. No lo juzgues antes. Deja que viva en tu espacio. Deja que cambie la habitación.&quot;</p>
          
          <p>Eso es <strong><a href="https://es.wikipedia.org/wiki/Flujo_(psicolog%C3%ADa)" target="_blank" rel="noopener noreferrer" className="text-[#2C3E50] underline decoration-1 underline-offset-4 hover:text-[#1A252F] transition-colors">arquitectura de flujo</a></strong> en una frase. La experiencia cumbre siempre es un acto de desaparición. No puedes retenerla. Solo puedes estar listo para ella.</p>
          
          <hr className="my-8 border-[#D5D8DC] w-12" />
          
          <p>Una caminata. Un giro equivocado. Un pepinillo. Una pieza de arte. Música. Agua. Sanación. Todo en doce horas. Nada planeado.</p>
          
          <p>Necesitaba una palabra para esto. No &quot;suerte.&quot; No &quot;coincidencia.&quot; Algo que capture el momento en que un accidente feliz y un patrón significativo colisionan, y lo reconoces en tiempo real.</p>
          
          <p className="text-xl font-medium text-[#2C3E50]">Esa palabra es <strong>GemSpark</strong>.</p>
          
          <p>Un GemSpark es el punto de fusión donde la serendipia y la sincronicidad colisionan, y finalmente reconoces el patrón. No es místico. Es arquitectónico. Es lo que pasa cuando construyes las condiciones para notar en vez de optimizar para la velocidad.</p>
          
          <p>Una vez que tienes la palabra, empiezas a verlos en todas partes. &quot;Tuve un GemSpark hoy.&quot; &quot;Casi me pierdo uno.&quot; &quot;Esa reunión fue puro GemSpark.&quot; Se convierte en un lente. Una práctica diaria. Una forma de moverse por el mundo que convierte el ruido en señal.</p>
        </article>

        {/* 5-Day Challenge CTA */}
        <div className="mt-12 bg-white p-8 rounded-2xl border border-[#EAECEE] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles aria-hidden="true" className="size-6 text-[#2C3E50]" />
            <h3 className="font-serif italic text-xl text-[#2C3E50]">El Reto GemSpark de 5 Días</h3>
          </div>
          <p className="text-[#34495E] font-light mb-4 leading-relaxed text-pretty">
            Ahora tienes una palabra que la mayoría no tiene. Úsala en los próximos cinco días. Nota un GemSpark. Nómbralo en voz alta. Luego vuelve y cuéntanos qué cambió.
          </p>
          <div className="bg-[#F8F9F9] p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Trophy aria-hidden="true" className="size-5 text-[#D4AC0D]" />
              <span className="font-medium text-[#2C3E50]">El Premio GemSpark</span>
            </div>
            <p className="text-sm text-[#5D6D7E] leading-relaxed">
              El GemSpark más poderoso enviado en los próximos cinco días gana el Premio GemSpark inaugural. Reconocimiento como Fundador GemSpark Spotter, destacado en esta página, y una conversación directa con Tony.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/gem-spark" className="inline-flex items-center gap-2 bg-[#2C3E50] text-white px-5 py-3 rounded-xl font-medium hover:bg-[#1A252F] transition-colors">
              <Sparkles aria-hidden="true" className="size-5" />
              Envía tu GemSpark aquí
            </Link>
            <a 
              href="https://www.linkedin.com/in/tonygreenberg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#2C3E50] font-medium hover:text-[#1A252F] transition-colors border border-[#D5D8DC] px-5 py-3 rounded-xl"
            >
              <FaLinkedin aria-hidden="true" className="size-5" />
              O comparte en LinkedIn
            </a>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-[#D5D8DC] pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-serif italic text-2xl text-[#2C3E50] mb-2">El GemSpark</h3>
              <p className="text-[#5D6D7E] font-light">© {new Date().getFullYear()} <Link href="/" className="text-[#5D6D7E] hover:text-[#2C3E50] transition-colors">Tony&nbsp;Greenberg</Link></p>
            </div>
            
            <ImpactReport />
          </div>
        </footer>

      </main>
    </div>
  );
}
