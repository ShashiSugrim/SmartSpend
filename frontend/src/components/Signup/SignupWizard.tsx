import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signupUser, loginUser, storeAccessToken, createSpendingCategory } from '@/lib/api';

interface FormData {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string; // frontend validation only, not sent
    salary: string;          // annual salary only
}

interface Category {
    name: string;
    totalBudgetNumber: string;
}

type Field = keyof FormData;
type ErrorMap = Partial<Record<Field, string>>;
type CategoryErrorMap = Record<number, { name?: string; totalBudgetNumber?: string }>;

const SignupWizard = () => {
    const [step, setStep] = useState<number>(1);
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        salary: ''
    });
    const [categories, setCategories] = useState<Category[]>([
        { name: '', totalBudgetNumber: '' },
        { name: '', totalBudgetNumber: '' },
        { name: '', totalBudgetNumber: '' }
    ]);
    const [errors, setErrors] = useState<ErrorMap>({});
    const [categoryErrors, setCategoryErrors] = useState<CategoryErrorMap>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: Field, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    const handleCategoryChange = (index: number, field: keyof Category, value: string) => {
        setCategories(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
        // Clear error for this field
        if (categoryErrors[index]?.[field]) {
            setCategoryErrors(prev => ({
                ...prev,
                [index]: { ...prev[index], [field]: undefined }
            }));
        }
    };

    const validateStep = (): boolean => {
        const newErrors: ErrorMap = {};

        if (step === 1) {
            if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
            if (!formData.email.trim()) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                newErrors.email = 'Please enter a valid email';
            }
        }

        if (step === 2) {
            if (!formData.password) newErrors.password = 'Password is required';
            else if (formData.password.length < 6)
                newErrors.password = 'Password must be at least 6 characters';
            if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
            else if (formData.password !== formData.confirmPassword)
                newErrors.confirmPassword = 'Passwords do not match';
        }

        if (step === 3) {
            if (!formData.salary.trim()) newErrors.salary = 'Annual salary is required';
            else if (Number.isNaN(parseFloat(formData.salary)) || parseFloat(formData.salary) <= 0)
                newErrors.salary = 'Please enter a valid amount';
        }

        if (step === 4) {
            const newCategoryErrors: CategoryErrorMap = {};
            categories.forEach((cat, idx) => {
                if (!cat.name.trim()) {
                    newCategoryErrors[idx] = { ...newCategoryErrors[idx], name: 'Category name is required' };
                }
                if (!cat.totalBudgetNumber.trim()) {
                    newCategoryErrors[idx] = { ...newCategoryErrors[idx], totalBudgetNumber: 'Budget is required' };
                } else if (Number.isNaN(parseFloat(cat.totalBudgetNumber)) || parseFloat(cat.totalBudgetNumber) <= 0) {
                    newCategoryErrors[idx] = { ...newCategoryErrors[idx], totalBudgetNumber: 'Enter a valid amount' };
                }
            });
            setCategoryErrors(newCategoryErrors);
            return Object.keys(newCategoryErrors).length === 0;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => { 
        if (validateStep()) {
            if (step === 3) {
                // After step 3, sign up and login before going to step 4
                handleSignupAndLogin();
            } else {
                setStep(prev => prev + 1);
            }
        }
    };
    const handleBack = () => setStep(prev => prev - 1);

    const handleSignupAndLogin = async () => {
        setIsSubmitting(true);
        try {
            // Step 1: Sign up the user
            await signupUser(formData.email, formData.password, formData.salary);

            // Step 2: Sign in the user automatically
            const token = await loginUser(formData.email, formData.password);
            
            // Store the access token and email in localStorage
            storeAccessToken(token, formData.email);

            // Move to category creation step
            setStep(4);
            
        } catch (error) {
            if (error instanceof Error && error.message === 'EMAIL_ALREADY_USED') {
                setErrors({ email: 'Email already used' });
                setStep(1); // Go back to step 1 to show the error
                return;
            }
            console.error('Error during signup/login:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateStep()) return;

        setIsSubmitting(true);
        try {
            // Create all 3 categories
            for (const category of categories) {
                await createSpendingCategory(category.name, parseFloat(category.totalBudgetNumber));
            }

            // Success! Redirect to home page where they'll see the "View My Categories" button
            window.location.href = '/';
            
        } catch (error) {
            console.error('Error creating categories:', error);
            alert('An error occurred while creating categories. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Progress Indicator (4 steps) */}
            <div className="mb-8 animate-fade-in">
                <div className="flex justify-between items-center mb-2">
                    {[1, 2, 3, 4].map((s) => (
                        <div
                            key={s}
                            className={`flex-1 h-2 rounded-full mx-1 transition-all duration-500 ${
                                s <= step ? 'bg-indigo-600' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
                <p className="text-sm text-gray-600 text-center">Step {step} of 4</p>
            </div>

            {/* Card Container */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
                {/* Step 1: Name & Email */}
                {step === 1 && (
                    <div key="step1" className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome! 👋</h2>
                        <p className="text-gray-600 mb-6">Let&apos;s start with your basic information</p>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fullName" className="text-gray-700">Full Name</Label>
                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className={`mt-1 ${errors.fullName ? 'border-red-500' : ''}`}
                                />
                                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <Button onClick={handleNext} className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700">
                            Continue
                        </Button>
                    </div>
                )}

                {/* Step 2: Passwords */}
                {step === 2 && (
                    <div key="step2" className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Secure Your Account 🔒</h2>
                        <p className="text-gray-600 mb-6">Create a strong password to protect your data</p>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="password" className="text-gray-700">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`mt-1 ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className={`mt-1 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                            <Button onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                                Continue
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Annual Salary (single input, no toggle) */}
                {step === 3 && (
                    <div key="step3" className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Annual Salary 💰</h2>
                        <p className="text-gray-600 mb-6">This helps us personalize your experience</p>

                        <div>
                            <Label htmlFor="salary" className="text-gray-700">Annual Salary</Label>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                <Input
                                    id="salary"
                                    type="number"
                                    placeholder="50000"
                                    value={formData.salary}
                                    onChange={(e) => handleInputChange('salary', e.target.value)}
                                    className={`pl-7 ${errors.salary ? 'border-red-500' : ''}`}
                                />
                            </div>
                            {errors.salary && <p className="text-red-500 text-sm mt-1">{errors.salary}</p>}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleBack} variant="outline" className="flex-1">Back</Button>
                            <Button 
                                onClick={handleNext} 
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Account...' : 'Continue'}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 4: Budget Categories */}
                {step === 4 && (
                    <div key="step4" className="animate-fade-in-up">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Budget Categories 📊</h2>
                        <p className="text-gray-600 mb-6">Create 3 categories to organize your spending</p>

                        <div className="space-y-4">
                            {categories.map((category, index) => (
                                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-700 mb-3">Category {index + 1}</p>
                                    <div className="space-y-3">
                                        <div>
                                            <Label htmlFor={`category-name-${index}`} className="text-gray-700">
                                                Category Name
                                            </Label>
                                            <Input
                                                id={`category-name-${index}`}
                                                type="text"
                                                placeholder="e.g., Groceries, Fashion, Entertainment"
                                                value={category.name}
                                                onChange={(e) => handleCategoryChange(index, 'name', e.target.value)}
                                                className={`mt-1 ${categoryErrors[index]?.name ? 'border-red-500' : ''}`}
                                            />
                                            {categoryErrors[index]?.name && (
                                                <p className="text-red-500 text-sm mt-1">{categoryErrors[index].name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <Label htmlFor={`category-budget-${index}`} className="text-gray-700">
                                                Monthly Budget Limit
                                            </Label>
                                            <div className="relative mt-1">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    id={`category-budget-${index}`}
                                                    type="number"
                                                    placeholder="500"
                                                    value={category.totalBudgetNumber}
                                                    onChange={(e) => handleCategoryChange(index, 'totalBudgetNumber', e.target.value)}
                                                    className={`pl-7 ${categoryErrors[index]?.totalBudgetNumber ? 'border-red-500' : ''}`}
                                                />
                                            </div>
                                            {categoryErrors[index]?.totalBudgetNumber && (
                                                <p className="text-red-500 text-sm mt-1">{categoryErrors[index].totalBudgetNumber}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button onClick={handleBack} variant="outline" className="flex-1" disabled={isSubmitting}>
                                Back
                            </Button>
                            <Button 
                                onClick={handleSubmit} 
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Creating Categories...' : 'Complete Sign Up'}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6 animate-fade-in">
                Already have an account?{' '}
                <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Sign in</a>
            </p>
        </div>
    );
};

export default SignupWizard;
