import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Target, 
  AlertCircle,
  CheckCircle,
  Calendar,
  Filter,
  Plus,
  Edit,
  Trash2
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  subcategory: string;
  priority: 'essential' | 'important' | 'leisure';
}

interface FinancialBucket {
  name: string;
  type: 'essential' | 'important' | 'leisure';
  color: string;
  icon: string;
  description: string;
  budget: number;
  spent: number;
  items: ExpenseItem[];
}

const ExpenseManagementPage: React.FC = () => {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [buckets, setBuckets] = useState<FinancialBucket[]>([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Initialize financial buckets
  useEffect(() => {
    const initialBuckets: FinancialBucket[] = [
      {
        name: 'Housing & Utilities',
        type: 'essential',
        color: 'bg-red-500',
        icon: '🏠',
        description: 'Rent, mortgage, utilities, insurance',
        budget: 2000,
        spent: 0,
        items: []
      },
      {
        name: 'Food & Groceries',
        type: 'essential',
        color: 'bg-orange-500',
        icon: '🛒',
        description: 'Groceries, dining out, food delivery',
        budget: 800,
        spent: 0,
        items: []
      },
      {
        name: 'Transportation',
        type: 'essential',
        color: 'bg-yellow-500',
        icon: '🚗',
        description: 'Gas, public transport, car maintenance',
        budget: 400,
        spent: 0,
        items: []
      },
      {
        name: 'Health & Medical',
        type: 'essential',
        color: 'bg-green-500',
        icon: '🏥',
        description: 'Medical bills, pharmacy, health insurance',
        budget: 300,
        spent: 0,
        items: []
      },
      {
        name: 'Savings & Investment',
        type: 'important',
        color: 'bg-blue-500',
        icon: '💰',
        description: 'Emergency fund, retirement, investments',
        budget: 1000,
        spent: 0,
        items: []
      },
      {
        name: 'Education & Skills',
        type: 'important',
        color: 'bg-indigo-500',
        icon: '📚',
        description: 'Courses, books, professional development',
        budget: 200,
        spent: 0,
        items: []
      },
      {
        name: 'Entertainment & Fun',
        type: 'leisure',
        color: 'bg-purple-500',
        icon: '🎬',
        description: 'Movies, games, hobbies, subscriptions',
        budget: 300,
        spent: 0,
        items: []
      },
      {
        name: 'Shopping & Personal',
        type: 'leisure',
        color: 'bg-pink-500',
        icon: '🛍️',
        description: 'Clothes, personal items, beauty',
        budget: 250,
        spent: 0,
        items: []
      }
    ];
    setBuckets(initialBuckets);
  }, []);

  // Sample data for demonstration
  useEffect(() => {
    const sampleExpenses: ExpenseItem[] = [
      {
        id: '1',
        name: 'Whole Foods Grocery',
        amount: 156.78,
        category: 'Food & Groceries',
        date: '2024-10-19',
        type: 'expense',
        subcategory: 'Groceries',
        priority: 'essential'
      },
      {
        id: '2',
        name: 'Netflix Subscription',
        amount: 15.99,
        category: 'Entertainment & Fun',
        date: '2024-10-18',
        type: 'expense',
        subcategory: 'Streaming',
        priority: 'leisure'
      },
      {
        id: '3',
        name: 'Gas Station',
        amount: 45.20,
        category: 'Transportation',
        date: '2024-10-17',
        type: 'expense',
        subcategory: 'Fuel',
        priority: 'essential'
      },
      {
        id: '4',
        name: 'Salary',
        amount: 5000,
        category: 'Income',
        date: '2024-10-15',
        type: 'income',
        subcategory: 'Salary',
        priority: 'essential'
      }
    ];
    setExpenses(sampleExpenses);
    updateBucketsWithExpenses(sampleExpenses);
  }, []);

  const updateBucketsWithExpenses = (expenseList: ExpenseItem[]) => {
    setBuckets(prevBuckets => 
      prevBuckets.map(bucket => {
        const bucketExpenses = expenseList.filter(expense => 
          expense.category === bucket.name && expense.type === 'expense'
        );
        const spent = bucketExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        return {
          ...bucket,
          spent,
          items: bucketExpenses
        };
      })
    );

    const income = expenseList.filter(e => e.type === 'income').reduce((sum, e) => sum + e.amount, 0);
    const expenses = expenseList.filter(e => e.type === 'expense').reduce((sum, e) => sum + e.amount, 0);
    
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getBudgetStatus = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return { status: 'over', color: 'text-red-600', bgColor: 'bg-red-100' };
    if (percentage >= 80) return { status: 'warning', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    return { status: 'good', color: 'text-green-600', bgColor: 'bg-green-100' };
  };

  const getBucketIcon = (type: string) => {
    const icons = {
      essential: '🔴',
      important: '🟡', 
      leisure: '🟢'
    };
    return icons[type as keyof typeof icons] || '⚪';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">💰</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Smart Expense Management
          </h1>
          <p className="text-lg text-gray-600">
            Organize your finances with intelligent expense bucketing
          </p>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Balance</p>
                <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(totalIncome - totalExpenses)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Expense Buckets */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="essential">Essential</TabsTrigger>
            <TabsTrigger value="leisure">Leisure</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buckets.map((bucket, index) => {
                const budgetStatus = getBudgetStatus(bucket.spent, bucket.budget);
                return (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{bucket.icon}</span>
                        <span className={`text-lg ${getBucketIcon(bucket.type)}`}></span>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${budgetStatus.bgColor} ${budgetStatus.color}`}>
                        {Math.round((bucket.spent / bucket.budget) * 100)}%
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-gray-800 mb-2">{bucket.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{bucket.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Spent</span>
                        <span className="font-semibold">{formatCurrency(bucket.spent)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Budget</span>
                        <span className="font-semibold">{formatCurrency(bucket.budget)}</span>
                      </div>
                      <Progress 
                        value={(bucket.spent / bucket.budget) * 100} 
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Remaining</span>
                        <span>{formatCurrency(bucket.budget - bucket.spent)}</span>
                      </div>
                    </div>
                    
                    {bucket.items.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Recent items:</p>
                        <div className="space-y-1">
                          {bucket.items.slice(0, 2).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between text-xs">
                              <span className="truncate">{item.name}</span>
                              <span className="font-semibold">{formatCurrency(item.amount)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="essential" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buckets.filter(bucket => bucket.type === 'essential').map((bucket, index) => {
                const budgetStatus = getBudgetStatus(bucket.spent, bucket.budget);
                return (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{bucket.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{bucket.name}</h3>
                          <p className="text-sm text-gray-600">{bucket.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${budgetStatus.bgColor} ${budgetStatus.color}`}>
                        {Math.round((bucket.spent / bucket.budget) * 100)}% used
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-800">{formatCurrency(bucket.spent)}</span>
                        <span className="text-lg text-gray-600">of {formatCurrency(bucket.budget)}</span>
                      </div>
                      <Progress 
                        value={(bucket.spent / bucket.budget) * 100} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Remaining: {formatCurrency(bucket.budget - bucket.spent)}</span>
                        <span>{bucket.items.length} transactions</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
          
          <TabsContent value="leisure" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buckets.filter(bucket => bucket.type === 'leisure').map((bucket, index) => {
                const budgetStatus = getBudgetStatus(bucket.spent, bucket.budget);
                return (
                  <Card key={index} className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-3xl">{bucket.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-800">{bucket.name}</h3>
                          <p className="text-sm text-gray-600">{bucket.description}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${budgetStatus.bgColor} ${budgetStatus.color}`}>
                        {Math.round((bucket.spent / bucket.budget) * 100)}% used
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-800">{formatCurrency(bucket.spent)}</span>
                        <span className="text-lg text-gray-600">of {formatCurrency(bucket.budget)}</span>
                      </div>
                      <Progress 
                        value={(bucket.spent / bucket.budget) * 100} 
                        className="h-3"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Remaining: {formatCurrency(bucket.budget - bucket.spent)}</span>
                        <span>{bucket.items.length} transactions</span>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button 
            onClick={() => window.location.href = '/scanner'}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            📸 Scan New Receipt
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-full font-semibold"
          >
            ➕ Add Manual Expense
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseManagementPage;
