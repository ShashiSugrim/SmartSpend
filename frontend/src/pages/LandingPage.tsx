import Hero from "@/components/Landing/Hero.tsx";
import Feature from "@/components/Landing/Feature.tsx";
import ChartShowcase from "@/components/Landing/ChartShowcase.tsx";

const LandingPage = () => {
    return(
        <div className= "h-screen w-screen">
            <Hero/>
            <ChartShowcase/>
            <Feature/>
        </div>
    );
}

export default LandingPage;