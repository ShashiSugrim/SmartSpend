import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser, storeAccessToken } from '@/lib/api';

interface LoginFormData {
    email: string;
    password: string;
}

type Field = keyof LoginFormData;
type ErrorMap = Partial<Record<Field, string>>;

const LoginForm = () => {
    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<ErrorMap>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (field: Field, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const validate = (): boolean => {
        const newErrors: ErrorMap = {};

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validate()) return;

        setIsLoading(true);

        try {
            // Login the user
            const accessToken = await loginUser(formData.email, formData.password);
            
            // Store the access token and email in localStorage
            storeAccessToken(accessToken, formData.email);

            // Success! Redirect to home page
            window.location.href = '/';
            
        } catch (error) {
            console.error('Error during login:', error);
            setErrors({ 
                email: 'Invalid email or password',
                password: 'Invalid email or password'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="animate-fade-in-up">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h2>
                    <p className="text-gray-600 mb-6">Sign in to continue to SmartSpend</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-gray-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                            />
                            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6 animate-fade-in">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign up</a>
            </p>
            <p className="text-center text-gray-600 text-sm mt-2 animate-fade-in">
                <a href="/" className="text-gray-500 hover:text-gray-700">← Back to home</a>
            </p>
        </div>
    );
};

export default LoginForm;
