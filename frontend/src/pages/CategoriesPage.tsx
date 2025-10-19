import { useEffect, useState } from 'react';
import { getSpendingCategories, getUserEmail, isAuthenticated, type SpendingCategory } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CategoriesPage = () => {
    const [categories, setCategories] = useState<SpendingCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userEmail = getUserEmail();

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const data = await getSpendingCategories();
                setCategories(data);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const calculatePercentageUsed = (currentTotal: number, budgetNumber: string) => {
        const budget = parseFloat(budgetNumber);
        if (budget === 0) return 0;
        return Math.min((currentTotal / budget) * 100, 100);
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 90) return 'bg-red-500';
        if (percentage >= 70) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your categories...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => window.location.reload()} className="w-full">
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 p-6">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Budget Categories 📊</h1>
                        <p className="text-gray-600">
                            Logged in as <span className="font-medium text-indigo-600">{userEmail}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => window.location.href = '/transactions'}
                            variant="outline"
                            className="bg-white"
                        >
                            💳 Transactions
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="bg-white"
                        >
                            ← Back to Home
                        </Button>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-6xl mx-auto">
                {categories.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardHeader>
                            <CardTitle>No Categories Yet</CardTitle>
                            <CardDescription>
                                You haven't created any spending categories yet.
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => {
                            const percentageUsed = calculatePercentageUsed(
                                category.current_total,
                                category.totalBudgetNumber
                            );
                            const remaining = parseFloat(category.totalBudgetNumber) - category.current_total;

                            return (
                                <Card
                                    key={category.categoryId}
                                    className="hover:shadow-lg transition-shadow duration-300 bg-white"
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span className="capitalize text-xl">{category.name}</span>
                                            <span className="text-sm font-normal text-gray-500">
                                                #{category.categoryId}
                                            </span>
                                        </CardTitle>
                                        <CardDescription>
                                            Created on {new Date(category.createdAt).toLocaleDateString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Budget Overview */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Budget:</span>
                                                <span className="font-semibold text-gray-800">
                                                    ${parseFloat(category.totalBudgetNumber).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Spent:</span>
                                                <span className="font-semibold text-gray-800">
                                                    ${category.current_total.toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Remaining:</span>
                                                <span className={`font-semibold ${remaining < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    ${remaining.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-gray-600">
                                                <span>Progress</span>
                                                <span>{percentageUsed.toFixed(1)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-500 ${getProgressColor(percentageUsed)}`}
                                                    style={{ width: `${percentageUsed}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="pt-2">
                                            {percentageUsed >= 100 ? (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
                                                    ⚠️ Over Budget
                                                </span>
                                            ) : percentageUsed >= 90 ? (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                                                    ⚡ Almost There
                                                </span>
                                            ) : percentageUsed >= 70 ? (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-orange-800 bg-orange-100 rounded-full">
                                                    📈 On Track
                                                </span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                    ✅ Looking Good
                                                </span>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoriesPage;
