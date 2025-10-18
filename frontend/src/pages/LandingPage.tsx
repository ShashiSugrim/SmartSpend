import Hero from "@/components/Landing/Hero.tsx";
import Feature from "@/components/Landing/Feature.tsx";

const LandingPage = () => {
    return(
        <div className= "h-screen w-screen">
            <Hero/>
            <Feature/>
        </div>
    );
}

export default LandingPage;