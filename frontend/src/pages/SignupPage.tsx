import SignupWizard from "@/components/Signup/SignupWizard.tsx";
const SignUpPage = () => {
        return (
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
                {/* Background glows */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,oklch(var(--primary-raw)/0.15),transparent_55%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,oklch(var(--accent-raw)/0.12),transparent_55%)]" />

                <div className="container mx-auto px-4 py-20 relative z-10">
                    <div className="flex items-center justify-center">
                        <SignupWizard />
                    </div>
                </div>
            </section>
        );
};
export default SignUpPage;