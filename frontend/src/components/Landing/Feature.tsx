import { Smartphone, Camera, BarChart3 } from "lucide-react";
import {Card} from "@/components/ui/card.tsx";

const features = [
    {
        icon: Smartphone,
        title: "Auto-Sync Purchases",
        description: "Every Apple Pay purchase automatically appears in your budget. No manual entry needed—just spend and watch your categories update in real-time.",
        gradient: "from-primary to-primary-glow",
    },
    {
        icon: Camera,
        title: "Smart Receipt Scanning",
        description: "Snap a photo of any receipt and our ML vision instantly extracts transactions, categorizes them, and adds them to the right budget buckets.",
        gradient: "from-accent to-accent-glow",
    },
    {
        icon: BarChart3,
        title: "Beautiful Analytics",
        description: "Visualize your spending patterns with interactive charts and insights. Make smarter financial decisions with data that actually makes sense.",
        gradient: "from-chart-3 to-chart-4",
    },
];

const Features = () => {
    return (
        <section className="py-24 px-4 bg-background relative">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center space-y-4 mb-16 animate-fade-in">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Everything you need to
                        <span className="bg-clip-text text-transparent bg-gradient-primary"> take control</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Powerful features that make budgeting effortless and even enjoyable
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className="group relative p-8 border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {/* Icon with gradient background */}
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-6 group-hover:scale-110 transition-transform shadow-md`}>
                                <feature.icon className="w-full h-full text-white" />
                            </div>

                            {/* Content */}
                            <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Hover effect glow */}
                            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl bg-gradient-to-br from-primary/20 to-accent/20" />
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
