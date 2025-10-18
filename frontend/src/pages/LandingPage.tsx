import Hero from "@/components/Landing/Hero.tsx";
import Feature from "@/components/Landing/Feature.tsx";
import ChartShowcase from "@/components/Landing/ChartShowcase.tsx";
import SignInButton from "@/components/Landing/SignInButton.tsx";
const LandingPage = () => {
    return(
        <div className= "h-screen w-screen">
            <SignInButton/>
            <Hero/>
            <ChartShowcase/>
            <Feature/>
        </div>
    );
}

export default LandingPage;