import Link from 'next/link';
import { Utensils, Zap, BarChart3, QrCode, ArrowRight, Check } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex-1 flex flex-col'>
      {/* Navigation */}
      <nav className='fixed top-0 w-full z-50 glass border-b border-white/5'>
        <div className='max-w-7xl mx-auto px-6 h-20 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl font-serif font-bold text-gradient-ember tracking-tight'>Kartá</span>
          </div>
          <div className='hidden md:flex items-center gap-8 text-sm font-medium'>
            <Link href='#features' className='hover:text-primary transition-colors'>Funciones</Link>
            <Link href='#pricing' className='hover:text-primary transition-colors'>Precios</Link>
            <Link href='/login' className='hover:text-primary transition-colors'>Iniciar Sesión</Link>
            <Link href='/register' className='bg-primary text-white px-5 py-2 rounded-lg font-bold hover:bg-opacity-80 transition-all'>
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='pt-40 pb-20 px-6 relative overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10' />
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-5xl md:text-7xl font-serif font-bold mb-8 leading-tight'>
            El Menú del Mañana, <br />
            <span className='text-gradient-ember'>Hoy.</span>
          </h1>
          <p className='text-xl md:text-2xl text-foreground/70 mb-12 max-w-2xl mx-auto font-sans leading-relaxed'>
            Transforma la experiencia de tu restaurante con un menú digital premium. 
            Sin aplicaciones, solo escanea y disfruta.
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/register' className='w-full sm:w-auto bg-gradient-ember text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform'>
              Registrar mi Restaurante <ArrowRight size={20} />
            </Link>
            <Link href='/demo' className='w-full sm:w-auto glass px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors'>
              Ver Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id='features' className='py-24 px-6 bg-surface-container'>
        <div className='max-w-7xl mx-auto'>
          <div className='text-center mb-16'>
            <h2 className='text-3xl md:text-4xl font-serif font-bold mb-4'>Autoridad Digital</h2>
            <p className='text-foreground/60'>Todo lo que necesitas para gestionar tu menú con elegancia.</p>
          </div>

          <div className='grid md:grid-cols-3 gap-8'>
            <FeatureCard 
              icon={<Zap className='text-primary' />}
              title='Actualizaciones en Vivo'
              description='Cambia precios o platos agotados instantáneamente desde tu dashboard.'
            />
            <FeatureCard 
              icon={<BarChart3 className='text-primary' />}
              title='Analíticas de Escaneo'
              description='Conoce qué platos son los favoritos y cuándo recibes más clientes.'
            />
            <FeatureCard 
              icon={<Utensils className='text-primary' />}
              title='Experiencia Visual'
              description='Fotos de alta resolución y diseño adaptable a cualquier smartphone.'
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id='pricing' className='py-24 px-6'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-center text-4xl font-serif font-bold mb-16'>Planes para cada Etapa</h2>
          <div className='grid md:grid-cols-3 gap-8 max-w-5xl mx-auto'>
            <PriceCard 
              name='Esencial'
              price='0'
              features={['1 Menú Digital', 'Hasta 15 platos', 'QR Estándar', 'Soporte vía Email']}
            />
            <PriceCard 
              name='Premium'
              price='12'
              highlighted
              features={['Menús Ilimitados', 'Platos Ilimitados', 'Analíticas Básicas', 'Categorías Personalizadas']}
            />
            <PriceCard 
              name='Elite'
              price='29'
              features={['Analíticas Pro', 'Branding Personalizado', 'Multi-sucursal', 'Soporte Prioritario']}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-12 border-t border-white/5 text-center'>
        <p className='text-sm text-foreground/40'>© 2026 Kartá. El estándar de oro para menús digitales.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className='glass p-8 rounded-3xl hover:bg-white/5 transition-all'>
      <div className='mb-6'>{icon}</div>
      <h3 className='text-xl border-shadow font-bold mb-3'>{title}</h3>
      <p className='text-foreground/60 leading-relaxed'>{description}</p>
    </div>
  );
}

function PriceCard({ name, price, features, highlighted = false }: { name: string, price: string, features: string[], highlighted?: boolean }) {
  return (
    <div className={`p-8 rounded-3xl flex flex-col ${highlighted ? 'bg-gradient-ember text-white shadow-xl shadow-primary/20 scale-105' : 'glass'}`}>
      <h3 className='text-xl font-bold mb-2'>{name}</h3>
      <div className='flex items-baseline gap-1 mb-8'>
        <span className='text-4xl font-serif font-bold'>${price}</span>
        <span className='text-sm opacity-60'>/mes</span>
      </div>
      <ul className='flex-1 space-y-4 mb-8'>
        {features.map((f, i) => (
          <li key={i} className='flex items-center gap-2 text-sm'>
            <Check size={16} /> {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-3 rounded-xl font-bold transition-all ${highlighted ? 'bg-white text-primary hover:bg-opacity-90' : 'bg-primary text-white hover:bg-opacity-80'}`}>
        Elegir Plan
      </button>
    </div>
  );
}
