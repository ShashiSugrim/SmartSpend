import { useEffect, useState } from 'react';
import {
    getTransactions,
    getSpendingCategories,
    createTransaction,
    getUserEmail,
    isAuthenticated,
    type Transaction,
    type SpendingCategory
} from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState<SpendingCategory[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<number | 'all'>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const userEmail = getUserEmail();

    // Form state
    const [formData, setFormData] = useState({
        itemPurchased: '',
        cost: '',
        categoryId: ''
    });
    const [formErrors, setFormErrors] = useState<{
        itemPurchased?: string;
        cost?: string;
        categoryId?: string;
    }>({});

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            window.location.href = '/login';
            return;
        }

        // Fetch transactions and categories
        const fetchData = async () => {
            try {
                const [transactionsData, categoriesData] = await Promise.all([
                    getTransactions(),
                    getSpendingCategories()
                ]);
                setTransactions(transactionsData);
                setFilteredTransactions(transactionsData);
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter transactions when filter changes
    useEffect(() => {
        if (selectedFilter === 'all') {
            setFilteredTransactions(transactions);
        } else {
            setFilteredTransactions(
                transactions.filter(t => t.category.categoryId === selectedFilter)
            );
        }
    }, [selectedFilter, transactions]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field as keyof typeof formErrors]) {
            setFormErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const errors: typeof formErrors = {};

        if (!formData.itemPurchased.trim()) {
            errors.itemPurchased = 'Item name is required';
        }

        if (!formData.cost.trim()) {
            errors.cost = 'Cost is required';
        } else if (Number.isNaN(parseFloat(formData.cost)) || parseFloat(formData.cost) <= 0) {
            errors.cost = 'Please enter a valid amount';
        }

        if (!formData.categoryId) {
            errors.categoryId = 'Please select a category';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await createTransaction(
                parseInt(formData.categoryId),
                formData.itemPurchased,
                parseFloat(formData.cost)
            );

            // Refresh transactions
            const updatedTransactions = await getTransactions();
            setTransactions(updatedTransactions);

            // Reset form
            setFormData({ itemPurchased: '', cost: '', categoryId: '' });
            setShowAddForm(false);
            
        } catch (err) {
            console.error('Error creating transaction:', err);
            alert('Failed to add transaction. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getTotalSpent = () => {
        return filteredTransactions.reduce((sum, t) => sum + parseFloat(t.cost), 0);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading transactions...</p>
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
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Transactions 💳</h1>
                        <p className="text-gray-600">
                            Logged in as <span className="font-medium text-indigo-600">{userEmail}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => window.location.href = '/categories'}
                            variant="outline"
                            className="bg-white"
                        >
                            📊 Categories
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="bg-white"
                        >
                            ← Home
                        </Button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Add Transaction & Filters */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Add Transaction Card */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>Add Transaction</span>
                                    <Button
                                        size="sm"
                                        onClick={() => setShowAddForm(!showAddForm)}
                                        variant={showAddForm ? 'outline' : 'default'}
                                    >
                                        {showAddForm ? 'Cancel' : '+ New'}
                                    </Button>
                                </CardTitle>
                                <CardDescription>Record a new purchase</CardDescription>
                            </CardHeader>
                            {showAddForm && (
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <Label htmlFor="itemPurchased">Item Name</Label>
                                            <Input
                                                id="itemPurchased"
                                                type="text"
                                                placeholder="e.g., Coffee, Shirt, Groceries"
                                                value={formData.itemPurchased}
                                                onChange={(e) => handleInputChange('itemPurchased', e.target.value)}
                                                className={formErrors.itemPurchased ? 'border-red-500' : ''}
                                                disabled={isSubmitting}
                                            />
                                            {formErrors.itemPurchased && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.itemPurchased}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="cost">Cost</Label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                                <Input
                                                    id="cost"
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00"
                                                    value={formData.cost}
                                                    onChange={(e) => handleInputChange('cost', e.target.value)}
                                                    className={`pl-7 ${formErrors.cost ? 'border-red-500' : ''}`}
                                                    disabled={isSubmitting}
                                                />
                                            </div>
                                            {formErrors.cost && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.cost}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="categoryId">Category</Label>
                                            <select
                                                id="categoryId"
                                                value={formData.categoryId}
                                                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                                                className={`w-full px-3 py-2 border rounded-md ${
                                                    formErrors.categoryId ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                                disabled={isSubmitting}
                                            >
                                                <option value="">Select a category...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.categoryId} value={cat.categoryId}>
                                                        {cat.name} (${parseFloat(cat.totalBudgetNumber).toFixed(2)} budget)
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.categoryId && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.categoryId}</p>
                                            )}
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Adding...' : 'Add Transaction'}
                                        </Button>
                                    </form>
                                </CardContent>
                            )}
                        </Card>

                        {/* Filter Card */}
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>Filter by Category</CardTitle>
                                <CardDescription>View transactions by category</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={selectedFilter === 'all' ? 'default' : 'outline'}
                                    className="w-full justify-start"
                                    onClick={() => setSelectedFilter('all')}
                                >
                                    All Transactions ({transactions.length})
                                </Button>
                                {categories.map(cat => {
                                    const count = transactions.filter(
                                        t => t.category.categoryId === cat.categoryId
                                    ).length;
                                    return (
                                        <Button
                                            key={cat.categoryId}
                                            variant={selectedFilter === cat.categoryId ? 'default' : 'outline'}
                                            className="w-full justify-start capitalize"
                                            onClick={() => setSelectedFilter(cat.categoryId)}
                                        >
                                            {cat.name} ({count})
                                        </Button>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Summary Card */}
                        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                            <CardHeader>
                                <CardTitle>Total Spent</CardTitle>
                                <CardDescription className="text-indigo-100">
                                    {selectedFilter === 'all' ? 'All categories' : categories.find(c => c.categoryId === selectedFilter)?.name}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold">${getTotalSpent().toFixed(2)}</p>
                                <p className="text-sm text-indigo-100 mt-2">
                                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Transactions List */}
                    <div className="lg:col-span-2">
                        <Card className="bg-white">
                            <CardHeader>
                                <CardTitle>
                                    {selectedFilter === 'all'
                                        ? 'All Transactions'
                                        : `${categories.find(c => c.categoryId === selectedFilter)?.name || ''} Transactions`}
                                </CardTitle>
                                <CardDescription>
                                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {filteredTransactions.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p className="text-lg font-medium">No transactions yet</p>
                                        <p className="text-sm mt-2">Add your first transaction to get started!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                                        {filteredTransactions.map((transaction) => (
                                            <div
                                                key={transaction.transactionId}
                                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                            <span className="text-lg">🛍️</span>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800">
                                                                {transaction.itemPurchased}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 capitalize">
                                                                {transaction.category.name} • {new Date(transaction.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-gray-800">
                                                        ${parseFloat(transaction.cost).toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        #{transaction.transactionId}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionsPage;
