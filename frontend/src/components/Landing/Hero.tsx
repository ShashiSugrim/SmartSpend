import { Button } from "@/components/ui/button.tsx";
import { ArrowRight, Sparkles } from "lucide-react";

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
            {/* Animated background glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary-raw)/0.15),transparent_55%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(var(--accent-raw)/0.12),transparent_55%)]" />

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in-up">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Seamlessly integrates with Apple ecosystem</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-primary">
              Smart budgeting
            </span>
                        <br />
                        <span className="text-foreground">that works for you</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Automatically track purchases, scan receipts with ML vision, and visualize your spending—all in one beautiful app.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                        <Button
                            size="lg"
                            className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-lg text-lg px-8 group"
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-lg px-8 border-2"
                        >
                            Watch Demo
                        </Button>
                    </div>

                    {/* Social proof */}
                    <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <div className="flex -space-x-2">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="w-8 h-8 rounded-full bg-gradient-primary border-2 border-background"
                                    />
                                ))}
                            </div>
                            <span>Trusted by 10k+ users</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-border" />
                        <span className="hidden sm:inline">⭐ 4.9/5 on App Store</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
