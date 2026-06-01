import { useEffect, useRef, useState } from 'react';
import fondoBg from '../assets/fondo2.jfif';
import imgGranola from '../assets/granola.jpg';
import imgBarras from '../assets/barras.jfif';
import imgSuplemento from '../assets/suplemento.jfif';
import imgBebidas from '../assets/bebidas.png';

const sections = [
    {
        id: 'quienes-somos',
        icon: 'bi-building',
        title: '¿Quiénes Somos?',
        content: [
            'BioNutri Balance S.R.L. es una empresa boliviana dedicada a la elaboración, distribución y comercialización de productos alimenticios saludables y suplementos nutricionales naturales. Nuestro compromiso es ofrecer alternativas nutritivas y de calidad que contribuyan al bienestar y la salud de nuestros clientes. Operamos en diferentes ciudades del país, abasteciendo a gimnasios, tiendas naturistas, supermercados y consumidores que buscan una alimentación más saludable.',
            'Lo que nos diferencia es nuestra combinación de ingredientes naturales, procesos de producción enfocados en la calidad y una constante búsqueda de innovación en productos nutricionales. Trabajamos para satisfacer las necesidades de nuestros clientes mediante soluciones alimenticias saludables, accesibles y adaptadas a las tendencias actuales del mercado.',
        ],
    },
    {
        id: 'historia',
        icon: 'bi-clock-history',
        title: 'Nuestra Historia',
        content: [
            'BioNutri Balance S.R.L. nació en 2019 gracias a la iniciativa de dos nutricionistas y un administrador de empresas que identificaron una creciente demanda de productos saludables en Bolivia. Lo que comenzó como un pequeño emprendimiento familiar dedicado a la elaboración de granolas y barras energéticas para gimnasios locales fue evolucionando rápidamente gracias a la aceptación de nuestros productos.',
            'Durante los años siguientes ampliamos nuestra presencia en el mercado, incorporando nuevos productos y expandiendo nuestra red de distribución hacia tiendas naturistas y supermercados. Actualmente contamos con una planta de producción, un almacén central y varios puntos de venta físicos, consolidándonos como una empresa comprometida con la nutrición y el bienestar de la población boliviana.',
        ],
    },
];

function SectionCard({ section, index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <i className={`bi ${section.icon} text-white`}></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800">{section.title}</h2>
            </div>
            {section.content.map((p, i) => (
                <p key={i} className={`text-gray-600 leading-relaxed ${i > 0 ? 'mt-4' : ''}`}>{p}</p>
            ))}
            {section.custom}
        </div>
    );
}

function MisionVisionCard({ index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <i className="bi bi-bullseye text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Misión y Visión</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-xl p-6 border border-emerald-200 group hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <i className="bi bi-flag-fill text-white"></i>
                        </div>
                        <h3 className="font-semibold text-emerald-800 text-lg">Misión</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Producir y comercializar alimentos saludables y suplementos nutricionales naturales de alta calidad, contribuyendo al bienestar de nuestros clientes mediante productos innovadores, nutritivos y accesibles, respaldados por procesos responsables y un compromiso permanente con la excelencia.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-xl p-6 border border-emerald-200 group hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <i className="bi bi-eye-fill text-white"></i>
                        </div>
                        <h3 className="font-semibold text-emerald-800 text-lg">Visión</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-sm">
                        Ser la empresa líder en Bolivia en la producción y comercialización de alimentos saludables y suplementos nutricionales naturales, reconocida por su calidad, innovación y compromiso con la salud, expandiendo nuestra presencia a nivel nacional e internacional.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ValoresCard({ index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const valores = [
        { icon: 'bi-shield-check', label: 'Responsabilidad', desc: 'Cumplir nuestros compromisos con clientes, colaboradores y proveedores.' },
        { icon: 'bi-star', label: 'Calidad', desc: 'Presente en cada etapa de nuestros procesos productivos.' },
        { icon: 'bi-lightbulb', label: 'Innovación', desc: 'Desarrollamos nuevas soluciones nutricionales para el mercado.' },
        { icon: 'bi-heart', label: 'Compromiso', desc: 'Fortalecemos nuestra relación con quienes confían en nosotros.' },
        { icon: 'bi-people', label: 'Trabajo en Equipo', desc: 'Fomentamos la colaboración y el crecimiento conjunto.' },
    ];

    return (
        <div
            ref={ref}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <i className="bi bi-gem text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Valores Corporativos</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6">
                En BioNutri Balance S.R.L. trabajamos guiados por valores fundamentales que orientan cada una de nuestras acciones. La <strong>responsabilidad</strong> nos impulsa a cumplir nuestros compromisos con clientes, colaboradores y proveedores. La <strong>calidad</strong> está presente en cada etapa de nuestros procesos productivos. La <strong>innovación</strong> nos permite desarrollar nuevas soluciones nutricionales adaptadas a las necesidades del mercado. El <strong>compromiso</strong> fortalece nuestra relación con quienes confían en nosotros, mientras que el <strong>trabajo en equipo</strong> fomenta la colaboración y el crecimiento conjunto dentro de la organización.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {valores.map((v, i) => (
                    <div
                        key={v.label}
                        className="group bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300 cursor-default"
                        style={{ transitionDelay: `${i * 50}ms` }}
                    >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                            <i className={`bi ${v.icon} text-white`}></i>
                        </div>
                        <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">{v.label}</h4>
                        <p className="text-gray-500 text-sm">{v.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function OfrecemosCard({ index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const productos = [
        { img: imgGranola, label: 'Granolas Artesanales' },
        { img: imgBarras, label: 'Barras Energéticas' },
        { img: imgSuplemento, label: 'Suplementos Proteicos' },
        { img: imgBebidas, label: 'Bebidas Funcionales' },
    ];

    return (
        <div
            ref={ref}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <i className="bi bi-box-seam text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800">¿Qué Ofrecemos?</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
                Ofrecemos una amplia variedad de productos alimenticios saludables, entre los que destacan granolas artesanales, barras energéticas, suplementos proteicos naturales, mezclas nutricionales, snacks saludables, bebidas funcionales y productos dietéticos personalizados. Cada uno de nuestros productos es elaborado bajo estándares de calidad que garantizan sabor, nutrición y seguridad para nuestros consumidores.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
                Nuestros clientes obtienen productos diseñados para complementar estilos de vida saludables, mejorar hábitos alimenticios y apoyar objetivos relacionados con el bienestar, la actividad física y la nutrición equilibrada.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {productos.map((p, i) => (
                    <div
                        key={p.label}
                        className="group bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-xl p-5 text-center border border-emerald-200 hover:shadow-lg hover:border-emerald-300 transition-all duration-300"
                        style={{ transitionDelay: `${i * 80}ms` }}
                    >
                        <div className="w-16 h-16 rounded-xl bg-white shadow-sm overflow-hidden mx-auto mb-3 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300">
                            <img src={p.img} alt={p.label} className="w-full h-full object-cover" />
                        </div>
                        <p className="font-medium text-gray-700 text-sm group-hover:text-emerald-700 transition-colors">{p.label}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ElegirnosCard({ index }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
            { threshold: 0.15 }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, []);

    const razones = [
        { icon: 'bi-award', title: 'Experiencia', desc: 'Amplia trayectoria en el desarrollo de productos nutricionales de calidad.' },
        { icon: 'bi-search-heart', title: 'Calidad Garantizada', desc: 'Ingredientes cuidadosamente seleccionados con altos estándares de producción.' },
        { icon: 'bi-headset', title: 'Atención Personalizada', desc: 'Asesoramiento sobre nuestros productos adaptado a tus necesidades.' },
        { icon: 'bi-arrow-repeat', title: 'Mejora Continua', desc: 'Compromiso con la innovación y soluciones saludables que generan confianza.' },
    ];

    return (
        <div
            ref={ref}
            className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                    <i className="bi bi-hand-thumbs-up text-white"></i>
                </div>
                <h2 className="text-xl font-bold text-gray-800">¿Por Qué Elegirnos?</h2>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
                Elegir BioNutri Balance significa confiar en una empresa que prioriza la salud, la calidad y la satisfacción de sus clientes. Contamos con experiencia en el desarrollo de productos nutricionales, utilizamos ingredientes cuidadosamente seleccionados y mantenemos altos estándares de producción para garantizar resultados confiables.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
                Además, ofrecemos atención personalizada, asesoramiento sobre nuestros productos y una amplia variedad de opciones adaptadas a diferentes necesidades nutricionales. Nuestro compromiso con la mejora continua y la innovación nos permite brindar soluciones saludables que generan valor y confianza en cada compra.
            </p>
            <div className="grid sm:grid-cols-2 gap-5">
                {razones.map((r, i) => (
                    <div
                        key={r.title}
                        className="group flex gap-4 items-start p-5 rounded-xl bg-gray-50 border border-gray-200 hover:border-emerald-200 hover:shadow-lg transition-all duration-300"
                        style={{ transitionDelay: `${i * 80}ms` }}
                    >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            <i className={`bi ${r.icon} text-white text-xl`}></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800 mb-1 group-hover:text-emerald-700 transition-colors">{r.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function EmpresaPage() {
    const heroRef = useRef(null);
    const [heroVisible, setHeroVisible] = useState(false);

    useEffect(() => {
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setHeroVisible(true); obs.disconnect(); } },
            { threshold: 0.3 }
        );
        if (heroRef.current) obs.observe(heroRef.current);
        return () => obs.disconnect();
    }, []);

    return (
        <div
            className="relative min-h-screen -m-4 md:-m-8 p-4 md:p-8"
            style={{ backgroundImage: `url(${fondoBg})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}
        >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <div
                ref={heroRef}
                className={`bg-gradient-to-br from-gray-900 via-gray-800 to-emerald-900 rounded-2xl p-8 md:p-12 text-center shadow-xl transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm shadow-lg mb-5 ring-1 ring-white/20">
                    <i className="bi bi-hexagon-fill text-emerald-400 text-4xl"></i>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">BioNutri Balance</h1>
                <p className="text-emerald-300/80 text-lg">Comprometidos con tu bienestar</p>
                <div className="flex justify-center gap-2 mt-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
            </div>

            <SectionCard section={sections[0]} index={0} />
            <SectionCard section={sections[1]} index={1} />
            <MisionVisionCard index={2} />
            <ValoresCard index={3} />
            <OfrecemosCard index={4} />
            <ElegirnosCard index={5} />

            <footer className="text-center py-6 border-t border-gray-200">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                    <i className="bi bi-c-circle"></i>
                    {new Date().getFullYear()} BioNutri Balance S.R.L. Todos los derechos reservados.
                </p>
            </footer>
            </div>
        </div>
    );
}
